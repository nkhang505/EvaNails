import React, { useState, useEffect } from 'react';
import { Button } from './button';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  const slides = [
    { id: 1, image: 'salon1.jpg', alt: 'Slide 1' },
    { id: 2, image: 'salon2.jpg', alt: 'Slide 2' },
    { id: 3, image: 'salon3.jpg', alt: 'Slide 3' },
    { id: 4, image: 'salon4.jpg', alt: 'Slide 4' },
    { id: 5, image: 'salon5.jpg', alt: 'Slide 5' },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides
    );
  };

  // Automatically move to the next slide every 2 seconds
  useEffect(() => {
    if (isHovered) return; // Pause autoplay if hovered

    const interval = setInterval(nextSlide, 1500); // Slide every 1.5 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [currentIndex, isHovered]);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsHovered(true)} // Pause on hover
      onMouseLeave={() => setIsHovered(false)} // Resume autoplay when hover ends
    >
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Previous Button */}
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
