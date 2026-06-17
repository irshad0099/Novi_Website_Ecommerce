'use client'
import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, className = '', type = 'reveal' }: {
  children: React.ReactNode
  className?: string
  type?: 'reveal' | 'reveal-left' | 'reveal-scale'
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${type} ${className}`}>
      {children}
    </div>
  )
}
