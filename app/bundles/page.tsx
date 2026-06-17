'use client'
import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ProductCard from '@/components/product/ProductCard'
import PRODUCTS, { CATEGORIES } from '@/lib/products'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types'

/* ── Discount logic ───────────────────────────────────── */
const getDiscount = (n: number) =>
  n >= 4 ? 0.15 : n === 3 ? 0.10 : n === 2 ? 0.05 : 0

const TIERS = [
  { count: 2, pct: 5,  label: 'منتجان',     emoji: '🎁' },
  { count: 3, pct: 10, label: 'ثلاثة منتجات', emoji: '🎀' },
  { count: 4, pct: 15, label: '٤ منتجات فأكثر', emoji: '👑' },
]

/* ── Constants ────────────────────────────────────────── */
const MAX_ITEMS = 5

export default function BundlesPage() {
  const addItem = useCart(s => s.addItem)
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [addedBundle, setAddedBundle] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  /* ── Filtered products ────────────────────────────────── */
  const filteredProducts = useMemo(() =>
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category.slug === activeCategory),
    [activeCategory]
  )

  /* ── Selection helpers ─────────────────────────────────── */
  const isSelected = (p: Product) => selected.some(s => s.id === p.id)

  const toggle = (p: Product) => {
    if (isSelected(p)) {
      setSelected(prev => prev.filter(s => s.id !== p.id))
    } else {
      if (selected.length >= MAX_ITEMS) return
      setSelected(prev => [...prev, p])
    }
  }

  /* ── Price calculations ────────────────────────────────── */
  const subtotal = selected.reduce((sum, p) => sum + p.price, 0)
  const discountRate = getDiscount(selected.length)
  const discountAmt = subtotal * discountRate
  const discountedTotal = subtotal - discountAmt

  /* ── Add bundle to cart ─────────────────────────────────── */
  const handleAddBundle = () => {
    if (selected.length === 0) return
    selected.forEach(p => addItem(p))
    setAddedBundle(true)
    setTimeout(() => { setAddedBundle(false); setSelected([]) }, 1500)
  }

  /* ── Active tier index ───────────────────────────────────── */
  const activeTierIndex =
    selected.length >= 4 ? 2 :
    selected.length === 3 ? 1 :
    selected.length === 2 ? 0 : -1

  return (
    <>
      <Header />

      <main className="min-h-screen bg-primary-50 pb-nav" dir="rtl">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-primary-900 py-14 px-4 text-center">
          <h1
            className="text-3xl md:text-5xl font-black text-white mb-3"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            بكج التوفير 🎁
          </h1>
          <p className="text-primary-300 text-base md:text-lg max-w-xl mx-auto">
            اختر منتجاتك واحصل على خصم تلقائي — كلما اخترت أكثر، وفّرت أكثر
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2">
            <span className="text-amber-400 text-sm font-bold">✨ حتى ١٥٪ خصم فوري</span>
          </div>
        </section>

        {/* ── Discount Tiers ───────────────────────────────────── */}
        <section className="max-w-screen-lg mx-auto px-4 py-8">
          <h2 className="text-lg font-black text-primary-900 mb-4 text-center" style={{ fontFamily: 'Amiri, serif' }}>
            شرائح الخصم
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {TIERS.map((tier, i) => {
              const isActive = activeTierIndex === i
              const isPassed = activeTierIndex > i
              return (
                <div
                  key={tier.count}
                  className={`rounded-2xl border-2 p-4 text-center transition-all duration-300 ${
                    isActive
                      ? 'border-amber-400 bg-amber-50 shadow-lg scale-[1.03]'
                      : isPassed
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-primary-200 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">{tier.emoji}</div>
                  <p className="text-xs font-bold text-primary-500 mb-1">{tier.label}</p>
                  <p className={`text-xl font-black ${isActive ? 'text-amber-600' : isPassed ? 'text-emerald-600' : 'text-primary-700'}`}>
                    {tier.pct}٪
                  </p>
                  <p className="text-[10px] text-primary-400 mt-0.5">خصم</p>
                  {isPassed && (
                    <span className="inline-block mt-1 text-[10px] font-black text-emerald-600">✓ محقق</span>
                  )}
                  {isActive && (
                    <span className="inline-block mt-1 text-[10px] font-black text-amber-600">← أنت هنا</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Main content: Product grid + Sidebar ──────────────── */}
        <div className="max-w-screen-xl mx-auto px-4 pb-16 flex flex-col lg:flex-row gap-8">

          {/* ── Product grid column ───────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border-2 transition-all flex-shrink-0 ${
                  activeCategory === 'all'
                    ? 'bg-primary-900 text-primary-200 border-primary-900'
                    : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400'
                }`}
              >
                🏠 الكل
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border-2 transition-all flex-shrink-0 ${
                    activeCategory === c.slug
                      ? 'bg-primary-900 text-primary-200 border-primary-900'
                      : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400'
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>

            {/* Counter */}
            <p className="text-xs text-primary-400 mb-4">
              {filteredProducts.length} منتج متاح — اختر حتى {MAX_ITEMS} منتجات
            </p>

            {/* Products grid with overlay select button */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map(p => {
                const sel = isSelected(p)
                const disabled = !sel && selected.length >= MAX_ITEMS
                return (
                  <div key={p.id} className="relative">
                    {/* Selection overlay ring */}
                    <div
                      className={`absolute inset-0 rounded-2xl pointer-events-none z-10 border-[3px] transition-all duration-200 ${
                        sel ? 'border-amber-400' : 'border-transparent'
                      }`}
                    />
                    {/* Checkmark badge */}
                    {sel && (
                      <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-amber-400 text-primary-900 text-xs font-black flex items-center justify-center shadow">
                        ✓
                      </div>
                    )}
                    {/* Product card (read-only display) */}
                    <div className={`transition-opacity ${disabled ? 'opacity-40' : 'opacity-100'}`}>
                      <ProductCard product={p} />
                    </div>
                    {/* Select button overlay */}
                    <button
                      onClick={() => toggle(p)}
                      disabled={disabled}
                      className={`absolute bottom-[52px] inset-x-2 py-2 rounded-xl text-xs font-black z-20 transition-all ${
                        sel
                          ? 'bg-red-500 text-white'
                          : disabled
                            ? 'bg-primary-200 text-primary-400 cursor-not-allowed'
                            : 'g-gold text-primary-900 hover:shadow-md'
                      }`}
                    >
                      {sel ? '✕ إزالة من البكج' : '＋ أضف للبكج'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Sidebar summary (desktop) ─────────────────────────── */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white border-2 border-primary-100 rounded-3xl overflow-hidden shadow-lg">
              {/* Header */}
              <div className="bg-primary-900 px-5 py-4">
                <h3 className="text-white font-black text-lg" style={{ fontFamily: 'Amiri, serif' }}>
                  🎁 بكجك الخاص
                </h3>
                <p className="text-primary-300 text-xs mt-0.5">
                  {selected.length} / {MAX_ITEMS} منتجات
                </p>
              </div>

              <div className="p-5 space-y-4">
                {/* Selected items list */}
                {selected.length === 0 ? (
                  <div className="py-6 text-center text-primary-400">
                    <div className="text-4xl mb-2">🛒</div>
                    <p className="text-sm font-bold">اختر منتجاتك لتبدأ</p>
                    <p className="text-xs mt-1">أضف منتجين على الأقل للحصول على خصم</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {selected.map(p => (
                      <li key={p.id} className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-primary-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-primary-800 line-clamp-2 leading-snug">{p.name}</p>
                          <p className="text-xs text-primary-500 mt-0.5">{formatPrice(p.price)}</p>
                        </div>
                        <button
                          onClick={() => toggle(p)}
                          className="w-6 h-6 rounded-full bg-red-100 text-red-500 text-xs flex items-center justify-center flex-shrink-0 hover:bg-red-200"
                        >✕</button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Discount progress bar */}
                {selected.length > 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] text-primary-400 mb-1">
                      <span>تقدم الخصم</span>
                      <span>{selected.length} / ٤ للخصم الأقصى</span>
                    </div>
                    <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                      <div
                        className="h-full g-gold rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((selected.length / 4) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Price breakdown */}
                {mounted && selected.length > 0 && (
                  <div className="border-t border-primary-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-primary-600">
                      <span>المجموع</span>
                      <span className="font-bold">{formatPrice(subtotal)}</span>
                    </div>
                    {discountRate > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>الخصم ({Math.round(discountRate * 100)}٪)</span>
                        <span className="font-bold">- {formatPrice(discountAmt)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black text-primary-900 border-t border-primary-100 pt-2">
                      <span>الإجمالي</span>
                      <span>{formatPrice(discountedTotal)}</span>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleAddBundle}
                  disabled={selected.length === 0}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all ${
                    addedBundle
                      ? 'bg-emerald-500 text-white scale-95'
                      : selected.length === 0
                        ? 'bg-primary-100 text-primary-400 cursor-not-allowed'
                        : 'g-gold text-primary-900 hover:shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  {addedBundle
                    ? '✅ أضيف للسلة!'
                    : selected.length === 0
                      ? 'اختر منتجاتك أولاً'
                      : `🛒 أضف البكج للسلة (${selected.length} منتجات)`
                  }
                </button>

                {selected.length > 0 && !addedBundle && (
                  <button
                    onClick={() => setSelected([])}
                    className="w-full text-xs text-primary-400 hover:text-red-500 transition-colors py-1"
                  >
                    مسح الاختيار كله
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Mobile sticky bottom bar ──────────────────────────── */}
      {mounted && selected.length > 0 && (
        <div
          className="lg:hidden fixed bottom-16 left-0 right-0 z-50 bg-white border-t-2 border-primary-100 px-4 py-3 shadow-2xl"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            {/* Count badge */}
            <div className="w-10 h-10 rounded-xl bg-primary-900 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
              {selected.length}
            </div>

            {/* Price */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-primary-400">
                {discountRate > 0 && <span className="text-emerald-600 font-bold">{Math.round(discountRate * 100)}٪ خصم · </span>}
                {selected.length} منتج
              </p>
              <p className="text-base font-black text-primary-900 leading-none">
                {formatPrice(discountedTotal)}
                {discountRate > 0 && (
                  <span className="text-xs text-primary-300 line-through mr-1.5">{formatPrice(subtotal)}</span>
                )}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleAddBundle}
              className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all flex-shrink-0 ${
                addedBundle ? 'bg-emerald-500 text-white' : 'g-gold text-primary-900'
              }`}
            >
              {addedBundle ? '✅ أضيف!' : '🛒 أضف للسلة'}
            </button>
          </div>
        </div>
      )}

      <WhatsAppButton />
      <BottomNav />
      <Footer />
    </>
  )
}
