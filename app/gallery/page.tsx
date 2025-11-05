"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import Navigation from "@/components/navigation"
import FloatingActions from "@/components/floating-actions"

interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
}

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("gallery_images")
          .select("*")
          .order("display_order", { ascending: true })

        if (fetchError) throw fetchError
        setGalleryImages(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery images")
        console.error("[v0] Gallery page fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-32 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft size={16} />
                Back
              </Button>
            </Link>
            <h2 className="p-2">Gallery</h2>
          </div>

          {error && (
            <div className="p-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg mb-8">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-lg bg-card border border-border hover:border-primary transition-all duration-500 opacity-0 translate-y-4 animate-fade-in cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square overflow-hidden group">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-primary mb-2">{image.title}</h3>
                    {image.description && <p className="text-sm text-muted-foreground mb-3">{image.description}</p>}
                    <p className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full inline-block">
                      {image.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No gallery images found</p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white" onClick={() => setSelectedImage(null)}>
            <X size={32} />
          </button>
          <img
            src={selectedImage.image_url}
            alt={selectedImage.title}
            className="max-w-full max-h-full object-contain rounded-md shadow-lg"
          />
        </div>
      )}

      <FloatingActions />
    </div>
  )
}
