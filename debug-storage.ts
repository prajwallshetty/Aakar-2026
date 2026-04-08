import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl || '', supabaseKey || '')

async function debugStorage() {
  const bucketName = 'eventimages'
  
  console.log(`Checking bucket: ${bucketName}`)
  
  const { data: listData, error: listError } = await supabase.storage
    .from(bucketName)
    .list('', { limit: 10 })
    
  if (listError) {
    console.error('Error listing bucket:', listError)
  } else {
    console.log('Bucket contents:', JSON.stringify(listData, null, 2))
    
    if (listData && listData.length > 0) {
      const firstFile = listData[0].name
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(firstFile)
      
      console.log(`Public URL for ${firstFile}:`, publicUrlData.publicUrl)
    }
  }
}

debugStorage()
