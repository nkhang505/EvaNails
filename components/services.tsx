"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

const services = [
  {
    id: 1,
    name: "Manicure",
    description: "Classic and gel manicures with premium finishes",
    price: "$35-65",
  },
  {
    id: 2,
    name: "Pedicure",
    description: "Relaxing pedicures with therapeutic foot massage",
    price: "$45-75",
  },
  {
    id: 3,
    name: "Nail Art",
    description: "Custom designs and artistic nail creations",
    price: "$50-100",
  },
  {
    id: 4,
    name: "Extensions",
    description: "Acrylic and gel nail extensions",
    price: "$60-120",
  },
  {
    id: 5,
    name: "Gel Polish",
    description: "Long-lasting gel polish application",
    price: "$40-70",
  },
  {
    id: 6,
    name: "Spa Treatment",
    description: "Luxurious hand and foot spa treatments",
    price: "$55-85",
  },
]

export default function Services() {
  const [visibleServices, setVisibleServices] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-service-id"))
            setVisibleServices((prev) => [...new Set([...prev, id])])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-service-card]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4 metallic-gold">Our Services</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover our comprehensive range of premium nail care services
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.id}
              data-service-id={service.id}
              data-service-card
              className={`bg-card border-border hover:border-primary transition-all hover:shadow-lg duration-500 ${
                visibleServices.includes(service.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } p-6`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <h3 className="text-xl font-semibold text-primary mb-2">{service.name}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <p className="text-lg font-bold text-primary">{service.price}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
