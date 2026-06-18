'use client'
import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import CompareDrawer from '@/components/product/CompareDrawer'
import ProductCard from '@/components/product/ProductCard'
import { useT } from '@/hooks/useT'
import PRODUCTS, { CATEGORIES } from '@/lib/products'
import Link from 'next/link'

type Props = { params: { slug: string } }

export default function CategoryPage({ params }: Props) {
  const { lang } = useT()
  const cat = CATEGORIES.find(c => c.slug === params.slug)
  const [sort, setSort] = useState('default')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const totalProducts = PRODUCTS.filter(p =>
    params.slug === 'all' ? true : p.category.slug === params.slug
  ).length

  const base = PRODUCTS.filter(p =>
    params.slug === 'all' ? true : p.category.slug === params.slug
  ).filter(p => p.price >= minPrice && p.price <= maxPrice)
    .filter(p => {
      if (activeFilter === 'sale')      return p.comparePrice != null
      if (activeFilter === 'new')       return (p as any).isNewArrival
      if (activeFilter === 'top')       return p.isBestSeller
      if (activeFilter === 'featured')  return p.isFeatured
      return true
    })

  const products = useMemo(() => {
    const arr = [...base]
    if (sort === 'price-asc')  arr.sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') arr.sort((a,b) => b.price - a.price)
    if (sort === 'rating')     arr.sort((a,b) => b.rating - a.rating)
    if (sort === 'popular')    arr.sort((a,b) => b.sold - a.sold)
    if (sort === 'newest')     arr.sort((a,b) => ((b as any).isNewArrival ? 1 : 0) - ((a as any).isNewArrival ? 1 : 0))
    return arr
  }, [base, sort])

  const FilterPanel = () => (
    <div className="space-y-4">
      {/* Price range dual-handle slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary-700">
            {lang === 'ar' ? 'نطاق السعر' : 'Price Range'}
          </span>
          <span className="text-xs font-black text-primary-600">
            {minPrice} – {maxPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}
          </span>
        </div>

        <div className="relative h-6 flex items-center">
          <div className="relative w-full">
            {/* Track background */}
            <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary-100 w-full rounded-full" />
            {/* Active track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full"
              style={{
                left: `${(minPrice / 500) * 100}%`,
                right: `${100 - (maxPrice / 500) * 100}%`,
              }}
            />
            {/* Min handle */}
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={minPrice}
              onChange={e => {
                const v = +e.target.value
                if (v < maxPrice - 10) setMinPrice(v)
              }}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-10
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary-700
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow-md"
            />
            {/* Max handle */}
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={maxPrice}
              onChange={e => {
                const v = +e.target.value
                if (v > minPrice + 10) setMaxPrice(v)
              }}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary-900
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-primary-400">
          <span>٠ ر.س</span>
          <span>٥٠٠ ر.س</span>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-bold text-primary-700 mb-1.5">
          {lang === 'ar' ? 'الترتيب' : 'Sort'}
        </label>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="w-full border-2 border-primary-200 rounded-xl px-3 py-2 text-sm text-primary-700 bg-white focus:outline-none focus:border-primary-400 font-semibold"
        >
          <option value="default">{lang === 'ar' ? 'افتراضي' : 'Default'}</option>
          <option value="price-asc">{lang === 'ar' ? 'السعر: الأقل أولاً' : 'Price: Low to High'}</option>
          <option value="price-desc">{lang === 'ar' ? 'السعر: الأعلى أولاً' : 'Price: High to Low'}</option>
          <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً' : 'Top Rated'}</option>
          <option value="popular">{lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Selling'}</option>
          <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest'}</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => { setMinPrice(0); setMaxPrice(500); setSort('default'); setActiveFilter('all') }}
        className="w-full text-xs font-bold text-primary-500 border border-primary-200 rounded-xl py-2 hover:bg-primary-50 transition-colors"
      >
        {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
      </button>
    </div>
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-nav">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-primary-100 py-3">
          <div className="max-w-screen-xl mx-auto px-4 text-xs text-primary-400 flex items-center gap-2">
            <Link href="/" className="hover:text-primary-700">{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
            <span>›</span>
            <span className="text-primary-800 font-semibold">
              {cat ? (lang === 'en' ? (cat as any).nameEn ?? cat.name : cat.name) : (lang === 'ar' ? 'جميع المنتجات' : 'All Products')}
            </span>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {/* Header row */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>
                {cat ? `${cat.icon} ${lang === 'en' ? (cat as any).nameEn ?? cat.name : cat.name}` : (lang === 'ar' ? '🏠 جميع المنتجات' : '🏠 All Products')}
                <span className="text-primary-400">.</span>
              </h1>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(prev => !prev)}
              className="md:hidden flex items-center gap-2 border-2 border-primary-200 rounded-xl px-4 py-2 text-sm font-bold text-primary-700 bg-white hover:border-primary-400 transition-colors"
            >
              🔧 {lang === 'ar' ? 'فلترة' : 'Filter'}
              <span className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
          </div>

          {/* Mobile filter panel */}
          {mobileFiltersOpen && (
            <div className="md:hidden bg-white rounded-2xl shadow-sm border border-primary-100 p-5 mb-4">
              <FilterPanel />
            </div>
          )}

          {/* Desktop filter bar */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-primary-100 p-5 mb-4">
            <div className="flex flex-wrap gap-6 items-end">
              {/* Price range */}
              <div className="flex-1 min-w-[200px] max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary-700">
                    {lang === 'ar' ? 'نطاق السعر' : 'Price Range'}
                  </span>
                  <span className="text-xs font-black text-primary-600">
                    {minPrice} – {maxPrice} {lang === 'ar' ? 'ر.س' : 'SAR'}
                  </span>
                </div>
                <div className="relative h-6 flex items-center">
                  <div className="relative w-full">
                    <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary-100 w-full rounded-full" />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full"
                      style={{
                        left: `${(minPrice / 500) * 100}%`,
                        right: `${100 - (maxPrice / 500) * 100}%`,
                      }}
                    />
                    <input
                      type="range" min={0} max={500} step={10} value={minPrice}
                      onChange={e => { const v = +e.target.value; if (v < maxPrice - 10) setMinPrice(v) }}
                      className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none z-10
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-primary-700
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-white
                        [&::-webkit-slider-thumb]:shadow-md"
                    />
                    <input
                      type="range" min={0} max={500} step={10} value={maxPrice}
                      onChange={e => { const v = +e.target.value; if (v > minPrice + 10) setMaxPrice(v) }}
                      className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none
                        [&::-webkit-slider-thumb]:pointer-events-auto
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-primary-900
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-white
                        [&::-webkit-slider-thumb]:shadow-md"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-primary-400">
                  <span>٠</span>
                  <span>٥٠٠ ر.س</span>
                </div>
              </div>

              {/* Sort select */}
              <div>
                <label className="block text-xs font-bold text-primary-700 mb-1.5">
                  {lang === 'ar' ? 'الترتيب' : 'Sort By'}
                </label>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="border-2 border-primary-200 rounded-xl px-3 py-2 text-sm text-primary-700 bg-white focus:outline-none focus:border-primary-400 font-semibold">
                  <option value="default">{lang === 'ar' ? 'ترتيب افتراضي' : 'Default'}</option>
                  <option value="price-asc">{lang === 'ar' ? 'السعر: الأقل أولاً' : 'Price: Low to High'}</option>
                  <option value="price-desc">{lang === 'ar' ? 'السعر: الأعلى أولاً' : 'Price: High to Low'}</option>
                  <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً' : 'Top Rated'}</option>
                  <option value="popular">{lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Selling'}</option>
                  <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest'}</option>
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() => { setMinPrice(0); setMaxPrice(500); setSort('default'); setActiveFilter('all') }}
                className="text-xs font-bold text-primary-500 border border-primary-200 rounded-xl px-4 py-2 hover:bg-primary-50 transition-colors"
              >
                {lang === 'ar' ? 'إعادة ضبط' : 'Reset'}
              </button>
            </div>
          </div>

          {/* Quick filter chips */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all',      label: lang === 'ar' ? '🏠 الكل'        : '🏠 All' },
              { id: 'sale',     label: lang === 'ar' ? '🔥 تخفيضات'    : '🔥 On Sale' },
              { id: 'new',      label: lang === 'ar' ? '✨ جديد'        : '✨ New' },
              { id: 'top',      label: lang === 'ar' ? '⭐ الأكثر مبيعاً' : '⭐ Best Sellers' },
              { id: 'featured', label: lang === 'ar' ? '💛 مميز'        : '💛 Featured' },
            ].map(f => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border-2 transition-all flex-shrink-0
                  ${activeFilter === f.id ? 'bg-primary-900 text-primary-200 border-primary-900' : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/category/all"
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border-2 transition-all ${params.slug === 'all' ? 'bg-primary-900 text-primary-200 border-primary-900' : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400'}`}>
              {lang === 'ar' ? '🏠 الكل' : '🏠 All'}
            </Link>
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={`/category/${c.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border-2 transition-all ${params.slug === c.slug ? 'bg-primary-900 text-primary-200 border-primary-900' : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400'}`}>
                {c.icon} {lang === 'en' ? (c as any).nameEn ?? c.name : c.name}
              </Link>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-primary-500 font-semibold mb-4">
            {lang === 'ar'
              ? `يعرض ${products.length} من ${totalProducts} منتج`
              : `Showing ${products.length} of ${totalProducts} products`
            }
          </p>

          {products.length === 0 ? (
            <div className="text-center py-20 text-primary-400">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg font-bold text-primary-700 mb-2">{lang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p>
              <p className="text-sm mb-4">{lang === 'ar' ? 'جرّب تعديل نطاق السعر أو اختر فئة أخرى' : 'Try adjusting the price range or choose another category'}</p>
              <Link href="/category/all" className="g-gold text-white font-black px-6 py-2.5 rounded-full text-sm">
                {lang === 'ar' ? 'عرض الكل' : 'View All'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <CompareDrawer />
      <Footer />
      <BottomNav />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  )
}
