'use client'
import { useRef } from 'react'
import Link from 'next/link'
import AddToCartButton from '@/components/product/AddToCartButton'
import SocialProof from '@/components/product/SocialProof'
import DeliveryEstimator from '@/components/product/DeliveryEstimator'
import GiftWrap from '@/components/product/GiftWrap'
import LoyaltyPoints from '@/components/product/LoyaltyPoints'
import StickyCartBar from '@/components/product/StickyCartBar'
import { useT } from '@/hooks/useT'
import { formatPrice, formatDiscount, toArabicNumerals } from '@/lib/format'
import type { Product } from '@/types'

export default function ProductDetails({ product: p }: { product: Product }) {
  const { lang } = useT()
  const addToCartRef = useRef<HTMLDivElement>(null)

  const displayName = lang === 'en' ? (p as any).nameEn ?? p.name : p.name
  const catName     = lang === 'en' ? (p.category as any).nameEn ?? p.category.name : p.category.name

  return (
    <>
      <div className="space-y-4">
        {/* Cat + SKU */}
        <div className="flex items-center gap-2">
          <Link href={`/category/${p.category.slug}`} className="text-xs font-black text-primary-500 uppercase tracking-widest hover:text-primary-700">
            {p.category.icon} {catName}
          </Link>
          <span className="text-primary-200">·</span>
          <span className="text-xs text-primary-300">{p.sku}</span>
        </div>

        {/* Name */}
        <h1 className="text-2xl md:text-3xl font-black text-primary-900 leading-tight" style={{fontFamily:'Amiri,serif'}}>
          {displayName}
        </h1>

        {/* Stars + Sold */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-primary-400 text-lg">{'★'.repeat(Math.floor(p.rating))}</span>
            <span className="font-black text-primary-700 text-sm">{toArabicNumerals(p.rating)}</span>
            <span className="text-primary-400 text-xs">({toArabicNumerals(p.reviewCount)} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
          </div>
          <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
            🔥 {toArabicNumerals(p.sold.toLocaleString('en'))} {lang === 'ar' ? 'مباع' : 'sold'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-3 flex-wrap">
          <span className="text-4xl font-black text-primary-600">{formatPrice(p.price)}</span>
          {p.comparePrice && (
            <>
              <span className="text-base text-primary-300 line-through pb-1">{formatPrice(p.comparePrice)}</span>
              <span className="bg-red-100 text-red-600 font-black text-sm px-3 py-1 rounded-full">
                {lang === 'ar' ? 'وفّر' : 'Save'} {formatDiscount(p.comparePrice, p.price)}
              </span>
            </>
          )}
        </div>

        {/* Loyalty points */}
        <LoyaltyPoints price={p.price} />

        {/* Badge */}
        {p.badge && (
          <span className={`inline-block font-black text-xs px-3 py-1.5 rounded-full ${
            p.badge.color === 'gold'  ? 'bg-primary-100 text-primary-800' :
            p.badge.color === 'red'   ? 'bg-red-100 text-red-700' :
            p.badge.color === 'green' ? 'bg-emerald-100 text-emerald-700' :
            'bg-blue-100 text-blue-700'
          }`}>⭐ {p.badge.label}</span>
        )}

        {/* Stock */}
        <div className={`flex items-center gap-2 text-sm font-semibold ${p.stock < 50 ? 'text-red-500' : 'text-emerald-600'}`}>
          <span className={`w-2 h-2 rounded-full ${p.stock < 50 ? 'bg-red-400' : 'bg-emerald-400'}`} />
          {p.stock < 50
            ? `⚠️ ${lang === 'ar' ? `متبقي ${toArabicNumerals(p.stock)} قطعة فقط!` : `Only ${p.stock} left!`}`
            : `✅ ${lang === 'ar' ? `متوفر (${toArabicNumerals(p.stock)} قطعة)` : `In stock (${p.stock} pcs)`}`}
        </div>

        {/* Social proof */}
        <SocialProof productId={p.id} />

        {/* Desc */}
        <p className="text-primary-600 text-sm leading-relaxed border-t border-primary-100 pt-4">{p.description}</p>

        {/* Features */}
        <div className="bg-primary-50 rounded-2xl p-4 space-y-2">
          <p className="font-black text-sm text-primary-900 mb-2">
            {lang === 'ar' ? '✨ المميزات الرئيسية:' : '✨ Key Features:'}
          </p>
          {p.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-primary-700">
              <span className="text-emerald-500 font-black mt-0.5 flex-shrink-0">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Specs */}
        <div className="border border-primary-100 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-primary-100">
            <p className="font-black text-sm text-primary-900">
              {lang === 'ar' ? '📋 المواصفات التفصيلية' : '📋 Specifications'}
            </p>
          </div>
          <div className="divide-y divide-primary-50">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-primary-500 font-semibold">{k}</span>
                <span className="text-primary-800 font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gift wrap */}
        <GiftWrap />

        {/* Add to cart */}
        <div ref={addToCartRef}>
          <AddToCartButton product={p} />
        </div>

        {/* Delivery estimator */}
        <DeliveryEstimator />

        {/* Social share */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="text-xs text-primary-400 font-semibold">{lang === 'ar' ? 'شارك:' : 'Share:'}</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent((lang === 'ar' ? p.name : (p as any).nameEn ?? p.name) + ' - ' + p.price + ' ر.س')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-full hover:bg-emerald-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.07 1.5 5.785L0 24l6.435-1.487A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.85 0-3.583-.497-5.078-1.363L3 21.5l.88-3.82A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            واتساب
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent((lang === 'ar' ? p.name : (p as any).nameEn ?? p.name))}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-primary-900 text-white font-bold text-xs px-3 py-1.5 rounded-full hover:bg-primary-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            تويتر
          </a>
          <button
            onClick={() => { navigator.clipboard?.writeText(typeof window !== 'undefined' ? window.location.href : ''); }}
            className="flex items-center gap-1.5 bg-primary-100 text-primary-700 font-bold text-xs px-3 py-1.5 rounded-full hover:bg-primary-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            {lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
          </button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            ['🚚', lang === 'ar' ? 'شحن مجاني' : 'Free Shipping', lang === 'ar' ? 'فوق ١٥٠ ريال' : 'Over 150 SAR'],
            ['🔄', lang === 'ar' ? 'إرجاع' : 'Returns',          lang === 'ar' ? 'خلال ٧ أيام' : 'Within 7 days'],
            ['🔒', lang === 'ar' ? 'دفع آمن' : 'Secure Payment', 'SSL 256'],
          ].map(([icon, t, s]) => (
            <div key={t} className="text-center bg-primary-50 rounded-xl p-2.5">
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-[11px] font-bold text-primary-800">{t}</p>
              <p className="text-[9px] text-primary-400">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky add to cart bar (shows when scrolled past the add to cart button) */}
      <StickyCartBar product={p} triggerRef={addToCartRef} />
    </>
  )
}
