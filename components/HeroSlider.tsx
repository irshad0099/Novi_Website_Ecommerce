'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1920&q=90',
    overlay: 'rgba(5,10,20,0.55)',
    bgText1: 'الأقوى',
    bgText2: 'الأجود',
    badge: '✨ العلامة الأولى للمناديل الفاخرة في المملكة',
    title: 'نعومة تلمسها',
    title2: 'وجودة تثق بها',
    sub: 'مناديل NOVI بـ٣ طبقات من الألياف الطبيعية النقية. ٦٠٠ منديل في كل علبة.',
    cta: '🛒 تسوق الآن',
    ctaHref: '/#products',
    cta2: '🎁 بكجات التوفير',
    cta2Href: '/category/bundles',
    stats: [['٦٠٠+','منديل/علبة'],['٣','طبقات ناعمة'],['+٥٠ألف','عميل سعيد']],
    accentColor: '#ffffff',
  },
  {
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=90',
    overlay: 'rgba(5,10,20,0.55)',
    bgText1: 'نعومة',
    bgText2: 'تلمسها',
    badge: '🌿 طبيعي ١٠٠٪ — بدون كيماويات',
    title: 'الطبيعة في',
    title2: 'كل منديل',
    sub: 'ألياف طبيعية نقية معتمدة رسمياً. آمنة للبشرة الحساسة لكل أفراد الأسرة.',
    cta: '🌿 اكتشف المنتجات',
    ctaHref: '/category/face-tissue',
    cta2: '🔬 اعرف أكثر',
    cta2Href: '/about',
    stats: [['١٢','مرحلة فحص'],['٠','كيماويات ضارة'],['٤.٩⭐','تقييم']],
    accentColor: '#82b0d5',
  },
  {
    img: 'https://images.unsplash.com/photo-1578895101003-571866c7d3c6?w=1920&q=90',
    overlay: 'rgba(5,10,20,0.55)',
    bgText1: 'جودة',
    bgText2: 'لا تُنافَس',
    badge: '✅ معتمدة SFDA — صُنع في المملكة',
    title: 'المملكة',
    title2: 'تستحق الأفضل',
    sub: 'معتمدة رسمياً من هيئة الغذاء والدواء السعودية. منتج وطني بأيدٍ سعودية منذ ٢٠١٩.',
    cta: '🏆 الأكثر مبيعاً',
    ctaHref: '/#products',
    cta2: '📖 قصتنا',
    cta2Href: '/about',
    stats: [['٢٠١٩','سنة التأسيس'],['SFDA','معتمدة'],['🇸🇦','صُنع بالسعودية']],
    accentColor: '#ffffff',
  },
  {
    img: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1920&q=90',
    overlay: 'rgba(5,10,20,0.55)',
    bgText1: 'شحن',
    bgText2: 'مجاني',
    badge: '🚚 شحن مجاني فوق ١٥٠ ريال لجميع مناطق المملكة',
    title: 'وصّلنا إلى',
    title2: 'كل بيت سعودي',
    sub: 'توصيل سريع ١–٣ أيام في الرياض. تابي وتمارا متاح. إرجاع مجاني ٧ أيام بدون أسئلة.',
    cta: '🎁 اطلب الآن',
    ctaHref: '/#products',
    cta2: '💬 تواصل معنا',
    cta2Href: '#',
    stats: [['١–٣','أيام توصيل'],['٧','أيام إرجاع'],['COD','الدفع عند الاستلام']],
    accentColor: '#82b0d5',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'next'|'prev'>('next')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const go = useCallback((idx: number, dir: 'next'|'prev' = 'next') => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 600)
  }, [animating])

  const next = useCallback(() => go((current + 1) % SLIDES.length, 'next'), [current, go])
  const prev = useCallback(() => go((current - 1 + SLIDES.length) % SLIDES.length, 'prev'), [current, go])

  // Auto-play
  useEffect(() => {
    timerRef.current = setTimeout(next, 5500)
    return () => clearTimeout(timerRef.current)
  }, [current, next])

  const slide = SLIDES[current]

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '92vh' }}>

      {/* ── Background image ── */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `url(${slide.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: animating ? (direction === 'next' ? 'scale(1.04) translateX(-2%)' : 'scale(1.04) translateX(2%)') : 'scale(1) translateX(0)',
          transition: 'transform 1s cubic-bezier(0.4,0,0.2,1)',
          filter: 'brightness(0.88)',
        }}
      />

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0" style={{ background: slide.overlay }} />


      {/* ── HUGE background Arabic text (billboard effect) ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <p style={{
          fontSize: 'clamp(90px, 18vw, 260px)',
          fontWeight: 900,
          fontFamily: 'Amiri, serif',
          color: 'white',
          opacity: 0.07,
          lineHeight: 0.85,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
          marginBottom: 0,
          textShadow: '0 0 80px rgba(255,255,255,0.3)',
        }}>
          {slide.bgText1}
        </p>
        <p style={{
          fontSize: 'clamp(70px, 14vw, 200px)',
          fontWeight: 900,
          fontFamily: 'Amiri, serif',
          color: 'white',
          opacity: 0.05,
          lineHeight: 0.85,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
        }}>
          {slide.bgText2}
        </p>
      </div>

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8"
        style={{
          minHeight: '92vh',
          opacity: animating ? 0 : 1,
          transform: animating ? (direction === 'next' ? 'translateY(20px)' : 'translateY(-20px)') : 'translateY(0)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold mb-5 md:mb-6">
          {slide.badge}
        </span>

        {/* Brand name */}
        <p className="text-[11px] md:text-xs font-black tracking-[0.3em] text-primary-300 mb-3 uppercase">
          NOVI
        </p>

        {/* Headline */}
        <h1
          className="font-black text-white leading-tight mb-4 drop-shadow-2xl"
          style={{
            fontFamily: 'Amiri, serif',
            fontSize: 'clamp(36px, 7vw, 90px)',
            textShadow: '0 4px 32px rgba(0,0,0,0.6)',
          }}
        >
          <span style={{ color: slide.accentColor }}>{slide.title}</span>
          <br />
          {slide.title2}
        </h1>

        {/* Sub */}
        <p className="text-white/75 text-sm md:text-lg mb-7 md:mb-8 max-w-xl leading-relaxed" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
          {slide.sub}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-5 md:gap-10 mb-8 flex-wrap justify-center">
          {slide.stats.map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="text-xl md:text-2xl font-black text-primary-300 drop-shadow">{n}</p>
              <p className="text-[10px] text-white/55 mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href={slide.ctaHref}
            className="g-gold text-white font-black px-7 md:px-9 py-3 md:py-3.5 rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all text-sm"
          >
            {slide.cta}
          </Link>
          <Link
            href={slide.cta2Href}
            className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-7 md:px-9 py-3 md:py-3.5 rounded-full hover:bg-white/25 transition-colors text-sm"
          >
            {slide.cta2}
          </Link>
        </div>
      </div>

      {/* ── Slide counter top-right ── */}
      <div className="absolute top-5 left-5 z-20 hidden sm:flex items-center gap-2">
        <span className="text-2xl font-black text-white/90" style={{ fontFamily: 'Amiri, serif' }}>
          {String(current + 1).padStart(2, '0')}
        </span>
        <div className="w-px h-6 bg-white/30" />
        <span className="text-sm text-white/40">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* ── Brand badge top-right ── */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 z-20 g-gold rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-white shadow-lg text-center hidden sm:block">
        <p className="text-[10px] font-bold leading-none">شحن مجاني</p>
        <p className="text-xs font-black">فوق ١٥٠ ريال</p>
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        onClick={prev}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
        aria-label="السابق"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
        aria-label="التالي"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > current ? 'next' : 'prev')}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? '#1a3461' : 'rgba(255,255,255,0.35)',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Progress bar at bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <div
          className="h-full g-gold"
          style={{
            width: `${((current + 1) / SLIDES.length) * 100}%`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* ── Bottom landmark label ── */}
      <p className="absolute bottom-14 md:bottom-12 left-1/2 -translate-x-1/2 text-white/30 text-[10px] tracking-widest whitespace-nowrap z-20">
        🏙️ المملكة العربية السعودية
      </p>
    </section>
  )
}
