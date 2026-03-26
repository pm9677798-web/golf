'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { CheckCircle2, Zap, Trophy, Heart } from 'lucide-react'

export default function StackedImages() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [activeImage, setActiveImage] = useState(0)

  const images = [
    'https://res.cloudinary.com/dez7clpi8/image/upload/v1774542044/ChatGPT_Image_Mar_26_2026_08_45_07_PM_bg52ys.png',
    'https://res.cloudinary.com/dez7clpi8/image/upload/v1774542042/ChatGPT_Image_Mar_26_2026_08_35_55_PM_d6ay9b.png',
    'https://res.cloudinary.com/dez7clpi8/image/upload/v1774542042/ChatGPT_Image_Mar_26_2026_08_37_38_PM_qvgbm5.png'
  ]

  const steps = [
    { title: 'Subscribe & Connect', desc: 'Choose your plan and pick a charity that resonates with you.', icon: Heart, color: 'text-pink-500' },
    { title: 'Play & Record', desc: 'Enter your 5 latest Stableford scores after your round.', icon: Zap, color: 'text-orange-500' },
    { title: 'Win & Impact', desc: 'Match the secret scores to win big while making a difference.', icon: Trophy, color: 'text-yellow-500' }
  ]

  useEffect(() => {
    const unsub = smoothProgress.on("change", (latest) => {
      // Map progress (roughly 0.3 to 0.7 for the active stack period) to image index
      const start = 0.2
      const end = 0.8
      if (latest < start) setActiveImage(0)
      else if (latest > end) setActiveImage(images.length - 1)
      else {
        const p = (latest - start) / (end - start)
        const idx = Math.floor(p * images.length)
        setActiveImage(Math.max(0, Math.min(images.length - 1, idx)))
      }
    })
    return () => unsub()
  }, [smoothProgress, images.length])

  return (
    <section ref={sectionRef} id="stacked-images-section" className="py-40 relative overflow-hidden bg-slate-50">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Left Side: Storytelling Text */}
          <div className="order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-orange-500">The Workflow</h2>
                <h3 className="text-6xl md:text-7xl font-black text-slate-900 leading-tight tracking-tighter">
                  How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 italic">Works.</span>
                </h3>
              </div>

              <div className="space-y-10">
                {steps.map((step, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      opacity: activeImage === i ? 1 : 0.4,
                      scale: activeImage === i ? 1.05 : 1,
                      x: activeImage === i ? 20 : 0
                    }}
                    className={`flex items-start space-x-6 p-8 rounded-[2.5rem] transition-all duration-500 ${activeImage === i ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center flex-shrink-0 ${activeImage === i ? 'scale-110 rotate-6' : ''} transition-transform`}>
                      <step.icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2">{step.title}</h4>
                      <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Stacked Images */}
          <div className="order-1 lg:order-2 relative h-[600px] flex items-center justify-center">
            <div className="relative w-full h-full max-w-2xl">
              {images.map((image, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: activeImage >= i ? 1 : 0,
                    y: activeImage >= i ? (i - activeImage) * 30 : 50,
                    scale: activeImage >= i ? 1 - (activeImage - i) * 0.05 : 0.9,
                    rotate: activeImage === i ? 0 : (i - activeImage) * 2
                  }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ zIndex: i }}
                >
                  <img
                    src={image}
                    alt={`Step ${i + 1}`}
                    className="w-full h-auto rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-4 border-white object-cover"
                  />
                  {activeImage === i && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-6 -right-6 w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}