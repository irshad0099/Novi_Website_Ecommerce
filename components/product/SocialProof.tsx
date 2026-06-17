'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/hooks/useT'
import { toArabicNumerals } from '@/lib/format'

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function SocialProof({ productId }: { productId: string | number }) {
  const { lang } = useT()
  const [viewers, setViewers] = useState(rand(12, 47))
  const [recentBuy, setRecentBuy] = useState(rand(3, 12))
  const [show, setShow] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(v => {
        const delta = rand(-3, 5)
        return Math.max(8, Math.min(80, v + delta))
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [productId])

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentBuy(rand(1, 8))
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  if (!show) return null

  const count = lang === 'ar' ? toArabicNumerals(viewers) : viewers.toString()
  const buyCount = lang === 'ar' ? toArabicNumerals(recentBuy) : recentBuy.toString()

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-primary-600 bg-primary-50 rounded-xl px-3 py-2 border border-primary-100">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="font-bold text-primary-800">
          {lang === 'ar'
            ? `${count} شخص يشاهد هذا المنتج الآن`
            : `${count} people viewing this now`}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
        <span>🛒</span>
        <span className="font-semibold">
          {lang === 'ar'
            ? `${buyCount} طلبوا هذا المنتج خلال آخر ساعة`
            : `${buyCount} ordered in the last hour`}
        </span>
      </div>
    </div>
  )
}
