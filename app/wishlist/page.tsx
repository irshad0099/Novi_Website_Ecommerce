'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import { useWishlist } from '@/store/wishlist'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { items, toggle, clear } = useWishlist()
  const addItem = useCart(s => s.addItem)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-primary-50 pb-nav" />
        <Footer />
        <BottomNav />
        <WhatsAppButton />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-nav" dir="rtl">
        <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-12">

          {/* Page heading */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-2xl md:text-3xl font-black text-primary-900 leading-tight"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                ❤️ المفضلة
              </h1>
              {items.length > 0 && (
                <p className="text-sm text-primary-400 mt-1">
                  {items.length} منتج محفوظ
                </p>
              )}
            </div>
            {items.length > 0 && (
              <button
                onClick={() => { clear(); toast('🗑️ تم مسح المفضلة') }}
                className="text-sm text-red-400 hover:text-red-600 font-bold border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-colors"
              >
                مسح الكل
              </button>
            )}
          </div>

          {/* Empty state */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-primary-100 shadow-sm">
              <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-primary-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <p className="text-xl font-black text-primary-700 mb-2">قائمة المفضلة فارغة</p>
              <p className="text-primary-400 text-sm mb-8 text-center max-w-xs">
                لم تضف أي منتجات بعد. تصفح متجرنا واحفظ ما يعجبك!
              </p>
              <Link
                href="/products"
                className="g-gold text-primary-900 font-black px-8 py-3.5 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-xl transition-shadow text-sm"
              >
                🛍️ تصفح المنتجات
              </Link>
            </div>
          ) : (
            /* Product grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {items.map(product => (
                <WishlistCard
                  key={product.id}
                  product={product}
                  onRemove={() => {
                    toggle(product)
                    toast('💔 تم الإزالة من المفضلة')
                  }}
                  onAddToCart={() => {
                    addItem(product)
                    toast.success(`🛒 أضيف "${product.name.slice(0, 18)}..."`)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </>
  )
}

/* ── Wishlist product card ─────────────────────────────────────────────────── */
function WishlistCard({
  product: p,
  onRemove,
  onAddToCart,
}: {
  product: import('@/types').Product
  onRemove: () => void
  onAddToCart: () => void
}) {
  const [imgErr, setImgErr] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 800)
  }

  return (
    <article className="bg-white border border-primary-100 rounded-2xl overflow-hidden flex flex-col hover:border-primary-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative group">

      {/* Remove button */}
      <button
        onClick={e => { e.preventDefault(); onRemove() }}
        aria-label="إزالة من المفضلة"
        className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/90 border border-primary-100 text-primary-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image */}
      <Link href={`/products/${p.slug}`}>
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary-50 to-amber-50">
          {!imgErr ? (
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🧻</div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        {/* Badge */}
        {p.badge && (
          <span className={`self-start text-[9px] font-black px-2 py-0.5 rounded-full mb-1.5 ${
            p.badge.color === 'gold'   ? 'bg-amber-100 text-amber-800' :
            p.badge.color === 'red'    ? 'bg-red-100 text-red-700' :
            p.badge.color === 'green'  ? 'bg-emerald-100 text-emerald-700' :
            p.badge.color === 'blue'   ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {p.badge.label}
          </span>
        )}

        <Link href={`/products/${p.slug}`}>
          <h3 className="text-[12px] md:text-[13px] font-bold text-primary-900 leading-snug line-clamp-2 mb-2 hover:text-primary-600 transition-colors">
            {p.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-amber-400 text-[10px]">{'★'.repeat(Math.floor(p.rating))}</span>
          <span className="text-[10px] text-primary-400">({p.reviewCount.toLocaleString('ar-SA')})</span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1.5 mb-3">
          <span className="text-sm md:text-base font-black text-primary-600">{formatPrice(p.price)}</span>
          {p.comparePrice && (
            <span className="text-[11px] text-primary-300 line-through pb-0.5">{formatPrice(p.comparePrice)}</span>
          )}
        </div>

        {/* Actions */}
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl font-black text-[12px] md:text-[13px] transition-all mt-auto ${
            added
              ? 'bg-emerald-500 text-white scale-95'
              : 'g-gold text-primary-900 hover:shadow-md hover:scale-[1.01]'
          }`}
        >
          {added ? '✅ أضيف!' : '🛒 أضف للسلة'}
        </button>
      </div>
    </article>
  )
}
