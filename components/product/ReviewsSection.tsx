'use client'
import { useState } from 'react'
import { toArabicNumerals } from '@/lib/format'
import { useT } from '@/hooks/useT'

interface Review {
  nameAr: string
  nameEn: string
  rating: number
  dateAr: string
  dateEn: string
  textAr: string
  textEn: string
  verified: boolean
  helpful: number
}

const SAMPLE_REVIEWS: Review[] = [
  { nameAr: 'أم خالد',         nameEn: 'Um Khaled',      rating: 5, dateAr: 'منذ ٣ أيام',    dateEn: '3 days ago',   textAr: 'جودة ممتازة! أنعم مناديل جربتها. أطلبها للمنزل كل شهر.',                          textEn: 'Excellent quality! The softest tissues I have tried. I order them for the house every month.', verified: true,  helpful: 24 },
  { nameAr: 'محمد العتيبي',    nameEn: 'Mohammed',       rating: 5, dateAr: 'منذ أسبوع',      dateEn: '1 week ago',   textAr: 'التوصيل سريع والمنتج بالضبط كما هو موصوف. سأعيد الطلب.',                            textEn: 'Fast delivery and the product is exactly as described. Will reorder.',              verified: true,  helpful: 18 },
  { nameAr: 'سارة الدوسري',    nameEn: 'Sara',           rating: 4, dateAr: 'منذ أسبوعين',    dateEn: '2 weeks ago',  textAr: 'نعومة رائعة ولطيفة على البشرة الحساسة. أنصح بها بشدة.',                              textEn: 'Wonderful softness, gentle on sensitive skin. Highly recommended.',                  verified: true,  helpful: 12 },
  { nameAr: 'فيصل القحطاني',   nameEn: 'Faisal',         rating: 5, dateAr: 'منذ شهر',        dateEn: '1 month ago',  textAr: 'أفضل مناديل في السوق السعودي. القيمة ممتازة مقارنة بالسعر.',                          textEn: 'Best tissues in the Saudi market. Excellent value for money.',                      verified: false, helpful:  9 },
  { nameAr: 'نورة الشمري',     nameEn: 'Noura',          rating: 4, dateAr: 'منذ شهر',        dateEn: '1 month ago',  textAr: 'مناديل جميلة وعملية. العبوة أنيقة وتناسب ديكور المنزل.',                              textEn: 'Beautiful and practical tissues. The packaging is elegant and fits home décor.',     verified: true,  helpful:  7 },
]

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  return (
    <div className={`flex gap-0.5 ${size === 'lg' ? 'text-2xl' : 'text-sm'}`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#1a3461' : '#e5e7eb' }}>★</span>
      ))}
    </div>
  )
}

export default function ReviewsSection({ productRating, reviewCount }: { productRating: number; reviewCount: number }) {
  const [showAll, setShowAll] = useState(false)
  const [helpful, setHelpful] = useState<Record<number, boolean>>({})
  const { t, lang } = useT()
  const shown = showAll ? SAMPLE_REVIEWS : SAMPLE_REVIEWS.slice(0, 3)

  const dist = [5,4,3,2,1].map(r => ({
    r,
    pct: r === 5 ? 68 : r === 4 ? 20 : r === 3 ? 7 : r === 2 ? 3 : 2
  }))

  const fmt = (n: number | string) => lang === 'ar' ? toArabicNumerals(n) : String(n)

  return (
    <section className="mt-10">
      <h2 className="text-xl font-black text-primary-900 mb-6" style={{ fontFamily: 'Amiri, serif' }}>
        {t('reviews','title')}
      </h2>

      <div className="bg-primary-50 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="text-center flex-shrink-0">
          <div className="text-5xl font-black text-primary-900">{fmt(productRating.toFixed(1))}</div>
          <Stars rating={Math.round(productRating)} size="lg" />
          <div className="text-xs text-primary-400 mt-1">{fmt(reviewCount)} {t('reviews','ratings')}</div>
        </div>
        <div className="flex-1 w-full space-y-1.5">
          {dist.map(({ r, pct }) => (
            <div key={r} className="flex items-center gap-2">
              <span className="text-xs text-primary-500 w-3">{r}</span>
              <span className="text-primary-400 text-xs">★</span>
              <div className="flex-1 h-2 bg-primary-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-400 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-primary-400 w-8">{fmt(pct)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {shown.map((r, i) => {
          const name = lang === 'en' ? r.nameEn : r.nameAr
          const text = lang === 'en' ? r.textEn : r.textAr
          const date = lang === 'en' ? r.dateEn : r.dateAr
          return (
            <div key={i} className="bg-white border border-primary-100 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-black text-primary-600 text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-primary-900">{name}</span>
                      {r.verified && (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full">{t('reviews','verified')}</span>
                      )}
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                </div>
                <span className="text-[11px] text-primary-400">{date}</span>
              </div>
              <p className="text-sm text-primary-700 leading-relaxed mb-3">{text}</p>
              <button
                onClick={() => setHelpful(h => ({ ...h, [i]: !h[i] }))}
                className={`text-[11px] font-bold transition-colors ${helpful[i] ? 'text-primary-600' : 'text-primary-300 hover:text-primary-500'}`}
              >
                {helpful[i] ? t('reviews','helpfulYes') : t('reviews','helpful')} ({fmt(r.helpful + (helpful[i] ? 1 : 0))})
              </button>
            </div>
          )
        })}
      </div>

      {SAMPLE_REVIEWS.length > 3 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="mt-4 w-full py-3 border-2 border-primary-200 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors text-sm"
        >
          {showAll ? t('reviews','showLess') : `${t('reviews','showAll')} (${fmt(SAMPLE_REVIEWS.length)}) ▼`}
        </button>
      )}
    </section>
  )
}
