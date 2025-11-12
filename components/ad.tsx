"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function GrandOpeningAd() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    // Show ad 1 second after page loads
    const timer = setTimeout(() => setVisible(true), 1000)

    // Auto-close after 16 seconds
    const autoCloseTimer = setTimeout(() => {
      handleClose()
    }, 16000)

    return () => {
      clearTimeout(timer)
      clearTimeout(autoCloseTimer)
    }
  }, [])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => setVisible(false), 400)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ad-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            key="ad-content"
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
            className="relative bg-black/90 text-gray-900 rounded-2xl shadow-2xl
                       p-8 sm:p-10 max-w-lg w-[90%] text-center"
          >
            {/* Close Button */}
            <Button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              aria-label="Close ad"
            >
              <X size={22} />
            </Button>

            {/* Content */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              🎉 Grand Opening!
            </h2>
            <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
              We’re thrilled to welcome you!
              Enjoy{" "}
              <span className="font-bold text-primary">20% OFF all services</span>{" "}
              for a limited time only.
              Treat yourself to a luxury experience at{" "}
              <span className="font-semibold">Eva Nails Salon</span> 💅✨
            </p>

            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-8 py-4 rounded-xl"
              onClick={() => {
                handleClose()
                window.location.href = "tel:8307018162"
              }}
            >
              Call to Book Now
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
