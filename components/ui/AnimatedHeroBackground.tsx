'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface AnimatedHeroBackgroundProps {
  totalFrames?: number
  children: React.ReactNode
  mode?: 'scroll' | 'carousel'
  autoPlayInterval?: number
  manualImages?: string[] // Optional array of image URLs to use instead of frames
}

export default function AnimatedHeroBackground({ 
  totalFrames = 240, 
  children,
  mode = 'scroll',
  autoPlayInterval = 5000,
  manualImages
}: AnimatedHeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  
  const currentFrameRef = useRef(0)
  const nextFrameRef = useRef(-1)
  const transitionProgressRef = useRef(1)
  const [imageIndex, setImageIndex] = useState(0)

  // Use either manual images or the frames sequence
  const targetImages = manualImages || []
  const isUsingManual = targetImages.length > 0

  // Preload Images
  useEffect(() => {
    let loadedCount = 0
    const images: HTMLImageElement[] = []
    setIsLoading(true)
    setProgress(0)

    const preload = async () => {
      const urls = isUsingManual 
        ? targetImages 
        : Array.from({ length: totalFrames }, (_, i) => `/assets/hero-frames/ezgif-frame-${(i + 1).toString().padStart(3, '0')}.png`)
      
      const count = urls.length
      const promises = urls.map((url, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.src = url
          img.onload = () => {
            loadedCount++
            setProgress(Math.floor((loadedCount / count) * 100))
            resolve()
          }
          img.onerror = () => {
            console.error(`Failed to load: ${url}`)
            resolve()
          }
          images[i] = img
        })
      })

      await Promise.all(promises)
      setLoadedImages(images)
      setIsLoading(false)
    }

    preload()
  }, [totalFrames, isUsingManual, targetImages])

  const drawFrame = useCallback((context: CanvasRenderingContext2D, img: HTMLImageElement, alpha: number) => {
    if (!img) return
    const canvas = context.canvas
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
    const x = (canvas.width - img.width * scale) / 2
    const y = (canvas.height - img.height * scale) / 2
    context.globalAlpha = alpha
    context.drawImage(img, x, y, img.width * scale, img.height * scale)
  }, [])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || loadedImages.length === 0) return
    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)

    if (nextFrameRef.current !== -1 && transitionProgressRef.current < 1) {
      // Cross-fade
      drawFrame(context, loadedImages[currentFrameRef.current], 1)
      drawFrame(context, loadedImages[nextFrameRef.current], transitionProgressRef.current)
      
      transitionProgressRef.current += 0.015 // Smooth fade speed
      if (transitionProgressRef.current >= 1) {
        currentFrameRef.current = nextFrameRef.current
        nextFrameRef.current = -1
      }
      requestAnimationFrame(render)
    } else {
      drawFrame(context, loadedImages[currentFrameRef.current], 1)
    }
  }, [loadedImages, drawFrame])

  // Handle Canvas Resizing
  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        render()
      }
    }
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [render])

  // Initial draw once loaded
  useEffect(() => {
    if (!isLoading && loadedImages.length > 0) {
      render()
    }
  }, [isLoading, loadedImages, render])

  // Scroll Mode Logic
  useEffect(() => {
    if (mode !== 'scroll' || isLoading || isUsingManual) return
    const handleScroll = () => {
      const scrollRange = window.innerHeight * 1.5
      const scrollProgress = Math.min(window.scrollY / scrollRange, 1)
      const frameIndex = Math.floor(scrollProgress * (totalFrames - 1))
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        render()
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mode, isLoading, isUsingManual, totalFrames, render])

  // Carousel Mode Logic
  useEffect(() => {
    if (mode !== 'carousel' || isLoading) return
    const interval = setInterval(() => {
      const count = isUsingManual ? targetImages.length : 4 // 4 key frames for sequence
      setImageIndex((prev) => (prev + 1) % count)
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [mode, isLoading, isUsingManual, targetImages.length, autoPlayInterval])

  // Trigger Carousel Transition
  useEffect(() => {
    if (mode !== 'carousel' || isLoading || loadedImages.length === 0) return
    
    // For manual mode, index is simple. For frames sequence, we pick key frames.
    const keyFrames = [0, 80, 160, 239]
    const targetIdx = isUsingManual ? imageIndex : keyFrames[imageIndex % 4]
    
    if (targetIdx !== currentFrameRef.current) {
      nextFrameRef.current = targetIdx
      transitionProgressRef.current = 0
      render()
    }
  }, [imageIndex, mode, isLoading, isUsingManual, loadedImages, render])

  return (
    <div className={`relative w-full ${mode === 'scroll' && !isUsingManual ? 'min-h-[200vh]' : 'min-h-screen'}`}>
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0">
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: isLoading ? 0 : 1 }}
        />
        
        {/* Darkening Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-50">
            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-orange-400">
              {isUsingManual ? 'Loading Carousel' : 'Initializing Sequence'} {progress}%
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full mt-[-100vh]">
        {children}
      </div>
    </div>
  )
}
