import { createClient, SupabaseClient } from "@supabase/supabase-js"

type StorageBucketName = "eventimages" | "paymentscreenshots"

// ── Supabase Singleton ──────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  // We log error but don't throw immediately to avoid crashing build-time imports if Env vars are missing
  console.warn("Supabase credentials missing. Client initialization may fail.")
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || "", 
  supabaseKey || "", 
  {
    auth: {
      persistSession: false,
    },
  }
)

export async function uploadFile(
  file: File,
  bucketName: StorageBucketName = "eventimages"
) {
  if (!file) {
    console.error("No file provided")
    return null
  }

  // Validate file before upload
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    console.error("File is too large (max 10MB)")
    return null
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const filePath = `public/${Date.now()}-${sanitizedName}`

  try {
    console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}, size: ${file.size}`)

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      })

    if (error) {
      console.error(`Supabase upload error (${error.name}):`, error.message)
      console.error("Full error object:", error)
      return null
    }

    console.log(`File uploaded successfully: ${data.path}`)

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path)

    console.log(`Public URL: ${publicUrlData.publicUrl}`)
    return publicUrlData.publicUrl

  } catch (err) {
    console.error("Upload failed with exception:", err)
    return null
  }
}

export async function uploadFiles(
  files: File[],
  bucketName: StorageBucketName = "eventimages"
) {
  const urls: string[] = []
  for (const file of files) {
    const url = await uploadFile(file, bucketName)
    if (url) urls.push(url)
  }
  return urls
}

export async function deleteFiles(
  fileUrls: string[],
  bucketName: StorageBucketName = "eventimages"
) {
  for (const fileUrl of fileUrls) {
    const pathMarker = `/public/${bucketName}/`
    const markerIndex = fileUrl.indexOf(pathMarker)
    if (markerIndex === -1) continue

    const filePath = fileUrl.slice(markerIndex + pathMarker.length).split("?")[0]
    if (!filePath) continue

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      console.error("Delete error:", error.message)
    }
  }
}

export function getPublicFileUrl(
  filePath: string,
  bucketName: string = "eventimages"
) {
  if (!filePath) return null

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)

  return data.publicUrl || null
}