'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent')
    if (!accepted) setTimeout(() => setVisible(true), 2000)
  }, [])

  const accept = () => { localStorage.setItem('cookie-consent', '1'); setVisible(false) }
  const decline = () => { localStorage.setItem('cookie-consent', '0'); setVisible(false) }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:max-w-sm z-50 animate-[fadeUp_0.4s_ease]">
      <div className="bg-primary-900 border border-primary-700 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">🍪</span>
          <div>
            <p className="text-white font-black text-sm">نستخدم ملفات الكوكيز</p>
            <p className="text-white/55 text-xs mt-1 leading-relaxed">
              لتحسين تجربتك وتخصيص المحتوى. يمكنك قبولها أو رفضها.{' '}
              <Link href="/about" className="text-primary-300 hover:underline">اعرف أكثر</Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={accept} className="flex-1 g-gold text-white font-black py-2 rounded-xl text-xs">
            قبول الكل ✓
          </button>
          <button onClick={decline} className="flex-1 bg-white/10 text-white/70 font-bold py-2 rounded-xl text-xs hover:bg-white/20 transition-colors">
            رفض
          </button>
        </div>
      </div>
    </div>
  )
}
