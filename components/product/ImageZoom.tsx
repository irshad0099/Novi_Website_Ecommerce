'use client'
import { useState, useEffect } from 'react'

export default function ImageZoom({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    if (lightbox) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') setActive(a => (a + 1) % images.length)
      if (e.key === 'ArrowRight') setActive(a => (a - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, images.length])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoom) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-primary-50 cursor-zoom-in group"
        onClick={() => setLightbox(true)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <img
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-200"
          style={zoom ? {
            transform: 'scale(2)',
            transformOrigin: `${pos.x}% ${pos.y}%`,
          } : {}}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/40 rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === active ? 'border-primary-500 scale-105' : 'border-primary-100 hover:border-primary-300'
              }`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          {/* Close */}
          <button className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Counter */}
          <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {active + 1} / {images.length}
          </span>

          {/* Prev/Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setActive(a => (a - 1 + images.length) % images.length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 rounded-full p-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); setActive(a => (a + 1) % images.length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 rounded-full p-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            </>
          )}

          <img
            src={images[active]}
            alt={name}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
