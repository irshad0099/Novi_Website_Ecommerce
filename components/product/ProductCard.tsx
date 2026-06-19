'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { useCompare } from '@/store/compare'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import { formatPrice, formatDiscount } from '@/lib/format'
import { useT } from '@/hooks/useT'
import QuickViewModal from '@/components/product/QuickViewModal'

// Lifestyle/usage images per category — shown on hover
const HOVER_IMGS: Record<string, string[]> = {
  'face-tissue': [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=85',
    'https://images.unsplash.com/photo-1559181567-c3190144543a?w=600&q=85',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=85',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=85',
  ],
  'wet-wipes': [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=85',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=85',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=85',
    'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&q=85',
  ],
  'kitchen': [
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=85',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=85',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85',
    'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&q=85',
  ],
  'cotton-towels': [
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=85',
    'https://images.unsplash.com/photo-1620977741926-cdaf81ee4576?w=600&q=85',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=85',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=85',
  ],
  'pocket': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=85',
    'https://images.unsplash.com/photo-1590114072880-9b5d9cefc70b?w=600&q=85',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=85',
    'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=600&q=85',
  ],
  'specialty': [
    'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&q=85',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=85',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=85',
  ],
  'bundles': [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=85',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85',
  ],
}

const BADGE_STYLES: Record<string, string> = {
  gold:   'bg-primary-100 text-primary-800',
  red:    'bg-red-100 text-red-700',
  green:  'bg-emerald-100 text-emerald-700',
  blue:   'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
}

function spawnConfetti(originX: number, originY: number) {
  const colors = ['#1a3461','#2669a0','#153d6a','#4a8abb','#82b0d5','#fff']
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div')
    const size = 5 + Math.random() * 7
    el.style.cssText = `position:fixed;left:${originX}px;top:${originY}px;width:${size}px;height:${size}px;background:${colors[~~(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};pointer-events:none;z-index:9999;`
    document.body.appendChild(el)
    const angle = Math.random() * Math.PI * 2
    const spd = 3 + Math.random() * 5
    let vx = Math.cos(angle)*spd, vy = Math.sin(angle)*spd - 4.5
    let x = originX, y = originY, opacity = 1, rot = 0
    const tick = () => {
      vy += 0.22; x += vx; y += vy; opacity -= 0.022; rot += 9
      Object.assign(el.style,{left:x+'px',top:y+'px',opacity:String(Math.max(0,opacity)),transform:`rotate(${rot}deg)`})
      if (opacity > 0) requestAnimationFrame(tick); else el.remove()
    }
    requestAnimationFrame(tick)
  }
}

export default function ProductCard({ product: p }: { product: Product }) {
  const addItem = useCart(s => s.addItem)
  const { toggle, has } = useCompare()
  const { t, lang } = useT()
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const catImgs = HOVER_IMGS[p.category.slug] ?? []
  const hoverSrc = catImgs.length > 0 ? catImgs[p.id % catImgs.length] : p.images[1]
  const inCompare = has(p.id)

  const displayName = lang === 'en' ? ((p as any).nameEn ?? p.name) : p.name
  const catName = lang === 'en' ? ((p.category as any).nameEn ?? p.category.name) : p.category.name

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    addItem(p); setAdded(true)
    spawnConfetti(e.clientX, e.clientY)
    toast.success(`🛒 "${displayName.slice(0, 22)}..."`)
    setTimeout(() => setAdded(false), 700)
  }

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 10, y: y * 10 })
  }

  const isLowStock = p.stock > 0 && p.stock < 20

  return (
    <>
      <div
        className="group block relative"
        onMouseMove={handleTilt}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
        style={{
          transform: `perspective(600px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg) translateY(${tilt.x || tilt.y ? -5 : 0}px)`,
          transition: (tilt.x || tilt.y) ? 'transform 0.05s linear' : 'transform 0.5s ease',
          borderRadius: 16,
        }}
      >
        <Link href={`/products/${p.slug}`} className="block">
          <article className="glass-card rounded-2xl overflow-hidden hover:border-primary-300 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 flex-shrink-0">
              {!imgErr ? (
                <>
                  {/* Product image — fades out on hover */}
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                    style={{ opacity: hovered ? 0 : 1, transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
                    onError={() => setImgErr(true)}
                  />
                  {/* Lifestyle/usage image — fades in on hover */}
                  <img
                    src={hoverSrc}
                    alt={`${p.name} — in use`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                    style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(1.06)' }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🧻</div>
              )}

              {/* Badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {p.badge && <span className={`text-[10px] font-black px-2 py-1 rounded-full shadow-sm ${BADGE_STYLES[p.badge.color]}`}>{p.badge.label}</span>}
                {(p as any).isNewArrival && !p.badge && <span className="text-[10px] font-black px-2 py-1 rounded-full bg-blue-100 text-blue-700 shadow-sm">{t('card','new')}</span>}
              </div>

              {/* Wishlist */}
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); toast(liked ? '🤍' : '❤️') }}
                className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center border transition-all shadow-sm ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-primary-100 text-primary-300 hover:text-red-400'}`}
              >
                <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>

              {/* Sold badge */}
              {p.sold > 5000 && (
                <div className="absolute bottom-2 right-2 bg-black/55 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  🔥 {t('card','sold').replace('{n}', p.sold.toLocaleString('en'))}
                </div>
              )}

              {/* Low stock badge — urgent pulsing */}
              {isLowStock && (
                <div className="absolute bottom-2 left-2">
                  <span className="flex items-center gap-0.5 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md stock-urgent">
                    ⚡ {p.stock < 6 ? `آخر ${p.stock}!` : `${p.stock} فقط!`}
                  </span>
                </div>
              )}

              {/* Quick View button */}
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(p) }}
                className="absolute bottom-0 inset-x-0 py-2.5 bg-primary-900/90 text-primary-100 text-[12px] font-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary-900"
              >
                {lang === 'en' ? '👁 Quick View' : '👁 عرض سريع'}
              </button>
            </div>

            {/* Body */}
            <div className="p-3 flex flex-col flex-1">
              <p className="text-[10px] text-primary-500 font-semibold mb-1">{catName}</p>
              <h3 className="text-[13px] font-bold text-primary-900 clamp-2 mb-2 leading-snug flex-1">{displayName}</h3>

              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-primary-400 text-xs">{'★'.repeat(Math.floor(p.rating))}</span>
                <span className="text-[11px] text-primary-500">({p.reviewCount.toLocaleString('ar-SA')})</span>
              </div>

              <div className="flex items-end gap-2 mb-2.5">
                <span className="text-base font-black text-primary-600">{formatPrice(p.price)}</span>
                {p.comparePrice && (
                  <>
                    <span className="text-xs text-primary-300 line-through pb-0.5">{formatPrice(p.comparePrice)}</span>
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{formatDiscount(p.comparePrice, p.price)}</span>
                  </>
                )}
              </div>

              {p.stock < 30 && !isLowStock && (
                <p className="text-[10px] text-primary-600 font-semibold mb-2">
                  ⚠️ {t('card','lowStock').replace('{n}', String(p.stock))}
                </p>
              )}

              <div className="flex gap-1.5 mt-auto">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-2.5 rounded-xl font-black text-[13px] transition-all ${added ? 'bg-emerald-500 text-white scale-95' : 'g-gold text-white hover:shadow-md hover:scale-[1.01]'}`}
                >
                  {added ? t('card','added') : t('card','addToCart')}
                </button>
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(p); toast(inCompare ? t('card','rmvCompare') : t('card','addedCompare')) }}
                  className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-xs transition-all ${inCompare ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-primary-100 text-primary-300 hover:border-primary-300'}`}
                  title={t('card','compare')}
                >⚖️</button>
              </div>
            </div>
          </article>
        </Link>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  )
}
