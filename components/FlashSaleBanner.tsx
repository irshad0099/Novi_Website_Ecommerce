'use client'
import { useState, useEffect } from 'react'
import { toArabicNumerals } from '@/lib/format'
import { useT } from '@/hooks/useT'

const SALE_END = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { t, lang } = useT()

  const pad = (n: number) => lang === 'ar'
    ? toArabicNumerals(String(n).padStart(2, '0'))
    : String(n).padStart(2, '0')

  useEffect(() => {
    setMounted(true)
    const tick = () => {
      const diff = Math.max(0, SALE_END.getTime() - Date.now())
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!visible || !mounted) return null

  return (
    <div
      className="relative w-full text-white text-center py-2 md:py-2.5 px-8 md:px-4 flex items-center justify-center gap-2 md:gap-3 flex-wrap text-xs md:text-sm font-bold"
      style={{ background: 'linear-gradient(90deg, #0f2a4d, #1a3461, #0f2a4d)' }}
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg leading-none w-6 h-6 flex items-center justify-center"
      >×</button>

      <span className="text-white font-black">{t('flash', 'label')}</span>
      <span className="hidden sm:inline">{t('flash', 'text')} <span
        className="font-black tracking-widest px-1.5 py-0.5 rounded text-primary-900"
        style={{ background: 'white', fontFamily: 'monospace' }}
      >FIRST50</span></span>
      <span className="text-white sm:hidden font-black" style={{ fontFamily: 'monospace' }}>FIRST50</span>
      <span className="text-white/70 text-[10px] hidden sm:inline">{t('flash', 'endsIn')}</span>

      <div className="flex items-center gap-1 font-black">
        {[
          { v: timeLeft.h, l: t('flash','h') },
          { v: timeLeft.m, l: t('flash','m') },
          { v: timeLeft.s, l: t('flash','s') },
        ].map(({ v, l }, i) => (
          <span key={i} className="flex items-center gap-0.5">
            <span
              className="inline-flex items-center justify-center rounded text-xs md:text-sm text-primary-900 font-black"
              style={{ background: 'white', minWidth: 24, height: 20, padding: '0 3px' }}
            >{pad(v)}</span>
            <span className="text-white/70 text-[9px] md:text-[10px]">{l}</span>
            {i < 2 && <span className="text-white/60 text-sm leading-none mx-0.5">:</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
