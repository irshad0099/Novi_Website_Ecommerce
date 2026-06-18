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
  const [priceMax, setPriceMax] = useState(500)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const base = PRODUCTS.filter(p =>
    params.slug === 'all' ? true : p.category.slug === params.slug
  ).filter(p => p.price <= priceMax)
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
              <p className="text-primary-400 text-sm mt-1">
                {products.length} {lang === 'ar' ? 'منتج متاح' : 'products'}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-primary-600">
                <span className="font-semibold">{lang === 'ar' ? 'السعر:' : 'Price:'}</span>
                <span className="font-black text-primary-500">{lang === 'ar' ? `حتى ${priceMax} ر.س` : `Up to ${priceMax} SAR`}</span>
                <input type="range" min={10} max={500} step={10} value={priceMax}
                  onChange={e => setPriceMax(+e.target.value)}
                  className="w-24 accent-primary-600" />
              </div>
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
          </div>

          {/* Quick filter chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
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
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
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

          {products.length === 0 ? (
            <div className="text-center py-20 text-primary-400">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg font-bold text-primary-700 mb-2">{lang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p>
              <p className="text-sm mb-4">{lang === 'ar' ? 'جرّب تغيير السعر الأقصى أو اختر فئة أخرى' : 'Try adjusting the price or choose another category'}</p>
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
