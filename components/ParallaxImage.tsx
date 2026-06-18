'use client'
import { useEffect, useRef } from 'react'

export default function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.08)`
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
      style={{ transform: 'translateY(0) scale(1.08)' }}
    />
  )
}
