"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { ScrollVelocityContainer, ScrollVelocityRow } from "./ui/scroll-based-velocity"

interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
}

export default function Gallery() {
  const [visibleItems, setVisibleItems] = useState<string[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id")
            if (id) setVisibleItems((prev) => [...new Set([...prev, id])])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-gallery-item]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [galleryImages])

  const fetchGalleryImages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from("gallery_images")
        .select("*")

      if (fetchError) throw fetchError

      // Randomize the array
      const shuffled = shuffleArray(data || [])

      setGalleryImages(shuffled)
    } catch (err) {
      console.error("[Gallery fetch error]:", err)
      setError(err instanceof Error ? err.message : "Failed to load gallery images")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to shuffle the array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
    }
    return shuffledArray
  }

  // limit visible images
  const displayedImages = showAll ? galleryImages : galleryImages.slice(0, 20)

  // Split the images into two halves
  const half = Math.ceil(displayedImages.length / 2)
  const firstHalf = displayedImages.slice(0, half)
  const secondHalf = displayedImages.slice(half)

  return (
    <section id="gallery" className="relative py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center p-1 mb-4 ">Our Gallery</h2>
        <h3 className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our latest nail designs and transformations
        </h3>

        {isLoading && (
          <p className="text-center text-muted-foreground">
            Loading gallery...
          </p>
        )}
        {error && <p className="text-center text-destructive">{error}</p>}

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
          <ScrollVelocityContainer className="w-full">
            <ScrollVelocityRow baseVelocity={2} direction={1} id="scr-1">
              {firstHalf &&
                firstHalf.map((item, index) => (
                  <img
                    key={`imgr-${index}`}
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="mx-2 inline-block h-64 md:h-80 w-64 md:w-80 rounded-lg object-cover shadow-sm mb-4"
                  />
                ))}
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={2} direction={-1} id="scr-2">
              {secondHalf &&
                secondHalf.map((item, index) => (
                  <img
                    key={`imgl-${index}`}
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="mx-2 inline-block h-64 md:h-80 w-64 md:w-80 rounded-lg object-cover shadow-sm mb-4"
                  />
                ))}
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/gallery">
            <Button className="bg-primary hover:bg-primary/80 text-background px-8 py-2 rounded-lg font-semibold transition-all duration-300">
              View All Gallery
            </Button>
          </Link>
        </div>
      </div>
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
}
