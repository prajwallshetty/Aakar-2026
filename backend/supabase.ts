import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function uploadFile(file: File, bucketName: "eventimages" | "paymentscreenshots" = "eventimages") {
    const fileName = `${Date.now()}-${file.name}`;

    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data.path);

        return publicUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
}

export async function uploadFiles(files: File[], bucketName: "eventimages" | "paymentscreenshots" = "eventimages") {
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        try {
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data.path);

            uploadedUrls.push(publicUrl);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }

    return uploadedUrls;
}

export async function deleteFiles(fileUrls: string[], bucketName: "eventimages" | "paymentscreenshots" = "eventimages") {
    for (let i = 0; i < fileUrls.length; i++) {
        const fileUrl = fileUrls[i];
        const fileName = fileUrl.split("/").pop()?.split("?")[0];
        if (!fileName) continue;
        try {
            const { error } = await supabase.storage
                .from(bucketName)
                .remove([fileName]);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }
}