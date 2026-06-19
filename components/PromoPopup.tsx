'use client'
import { useState, useEffect, useRef } from 'react'

export default function PromoPopup() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [progress, setProgress] = useState(100)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const DURATION = 9000 // 9 seconds

  const close = () => {
    setClosing(true)
    setTimeout(() => setVisible(false), 400)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    // Show after 1.5s delay on first visit
    const showTimer = setTimeout(() => {
      setVisible(true)
      setProgress(100)

      // Countdown progress bar
      const start = Date.now()
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start
        const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100)
        setProgress(remaining)
      }, 50)

      // Auto-close
      timerRef.current = setTimeout(() => {
        close()
      }, DURATION)
    }, 1500)

    return () => {
      clearTimeout(showTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{ direction: 'rtl' }}
    >
      {/* Backdrop blur — only behind popup */}
      <div
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={close}
        style={{
          opacity: closing ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Popup card */}
      <div
        className="relative pointer-events-auto mx-4"
        style={{
          animation: closing
            ? 'popupOut 0.4s cubic-bezier(0.4,0,1,1) forwards'
            : 'popupIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
          maxWidth: 420,
          width: '100%',
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute -inset-1 rounded-3xl opacity-60"
          style={{
            background: 'linear-gradient(135deg, #1a3461, #2669a0, #1a3461)',
            filter: 'blur(8px)',
            zIndex: -1,
          }}
        />

        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #040c18 0%, #081628 50%, #030c16 100%)',
            border: '1px solid rgba(26,52,97,0.4)',
          }}
        >
          {/* Top decorative strip */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, #1a3461, #2669a0, #1a3461)' }}
          />

          {/* Progress bar */}
          <div className="h-0.5 bg-white/10 w-full">
            <div
              className="h-full transition-none"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #1a3461, #2669a0)',
                transition: 'width 0.05s linear',
              }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all z-10"
            aria-label="إغلاق"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Body */}
          <div className="px-7 pt-6 pb-7">
            {/* Badge */}
            <div className="flex justify-center mb-4">
              <span
                className="text-[11px] font-black px-4 py-1.5 rounded-full tracking-wider uppercase"
                style={{
                  background: 'linear-gradient(135deg, #1a3461, #2669a0)',
                  color: '#ffffff',
                }}
              >
                ✨ عرض حصري لزوار الموقع
              </span>
            </div>

            {/* Emoji */}
            <div className="text-center text-5xl mb-3">🎁</div>

            {/* Headline */}
            <h2
              className="text-center text-2xl font-black mb-2 leading-snug"
              style={{ color: '#ffffff', fontFamily: 'Amiri, serif' }}
            >
              خصم ٥٠٪ على أول طلب!
            </h2>

            <p className="text-center text-white/60 text-sm mb-5 leading-relaxed">
              استمتع بأفضل مناديل NOVI الفاخرة<br />
              بنصف السعر — لفترة محدودة فقط 🧻
            </p>

            {/* Coupon box */}
            <div
              className="flex items-center justify-between rounded-2xl px-5 py-3.5 mb-5"
              style={{
                background: 'rgba(26,52,97,0.12)',
                border: '1.5px dashed rgba(26,52,97,0.5)',
              }}
            >
              <span className="text-white/50 text-xs">كود الخصم</span>
              <span
                className="text-xl font-black tracking-widest"
                style={{ color: '#82b0d5', fontFamily: 'monospace' }}
              >
                FIRST50
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('FIRST50')
                  const el = document.getElementById('copied-msg')
                  if (el) { el.style.opacity = '1'; setTimeout(() => { el.style.opacity = '0' }, 1500) }
                }}
                className="text-[11px] font-bold px-3 py-1 rounded-lg transition-all"
                style={{ background: 'rgba(26,52,97,0.2)', color: '#82b0d5' }}
              >
                نسخ
              </button>
            </div>

            {/* Copied msg */}
            <p
              id="copied-msg"
              className="text-center text-xs mb-3 transition-opacity"
              style={{ color: '#82b0d5', opacity: 0 }}
            >
              ✅ تم نسخ الكود!
            </p>

            {/* CTA */}
            <a
              href="/products"
              onClick={close}
              className="block w-full text-center py-4 rounded-2xl font-black text-[15px] transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #1a3461 0%, #2669a0 50%, #1a3461 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 30px rgba(26,52,97,0.35)',
              }}
            >
              🛒 تسوق الآن واستخدم الكود
            </a>

            {/* Note */}
            <p className="text-center text-white/30 text-[10px] mt-3">
              ⏱️ العرض ينتهي قريباً — لا تفوّت الفرصة
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popupIn {
          0%   { opacity:0; transform: scale(0.85) translateY(30px); }
          100% { opacity:1; transform: scale(1)    translateY(0); }
        }
        @keyframes popupOut {
          0%   { opacity:1; transform: scale(1)    translateY(0); }
          100% { opacity:0; transform: scale(0.85) translateY(20px); }
        }
      `}</style>
    </div>
  )
}
