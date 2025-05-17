import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const sourceClient = new Client({ connectionString: process.env.DATABASE_URL });
  const backupClient = new Client({ connectionString: process.env.BACKUP_DATABASE_URL });

  const backupSummary = [];

  try {
    await sourceClient.connect();
    await backupClient.connect();

    const tablesRes = await sourceClient.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema='public' AND table_type='BASE TABLE';
    `);

    for (const { table_name } of tablesRes.rows) {
      const columnInfoRes = await sourceClient.query(`
        SELECT column_name, data_type, udt_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${table_name}';
      `);

      const columnTypes: any = {};
      for (const col of columnInfoRes.rows) {
        columnTypes[col.column_name] = {
          data_type: col.data_type,
          udt_name: col.udt_name
        };
      }

      const pkRes = await sourceClient.query(`
        SELECT a.attname
        FROM   pg_index i
        JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE  i.indrelid = '"${table_name}"'::regclass
        AND    i.indisprimary;
      `);
      const pkColumns = pkRes.rows.map(r => r.attname);

      if (pkColumns.length === 0) {
        console.warn(`Skipping table "${table_name}" (no primary key found).`);
        continue;
      }

      const dataRes = await sourceClient.query(`SELECT * FROM "${table_name}"`);
      const data = dataRes.rows;

      let upsertCount = 0;

      for (const row of data) {
        const columns = Object.keys(row);

        const processedValues = columns.map(colName => {
          const value = row[colName];
          const colType = columnTypes[colName];

          if (
            (colType?.data_type === 'json' || colType?.data_type === 'jsonb' ||
              colType?.udt_name === 'json' || colType?.udt_name === 'jsonb') &&
            value !== null &&
            typeof value === 'object' &&
            !(value instanceof Date) &&
            !Buffer.isBuffer(value)
          ) {
            return JSON.stringify(value);
          }
          return value;
        });

        const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');

        const updateAssignments = columns
          .filter(col => !pkColumns.includes(col))
          .map(col => `"${col}" = EXCLUDED."${col}"`)
          .join(', ');

        const conflictClause = `ON CONFLICT (${pkColumns.map(col => `"${col}"`).join(', ')})`;

        const query = `
          INSERT INTO "${table_name}" (${columns.map(col => `"${col}"`).join(', ')})
          VALUES (${placeholders})
          ${updateAssignments ? `${conflictClause} DO UPDATE SET ${updateAssignments}` : `${conflictClause} DO NOTHING`}
        `;

        await backupClient.query(query, processedValues);
        upsertCount++;
      }

      backupSummary.push({
        table: table_name,
        rowsBackedUp: upsertCount,
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Backup completed successfully.',
      summary: backupSummary,
    });
  } catch (error: any) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  } finally {
    await sourceClient.end();
    await backupClient.end();
  }
}