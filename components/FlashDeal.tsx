'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/store/cart'
import { useT } from '@/hooks/useT'
import { formatPrice, toArabicNumerals } from '@/lib/format'
import PRODUCTS from '@/lib/products'
import toast from 'react-hot-toast'

const DEAL_PRODUCT_ID = 1 // First featured product

export default function FlashDeal() {
  const [time, setTime] = useState(7200) // 2 hours
  const [mounted, setMounted] = useState(false)
  const { lang } = useT()
  const addItem = useCart(s => s.addItem)
  const product = PRODUCTS.find(p => p.id === DEAL_PRODUCT_ID) || PRODUCTS[0]

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setTime(v => Math.max(0, v - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const h = Math.floor(time/3600), m = Math.floor((time%3600)/60), s = time%60
  const pad = (n:number) => String(n).padStart(2,'0')
  const fmt = (n:string) => lang==='ar'?toArabicNumerals(n):n

  const dealPrice = product.price * 0.8 // 20% off

  return (
    <section className="py-10 md:py-14 bg-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(38,105,160,0.2) 0%, transparent 70%)'}}/>
      <div className="relative z-10 max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Product image */}
          <div className="relative flex-shrink-0">
            <img src={product.images[0]} alt={product.name} className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl border-2 border-white/10"/>
            <div className="absolute -top-3 -right-3 g-gold text-white font-black text-sm px-3 py-1.5 rounded-full shadow-lg">
              ٢٠٪ خصم!
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"/></span>
              {lang==='ar'?'عرض اليوم فقط!':'Today\'s Deal Only!'}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2" style={{fontFamily:'Amiri,serif'}}>
              {lang==='ar'?product.name:(product as any).nameEn??product.name}
            </h2>
            <div className="flex items-center gap-4 justify-center md:justify-start mb-5">
              <span className="text-4xl font-black text-primary-300">{formatPrice(dealPrice)}</span>
              <span className="text-xl text-white/40 line-through">{formatPrice(product.price)}</span>
            </div>
            {/* Countdown */}
            {mounted && (
              <div className="mb-6">
                <p className="text-white/60 text-xs mb-2">{lang==='ar'?'ينتهي العرض خلال:':'Offer ends in:'}</p>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  {[[h,lang==='ar'?'ساعة':'h'],[m,lang==='ar'?'دقيقة':'m'],[s,lang==='ar'?'ثانية':'s']].map(([v,l],i)=>(
                    <span key={i} className="flex items-center gap-1">
                      <span className="bg-white text-primary-900 font-black text-xl w-12 h-12 rounded-xl flex items-center justify-center shadow">{fmt(pad(v as number))}</span>
                      <span className="text-white/50 text-xs">{l as string}</span>
                      {i<2&&<span className="text-white/60 font-black text-xl mx-0.5">:</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => { addItem(product); toast.success(lang==='ar'?'🎉 أضيف للسلة بسعر العرض!':'Added at deal price!') }}
              className="g-gold text-white font-black px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
            >
              🛒 {lang==='ar'?'اشتر الآن بالسعر المخفض':'Buy Now at Discount'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
