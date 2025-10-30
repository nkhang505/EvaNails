"use client"
import { useEffect, useState } from "react"

export default function About() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    const element = document.getElementById("about-content")
    if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="about-content" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <h2 className="text-4xl font-bold mb-6 ">About Eva Nails</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Eva Nails Salon is dedicated to providing the highest quality nail care services in an elegant and
              sophisticated environment. Our team of expert technicians brings years of experience and passion to every
              service.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We use only premium products and maintain the highest standards of hygiene and professionalism. Each
              client is treated with personalized attention to ensure complete satisfaction.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Expert Technicians
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Premium Products
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Luxury Environment
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Personalized Service
              </li>
            </ul>
          </div>
          <div
            className={`aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <img src="/luxury-nail-salon-interior.jpg" alt="Eva Nails Salon" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
