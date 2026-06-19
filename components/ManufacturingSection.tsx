'use client'
import Link from 'next/link'
import { useT } from '@/hooks/useT'

export default function ManufacturingSection() {
  const { lang } = useT()

  return (
    <section className="bg-white">
      {/* Big number image block */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1', maxHeight: 480 }}>
        {/* Background texture */}
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=90"
          alt="texture"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.72) saturate(0.6)' }}
        />
        {/* Big Arabic numeral overlay — same as the "1" in the reference */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="select-none pointer-events-none font-black text-white"
            style={{
              fontSize: 'clamp(220px, 55vw, 420px)',
              lineHeight: 1,
              opacity: 0.18,
              fontFamily: 'Amiri, serif',
              letterSpacing: '-0.05em',
              textShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          >
            ١
          </span>
        </div>
        {/* Foreground styled "1" matching the gold look */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="select-none pointer-events-none font-black"
            style={{
              fontSize: 'clamp(180px, 45vw, 360px)',
              lineHeight: 1,
              fontFamily: 'Amiri, serif',
              letterSpacing: '-0.05em',
              background: 'linear-gradient(160deg, #c8a84b 0%, #e8d48b 40%, #a07830 70%, #c8a84b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))',
            }}
          >
            ١
          </span>
        </div>
      </div>

      {/* Text content — same bold layout as reference */}
      <div className="px-5 pt-8 pb-10 max-w-screen-sm mx-auto">
        <h2
          className="font-black text-primary-900 leading-tight mb-5"
          style={{
            fontSize: 'clamp(28px, 7vw, 44px)',
            fontFamily: 'Amiri, serif',
            letterSpacing: '-0.01em',
          }}
        >
          {lang === 'ar'
            ? 'الشركة الأولى لتصنيع المناديل الفاخرة في المملكة'
            : 'Saudi\'s #1 Luxury Tissue Manufacturer'}
        </h2>

        <p className="text-primary-600 leading-relaxed mb-8" style={{ fontSize: 'clamp(15px, 4vw, 17px)' }}>
          {lang === 'ar'
            ? 'نؤمن في NOVI بأن رضا العميل والجودة العالية هما الهدف الأسمى الذي نسعى إليه دائماً. إن إيماننا بإرضاء عملائنا وسعينا الدائم نحو تحقيق أعلى مستويات الجودة هما الركيزتان الأساسيتان التي بُني عليهما هذا الكيان. إن وصولنا إلى مكانة الشركة الرائدة في صناعة المناديل لم يكن مجرد مصادفة، بل كان نتيجة طبيعية لثقة عملائنا في المملكة العربية السعودية.'
            : 'We believe at NOVI that customer satisfaction and high-quality products are the top goals we will always strive for. Our constant quest towards achieving the highest levels of quality are the most profound pillars on which NOVI is built. Becoming the leading manufacturer in the tissue industry was not a coincidence, but the result of trust our customers across Saudi Arabia have in us.'}
        </p>

        <Link
          href="/about"
          className="inline-flex items-center gap-3 group"
        >
          <span
            className="font-black tracking-widest text-primary-900 uppercase border-b-2 border-primary-900 pb-0.5 group-hover:text-primary-500 group-hover:border-primary-500 transition-colors"
            style={{ fontSize: 'clamp(12px, 3.5vw, 15px)', letterSpacing: '0.15em' }}
          >
            {lang === 'ar' ? 'اقرأ المزيد' : 'READ MORE'}
          </span>
          <svg className="w-4 h-4 text-primary-900 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Bottom divider */}
      <div className="h-px bg-primary-100 mx-5" />
    </section>
  )
}
