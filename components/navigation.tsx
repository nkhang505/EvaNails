"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export default function Navigation({ mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Eva Nails & Spa Logo" width={40} height={40} className="h-10 w-10" />
            <span className="text-2xl font-bold metallic-gold">Eva Nails</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="#services" className="hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="#gallery" className="hover:text-primary transition-colors">
              Gallery
            </Link>
            <Link href="#about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="#services" className="block py-2 hover:text-primary">
              Services
            </Link>
            <Link href="#gallery" className="block py-2 hover:text-primary">
              Gallery
            </Link>
            <Link href="#about" className="block py-2 hover:text-primary">
              About
            </Link>
            <Link href="#contact" className="block py-2 hover:text-primary">
              Contact
            </Link>
            <Link href="/admin" className="block">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Admin
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
