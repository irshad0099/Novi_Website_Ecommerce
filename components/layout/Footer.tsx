'use client'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/products'
import { useT } from '@/hooks/useT'

export default function Footer() {
  const { t, tArr, lang } = useT()
  const supportLinks = tArr('footer', 'supportLinks')

  return (
    <footer className="bg-primary-900 text-white/60 pt-10 md:pt-14 pb-6">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
        <div>
          <div className="mb-4">
            <img src="/logo-combined.png" alt="NOVI نوفي" className="h-14 w-auto object-contain rounded-lg" />
          </div>
          <p className="text-sm leading-relaxed text-white/50 mb-4">{t('footer', 'desc')}</p>
          <div className="flex gap-2">
            {['📸','🐦','💬','👻','🎵'].map((i, n) => (
              <a key={n} href="#" className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors">{i}</a>
            ))}
          </div>
        </div>
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
        <div>
          <h4 className="text-sm font-black text-white mb-3">{t('footer', 'support')}</h4>
          <ul className="space-y-2">
            {supportLinks.map((lbl, i) => (
              <li key={i}><a href="#" className="text-sm text-white/55 hover:text-primary-300 transition-colors">{lbl}</a></li>
            ))}
          </ul>
        </div>
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
      <div className="max-w-screen-xl mx-auto px-4 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/30">{t('footer', 'copy')}</p>
        <div className="flex gap-2 flex-wrap">
          {['VISA','Mastercard','مدى','Apple Pay','تابي','تمارا','COD'].map(p => (
            <span key={p} className="bg-white/8 border border-white/10 px-2 py-1 rounded text-[10px] font-bold">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
