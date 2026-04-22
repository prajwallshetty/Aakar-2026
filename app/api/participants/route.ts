import { NextResponse } from "next/server";
import { getParticipantsPaginated } from "@/backend/participant";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const college = searchParams.get("college") || "";
  const collegeFilterType = (searchParams.get("collegeFilterType") || "all") as "all" | "include" | "exclude";

  try {
    const response = await getParticipantsPaginated({
      page,
      limit,
      search,
      college,
      collegeFilterType,
    });

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 403 });
    }

    // EDGE CACHING: Set Cache-Control header for 30s
    // s-maxage=30: Cache on Vercel Edge for 30s
    // stale-while-revalidate=59: Serve stale data while revalidating for up to 59s
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
