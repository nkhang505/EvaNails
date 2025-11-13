"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import Navigation from "@/components/navigation"
import FloatingActions from "@/components/floating-actions"
import { motion, AnimatePresence } from "framer-motion"

interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
}

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<1 | -1>(0) // for swipe animation

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
        console.error("[GalleryPage] fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  const openFullscreen = (index: number) => setSelectedIndex(index)
  const closeFullscreen = () => setSelectedIndex(null)
  const showPrev = () => {
    if (selectedIndex !== null) {
      setDirection(-1)
      setSelectedIndex(prev => (prev! > 0 ? prev! - 1 : galleryImages.length - 1))
    }
  }
  const showNext = () => {
    if (selectedIndex !== null) {
      setDirection(1)
      setSelectedIndex(prev => (prev! < galleryImages.length - 1 ? prev! + 1 : 0))
    }
  }

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
            <h2 className="p-2 text-2xl font-semibold">Gallery</h2>
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
            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => openFullscreen(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <img
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover aspect-square"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-foreground text-lg">No gallery images found</p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Overlay with animation */}
      <AnimatePresence initial={false}>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4"
            onClick={closeFullscreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-6 right-6 text-white z-50"
              onClick={closeFullscreen}
            >
              <X size={32} />
            </button>

            <button
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white z-50"
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
            >
              <ChevronLeft size={40} />
            </button>

            <motion.img
              key={galleryImages[selectedIndex].id} // re-render for animation
              src={galleryImages[selectedIndex].image_url}
              alt={galleryImages[selectedIndex].title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain rounded-md shadow-lg"
              initial={{ x: direction * 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 300, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />

            <button
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white z-50"
              onClick={(e) => { e.stopPropagation(); showNext(); }}
            >
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingActions />
    </div>
  )
}
