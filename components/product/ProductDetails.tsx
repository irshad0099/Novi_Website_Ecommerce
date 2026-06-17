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
            <span className="text-amber-400 text-lg">{'★'.repeat(Math.floor(p.rating))}</span>
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
            p.badge.color === 'gold'  ? 'bg-amber-100 text-amber-800' :
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
