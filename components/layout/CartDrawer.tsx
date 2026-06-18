'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { useT } from '@/hooks/useT'
import { PRODUCTS } from '@/lib/products'
import { formatPrice } from '@/lib/format'
import toast from 'react-hot-toast'

/* ── Upsell mini card ──────────────────────────────────────────────────────── */
function UpsellCard({ product: p }: { product: import('@/types').Product }) {
  const addItem = useCart(s => s.addItem)
  const [added, setAdded] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(p)
    toast.success(`🛒 "${p.name.slice(0, 16)}..."`)
    setAdded(true)
    setTimeout(() => setAdded(false), 700)
  }

  return (
    <div className="flex-shrink-0 w-[116px] bg-primary-50 border border-primary-100 rounded-xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="w-full h-14 bg-primary-100 overflow-hidden flex items-center justify-center flex-shrink-0">
        {!imgErr ? (
          <img
            src={p.images[0]}
            alt={p.name}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-2xl">🧻</span>
        )}
      </div>

      {/* Info */}
      <div className="p-1.5 flex flex-col flex-1">
        <p className="text-[10px] font-semibold text-primary-800 leading-tight line-clamp-1 mb-1">{p.name}</p>
        <p className="text-[10px] font-black text-primary-600 mb-1.5">{formatPrice(p.price)}</p>
        <button
          onClick={handleAdd}
          className={`w-full py-1 rounded-lg text-[10px] font-black transition-all ${
            added
              ? 'bg-emerald-500 text-white scale-95'
              : 'g-gold text-primary-900 hover:opacity-90'
          }`}
        >
          {added ? '✅' : '+'}
        </button>
      </div>
    </div>
  )
}

/* ── Upsell strip ──────────────────────────────────────────────────────────── */
function CartUpsell({ cartItemIds }: { cartItemIds: number[] }) {
  const suggestions = useMemo(() => {
    const pool = PRODUCTS.filter(p => !cartItemIds.includes(p.id))
    // deterministic shuffle via id-based sort so it is stable per render
    const shuffled = [...pool].sort((a, b) => (a.id * 7 + 3) % 13 - (b.id * 7 + 3) % 13)
    return shuffled.slice(0, 3)
  }, [cartItemIds])

  if (suggestions.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-primary-100">
      <p className="text-[12px] font-black text-primary-700 mb-3">قد يعجبك أيضاً 💛</p>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        {suggestions.map(p => (
          <UpsellCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQty, subtotal, shipping, discount, total, applyCoupon, removeCoupon, couponCode, couponPct } = useCart()
  const [coupon, setCoupon] = useState('')
  const [mounted, setMounted] = useState(false)
  const { t } = useT()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!mounted) return null

  const sub = subtotal(), ship = shipping(), disc = discount(), tot = total()

  const handleCoupon = () => {
    if (!coupon.trim()) return
    const ok = applyCoupon(coupon)
    if (ok) { toast.success(`🎉 ${t('cart','discount')} ${useCart.getState().couponPct}%!`); setCoupon('') }
    else toast.error('❌ كود غير صالح. جرّب: NADA10')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer — slides from RIGHT for RTL */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[400px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: '100vw' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-primary-100 flex-shrink-0">
          <div>
            <h2 className="text-base md:text-lg font-black text-primary-900">🛒 {t('cart','title')}</h2>
            <p className="text-xs text-primary-400 mt-0.5">
              {items.reduce((s, i) => s + i.qty, 0)} {t('cart','items')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-primary-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Free shipping progress bar */}
        {(() => {
          const s = subtotal()
          const FREE = 150
          const pct  = Math.min(100, (s / FREE) * 100)
          const rem  = Math.max(0, FREE - s)
          return s > 0 ? (
            <div className={`px-3 md:px-4 py-2.5 border-b flex-shrink-0 ${pct >= 100 ? 'bg-green-50 border-green-100' : 'bg-primary-50 border-primary-100'}`}>
              {pct < 100 ? (
                <>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-primary-700">🚚 أضف <span className="text-primary-600 font-black">{rem.toFixed(0)} ر.س</span> للشحن المجاني</span>
                    <span className="text-primary-400">{Math.round(pct)}٪</span>
                  </div>
                  <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700 g-gold" style={{ width: `${pct}%` }} />
                  </div>
                </>
              ) : (
                <p className="text-center text-green-700 font-black text-[12px]">🎉 تهانينا! حصلت على الشحن المجاني</p>
              )}
            </div>
          ) : null
        })()}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-lg font-black text-primary-700 mb-1">{t('cart','empty')}</p>
              <p className="text-sm text-primary-400 mb-6">{t('cart','emptySub')}</p>
              <button onClick={onClose} className="g-gold text-primary-900 font-black px-6 py-2.5 rounded-full text-sm">
                {t('cart','startShopping')}
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 bg-primary-50 rounded-2xl border border-primary-100">
                    <div className="flex-shrink-0 rounded-xl bg-primary-100 overflow-hidden flex items-center justify-center" style={{ width: 64, height: 64 }}>
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] md:text-[13px] font-bold text-primary-900 leading-tight clamp-2 mb-1">{item.name}</p>
                      <p className="text-sm font-black text-primary-600 mb-2">{(item.price * item.qty).toFixed(2)} ر.س</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-md border border-primary-200 bg-white flex items-center justify-center text-sm font-bold text-primary-700 hover:border-primary-400 transition-colors">−</button>
                        <span className="text-sm font-black w-5 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-md border border-primary-200 bg-white flex items-center justify-center text-sm font-bold text-primary-700 hover:border-primary-400 transition-colors">+</button>
                      </div>
                    </div>
                    <button
                      onClick={() => { removeItem(item.id); toast('🗑️') }}
                      className="p-1 text-primary-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Upsell section */}
              <CartUpsell cartItemIds={items.map(i => i.id)} />
            </>
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-primary-100 px-3 md:px-4 py-4 space-y-3 flex-shrink-0 bg-white">
            {couponCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 md:px-4 py-2.5">
                <span className="text-xs md:text-sm font-bold text-green-700">✅ {couponCode} — خصم {couponPct}٪</span>
                <button onClick={removeCoupon} className="text-xs text-red-500 font-bold hover:underline flex-shrink-0">{t('cart','remove')}</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                  placeholder={t('cart','couponPlh')}
                  className="flex-1 px-3 py-2 border border-primary-200 rounded-xl text-sm bg-primary-50 focus:outline-none focus:border-primary-400 transition-colors min-w-0"
                />
                <button onClick={handleCoupon} className="px-3 md:px-4 py-2 border-2 border-primary-400 text-primary-700 font-bold text-sm rounded-xl hover:bg-primary-50 transition-colors flex-shrink-0">
                  {t('cart','apply')}
                </button>
              </div>
            )}

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-primary-600">
                <span>{t('cart','subtotal')}</span><span>{sub.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-primary-600">
                <span>{t('cart','shipping')}</span>
                <span className={ship === 0 ? 'text-green-600 font-bold' : ''}>{ship === 0 ? `${t('cart','freeShipping')} 🎉` : `${ship.toFixed(2)} ر.س`}</span>
              </div>
              {disc > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>{t('cart','discount')} ({couponPct}٪)</span>
                  <span>-{disc.toFixed(2)} ر.س</span>
                </div>
              )}
            </div>

            <div className="flex justify-between font-black text-base pt-1.5 border-t border-primary-100">
              <span>{t('cart','total')}</span>
              <span className="text-primary-600">{tot.toFixed(2)} ر.س</span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full g-gold text-primary-900 font-black py-3 md:py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm md:text-[15px] shadow-lg hover:shadow-xl transition-shadow"
            >
              🔒 {t('cart','checkout')}
            </Link>
            <p className="text-center text-[11px] text-primary-400">🔒 دفع آمن مشفر بـ SSL 256bit</p>
          </div>
        )}
      </aside>
    </>
  )
}
