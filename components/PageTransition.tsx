'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  useEffect(() => {
    setShow(true)
    const t = setTimeout(() => setShow(false), 400)
    return () => clearTimeout(t)
  }, [pathname])
  if (!show) return null
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="absolute inset-0 bg-primary-900 animate-[pageOut_0.4s_ease_forwards]" />
    </div>
  )
}
