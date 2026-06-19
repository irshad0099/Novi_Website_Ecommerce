'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center text-center px-6" dir="rtl"
      style={{ background: 'linear-gradient(135deg, #030c16 0%, #0c1a2e 50%, #081628 100%)' }}>

      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-5"
            style={{
              width: `${200 + i * 120}px`, height: `${200 + i * 120}px`,
              border: '1px solid #2669a0',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `pulse-gold ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="text-8xl mb-6 anim-float">⚠️</div>
        <p className="text-primary-400 text-sm font-black tracking-[0.2em] uppercase mb-3">خطأ في النظام</p>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Amiri, serif' }}>
          حدث خطأ غير متوقع
        </h1>
        <p className="text-primary-400 text-base mb-8 max-w-md mx-auto leading-relaxed">
          نعتذر عن هذا الخطأ. فريقنا يعمل على إصلاحه. يمكنك المحاولة مجدداً أو العودة للرئيسية.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="g-gold text-white font-black px-8 py-3.5 rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-lg"
          >
            🔄 حاول مجدداً
          </button>
          <Link
            href="/"
            className="bg-white/10 border border-white/20 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-colors"
          >
            🏠 الرئيسية
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <p className="mt-8 text-red-400/60 text-xs font-mono bg-black/30 px-4 py-2 rounded-lg max-w-lg mx-auto text-right">
            {error.message}
          </p>
        )}
      </div>
    </div>
  )
}
