import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";

const Carousel = () => {
  const slides = [
    { id: 1, image: "salon1.JPG", alt: "Slide 1" },
    { id: 2, image: "salon2.JPG", alt: "Slide 2" },
    { id: 3, image: "salon3.JPG", alt: "Slide 3" },
    { id: 4, image: "salon4.JPG", alt: "Slide 4" },
    { id: 5, image: "salon5.JPG", alt: "Slide 5" },
  ];

  const totalSlides = slides.length;
  const [currentIndex, setCurrentIndex] = useState(totalSlides); // start at the first "real" slide
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create duplicated slides for seamless looping
  const extendedSlides = [...slides, ...slides, ...slides];

  const slideWidth = 100; // percent

  const nextSlide = () => setCurrentIndex((prev) => prev + 1);
  const prevSlide = () => setCurrentIndex((prev) => prev - 1);

  // Autoplay
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 1500);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Handle seamless reset
  useEffect(() => {
    if (!containerRef.current) return;

    const transitionEnd = () => {
      if (currentIndex >= totalSlides * 2) {
        // reset to the first set
        setCurrentIndex(totalSlides);
        containerRef.current!.style.transition = "none";
        containerRef.current!.style.transform = `translateX(-${totalSlides * slideWidth}%)`;
      } else if (currentIndex < totalSlides) {
        // reset to the last set
        setCurrentIndex(totalSlides * 2 - 1);
        containerRef.current!.style.transition = "none";
        containerRef.current!.style.transform = `translateX(-${(totalSlides * 2 - 1) * slideWidth}%)`;
      }
    };

    const node = containerRef.current;
    node.addEventListener("transitionend", transitionEnd);

    return () => node.removeEventListener("transitionend", transitionEnd);
  }, [currentIndex, totalSlides]);

  // Update transform on index change
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.transition = "transform 0.5s ease-in-out";
    containerRef.current.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
  }, [currentIndex]);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex" ref={containerRef}>
        {extendedSlides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <Button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-black p-2 rounded-full shadow-lg hover:bg-gray-800"
      >
        &#10094;
      </Button>

      {/* Next Button */}
      <Button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-black p-2 rounded-full shadow-lg hover:bg-gray-800"
      >
        &#10095;
      </Button>
    </div>
  );
};

export default Carousel;
