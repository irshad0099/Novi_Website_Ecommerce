'use client'
import { useState, useRef } from 'react'

export default function BeforeAfter({
  before,
  after,
  labelBefore = 'قبل',
  labelAfter = 'بعد',
}: {
  before: string
  after: string
  labelBefore?: string
  labelAfter?: string
}) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setPos(x)
  }

  return (
    <div
      ref={ref}
      className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-ew-resize select-none border border-primary-100"
      onMouseMove={move}
      onTouchMove={move}
    >
      <img src={before} alt={labelBefore} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={after} alt={labelAfter} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full g-gold border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-lg">
          ⟷
        </div>
      </div>
      {/* Labels */}
      <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">
        {labelBefore}
      </span>
      <span className="absolute bottom-3 left-3 bg-white/90 text-primary-900 text-xs font-bold px-2 py-1 rounded-full">
        {labelAfter}
      </span>
    </div>
  )
}
