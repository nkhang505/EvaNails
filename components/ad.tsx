"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function GrandOpeningAd() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    // Show ad 1 second after page loads
    const timer = setTimeout(() => setVisible(true), 1000)

    // Auto-close after 10 seconds
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
    setTimeout(() => {
      setVisible(false)
    }, 400)
  }

  if (!visible) return null

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/50 backdrop-blur-sm transition-opacity duration-500
        ${closing ? "opacity-0" : "opacity-100"}
      `}
    >
      <div
        className={`
          relative bg-black/90 text-gray-900 rounded-2xl shadow-2xl
          p-8 sm:p-10 max-w-lg w-[90%] text-center
          transform transition-all duration-500
          ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
      >
        {/* Close Button */}
        <Button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
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
          Enjoy <span className="font-bold text-primary">20% OFF all services</span> for a limited time only.
          Treat yourself to a luxury experience at <span className="font-semibold">Eva Nails Salon</span> 💅✨
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
      </div>
    </div>
  )
}
