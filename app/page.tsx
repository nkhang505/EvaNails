"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Prefetch main routes
  useEffect(() => {
    const pages = ["/about", "/services", "/gallery", "/contact", "/testimonials"]
    pages.forEach((page) => router.prefetch(page))
  }, [router])

  // ✅ Wait until all images & components finish loading
  useEffect(() => {
    const waitForImages = async () => {
      const allImages = Array.from(document.images)
      const unloaded = allImages.filter((img) => !img.complete)

      if (unloaded.length === 0) {
        // Everything is already loaded
        finishLoading()
        return
      }

      await Promise.all(
        unloaded.map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener("load", resolve)
              img.addEventListener("error", resolve) // handle broken links safely
            })
        )
      )

      finishLoading()
    }

    const finishLoading = () => {
      // Small buffer for smoother fade transition
      setTimeout(() => setLoading(false), 500)
    }

    waitForImages()
  }, [])

  return (
    <div className="relative min-h-screen text-foreground">
      {/* Background */}
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

      {/* 🪄 Logo Preloader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Image
                src="/logo.png"
                alt="Eva Nails Logo"
                width={180}
                height={180}
                priority
                className="drop-shadow-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={`relative z-10 ${loading ? "pointer-events-none" : "pointer-events-auto"}`}
      >
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
      </motion.div>
    </div>
  )
}
