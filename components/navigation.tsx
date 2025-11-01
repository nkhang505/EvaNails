"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuItems = [
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Admin", href: "/admin", isButton: true },
  ]

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Eva Nails & Spa Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span> <h1 className="text-2xl">Eva Nails</h1></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {menuItems.map((item) =>
              item.isButton ? (
                <Link key={item.label} href={item.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-foreground hover:bg-primary/10"
                  >
                    {item.label}
                  </Button>
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-primary transition-colors duration-300"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden p-2 rounded-md hover:bg-primary/10 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out transform ${mobileMenuOpen
              ? "max-h-96 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-4"
            }`}
        >
          <div className="flex flex-col px-4 pb-4 space-y-2 bg-background">
            {menuItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-2 rounded-md text-center transition-opacity duration-500 ${mobileMenuOpen ? "opacity-100" : "opacity-0"
                  }`}
                style={{ transitionDelay: `${i * 100}ms` }} // stagger effect
              >
                {item.isButton ? (
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    {item.label}
                  </Button>
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
