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
  avatarColor: string
}

const SAMPLE_REVIEWS: Review[] = [
  { nameAr: 'أم خالد',       nameEn: 'Um Khaled',   rating: 5, dateAr: 'منذ ٣ أيام',   dateEn: '3 days ago',   textAr: 'جودة ممتازة! أنعم مناديل جربتها في حياتي. أطلبها للمنزل كل شهر بدون توقف.',         textEn: 'Excellent quality! Softest tissues I have ever tried. I order them every month.',        verified: true,  helpful: 24, avatarColor: '#1a3461' },
  { nameAr: 'محمد العتيبي',  nameEn: 'Mohammed',    rating: 5, dateAr: 'منذ أسبوع',    dateEn: '1 week ago',   textAr: 'التوصيل سريع جداً والمنتج بالضبط كما هو موصوف. سأعيد الطلب بالتأكيد.',              textEn: 'Very fast delivery and product exactly as described. Will definitely reorder.',          verified: true,  helpful: 18, avatarColor: '#153d6a' },
  { nameAr: 'سارة الدوسري',  nameEn: 'Sara',        rating: 4, dateAr: 'منذ أسبوعين', dateEn: '2 weeks ago',  textAr: 'نعومة رائعة ولطيفة جداً على البشرة الحساسة. أنصح بها بشدة لكل أم.',                   textEn: 'Wonderful softness, very gentle on sensitive skin. Highly recommended for every mom.',   verified: true,  helpful: 12, avatarColor: '#2669a0' },
  { nameAr: 'فيصل القحطاني', nameEn: 'Faisal',      rating: 5, dateAr: 'منذ شهر',     dateEn: '1 month ago',  textAr: 'أفضل مناديل في السوق السعودي بلا منافس. القيمة ممتازة جداً مقارنة بالسعر.',           textEn: 'Best tissues in Saudi market bar none. Excellent value for the price.',                  verified: false, helpful:  9, avatarColor: '#0f2a4d' },
  { nameAr: 'نورة الشمري',   nameEn: 'Noura',       rating: 4, dateAr: 'منذ شهر',     dateEn: '1 month ago',  textAr: 'مناديل جميلة وعملية. العبوة أنيقة وتناسب ديكور المنزل الراقي.',                        textEn: 'Beautiful and practical. The packaging is elegant and fits upscale home décor.',         verified: true,  helpful:  7, avatarColor: '#1a3461' },
]

const TAGS_AR = ['ناعم جداً', 'توصيل سريع', 'جودة عالية', 'يستحق السعر', 'للبشرة الحساسة', 'رائحة لطيفة']
const TAGS_EN = ['Very Soft', 'Fast Delivery', 'High Quality', 'Worth the Price', 'Sensitive Skin', 'Fresh Scent']

const AVATAR_LETTERS: Record<string, string> = {
  'أم خالد': 'أ', 'محمد العتيبي': 'م', 'سارة الدوسري': 'س',
  'فيصل القحطاني': 'ف', 'نورة الشمري': 'ن',
}

function Stars({ rating, size = 'sm', interactive = false, onRate }: {
  rating: number; size?: 'sm' | 'lg'; interactive?: boolean; onRate?: (r: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className={`flex gap-0.5 ${size === 'lg' ? 'text-2xl' : 'text-base'}`}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          style={{ color: i <= (interactive ? (hovered || rating) : rating) ? '#1a3461' : '#dde4f0', transition: 'color 0.15s', cursor: interactive ? 'pointer' : 'default' }}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(i)}
        >★</span>
      ))}
    </div>
  )
}

export default function ReviewsSection({ productRating, reviewCount }: { productRating: number; reviewCount: number }) {
  const [showAll, setShowAll]       = useState(false)
  const [helpful, setHelpful]       = useState<Record<number, boolean>>({})
  const [filterStar, setFilterStar] = useState(0)
  const [sort, setSort]             = useState<'helpful'|'recent'>('helpful')
  const [showForm, setShowForm]     = useState(false)
  const [formRating, setFormRating] = useState(0)
  const [formName, setFormName]     = useState('')
  const [formText, setFormText]     = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const { t, lang } = useT()

  const fmt = (n: number | string) => lang === 'ar' ? toArabicNumerals(n) : String(n)
  const tags = lang === 'ar' ? TAGS_AR : TAGS_EN

  const dist = [5,4,3,2,1].map(r => ({
    r, pct: r===5?68:r===4?20:r===3?7:r===2?3:2,
    count: r===5?34:r===4?10:r===3?4:r===2?2:1,
  }))

  let shown = filterStar > 0
    ? SAMPLE_REVIEWS.filter(r => r.rating === filterStar)
    : SAMPLE_REVIEWS

  if (sort === 'helpful') shown = [...shown].sort((a,b) => b.helpful - a.helpful)
  if (!showAll) shown = shown.slice(0,3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRating || !formName.trim() || !formText.trim()) return
    setSubmitted(true)
    setTimeout(() => { setShowForm(false); setSubmitted(false); setFormRating(0); setFormName(''); setFormText('') }, 2000)
  }

  return (
    <section className="mt-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-black text-primary-900" style={{ fontFamily: 'Amiri, serif' }}>
          {lang === 'ar' ? 'آراء العملاء' : 'Customer Reviews'}
        </h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="g-gold text-white font-black text-xs px-5 py-2.5 rounded-full shadow hover:shadow-md transition-shadow"
        >
          ✏️ {lang === 'ar' ? 'اكتب تقييمك' : 'Write a Review'}
        </button>
      </div>

      {/* Write review form */}
      {showForm && (
        <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-5 mb-6 animate-[fadeUp_0.3s_ease]">
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-black text-primary-800">{lang === 'ar' ? 'شكراً! تم إرسال تقييمك.' : 'Thank you! Review submitted.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-black text-primary-900 text-sm mb-3">{lang === 'ar' ? 'تقييمك يهمنا 🌟' : 'Your opinion matters 🌟'}</h3>
              {/* Star picker */}
              <div>
                <p className="text-xs text-primary-500 mb-1.5 font-semibold">{lang === 'ar' ? 'تقييمك' : 'Your Rating'}</p>
                <Stars rating={formRating} size="lg" interactive onRate={setFormRating} />
              </div>
              <div>
                <p className="text-xs text-primary-500 mb-1.5 font-semibold">{lang === 'ar' ? 'اسمك' : 'Your Name'}</p>
                <input
                  value={formName} onChange={e => setFormName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: أم خالد' : 'e.g. Sarah'}
                  className="w-full px-4 py-2.5 border border-primary-200 rounded-xl text-sm bg-white text-primary-900 focus:outline-none focus:border-primary-400"
                />
              </div>
              <div>
                <p className="text-xs text-primary-500 mb-1.5 font-semibold">{lang === 'ar' ? 'رأيك في المنتج' : 'Your Review'}</p>
                <textarea
                  value={formText} onChange={e => setFormText(e.target.value)}
                  placeholder={lang === 'ar' ? 'شاركنا تجربتك مع المنتج...' : 'Share your experience with this product...'}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-primary-200 rounded-xl text-sm bg-white text-primary-900 focus:outline-none focus:border-primary-400 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={!formRating || !formName.trim() || !formText.trim()}
                  className="flex-1 g-gold text-white font-black py-2.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  {lang === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-primary-200 rounded-xl text-sm text-primary-500 font-bold hover:bg-white">
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Rating summary */}
      <div className="bg-primary-50 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row gap-6 items-center">
        {/* Big number */}
        <div className="text-center flex-shrink-0">
          <div className="text-6xl font-black text-primary-900 leading-none">{fmt(productRating.toFixed(1))}</div>
          <Stars rating={Math.round(productRating)} size="lg" />
          <div className="text-xs text-primary-400 mt-2">{fmt(reviewCount)} {lang === 'ar' ? 'تقييم' : 'ratings'}</div>
        </div>

        {/* Bars */}
        <div className="flex-1 w-full space-y-2">
          {dist.map(({ r, pct, count }) => (
            <button
              key={r}
              onClick={() => setFilterStar(filterStar === r ? 0 : r)}
              className={`flex items-center gap-2 w-full group transition-opacity ${filterStar > 0 && filterStar !== r ? 'opacity-40' : 'opacity-100'}`}
            >
              <span className="text-xs text-primary-600 font-black w-3">{r}</span>
              <span className="text-primary-400 text-xs">★</span>
              <div className="flex-1 h-2.5 bg-primary-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-700"
                  style={{ width: `${filterStar === r ? pct : pct}%` }}
                />
              </div>
              <span className="text-xs text-primary-400 w-10 text-left">{fmt(count)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tags.map(tag => (
          <span key={tag} className="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full border border-primary-200">
            ✓ {tag}
          </span>
        ))}
      </div>

      {/* Filter + Sort bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        {/* Star filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterStar(0)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filterStar === 0 ? 'bg-primary-900 text-white' : 'bg-primary-100 text-primary-600 hover:bg-primary-200'}`}
          >
            {lang === 'ar' ? 'الكل' : 'All'}
          </button>
          {[5,4,3].map(s => (
            <button
              key={s}
              onClick={() => setFilterStar(filterStar === s ? 0 : s)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filterStar === s ? 'bg-primary-900 text-white' : 'bg-primary-100 text-primary-600 hover:bg-primary-200'}`}
            >
              {s} ★
            </button>
          ))}
        </div>
        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as 'helpful'|'recent')}
          className="text-xs font-bold text-primary-600 bg-primary-50 border border-primary-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary-400"
        >
          <option value="helpful">{lang === 'ar' ? 'الأكثر فائدة' : 'Most Helpful'}</option>
          <option value="recent">{lang === 'ar' ? 'الأحدث' : 'Most Recent'}</option>
        </select>
      </div>

      {/* Reviews list */}
      {shown.length === 0 ? (
        <div className="text-center py-10 text-primary-400">
          <div className="text-4xl mb-2">🔍</div>
          <p className="font-bold text-sm">{lang === 'ar' ? 'لا توجد تقييمات لهذا التصنيف' : 'No reviews for this filter'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((r, i) => {
            const name = lang === 'en' ? r.nameEn : r.nameAr
            const text = lang === 'en' ? r.textEn : r.textAr
            const date = lang === 'en' ? r.dateEn : r.dateAr
            const letter = AVATAR_LETTERS[r.nameAr] || r.nameAr[0]
            return (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Colored avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0 shadow"
                      style={{ background: r.avatarColor }}
                    >
                      {letter}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-primary-900">{name}</span>
                        {r.verified && (
                          <span className="text-[10px] text-emerald-700 font-black bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✅ {lang === 'ar' ? 'مشتري موثّق' : 'Verified'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Stars rating={r.rating} />
                        <span className="text-[10px] text-primary-400">{date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-primary-700 leading-relaxed mb-3">{text}</p>
                <button
                  onClick={() => setHelpful(h => ({ ...h, [i]: !h[i] }))}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${helpful[i] ? 'bg-primary-900 text-white border-primary-900' : 'border-primary-200 text-primary-400 hover:border-primary-400 hover:text-primary-600'}`}
                >
                  👍 {lang === 'ar' ? 'مفيد' : 'Helpful'} ({fmt(r.helpful + (helpful[i] ? 1 : 0))})
                </button>
              </div>
            )
          })}
        </div>
      )}

      {SAMPLE_REVIEWS.filter(r => filterStar === 0 || r.rating === filterStar).length > 3 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="mt-4 w-full py-3 border-2 border-primary-200 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors text-sm"
        >
          {showAll
            ? (lang === 'ar' ? '▲ عرض أقل' : '▲ Show Less')
            : `▼ ${lang === 'ar' ? 'عرض المزيد' : 'Show More'} (${fmt(SAMPLE_REVIEWS.filter(r => filterStar === 0 || r.rating === filterStar).length)})`
          }
        </button>
      )}
    </section>
  )
}
