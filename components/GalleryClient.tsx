"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import type { ImageFile } from "@/app/highlights/utils"

interface GalleryClientProps {
    images: ImageFile[]
    imagesPerPage?: number
}

export default function GalleryClient({ images, imagesPerPage = 12 }: GalleryClientProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

    const totalImages = images.length
    const totalPages = Math.ceil(totalImages / imagesPerPage)
    const startIndex = (currentPage - 1) * imagesPerPage
    const endIndex = Math.min(startIndex + imagesPerPage, totalImages)
    const currentImages = images.slice(startIndex, endIndex)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!selectedImage) return

            switch (event.key) {
                case "Escape":
                    closeModal()
                    break
                case "ArrowLeft":
                    navigateImage(-1)
                    break
                case "ArrowRight":
                    navigateImage(1)
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedImage, selectedImageIndex])

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [currentPage])

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [currentPage, totalPages])

    const openModal = useCallback((image: ImageFile, index: number) => {
        setSelectedImage(image)
        setSelectedImageIndex(startIndex + index)
    }, [startIndex])

    const closeModal = useCallback(() => {
        setSelectedImage(null)
        setSelectedImageIndex(null)
    }, [])

    const navigateImage = useCallback((direction: number) => {
        if (selectedImageIndex === null) return

        const newIndex = selectedImageIndex + direction
        if (newIndex >= 0 && newIndex < totalImages) {
            const newImage = images[newIndex]
            setSelectedImage(newImage)
            setSelectedImageIndex(newIndex)
        }
    }, [selectedImageIndex, totalImages, images])

    const handleImageError = useCallback((imagePath: string) => {
        setImageErrors(prev => new Set(prev).add(imagePath))
    }, [])

    const handleDownload = useCallback(async (image: ImageFile) => {
        try {
            const response = await fetch(image.path)
            if (!response.ok) throw new Error('Download failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = image.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download failed:", error)
            const link = document.createElement("a")
            link.href = image.path
            link.download = image.name
            link.target = "_blank"
            link.click()
        }
    }, [])

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    if (totalImages === 0) {
        return (
            <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No images found in the gallery.</p>
                <p className="text-gray-400 text-sm mt-2">
                    Add images to the <code className="bg-gray-100 px-2 py-1 rounded">public/highlights</code> directory.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="mb-8 text-center">
                <p className="text-gray-600">
                    {totalImages} image{totalImages !== 1 ? "s" : ""} • Page {currentPage} of {totalPages}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {currentImages.map((image, index) => {
                    const hasError = imageErrors.has(image.path)
                    const globalIndex = startIndex + index

                    return (
                        <div
                            key={`${image.name}-${globalIndex}`}
                            className="group relative overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div
                                className="relative aspect-square w-full cursor-pointer"
                                onClick={() => !hasError && openModal(image, index)}
                            >
                                {!hasError ? (
                                    <Image
                                        src={image.path}
                                        alt={`Gallery image: ${image.name}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                        onError={() => handleImageError(image.path)}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gray-200">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-white">
                                <p className="text-xs font-medium text-gray-700 truncate" title={image.name}>
                                    {image.name}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">#{globalIndex + 1}</span>
                                        {image.size && (
                                            <span className="text-xs text-gray-400">{formatFileSize(image.size)}</span>
                                        )}
                                    </div>
                                    {!hasError && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDownload(image)
                                            }}
                                        >
                                            <Download className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-4">
                    <Button
                        variant="outline"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                                pageNum = i + 1
                            } else if (currentPage <= 3) {
                                pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                            } else {
                                pageNum = currentPage - 2 + i
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setCurrentPage(pageNum)
                                        window.scrollTo({ top: 0, behavior: "smooth" })
                                    }}
                                    className="w-10 h-10"
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="max-w-6xl w-[95vw] p-0 bg-black">
                    <DialogTitle className="sr-only">
                        {selectedImage ? `View ${selectedImage.name}` : "Image Gallery Modal"}
                    </DialogTitle>
                    <div className="relative w-full h-[85vh]">
                        {selectedImage && (
                            <>
                                <Image
                                    src={selectedImage.path}
                                    alt={`Full size: ${selectedImage.name}`}
                                    fill
                                    className="object-contain"
                                    priority
                                    quality={95}
                                />

                                {selectedImageIndex !== null && (
                                    <>
                                        {selectedImageIndex > 0 && (
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                                onClick={() => navigateImage(-1)}
                                            >
                                                <ChevronLeft className="h-6 w-6 text-white" />
                                            </Button>
                                        )}

                                        {selectedImageIndex < totalImages - 1 && (
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                                onClick={() => navigateImage(1)}
                                            >
                                                <ChevronRight className="h-6 w-6 text-white" />
                                            </Button>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex justify-between items-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <DialogClose asChild>
                                <Button variant="secondary" size="icon" onClick={closeModal}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>

                            {selectedImage && selectedImageIndex !== null && (
                                <div className="text-white text-sm">
                                    <span className="font-medium">{selectedImage.name}</span>
                                    <span className="ml-2 opacity-70">
                                        {selectedImageIndex + 1} of {totalImages}
                                    </span>
                                    {selectedImage.size && (
                                        <span className="ml-2 opacity-70">
                                            • {formatFileSize(selectedImage.size)}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {selectedImage && (
                            <Button
                                onClick={() => handleDownload(selectedImage)}
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}