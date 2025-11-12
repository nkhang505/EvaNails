"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Gallery from "@/components/gallery"
import About from "@/components/about"
import Contact from "@/components/contact"
import Navigation from "@/components/navigation"
import FloatingActions from "@/components/floating-actions"
import Testimonials from "@/components/testimonials"
import Ad from "@/components/ad"
import Footer from "@/components/footer"
import { CenterImage } from "@/components/center-image"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Prefetch all main tabs/pages
    const pages = ["/about", "/services", "/gallery", "/contact", "/testimonials"]
    pages.forEach((page) => router.prefetch(page))
  }, [router])

  return (
    <div className="relative min-h-screen text-foreground">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ✅ Foreground content */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <CenterImage />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Contact />
        <Ad />
        <FloatingActions />
      </div>
    </div>
  )
}
