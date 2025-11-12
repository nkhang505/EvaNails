"use client"

import { Phone, MapPin, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

export default function FloatingActions() {
  const [showMenu, setShowMenu] = useState(false)

  const handleCall = () => {
    window.location.href = "tel:8307018162"
  }

  const handleDirections = () => {
    const address = "936 Junction Hwy Suite.D, Kerrville, TX 78028"
    const encodedAddress = encodeURIComponent(address)
    window.location.href = `https://maps.google.com/?q=${encodedAddress}`
  }

  const handleReview = () => {
    window.open(
      "https://www.google.com/search?sca_esv=2286498253ea9ec4&sxsrf=AE3TifNA1uYc92ZqsbXjEPQG8tUrwAPGXA:1762913474195&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EybjYIXt5OsK-rWPwq2UT70S_EQM6JCVS8L3aIET1Cdr-3OUJbZ-6gvib6gCJ_gAODh2i6vjH8F_bVGY01FdqwuRZEQI&q=Eva+Nails+%26+Spa+Reviews&sa=X&ved=2ahUKEwiVwpi7xOuQAxV2IEQIHQYEMIgQ0bkNegQIIxAE&biw=1022&bih=1043&dpr=1.25",
      "_blank"
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Call Button */}
      <Button
        onClick={handleCall}
        className="flex items-center gap-2 bg-primary hover:bg-accent text-black px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
        aria-label="Call to book appointment"
        size={"xl"}
      >
        <Phone className="w-5 h-5" />
        <span className="hidden sm:inline">Call Now</span>
      </Button>

      {/* Directions Button */}
      <Button
        onClick={handleDirections}
        className="flex items-center gap-2 bg-primary hover:bg-accent text-black px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
        aria-label="Get directions to salon"
        size={"xl"}
      >
        <MapPin className="w-5 h-5" />
        <span className="hidden sm:inline">Directions</span>
      </Button>

      {/* Review Button */}
      <Button
        onClick={handleReview}
        className="flex items-center gap-2 bg-primary hover:bg-accent text-black px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
        aria-label="Leave a review"
        size={"xl"}
      >
        <Star className="w-5 h-5" />
        <span className="hidden sm:inline">Leave a Review</span>
      </Button>
    </div>
  )
}
