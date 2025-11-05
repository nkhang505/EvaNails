"use client"

import { useState } from "react"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Gallery from "@/components/gallery"
import About from "@/components/about"
import Contact from "@/components/contact"
import Navigation from "@/components/navigation"
import FloatingActions from "@/components/floating-actions"
import Testimonials from "@/components/testimonials"
import { CenterImage } from "@/components/center-image"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[url('/bg.png')] bg-cover bg-no-repeat bg-center bg-fixed text-foreground">
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Hero />
      <CenterImage />
      <About />
      <Services />
      <Gallery />
      <Testimonials />
      <Contact />
      <FloatingActions />
    </div>
  )
}
