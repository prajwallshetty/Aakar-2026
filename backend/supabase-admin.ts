import { createClient } from "@supabase/supabase-js";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function uploadElitePassPayment(file: File) {
  return uploadWithServiceRole(file, "elitepasspayments");
}

async function uploadWithServiceRole(
  file: File,
  bucketName: "elitepasspayments" | "paymentscreenshots"
) {
  const supabase = getSupabaseAdminClient();

  if (!file) {
    throw new Error("No file provided");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File is too large (max 10MB)");
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `public/${Date.now()}-${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

export async function uploadMerchPaymentScreenshot(file: File) {
  return uploadWithServiceRole(file, "paymentscreenshots");
}
