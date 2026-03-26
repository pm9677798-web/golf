'use client'

import { useEffect, useState } from 'react'

const heroImages = [
  'https://res.cloudinary.com/dez7clpi8/image/upload/v1774542044/ChatGPT_Image_Mar_26_2026_08_45_07_PM_bg52ys.png',
  'https://res.cloudinary.com/dez7clpi8/image/upload/v1774542044/ChatGPT_Image_Mar_26_2026_08_09_12_PM_ztvvuh.png',
  'https://res.cloudinary.com/dez7clpi8/image/upload/v1774542044/ChatGPT_Image_Mar_26_2026_08_39_39_PM_jmbrbr.png',
  'https://res.cloudinary.com/dez7clpi8/image/upload/v1774542042/ChatGPT_Image_Mar_26_2026_08_37_38_PM_qvgbm5.png',
  'https://res.cloudinary.com/dez7clpi8/image/upload/v1774542042/ChatGPT_Image_Mar_26_2026_08_35_55_PM_d6ay9b.png'
]

interface HeroCarouselProps {
  children: React.ReactNode
}

export default function HeroCarousel({ children }: HeroCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      )
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Carousel Background Images */}
      <div className="absolute inset-0 -z-10">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white shadow-lg scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        {children}
      </div>
    </section>
  )
}