'use client'
import { useState } from 'react'
import { useT } from '@/hooks/useT'

const CITIES: { name: string; nameEn: string; days: number }[] = [
  { name: 'الرياض',           nameEn: 'Riyadh',       days: 1 },
  { name: 'جدة',              nameEn: 'Jeddah',       days: 1 },
  { name: 'الدمام',           nameEn: 'Dammam',       days: 2 },
  { name: 'الخبر',            nameEn: 'Khobar',       days: 2 },
  { name: 'مكة المكرمة',     nameEn: 'Makkah',       days: 2 },
  { name: 'المدينة المنورة', nameEn: 'Madinah',      days: 2 },
  { name: 'الطائف',           nameEn: 'Taif',         days: 2 },
  { name: 'أبها',             nameEn: 'Abha',         days: 3 },
  { name: 'تبوك',             nameEn: 'Tabuk',        days: 3 },
  { name: 'جازان',            nameEn: 'Jazan',        days: 3 },
  { name: 'نجران',            nameEn: 'Najran',       days: 3 },
  { name: 'حائل',             nameEn: 'Hail',         days: 3 },
]

export default function DeliveryEstimator() {
  const { lang } = useT()
  const [city, setCity] = useState('')

  const selected = CITIES.find(c => c.name === city)

  const today = new Date()
  const deliveryDate = selected ? new Date(today.getTime() + selected.days * 24 * 3600 * 1000) : null

  const formatDate = (d: Date) => {
    if (lang === 'ar') {
      return d.toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' })
    }
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  return (
    <div className="border border-primary-100 rounded-2xl p-4 bg-primary-50/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🚚</span>
        <span className="font-black text-primary-800 text-sm">
          {lang === 'ar' ? 'تقدير موعد التوصيل' : 'Delivery Estimator'}
        </span>
      </div>
      <select
        value={city}
        onChange={e => setCity(e.target.value)}
        className="w-full border-2 border-primary-200 rounded-xl px-3 py-2.5 text-sm bg-white text-primary-800 focus:outline-none focus:border-primary-400 font-semibold"
      >
        <option value="">{lang === 'ar' ? '— اختر مدينتك —' : '— Select your city —'}</option>
        {CITIES.map(c => (
          <option key={c.name} value={c.name}>
            {lang === 'ar' ? c.name : c.nameEn}
          </option>
        ))}
      </select>
      {selected && deliveryDate && (
        <div className="mt-3 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
          <span className="text-emerald-500 mt-0.5">✅</span>
          <div>
            <p className="text-xs text-emerald-700 font-bold">
              {lang === 'ar'
                ? `يصلك في ${selected.days === 1 ? 'غد' : `${selected.days} أيام`}`
                : `Arrives in ${selected.days === 1 ? '1 day' : `${selected.days} days`}`}
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">{formatDate(deliveryDate)}</p>
            {selected.days <= 1 && (
              <p className="text-[10px] text-emerald-500 mt-1">
                {lang === 'ar' ? '⚡ توصيل سريع' : '⚡ Express delivery'}
              </p>
            )}
          </div>
        </div>
      )}
      <p className="text-[10px] text-primary-400 mt-2">
        {lang === 'ar'
          ? 'للطلبات قبل ٢م في أيام العمل'
          : 'For orders placed before 2pm on business days'}
      </p>
    </div>
  )
}
