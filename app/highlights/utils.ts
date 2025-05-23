import fs from "fs"
import path from "path"

export interface ImageFile {
    name: string
    path: string
    size?: number
    lastModified?: Date
}

export async function getImageFiles(): Promise<ImageFile[]> {
    try {
        const imagesDirectory = path.join(process.cwd(), "public/highlights")

        if (!fs.existsSync(imagesDirectory)) {
            console.warn("Images directory does not exist:", imagesDirectory)
            return []
        }

        const files = fs.readdirSync(imagesDirectory)

        const imageFiles = files
            .filter((file) => {
                const ext = file.toLowerCase()
                return ext.endsWith(".png") || ext.endsWith(".jpg") ||
                    ext.endsWith(".jpeg") || ext.endsWith(".webp") ||
                    ext.endsWith(".gif") || ext.endsWith(".svg")
            })
            .map((file) => {
                const filePath = path.join(imagesDirectory, file)
                const stats = fs.statSync(filePath)

                return {
                    name: file,
                    path: `/highlights/${file}`,
                    size: stats.size,
                    lastModified: stats.mtime
                }
            })
            .sort((a, b) => b.lastModified!.getTime() - a.lastModified!.getTime())

        return imageFiles
    } catch (error) {
        console.error("Error reading image directory:", error)
        return []
    }
}