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

// Tissue/napkin usage images — all 100% napkin/tissue in real context
const USAGE_IMGS: Record<string, string[]> = {
  'face-tissue': [
    'https://images.unsplash.com/photo-1584651772793-d555266cce99?w=600&q=90', // tissue box on desk
    'https://images.unsplash.com/photo-1708337338728-9fe34ccb91b4?w=600&q=90', // tissue dispenser
    'https://images.unsplash.com/photo-1607516531499-9e57ef94a9d9?w=600&q=90', // floral tissue box on table
    'https://images.unsplash.com/photo-1746351635660-67a0c51f5c6f?w=600&q=90', // tissue box lifestyle
    'https://images.unsplash.com/photo-1609840112990-4265448268d1?w=600&q=90', // tissue box clear
  ],
  'wet-wipes': [
    'https://images.unsplash.com/photo-1584743578805-d7991ca2d5d4?w=600&q=90', // wipes pack open
    'https://images.unsplash.com/photo-1734599395438-1ec2a861ed8d?w=600&q=90', // organic wipes lifestyle
    'https://images.unsplash.com/photo-1584109807991-ebfcd80112a8?w=600&q=90', // tissue roll blue bg
    'https://images.unsplash.com/photo-1620778864482-5f20e3d9745a?w=600&q=90', // paper roll texture
  ],
  'kitchen': [
    'https://images.unsplash.com/photo-1598046937985-11c320dfd379?w=600&q=90', // tissue roll white
    'https://images.unsplash.com/photo-1585690359409-9020f3602bdb?w=600&q=90', // multiple paper rolls
    'https://images.unsplash.com/photo-1583496597467-d968d2fa33a8?w=600&q=90', // toilet paper white table
    'https://images.unsplash.com/photo-1620778864482-5f20e3d9745a?w=600&q=90', // paper roll texture
  ],
  'cotton-towels': [
    'https://images.unsplash.com/photo-1583496597467-d968d2fa33a8?w=600&q=90', // white cotton rolls on table
    'https://images.unsplash.com/photo-1585690359409-9020f3602bdb?w=600&q=90', // white paper rolls stacked
    'https://images.unsplash.com/photo-1598046937985-11c320dfd379?w=600&q=90', // towel roll white
    'https://images.unsplash.com/photo-1620778864482-5f20e3d9745a?w=600&q=90', // paper texture close
  ],
  'pocket': [
    'https://images.unsplash.com/photo-1746351635660-67a0c51f5c6f?w=600&q=90', // pocket tissue pack
    'https://images.unsplash.com/photo-1607516531499-9e57ef94a9d9?w=600&q=90', // tissue pack lifestyle
    'https://images.unsplash.com/photo-1584651772793-d555266cce99?w=600&q=90', // tissue on table
  ],
  'specialty': [
    'https://images.unsplash.com/photo-1607516531499-9e57ef94a9d9?w=600&q=90', // decorative tissue box
    'https://images.unsplash.com/photo-1746351635660-67a0c51f5c6f?w=600&q=90', // premium tissue
    'https://images.unsplash.com/photo-1584651772793-d555266cce99?w=600&q=90', // tissue on wood desk
  ],
  'bundles': [
    'https://images.unsplash.com/photo-1585690359409-9020f3602bdb?w=600&q=90', // multiple rolls stacked
    'https://images.unsplash.com/photo-1583496597467-d968d2fa33a8?w=600&q=90', // tissue rolls on table
    'https://images.unsplash.com/photo-1598046937985-11c320dfd379?w=600&q=90', // tissue roll bundle
    'https://images.unsplash.com/photo-1584109807991-ebfcd80112a8?w=600&q=90', // tissue pack blue bg
  ],
}

const USAGE_LABEL: Record<string, string> = {
  'face-tissue': 'مناديل الوجه • على الطاولة',
  'wet-wipes': 'مناديل مبللة • للاستخدام اليومي',
  'kitchen': 'مناشف المطبخ • في المطبخ',
  'cotton-towels': 'مناشف قطنية • للاستخدام المنزلي',
  'pocket': 'مناديل الجيب • في أي مكان',
  'specialty': 'منتجات خاصة',
  'bundles': 'بكجات التوفير • للمنزل',
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
  const [flipped, setFlipped] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const catImgs = USAGE_IMGS[p.category.slug] ?? []
  const usageSrc = catImgs.length > 0 ? catImgs[p.id % catImgs.length] : p.images[1]
  const usageLabel = USAGE_LABEL[p.category.slug] ?? ''
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

  const isLowStock = p.stock > 0 && p.stock < 20

  return (
    <>
      <div className="group block relative" style={{ borderRadius: 16 }}>
        <Link href={`/products/${p.slug}`} className="block">
          <article className="glass-card rounded-2xl overflow-hidden hover:border-primary-300 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">

            {/* ── IMAGE SECTION with hover swap ── */}
            <div
              className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100"
              style={{ aspectRatio: '1/1' }}
              onMouseEnter={() => setFlipped(true)}
              onMouseLeave={() => setFlipped(false)}
            >
              {/* ── FRONT: product image ── */}
              {!imgErr ? (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: flipped ? 0 : 1,
                    transform: flipped ? 'scale(1.07)' : 'scale(1)',
                    transition: 'opacity 0.42s ease, transform 0.42s ease',
                  }}
                  onError={() => setImgErr(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-6xl">🧻</div>
              )}

              {/* ── BACK: usage image — slides up from bottom ── */}
              <div
                className="absolute inset-0"
                style={{
                  opacity: flipped ? 1 : 0,
                  transform: flipped ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.42s ease, transform 0.42s ease',
                  pointerEvents: flipped ? 'auto' : 'none',
                }}
              >
                <img
                  src={usageSrc}
                  alt={`${p.name} — في الاستخدام`}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/10 to-transparent" />
                {/* Top tags */}
                <div className="absolute top-2.5 right-2.5 left-2.5 flex justify-between items-center">
                  <span className="bg-white/95 text-primary-900 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">NOVI</span>
                  <span className="bg-primary-700/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">كيفية الاستخدام</span>
                </div>
                {/* Bottom label */}
                <div className="absolute bottom-10 right-0 left-0 px-3">
                  <p className="text-white font-black text-[11px] leading-tight mb-1 drop-shadow-lg">
                    {displayName.length > 26 ? displayName.slice(0, 26) + '…' : displayName}
                  </p>
                  <p className="text-primary-200 text-[10px]">{usageLabel}</p>
                </div>
                {/* Quick view */}
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(p) }}
                  className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm border border-white/40 text-white text-[10px] font-black px-4 py-1.5 rounded-full hover:bg-white/35 transition-colors whitespace-nowrap"
                >
                  👁 عرض سريع
                </button>
              </div>

              {/* ── Shared overlays (always on top of both images) ── */}
              {/* Badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 z-10" style={{ opacity: flipped ? 0 : 1, transition: 'opacity 0.2s' }}>
                {p.badge && <span className={`text-[10px] font-black px-2 py-1 rounded-full shadow-sm ${BADGE_STYLES[p.badge.color]}`}>{p.badge.label}</span>}
                {(p as any).isNewArrival && !p.badge && <span className="text-[10px] font-black px-2 py-1 rounded-full bg-blue-100 text-blue-700 shadow-sm">{t('card','new')}</span>}
              </div>

              {/* Wishlist */}
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); toast(liked ? '🤍' : '❤️') }}
                className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all shadow-sm ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-primary-100 text-primary-300 hover:text-red-400'}`}
              >
                <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>

              {/* Hover hint — shows before flip */}
              <div
                className="absolute bottom-0 inset-x-0 py-2 bg-gradient-to-t from-primary-900/65 to-transparent flex items-center justify-center z-10"
                style={{ opacity: flipped ? 0 : 1, transition: 'opacity 0.25s' }}
              >
                <span className="text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  🖼 اعرف كيف يُستخدم
                </span>
              </div>

              {/* Sold / Low stock */}
              {p.sold > 5000 && !flipped && (
                <div className="absolute bottom-8 right-2 z-10 bg-black/55 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  🔥 {t('card','sold').replace('{n}', p.sold.toLocaleString('en'))}
                </div>
              )}
              {isLowStock && !flipped && (
                <div className="absolute bottom-8 left-2 z-10">
                  <span className="flex items-center gap-0.5 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md stock-urgent">
                    ⚡ {p.stock < 6 ? `آخر ${p.stock}!` : `${p.stock} فقط!`}
                  </span>
                </div>
              )}
            </div>

            {/* ── CARD BODY ── */}
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
