"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const galleryItems = [
  { id: 1, title: "Classic Red", category: "Manicure" },
  { id: 2, title: "Ombre Design", category: "Nail Art" },
  { id: 3, title: "French Tips", category: "Manicure" },
  { id: 4, title: "Glitter Accent", category: "Nail Art" },
  { id: 5, title: "Gel Extensions", category: "Extensions" },
  { id: 6, title: "Marble Effect", category: "Nail Art" },
]

export default function Gallery() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"))
            setVisibleItems((prev) => [...new Set([...prev, id])])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-gallery-item]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="gallery" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4 ">Gallery</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our latest nail designs and transformations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <Card
              key={item.id}
              data-id={item.id}
              data-gallery-item
              className={`overflow-hidden bg-background border-border hover:border-primary transition-all hover:shadow-lg duration-500 ${
                visibleItems.includes(item.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden group">
                <img
                  src={`/luxury-nail-design-.jpg?height=300&width=300&query=luxury nail design ${item.title}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
