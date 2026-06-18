'use client'
import { useCompare } from '@/store/compare'
import { useT } from '@/hooks/useT'
import { formatPrice } from '@/lib/format'
import Link from 'next/link'

export default function CompareDrawer() {
  const { items, remove, clear } = useCompare()
  const { t, lang } = useT()
  if (items.length === 0) return null

  const rows = [
    { labelKey: 'price',    val: (p: typeof items[0]) => formatPrice(p.price) },
    { labelKey: 'rating',   val: (p: typeof items[0]) => '★'.repeat(Math.round(p.rating)) + ` (${p.reviewCount})` },
    { labelKey: 'category', val: (p: typeof items[0]) => lang === 'en' ? ((p.category as any).nameEn ?? p.category.name) : p.category.name },
    { labelKey: 'stock',    val: (p: typeof items[0]) => p.stock > 0
      ? `${p.stock} ${t('compare','units')}`
      : t('compare','outOfStock')
    },
  ]

  return (
    <div
      className="fixed left-0 right-0 z-50 bg-white border-t-2 border-primary-200 shadow-2xl bottom-[64px] md:bottom-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="font-black text-primary-900 text-sm">{t('compare','title')} ({items.length}/3)</span>
          <button onClick={clear} className="text-xs text-red-500 font-bold hover:underline">{t('compare','clearAll')}</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr>
                <td className="text-primary-400 text-xs w-24 pb-2" />
                {items.map(p => (
                  <td key={p.id} className="pb-2 text-center">
                    <div className="relative inline-block">
                      <img src={p.images[0]} alt={p.name} className="w-14 h-14 object-cover rounded-xl mx-auto" />
                      <button
                        onClick={() => remove(p.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center"
                      >✕</button>
                    </div>
                    <p className="text-[11px] font-bold text-primary-800 mt-1 max-w-[90px] mx-auto line-clamp-2">
                      {lang === 'en' ? ((p as any).nameEn ?? p.name) : p.name}
                    </p>
                  </td>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td key={i} className="pb-2 text-center">
                    <div className="w-14 h-14 border-2 border-dashed border-primary-200 rounded-xl mx-auto flex items-center justify-center text-primary-300 text-xl">+</div>
                    <p className="text-[11px] text-primary-300 mt-1">{t('compare','addProduct')}</p>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ labelKey, val }) => (
                <tr key={labelKey} className="border-t border-primary-50">
                  <td className="py-1.5 text-xs text-primary-500 font-bold">{t('compare', labelKey)}</td>
                  {items.map(p => (
                    <td key={p.id} className="py-1.5 text-center text-xs text-primary-800 font-bold">{val(p)}</td>
                  ))}
                  {Array.from({ length: 3 - items.length }).map((_, i) => (
                    <td key={i} className="py-1.5 text-center text-primary-200">—</td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-primary-50">
                <td className="pt-2" />
                {items.map(p => (
                  <td key={p.id} className="pt-2 text-center">
                    <Link
                      href={`/products/${p.slug}`}
                      className="inline-block text-[11px] font-black g-gold text-white px-3 py-1.5 rounded-lg"
                    >
                      {t('compare','view')}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
