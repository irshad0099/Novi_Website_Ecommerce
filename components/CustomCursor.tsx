'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only on non-touch devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.body.classList.add('custom-cursor-on')

    let ringX = 0, ringY = 0
    let rafId: number

    const moveDot = (x: number, y: number) => {
      if (dotRef.current) {
        dotRef.current.style.left = x + 'px'
        dotRef.current.style.top  = y + 'px'
      }
    }

    const animateRing = () => {
      if (ringRef.current) {
        ringRef.current.style.left = ringX + 'px'
        ringRef.current.style.top  = ringY + 'px'
      }
      rafId = requestAnimationFrame(animateRing)
    }

    const onMove = (e: MouseEvent) => {
      moveDot(e.clientX, e.clientY)
      ringX += (e.clientX - ringX) * 0.12
      ringY += (e.clientY - ringY) * 0.12
    }

    const onEnter = () => {
      dotRef.current?.classList.add('cd-hover')
      ringRef.current?.classList.add('cd-hover')
    }
    const onLeave = () => {
      dotRef.current?.classList.remove('cd-hover')
      ringRef.current?.classList.remove('cd-hover')
    }
    const onDown = () => {
      dotRef.current?.classList.add('cd-click')
      ringRef.current?.classList.add('cd-click')
    }
    const onUp = () => {
      dotRef.current?.classList.remove('cd-click')
      ringRef.current?.classList.remove('cd-click')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    const interactables = () => document.querySelectorAll('a,button,[role="button"]')
    const attachHover = () => {
      interactables().forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attachHover()
    const observer = new MutationObserver(attachHover)
    observer.observe(document.body, { childList: true, subtree: true })

    rafId = requestAnimationFrame(animateRing)

    return () => {
      document.body.classList.remove('custom-cursor-on')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  )
}
