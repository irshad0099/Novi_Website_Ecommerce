'use client'
import { useT } from '@/hooks/useT'
import { toArabicNumerals } from '@/lib/format'

export default function LoyaltyPoints({ price }: { price: number }) {
  const { lang } = useT()
  const points = Math.floor(price * 2)
  const displayPoints = lang === 'ar' ? toArabicNumerals(points) : points.toString()

  return (
    <div className="flex items-center gap-2 bg-gradient-to-l from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-3 py-2.5">
      <span className="text-lg anim-float">✨</span>
      <div className="flex-1">
        <p className="text-xs font-black text-amber-700">
          {lang === 'ar'
            ? `ستكسب ${displayPoints} نقطة مكافأة`
            : `Earn ${displayPoints} reward points`}
        </p>
        <p className="text-[10px] text-amber-600 mt-0.5">
          {lang === 'ar'
            ? 'تُستبدل بخصومات على طلباتك القادمة'
            : 'Redeemable on future orders'}
        </p>
      </div>
      <div className="text-center flex-shrink-0">
        <div className="text-lg font-black text-amber-500">{displayPoints}</div>
        <div className="text-[9px] text-amber-500">{lang === 'ar' ? 'نقطة' : 'pts'}</div>
      </div>
    </div>
  )
}
