"use client"

import { Phone, MapPin } from "lucide-react"
import { useState } from "react"

export default function FloatingActions() {
  const [showMenu, setShowMenu] = useState(false)

  const handleCall = () => {
    window.location.href = "tel:(830)701-8162"
  }

  const handleDirections = () => {
    const address = "936 Junction Hwy Suite D, Kerrville, TX 78028"
    const encodedAddress = encodeURIComponent(address)
    window.location.href = `https://maps.google.com/?q=${encodedAddress}`
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Call Button */}
      <button
        onClick={handleCall}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
        aria-label="Call to book appointment"
      >
        <Phone className="w-5 h-5" />
        <span className="hidden sm:inline">Call Now</span>
      </button>

      {/* Directions Button */}
      <button
        onClick={handleDirections}
        className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
        aria-label="Get directions to salon"
      >
        <MapPin className="w-5 h-5" />
        <span className="hidden sm:inline">Directions</span>
      </button>
    </div>
  )
}
