'use client'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/store/cart'
import { useT } from '@/hooks/useT'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

export default function StickyCartBar({ product, triggerRef }: {
  product: Product
  triggerRef: React.RefObject<HTMLElement>
}) {
  const { lang } = useT()
  const addItem = useCart(s => s.addItem)
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (triggerRef.current) obs.observe(triggerRef.current)
    return () => obs.disconnect()
  }, [triggerRef])

  const handleAdd = () => {
    addItem(product, 1)
    setAdded(true)
    toast.success(lang === 'ar' ? '🛒 أضيف للسلة!' : '🛒 Added to cart!')
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-primary-900 border-t border-primary-700 shadow-2xl transition-transform duration-300
        ${visible ? 'translate-y-0' : 'translate-y-full'}
        md:bottom-0`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-primary-200 font-bold text-sm clamp-1">{lang === 'ar' ? product.name : (product as any).nameEn ?? product.name}</p>
          <p className="text-amber-400 font-black text-sm">{product.price.toFixed(2)} ر.س</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={added}
          className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg
            ${added ? 'bg-emerald-500 text-white' : 'g-gold text-primary-900'}`}
        >
          {added
            ? '✅'
            : lang === 'ar' ? '🛒 أضف للسلة' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  )
}
