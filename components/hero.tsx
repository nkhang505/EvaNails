"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const handleCall = () => {
    window.location.href = "tel:(830)701-8162"
  }

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background via-background to-card overflow-hidden pt-0 sm:pt-20">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, oklch(0.65 0.2 70) 0%, transparent 70%)",
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Animated bokeh overlays */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Shimmer effect overlay */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.1) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: "shimmer 3s infinite",
        }}
      />

      <div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-accent rounded-full opacity-40 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary rounded-full opacity-50 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center items-center text-center">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Eva Nails & Spa Logo"
            width={400}
            height={400}
            quality={100}
            className="w-full max-w-[400px] sm:max-w-[400px] md:max-w-[400px] object-contain"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 btn bg-clip-text text-transparent">
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
          <Button
            onClick={handleCall}
            size="lg">
              Call to Book Appointment
          </Button>
        </div>
      </div>
    </section>
  )
}
