'use client'
import { useEffect, useState } from 'react'

export default function BrandSplash() {
  const [phase, setPhase] = useState<'hidden'|'in'|'hold'|'out'>('hidden')

  useEffect(() => {
    if (sessionStorage.getItem('novi-splash')) return
    sessionStorage.setItem('novi-splash', '1')
    setPhase('in')
    setTimeout(() => setPhase('hold'), 600)
    setTimeout(() => setPhase('out'),  1800)
    setTimeout(() => setPhase('hidden'), 2500)
  }, [])

  if (phase === 'hidden') return null

  const opacity = phase === 'in' ? 1 : phase === 'hold' ? 1 : 0

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#0d0a04',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        opacity, transition: phase === 'in' ? 'opacity 0.6s ease' : phase === 'out' ? 'opacity 0.7s ease' : 'none',
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      <img
        src="/logo-combined.png"
        alt="نَدى الحرير"
        style={{
          height: 80, maxWidth: 220, objectFit: 'contain', marginBottom: 14,
          transform: phase === 'in' ? 'scale(1)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />
      <p style={{
        color: '#82b0d5', fontSize: 13, fontFamily: 'Cairo,sans-serif',
        letterSpacing: 1, opacity: 0.7, textAlign: 'center',
      }}>
        نعومة تلمسها • وجودة تثق بها
      </p>
      {/* navy shimmer bar */}
      <div style={{
        marginTop: 24, width: 80, height: 2, borderRadius: 99,
        background: 'linear-gradient(90deg,#1a3461,#2669a0,#1a3461)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.2s ease-in-out infinite',
      }} />
    </div>
  )
}
