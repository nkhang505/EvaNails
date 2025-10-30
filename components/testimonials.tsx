"use client"

import { useEffect, useState } from "react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    text: "Eva Nails is absolutely stunning! The attention to detail and luxurious atmosphere made my experience unforgettable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Maria Garcia",
    text: "Best nail salon in town! The technicians are incredibly skilled and the service is impeccable.",
    rating: 5,
  },
  {
    id: 3,
    name: "Jessica Lee",
    text: "I love coming here. The ambiance is so elegant and the staff is always so welcoming and professional.",
    rating: 5,
  },
]

export default function Testimonials() {
  const [visibleTestimonials, setVisibleTestimonials] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-testimonial-id"))
            setVisibleTestimonials((prev) => [...new Set([...prev, id])])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-testimonial-card]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="testimonials" className="py-20 bg-card/50 relative">
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/20 rounded-full opacity-30" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-primary/10 rounded-full opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-4 ">Client Testimonials</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Hear from our satisfied clients about their experience at Eva Nails
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              data-testimonial-id={testimonial.id}
              data-testimonial-card
              className={`testimonial-frame transition-all duration-500 group ${visibleTestimonials.includes(testimonial.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex gap-1 mb-4 justify-center">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-primary text-xl drop-shadow-lg">
                    ★
                  </span>
                ))}
              </div>

              <p className="text-foreground mb-4 italic text-center">"{testimonial.text}"</p>
              <p className="font-semibold text-primary text-center group-hover:text-accent transition-colors duration-300">
                {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}