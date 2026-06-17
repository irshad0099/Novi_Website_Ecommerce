'use client'
import { useState } from 'react'
import { useT } from '@/hooks/useT'

export default function GiftWrap({ onToggle }: { onToggle?: (enabled: boolean, msg: string) => void }) {
  const { lang } = useT()
  const [enabled, setEnabled] = useState(false)
  const [msg, setMsg] = useState('')

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    onToggle?.(next, msg)
  }

  return (
    <div className={`border-2 rounded-2xl p-4 transition-all duration-300 ${enabled ? 'border-amber-300 bg-amber-50' : 'border-primary-100 bg-white hover:border-primary-200'}`}>
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={toggle}
          className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${enabled ? 'bg-amber-400' : 'bg-primary-200'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${enabled ? 'right-0.5' : 'left-0.5'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <span className="font-black text-primary-800 text-sm">
              {lang === 'ar' ? 'تغليف هدية فاخر' : 'Luxury Gift Wrap'}
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              +{lang === 'ar' ? '٥ ر.س' : '5 SAR'}
            </span>
          </div>
          <p className="text-xs text-primary-500 mt-0.5">
            {lang === 'ar'
              ? 'صندوق فاخر مع ورق لف وشريط ساتان وبطاقة تهنئة'
              : 'Premium box with wrapping paper, satin ribbon & greeting card'}
          </p>
        </div>
      </label>

      {enabled && (
        <div className="mt-3 animate-[fadeUp_0.3s_ease]">
          <textarea
            value={msg}
            onChange={e => { setMsg(e.target.value); onToggle?.(true, e.target.value) }}
            placeholder={lang === 'ar' ? 'رسالة تهنئة (اختياري)...' : 'Greeting message (optional)...'}
            rows={2}
            className="w-full border border-amber-200 rounded-xl px-3 py-2 text-xs bg-white text-primary-800 focus:outline-none focus:border-amber-400 resize-none"
          />
        </div>
      )}
    </div>
  )
}
