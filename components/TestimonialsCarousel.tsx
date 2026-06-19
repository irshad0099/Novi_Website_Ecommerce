'use client'
import { useState, useEffect, useCallback } from 'react'
import { useT } from '@/hooks/useT'

const TESTIMONIALS = [
  {
    nameAr: 'أم خالد الرشيدي', nameEn: 'Um Khaled',
    cityAr: 'الرياض', cityEn: 'Riyadh',
    textAr: 'استخدم مناديل NOVI منذ سنتين ولم أغير. ناعمة جداً وطويلة الأمد. الجودة لا تُنافَس في السوق السعودي.',
    textEn: 'I have been using NOVI tissues for two years and never switched. Very soft and long-lasting. Unmatched quality.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80',
    since: '٢٠٢٢',
  },
  {
    nameAr: 'محمد القحطاني', nameEn: 'Mohammed Al-Qahtani',
    cityAr: 'جدة', cityEn: 'Jeddah',
    textAr: 'طلبت بكج التوفير وكانت أفضل صفقة عملتها. التوصيل في يوم واحد والجودة فوق التوقعات تماماً.',
    textEn: 'Ordered the bundle and it was the best deal I made. Delivery in one day and quality exceeded expectations.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    since: '٢٠٢٣',
  },
  {
    nameAr: 'سارة العتيبي', nameEn: 'Sara Al-Otaibi',
    cityAr: 'الدمام', cityEn: 'Dammam',
    textAr: 'طفلتي عندها بشرة حساسة جداً وهذه المناديل لطيفة تماماً معها. لن أستبدلها بأي ماركة أخرى أبداً.',
    textEn: 'My daughter has very sensitive skin and these tissues are perfect for her. I will never switch to any other brand.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
    since: '٢٠٢٣',
  },
  {
    nameAr: 'فهد الزهراني', nameEn: 'Fahad Al-Zahrani',
    cityAr: 'مكة المكرمة', cityEn: 'Makkah',
    textAr: 'أطلب للمنزل والمكتب دائماً من NOVI. الكمية كبيرة والسعر ممتاز. خدمة العملاء ممتازة أيضاً.',
    textEn: 'Always order for home and office from NOVI. Great quantity and price. Excellent customer service too.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80',
    since: '٢٠٢١',
  },
  {
    nameAr: 'نورة الشمري', nameEn: 'Noura Al-Shammari',
    cityAr: 'الرياض', cityEn: 'Riyadh',
    textAr: 'من أجمل ما في NOVI أن التغليف أنيق جداً ويناسب ديكور المنزل الحديث. وطبعاً الجودة في المقام الأول.',
    textEn: 'What I love about NOVI is the elegant packaging that suits modern home decor. And of course quality comes first.',
    rating: 4,
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fd?w=120&q=80',
    since: '٢٠٢٤',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#1a3461' : '#dde4f0' }}>★</span>
      ))}
    </span>
  )
}

export default function TestimonialsCarousel() {
  const [cur, setCur] = useState(0)
  const [animating, setAnimating] = useState(false)
  const { lang } = useT()

  const go = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => { setCur(idx); setAnimating(false) }, 350)
  }, [animating])

  useEffect(() => {
    const t = setTimeout(() => go((cur + 1) % TESTIMONIALS.length), 5000)
    return () => clearTimeout(t)
  }, [cur, go])

  const t = TESTIMONIALS[cur]
  const name = lang === 'ar' ? t.nameAr : t.nameEn
  const city = lang === 'ar' ? t.cityAr : t.cityEn
  const text = lang === 'ar' ? t.textAr : t.textEn

  return (
    <section className="py-12 md:py-16 bg-primary-50 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-primary-900" style={{ fontFamily: 'Amiri, serif' }}>
            {lang === 'ar' ? 'عملاؤنا يتحدثون' : 'Our Customers Speak'}
            <span className="text-primary-400">.</span>
          </h2>
          <p className="text-primary-400 text-sm mt-2">
            {lang === 'ar' ? 'أكثر من ٥٠,٠٠٠ عائلة سعودية تثق بنا' : 'Over 50,000 Saudi families trust us'}
          </p>
        </div>

        {/* Main card */}
        <div
          className="max-w-2xl mx-auto bg-white rounded-3xl p-7 md:p-10 shadow-lg border border-primary-100 relative"
          style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(10px)' : 'translateY(0)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}
        >
          {/* Big quote */}
          <div className="absolute top-5 right-7 text-7xl text-primary-100 font-black leading-none select-none">"</div>

          <div className="flex items-center gap-4 mb-5 relative z-10">
            <img src={t.img} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-primary-200 shadow flex-shrink-0" />
            <div>
              <p className="font-black text-primary-900 text-base">{name}</p>
              <p className="text-primary-400 text-xs mt-0.5">📍 {city} · {lang === 'ar' ? `عميل منذ ${t.since}` : `Customer since ${t.since}`}</p>
              <Stars n={t.rating} />
            </div>
            <span className="mr-auto text-[10px] font-black text-primary-400 bg-primary-50 border border-primary-200 px-2 py-1 rounded-full">
              {lang === 'ar' ? 'مشتري موثّق ✅' : 'Verified ✅'}
            </span>
          </div>

          <p className="text-primary-700 text-base md:text-lg leading-relaxed relative z-10">
            {text}
          </p>
        </div>

        {/* Dots + nav */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => go((cur - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full bg-white border border-primary-200 text-primary-600 flex items-center justify-center hover:bg-primary-900 hover:text-white transition-all text-sm">‹</button>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 ${i === cur ? 'w-6 h-3 bg-primary-700' : 'w-3 h-3 bg-primary-200 hover:bg-primary-400'}`} />
          ))}
          <button onClick={() => go((cur + 1) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full bg-white border border-primary-200 text-primary-600 flex items-center justify-center hover:bg-primary-900 hover:text-white transition-all text-sm">›</button>
        </div>

        {/* Avatars strip */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {TESTIMONIALS.map((tm, i) => (
            <button key={i} onClick={() => go(i)}
              className={`rounded-full border-2 transition-all duration-300 overflow-hidden ${i === cur ? 'border-primary-600 scale-110' : 'border-transparent opacity-50 hover:opacity-80'}`}
              style={{ width: 36, height: 36 }}>
              <img src={tm.img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
