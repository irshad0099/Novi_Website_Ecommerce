'use client'
import { useEffect, useRef, useState, RefObject } from 'react'
import { useCart } from '@/store/cart'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/format'
import toast from 'react-hot-toast'

export default function StickyCartBar({
  product: p,
  triggerRef,
}: {
  product: Product
  triggerRef?: RefObject<HTMLDivElement>
}) {
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)
  const internalRef = useRef<HTMLDivElement>(null)
  const addItem = useCart(s => s.addItem)

  useEffect(() => {
    const el = (triggerRef?.current ?? internalRef.current)
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setVisible(!e.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleAdd = () => {
    addItem(p)
    setAdded(true)
    toast.success(`🛒 أُضيف إلى السلة`)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      {!triggerRef && <div ref={internalRef} className="h-px" />}

      {/* Desktop: slides down from top */}
      <div
        className="hidden md:block fixed top-0 inset-x-0 z-50 transition-all duration-350"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <div className="bg-white/97 backdrop-blur-lg border-b border-primary-100 shadow-xl">
          <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center gap-5">
            <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-primary-100 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-black text-primary-900 text-sm truncate">{p.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-primary-400 text-xs">{'★'.repeat(Math.floor(p.rating))}</span>
                <span className="text-xs text-primary-400">({p.reviewCount.toLocaleString('ar-SA')} تقييم)</span>
              </div>
            </div>
            <div className="flex items-center gap-5 flex-shrink-0">
              <div>
                <p className="font-black text-primary-700 text-xl leading-none">{formatPrice(p.price)}</p>
                {p.comparePrice && <p className="text-primary-300 text-xs line-through mt-0.5">{formatPrice(p.comparePrice)}</p>}
              </div>
              <button
                onClick={handleAdd}
                disabled={p.stock === 0}
                className={`px-8 py-2.5 rounded-xl font-black text-sm transition-all shadow ${
                  added ? 'bg-emerald-500 text-white scale-95' :
                  p.stock === 0 ? 'bg-primary-100 text-primary-400 cursor-not-allowed' :
                  'g-gold text-white hover:scale-105 hover:shadow-lg'
                }`}
              >
                {added ? '✓ أُضيف للسلة!' : p.stock === 0 ? 'نفد المخزون' : '🛒 أضف إلى السلة'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: slides up from bottom */}
      <div
        className="md:hidden fixed bottom-14 inset-x-0 z-50 transition-all duration-350"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <div className="bg-white border-t-2 border-primary-200 shadow-2xl px-4 py-3 flex items-center gap-3">
          <img src={p.images[0]} alt={p.name} className="w-11 h-11 object-cover rounded-xl border border-primary-100 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-primary-900 text-xs truncate">{p.name}</p>
            <p className="font-black text-primary-600 text-sm">{formatPrice(p.price)}</p>
          </div>
          <button
            onClick={handleAdd}
            disabled={p.stock === 0}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
              added ? 'bg-emerald-500 text-white' :
              p.stock === 0 ? 'bg-primary-100 text-primary-400' :
              'g-gold text-white'
            }`}
          >
            {added ? '✓ تم!' : '🛒 اشتر الآن'}
          </button>
        </div>
      </div>
    </>
  )
}
