"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background via-background to-card pt-20 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, oklch(0.65 0.2 70) 0%, transparent 70%)",
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center items-center text-center">
        <h1
          className={`text-5xl md:text-7xl font-bold mb-6 metallic-gold metallic-shine ${
            isVisible ? "float-in" : "opacity-0"
          }`}
        >
          Eva Nails Salon
        </h1>
        <p
          className={`text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Experience luxury nail care in an elegant, sophisticated environment
        </p>
        <div
          className={`flex gap-4 flex-wrap justify-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 glow-border">
            Book Appointment
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
