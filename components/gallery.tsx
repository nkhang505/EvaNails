"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
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
      const shuffled = (data || []).sort(() => Math.random() - 0.5)

      setGalleryImages(shuffled)
    } catch (err) {
      console.error("[Gallery fetch error]:", err)
      setError(err instanceof Error ? err.message : "Failed to load gallery images")
    } finally {
      setIsLoading(false)
    }
  }

  // limit visible images
  const displayedImages = showAll ? galleryImages : galleryImages.slice(0, 10)

  return (
    <section id="gallery" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center p-1 mb-4 ">Gallery</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our latest nail designs and transformations
        </p>

        {isLoading && (
          <p className="text-center text-muted-foreground">
            Loading gallery...
          </p>
        )}
        {error && <p className="text-center text-destructive">{error}</p>}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedImages.map((item, index) => (
            <Card
              key={item.id}
              data-id={item.id}
              data-gallery-item
              className={`overflow-hidden bg-background border-border hover:border-primary transition-all hover:shadow-lg duration-500 ${
                visibleItems.includes(item.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden group">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
            </Card>
          ))}

          {!isLoading && !error && galleryImages.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No images available yet.
            </p>
          )}
        </div> */}

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
          <ScrollVelocityContainer className="w-full">
            <ScrollVelocityRow baseVelocity={4} direction={1}>
              {displayedImages &&
                displayedImages.map((item, index) => (
                  <img
                    id={`img-${index}`}
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="mx-2 inline-block h-80 w-80 rounded-lg object-cover shadow-sm"
                  />
                ))}
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={4} direction={-1}>
              {displayedImages &&
                displayedImages.map((item, index) => (
                  <img
                    id={`img-${index}`}
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="mx-2 inline-block h-80 w-80 rounded-lg object-cover shadow-sm"
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
    </section>
  );
}
