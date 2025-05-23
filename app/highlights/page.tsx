import { getImageFiles } from "./utils"
import GalleryClient from "@/components/GalleryClient"

export default async function GalleryPage() {
    const images = await getImageFiles()

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Image Gallery</h1>
            <GalleryClient images={images} imagesPerPage={12} />
        </div>
    )
}