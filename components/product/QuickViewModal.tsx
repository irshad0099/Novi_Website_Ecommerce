'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import { useT } from '@/hooks/useT'

interface Props {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({ product: p, onClose }: Props) {
  const addItem = useCart(s => s.addItem)
  const { lang } = useT()

  /* Close on Escape */
  useEffect(() => {
    if (!p) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [p, onClose])

  /* Lock body scroll */
  useEffect(() => {
    if (p) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [p])

  if (!p) return null

  const displayName = lang === 'en' ? ((p as any).nameEn ?? p.name) : p.name
  const catName = lang === 'en' ? ((p.category as any).nameEn ?? p.category.name) : p.category.name
  const isInStock = p.stock > 0

  return (
    <>
      <style>{`
        @keyframes qv-backdrop {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes qv-card {
          from { opacity: 0; transform: scale(0.92) translateY(12px) }
          to   { opacity: 1; transform: scale(1)    translateY(0) }
        }
        .qv-backdrop { animation: qv-backdrop 0.22s ease both }
        .qv-card     { animation: qv-card     0.28s cubic-bezier(0.34,1.56,0.64,1) both }
      `}</style>

      {/* Backdrop */}
      <div
        className="qv-backdrop fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal card */}
        <div
          className="qv-card relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
          onClick={e => e.stopPropagation()}
          dir="rtl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-primary-100 hover:bg-primary-200 text-primary-700 flex items-center justify-center transition-colors"
            aria-label="إغلاق"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div className="flex flex-col md:flex-row">
            {/* ── Left: Image ── */}
            <div className="w-full md:w-1/2 aspect-square bg-gradient-to-br from-primary-50 to-amber-50 flex-shrink-0 relative overflow-hidden">
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover"
              />
              {p.badge && (
                <span className="absolute top-4 right-4 text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 shadow">
                  {p.badge.label}
                </span>
              )}
            </div>

            {/* ── Right: Info ── */}
            <div className="flex-1 p-6 md:p-8 flex flex-col gap-3 overflow-y-auto max-h-[80vh] md:max-h-none">
              {/* Category */}
              <p className="text-xs font-bold text-primary-400 uppercase tracking-wide">{catName}</p>

              {/* Name */}
              <h2
                className="text-xl md:text-2xl font-black text-primary-900 leading-snug"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                {displayName}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">{'★'.repeat(Math.floor(p.rating))}</span>
                <span className="text-[12px] text-primary-500">({p.reviewCount.toLocaleString('ar-SA')} تقييم)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2.5">
                <span className="text-2xl font-black text-primary-600">{formatPrice(p.price)}</span>
                {p.comparePrice && (
                  <span className="text-sm text-primary-300 line-through pb-0.5">{formatPrice(p.comparePrice)}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-primary-600 leading-relaxed line-clamp-3">{p.description}</p>

              {/* Features (first 3) */}
              {p.features.length > 0 && (
                <ul className="space-y-1.5">
                  {p.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-primary-700">
                      <span className="text-amber-500 mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Stock status */}
              <p className={`text-xs font-bold ${isInStock ? 'text-emerald-600' : 'text-red-500'}`}>
                {isInStock
                  ? (p.stock < 30 ? `⚠️ متبقي ${p.stock} قطعة فقط!` : '✅ متوفر في المخزن')
                  : '❌ نفذ من المخزن'}
              </p>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  onClick={() => { addItem(p); onClose() }}
                  disabled={!isInStock}
                  className="flex-1 py-3 rounded-2xl font-black text-sm g-gold text-primary-900 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  🛒 أضف للسلة
                </button>
                <Link
                  href={`/products/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-primary-200 text-primary-700 hover:border-primary-400 text-sm font-bold transition-colors whitespace-nowrap"
                >
                  عرض الكل ←
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
