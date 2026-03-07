import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function uploadFile(
  file: File,
  bucketName: "eventimages" | "paymentscreenshots" = "eventimages"
) {

  if (!file) {
    console.error("No file provided")
    return null
  }

  const fileName = `${Date.now()}-${file.name}`

  try {

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      })

    if (error) {
      console.error("Supabase upload error:", error.message)
      return null
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path)

    return publicUrlData.publicUrl

  } catch (err) {
    console.error("Upload failed:", err)
    return null
  }
}

export async function uploadFiles(
  files: File[],
  bucketName: "eventimages" | "paymentscreenshots" = "eventimages"
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
  bucketName: "eventimages" | "paymentscreenshots" = "eventimages"
) {

  for (const fileUrl of fileUrls) {

    const fileName = fileUrl.split("/").pop()?.split("?")[0]
    if (!fileName) continue

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName])

    if (error) {
      console.error("Delete error:", error.message)
    }
  }
}