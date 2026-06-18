'use client'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import { useT } from '@/hooks/useT'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

export default function BundleRecommendation({ current, products }: { current: Product; products: Product[] }) {
  const { lang } = useT()
  const addItem = useCart(s => s.addItem)
  const suggestions = products.filter(p => p.category.slug === current.category.slug && p.id !== current.id).slice(0, 3)
  if (!suggestions.length) return null
  const addAll = () => {
    suggestions.forEach(p => addItem(p))
    toast.success(lang==='ar'?'🎁 أضيف البكج للسلة!':'Bundle added to cart!')
  }
  return (
    <section className="mt-8 bg-primary-50 rounded-2xl p-5 border border-primary-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>{lang==='ar'?'اكمل البكج 🎁':'Complete the Bundle 🎁'}</h3>
        <span className="text-xs text-primary-400 bg-white border border-primary-200 px-2 py-1 rounded-full">{lang==='ar'?'وفّر ٥٪ عند شراء منتجين':'Save 5% on 2+ items'}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {suggestions.map(p => (
          <Link key={p.id} href={`/products/${p.slug}`} className="bg-white border border-primary-100 rounded-xl p-2 hover:border-primary-300 transition-colors text-center">
            <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-1"/>
            <p className="text-[10px] font-bold text-primary-800 line-clamp-2 leading-tight">{lang==='ar'?p.name:(p as any).nameEn??p.name}</p>
            <p className="text-xs font-black text-primary-600 mt-1">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
      <button onClick={addAll} className="w-full g-gold text-white font-black py-2.5 rounded-xl text-sm">
        🛒 {lang==='ar'?'أضف الكل للسلة':'Add All to Cart'}
      </button>
    </section>
  )
}
