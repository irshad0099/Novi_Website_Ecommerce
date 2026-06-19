'use client'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/products'
import { useT } from '@/hooks/useT'

export default function Footer() {
  const { t, tArr, lang } = useT()
  const supportLinks = tArr('footer', 'supportLinks')

  return (
    <footer className="bg-primary-900 text-white/60">

      {/* ── Brand identity strip ── */}
      <div className="border-b border-white/8 py-10 px-4">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <img src="/logo-combined.png" alt="NOVI" className="h-16 w-auto object-contain flex-shrink-0" />
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-xl font-black text-white mb-1" style={{fontFamily:'Amiri,serif'}}>
              NOVI — العلامة الأولى للمناديل الفاخرة في المملكة
            </h2>
            <p className="text-white/45 text-sm leading-relaxed">
              نعومة تلمسها، وجودة تثق بها. منذ ٢٠١٩ نخدم أكثر من ٥٠,٠٠٠ أسرة سعودية بأجود المناديل الطبيعية ١٠٠٪.
            </p>
          </div>
          {/* Certifications */}
          <div className="flex gap-3 flex-shrink-0">
            {[['✅','SFDA'],['🇸🇦','صُنع في السعودية'],['♻️','بيئي']].map(([icon, label]) => (
              <div key={label as string} className="text-center bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                <span className="text-lg block">{icon}</span>
                <span className="text-[9px] text-white/40 font-bold whitespace-nowrap">{label as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Brand stats ── */}
      <div className="border-b border-white/8 py-5 px-4">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[['+٥٠ ألف','عميل سعيد'],['٤.٩ ⭐','متوسط التقييم'],['٩٢+','منتج متاح'],['٢٠+','مدينة سعودية']].map(([n, l]) => (
            <div key={l}>
              <p className="text-xl font-black text-primary-300">{n}</p>
              <p className="text-[10px] text-white/35 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main links grid ── */}
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-white/8">

        {/* Brand column */}
        <div>
          <h4 className="text-sm font-black text-white mb-3">NOVI</h4>
          <ul className="space-y-2 text-sm text-white/55">
            <li><Link href="/about" className="hover:text-primary-300 transition-colors">من نحن</Link></li>
            <li><a href="#" className="hover:text-primary-300 transition-colors">رؤيتنا ورسالتنا</a></li>
            <li><a href="#" className="hover:text-primary-300 transition-colors">اعتماداتنا</a></li>
            <li><a href="#" className="hover:text-primary-300 transition-colors">وظائف لدينا</a></li>
            <li><Link href="/contact" className="hover:text-primary-300 transition-colors">تواصل معنا</Link></li>
            <li><Link href="/blog" className="hover:text-primary-300 transition-colors">المدونة</Link></li>
            <li><Link href="/bulk-order" className="hover:text-primary-300 transition-colors">طلبات الجملة</Link></li>
          </ul>
          <div className="flex gap-2 mt-4">
            {['📸','🐦','💬','👻','🎵'].map((i, n) => (
              <a key={n} href="#" className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors">{i}</a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-black text-white mb-3">{t('footer', 'categories')}</h4>
          <ul className="space-y-2">
            {CATEGORIES.map(c => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="text-sm text-white/55 hover:text-primary-300 transition-colors">
                  {c.icon} {lang === 'en' ? ((c as any).nameEn ?? c.name) : c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-black text-white mb-3">{t('footer', 'support')}</h4>
          <ul className="space-y-2">
            {supportLinks.map((lbl, i) => (
              <li key={i}><a href="#" className="text-sm text-white/55 hover:text-primary-300 transition-colors">{lbl}</a></li>
            ))}
            <li><Link href="/order-tracking" className="hover:text-primary-300 transition-colors text-sm text-white/55">تتبع الطلب</Link></li>
            <li><Link href="/shipping" className="hover:text-primary-300 transition-colors text-sm text-white/55">الشحن والإرجاع</Link></li>
            <li><Link href="/privacy" className="hover:text-primary-300 transition-colors text-sm text-white/55">سياسة الخصوصية</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-black text-white mb-3">{t('footer', 'contact')}</h4>
          <ul className="space-y-2 text-sm text-white/55">
            <li><a href="tel:+966XXXXXXXXX" className="hover:text-primary-300 transition-colors">{t('footer', 'phone')}</a></li>
            <li><a href="mailto:info@nadaalhareer.sa" className="hover:text-primary-300 transition-colors">{t('footer', 'email')}</a></li>
            <li>{t('footer', 'address')}</li>
            <li className="pt-1">{t('footer', 'hours')}</li>
            <li>{t('footer', 'whatsapp')}</li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-screen-xl mx-auto px-4 pt-5 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
          <p className="text-xs text-white/30">{t('footer', 'copy')}</p>
          <span className="hidden sm:block text-white/15">•</span>
          <p className="text-xs text-white/20">🇸🇦 صُنع في المملكة العربية السعودية بكل فخر</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {['VISA','Mastercard','مدى','Apple Pay','تابي','تمارا','COD'].map(p => (
            <span key={p} className="bg-white/8 border border-white/10 px-2 py-1 rounded text-[10px] font-bold">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
