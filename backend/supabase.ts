"use server"
import { supabase } from ".";

export async function uploadFile(file: File) {
    const bucketName = "eventimages";
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

export async function uploadFiles(files: File[]) {
    const bucketName = "eventimages";
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

export async function deleteFiles(fileUrls: string[]) {
    const bucketName = "eventimages";

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