'use client'
import { useEffect, useRef, useState } from 'react'
import { toArabicNumerals } from '@/lib/format'
import { useT } from '@/hooks/useT'

const STATS = [
  { value: 50000, suffix: '+', labelAr: 'عميل سعيد', labelEn: 'Happy Customers', icon: '👥' },
  { value: 92,    suffix: '+', labelAr: 'منتج في المتجر', labelEn: 'Products', icon: '📦' },
  { value: 20,    suffix: '+', labelAr: 'مدينة سعودية', labelEn: 'Saudi Cities', icon: '🗺️' },
  { value: 4.9,   suffix: '★', labelAr: 'متوسط التقييم', labelEn: 'Avg Rating', icon: '⭐', decimal: true },
]

function Counter({ target, suffix, decimal, started }: { target: number; suffix: string; decimal?: boolean; started: boolean }) {
  const [count, setCount] = useState(0)
  const { lang } = useT()

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + increment, target)
      setCount(current)
      if (current >= target) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, target])

  const display = decimal ? count.toFixed(1) : Math.floor(count).toLocaleString('en')
  const formatted = lang === 'ar' ? toArabicNumerals(display) : display

  return (
    <span className="text-3xl md:text-4xl font-black text-white">
      {formatted}{suffix}
    </span>
  )
}

export default function AnimatedCounters() {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const { lang } = useT()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-10 md:py-14 g-gold">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {STATS.map(s => (
            <div key={s.labelAr} className="space-y-1">
              <div className="text-3xl mb-1">{s.icon}</div>
              <Counter target={s.value} suffix={s.suffix} decimal={s.decimal} started={started} />
              <p className="text-white/70 text-xs md:text-sm font-semibold">
                {lang === 'ar' ? s.labelAr : s.labelEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
