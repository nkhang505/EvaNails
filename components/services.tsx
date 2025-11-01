"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  full_set_price?: number
  fill_ins_price?: number
}

interface ServiceCategory {
  title: string
  services: Service[]
}

export default function Services() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("services")
        .select("*")

      if (error) throw error

      // Define the custom category order
      const categoryOrder = [
        "Manicure",
        "Pedicure",
        "Dipping Powder",
        "Nail Enhancement",
        "Waxing",
        "Additional Services"
      ]

      // Group services by category
      const grouped: Record<string, Service[]> = {}
      data.forEach((service: Service) => {
        if (!grouped[service.category]) grouped[service.category] = []
        grouped[service.category].push(service)
      })

      // Sort services by price ascending within each category
      Object.keys(grouped).forEach((category) => {
        grouped[category].sort((a, b) => a.price - b.price)
      })

      // Convert to array following the custom category order
      const categories = categoryOrder
        .filter((title) => grouped[title]) // only include categories that exist
        .map((title) => ({
          title,
          services: grouped[title],
        }))

      setServiceCategories(categories)
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Placeholder images by category name
  const placeholderImages: Record<string, string> = {
    "Manicure": "/Manicure.png",
    "Pedicure": "/Pedicure.png",
    "Waxing": "/Waxing.png",
    "Dipping Powder": "/Dipping.png",
    "Nail Enhancement": "/Nail-enhancement.png",
    "Additional Services": "/Additional-services.png",
  }

  const getCategoryImage = (category: string) => {
    return placeholderImages[category] || placeholderImages["Default"]
  }

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-background text-center">
        <p className="text-muted-foreground">Loading services...</p>
      </section>
    )
  }

  const selectedCategoryData = serviceCategories.find((cat) => cat.title === selectedCategory)

  return (
    <section id="services" className="py-20 bg-background relative overflow-hidden">
      {/* Decorative border line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4 ">Our Services</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover our range of luxurious nail and spa services designed to make you look and feel your best.
        </p>

        {/* Category Display */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCategory(category.title)}
              className="cursor-pointer group bg-background border border-primary/20 hover:border-primary/50 rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300"
            >
              {/* Category Image */}
              <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-2xl">
                <Image
                  src={getCategoryImage(category.title)}
                  alt={category.title}
                  fill
                  style={{
                    objectPosition: window.innerWidth < 640 ? "center 60%" : "center 80%", // mobile higher
                  }}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors duration-300" />
                <h3 className="absolute bottom-14 left-4 text-white text-2xl font-semibold drop-shadow-lg">
                  {category.title}
                </h3>
                <p className="absolute bottom-4 left-4 text-white text-sm drop-shadow-md">
                  Click to view our full list of {category.title.toLowerCase()} services.
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Full Service Tab */}
        <AnimatePresence>
          {selectedCategoryData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 150 }}
                className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-primary/50 shadow-lg"
              >
                <div className="sticky top-0 bg-background border-b border-primary/30 p-6 flex justify-between items-center">
                  <h3 className="text-3xl font-bold ">{selectedCategoryData.title}</h3>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {selectedCategoryData.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-start p-4 rounded-lg hover:bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                    >
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {service.name}
                        </p>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-6">
                        <p className="font-bold text-lg text-primary">${service.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  )
}
