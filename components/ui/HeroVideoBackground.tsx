'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(console.error)
    }
  }, [])

  return (
    <section className="relative h-screen overflow-hidden mt-16 w-full">
      {/* Video Background */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source 
            src="https://res.cloudinary.com/dez7clpi8/video/upload/v1774542042/Animated_background_for_202603262025_ydggts.mp4" 
            type="video/mp4" 
          />
        </video>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center justify-start pl-12 md:pl-20 lg:pl-32">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-12xl lg:text-[11rem] xl:text-[12rem] font-black text-white leading-tight mb-4">
            Turn Your Golf Scores
          </h1>
          <h1 className="text-6xl md:text-9xl lg:text-[11rem] xl:text-[12rem] font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 bg-clip-text text-transparent leading-tight mb-8">
            Into Rewards
          </h1>
          <div className="space-y-2 mb-12">
            <p className="text-2xl md:text-4xl lg:text-5xl text-white font-normal">
              Play anywhere. Enter your scores.
            </p>
            <p className="text-2xl md:text-4xl lg:text-5xl text-white font-normal">
              Win monthly prizes & support charity.
            </p>
          </div>
          <Link 
            href="/signup" 
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-12 rounded-full text-xl md:text-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Subscribe Now
          </Link>
        </div>
      </div>
    </section>
  )
}