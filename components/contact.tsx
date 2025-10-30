"use client"

import { Button } from "@/components/ui/button"
import { Phone, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export default function Contact() {
  const handleCall = () => {
    window.location.href = "tel:(830)701-8162"
  }

  return (
    <section id="contact" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 ">Get In Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <Phone className="w-12 h-12 text-yellow-200 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-muted-foreground">(830) 701-8162</p>
          </div>
          <div className="text-center">
            <MapPin className="w-12 h-12 text-yellow-200 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground">936 Junction Hwy Suite D, Kerrville, TX 78028</p>
          </div>
          <div className="text-center">
            <Clock className="w-12 h-12 text-yellow-200 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Hours</h3>
            <p className="text-muted-foreground">Mon-Sat: 9:30 AM – 7:00 PM</p>
            <p className="text-muted-foreground text-sm">Closed Sunday</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 ">Follow Us</h3>
            <div className="flex gap-6 justify-center">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-200 hover:text-accent transition-colors duration-300 transform hover:scale-110"
              >
                <Facebook className="w-8 h-8" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-200 hover:text-accent transition-colors duration-300 transform hover:scale-110"
              >
                <Instagram className="w-8 h-8" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-200 hover:text-accent transition-colors duration-300 transform hover:scale-110"
              >
                <Twitter className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" onClick={handleCall} className="bg-primary hover:bg-primary/90">
            Call to Book Appointment
          </Button>
        </div>
      </div>
    </section>
  )
}
