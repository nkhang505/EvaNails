"use client"

import { useState } from "react"
import Image from "next/image"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Gallery from "@/components/gallery"
import About from "@/components/about"
import Contact from "@/components/contact"
import Navigation from "@/components/navigation"
import FloatingActions from "@/components/floating-actions"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"
import { CenterImage } from "@/components/center-image"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
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
        <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <Hero />
        <CenterImage />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Contact />
        <Footer />
        <FloatingActions />
      </div>
    </div>
  )
}
