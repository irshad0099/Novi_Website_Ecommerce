'use client'
import { useEffect, useState } from 'react'
import { useRecentlyViewed } from '@/store/recentlyViewed'
import { useT } from '@/hooks/useT'
import ProductCard from './product/ProductCard'

export default function RecentlyViewed() {
  const [mounted, setMounted] = useState(false)
  const items = useRecentlyViewed(s => s.items)
  const { t } = useT()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || items.length === 0) return null

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-primary-900" style={{ fontFamily: 'Amiri, serif' }}>
            {t('recentlyViewed', 'title')}
          </h2>
          <p className="text-sm text-primary-400">{t('recentlyViewed', 'subtitle')}</p>
        </div>
        <button
          onClick={() => useRecentlyViewed.getState().clear()}
          className="text-xs text-primary-400 hover:text-red-500 transition-colors"
        >
          {t('recentlyViewed', 'clearAll')}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.slice(0, 5).map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
