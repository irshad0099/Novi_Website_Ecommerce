'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart(s => s.addItem)
  const { toggle: toggleWish, has: inWishlist } = useWishlist()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const wished = inWishlist(product.id)

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    toast.success(`🛒 ${qty} قطعة أضيفت للسلة!`)
    setTimeout(() => setAdded(false), 800)
  }

  return (
    <div className="space-y-3">
      {/* Qty */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-primary-700">الكمية:</span>
        <div className="flex items-center border-2 border-primary-200 rounded-xl overflow-hidden">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-xl font-black text-primary-700 hover:bg-primary-50 transition-colors">−</button>
          <span className="w-10 text-center font-black text-primary-900 text-base">{qty}</span>
          <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center text-xl font-black text-primary-700 hover:bg-primary-50 transition-colors">+</button>
        </div>
        <span className="text-xs text-primary-400">المتاح: {product.stock} قطعة</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 md:gap-3">
        <button
          onClick={handleAdd}
          disabled={added}
          className={`flex-1 py-3 md:py-4 rounded-2xl font-black text-sm md:text-[15px] transition-all shadow-lg ${added ? 'bg-emerald-500 text-white' : 'g-gold text-primary-900 hover:shadow-xl'}`}
        >
          {added ? '✅ تمت الإضافة!' : `🛒 أضف للسلة — ${(product.price * qty).toFixed(2)} ر.س`}
        </button>
        <button
          onClick={() => {
            toggleWish(product)
            toast(wished ? '💔 أُزيل من المفضلة' : '❤️ أُضيف للمفضلة')
          }}
          className={`w-11 h-11 md:w-12 md:h-14 border-2 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${wished ? 'border-red-300 bg-red-50 text-red-500' : 'border-primary-200 text-primary-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50'}`}
        >
          {wished ? '❤️' : '🤍'}
        </button>
      </div>

      <Link href="/checkout" onClick={handleAdd} className="w-full py-3 md:py-4 bg-primary-900 text-primary-200 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-800 transition-colors text-sm md:text-[15px]">
        ⚡ اشترِ الآن
      </Link>
    </div>
  )
}
