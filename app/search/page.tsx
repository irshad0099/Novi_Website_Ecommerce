'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import ProductCard from '@/components/product/ProductCard'
import PRODUCTS, { CATEGORIES } from '@/lib/products'

function SearchResults() {
  const params = useSearchParams()
  const router = useRouter()
  const q = params.get('q') || ''
  const [input, setInput] = useState(q)
  const [sort, setSort] = useState('default')
  const [catFilter, setCatFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  useEffect(() => {
    setInput(q)
    // Reset filters when query changes
    setSort('default')
    setCatFilter('all')
    setPriceRange('all')
  }, [q])

  const results = q.trim()
    ? PRODUCTS.filter(p =>
        p.name.includes(q) ||
        p.description.includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.category.name.includes(q) ||
        p.nameEn.toLowerCase().includes(q.toLowerCase())
      )
    : []

  // Apply category + price filters
  let filtered = results
    .filter(p => catFilter === 'all' || p.category.slug === catFilter)
    .filter(p => {
      if (priceRange === 'under50') return p.price < 50
      if (priceRange === '50-100') return p.price >= 50 && p.price <= 100
      if (priceRange === '100-200') return p.price >= 100 && p.price <= 200
      if (priceRange === 'over200') return p.price > 200
      return true
    })

  // Apply sort
  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  if (sort === 'popular') filtered = [...filtered].sort((a, b) => b.sold - a.sold)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) router.push(`/search?q=${encodeURIComponent(input.trim())}`)
  }

  const priceRangeButtons = [
    { id: 'under50', label: 'أقل من ٥٠ ر.س' },
    { id: '50-100', label: '٥٠–١٠٠ ر.س' },
    { id: '100-200', label: '١٠٠–٢٠٠ ر.س' },
    { id: 'over200', label: 'أكثر من ٢٠٠ ر.س' },
  ]

  return (
    <main className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className="text-2xl font-black text-primary-900 mb-5">🔍 نتائج البحث</h1>

        {/* Search box */}
        <form onSubmit={submit} className="flex gap-3 max-w-xl mb-8">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="ابحث عن مناديل، مناشف..."
            className="flex-1 px-4 py-3 border-2 border-primary-200 rounded-2xl text-sm bg-white text-primary-900 focus:outline-none focus:border-primary-400"
          />
          <button type="submit" className="g-gold text-white font-black px-6 py-3 rounded-2xl shadow-md">بحث</button>
        </form>

        {q ? (
          <>
            {/* ── Filter & Sort Bar (only when there are results) ── */}
            {results.length > 0 && (
              <div className="bg-white border border-primary-100 rounded-2xl p-4 mb-6 space-y-4">

                {/* Top row: Sort + count */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <p className="text-sm font-bold text-primary-600">
                    يعرض{' '}
                    <span className="text-primary-900 font-black">{filtered.length}</span>
                    {' '}من{' '}
                    <span className="text-primary-900 font-black">{results.length}</span>
                    {' '}نتيجة لـ "{q}"
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-primary-500">ترتيب حسب:</label>
                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      className="px-3 py-2 border border-primary-200 rounded-xl text-sm text-primary-800 bg-white focus:outline-none focus:border-primary-400"
                    >
                      <option value="default">الافتراضي</option>
                      <option value="popular">الأكثر مبيعاً</option>
                      <option value="price-asc">السعر تصاعدي</option>
                      <option value="price-desc">السعر تنازلي</option>
                      <option value="rating">التقييم</option>
                    </select>
                  </div>
                </div>

                {/* Category chips */}
                <div>
                  <p className="text-xs font-black text-primary-400 mb-2">التصنيف:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCatFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        catFilter === 'all'
                          ? 'g-gold text-white'
                          : 'bg-primary-50 border border-primary-200 text-primary-600 hover:border-primary-400'
                      }`}
                    >
                      الكل
                    </button>
                    {CATEGORIES.map(c => (
                      <button
                        key={c.slug}
                        onClick={() => setCatFilter(c.slug)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                          catFilter === c.slug
                            ? 'g-gold text-white'
                            : 'bg-primary-50 border border-primary-200 text-primary-600 hover:border-primary-400'
                        }`}
                      >
                        {c.icon} {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range buttons */}
                <div>
                  <p className="text-xs font-black text-primary-400 mb-2">نطاق السعر:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPriceRange('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        priceRange === 'all'
                          ? 'g-gold text-white'
                          : 'bg-primary-50 border border-primary-200 text-primary-600 hover:border-primary-400'
                      }`}
                    >
                      كل الأسعار
                    </button>
                    {priceRangeButtons.map(pr => (
                      <button
                        key={pr.id}
                        onClick={() => setPriceRange(pr.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                          priceRange === pr.id
                            ? 'g-gold text-white'
                            : 'bg-primary-50 border border-primary-200 text-primary-600 hover:border-primary-400'
                        }`}
                      >
                        {pr.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : results.length > 0 ? (
              /* Results exist but filtered to zero */
              <div className="text-center py-12 bg-white rounded-3xl border border-primary-100">
                <div className="text-5xl mb-4">🔎</div>
                <p className="text-lg font-black text-primary-700 mb-2">لا توجد نتائج بهذه الفلاتر</p>
                <p className="text-primary-400 text-sm mb-5">جرّب تغيير الفلاتر أو إزالتها</p>
                <button
                  onClick={() => { setCatFilter('all'); setPriceRange('all'); setSort('default') }}
                  className="px-6 py-2.5 g-gold text-white font-bold rounded-xl text-sm hover:shadow-md transition-shadow"
                >
                  إزالة كل الفلاتر
                </button>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-primary-100">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-black text-primary-700 mb-2">لا توجد نتائج</p>
                <p className="text-primary-400 text-sm mb-6">جرّب كلمات مختلفة مثل: مناديل، مبللة، مناشف</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['مناديل', 'مبللة', 'مناشف', 'صبار', 'أطفال', 'بامبو', 'ماكسي'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => router.push(`/search?q=${tag}`)}
                      className="px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-sm font-semibold text-primary-600 hover:border-primary-400 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-primary-100">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-black text-primary-700 mb-5">ابحث عن منتجاتك المفضلة</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['مناديل كلاسيك', 'مبللة أطفال', 'مناشف قطنية', 'بامبو', 'بكج توفير', 'ماكسي'].map(tag => (
                <button
                  key={tag}
                  onClick={() => router.push(`/search?q=${tag}`)}
                  className="px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-sm font-semibold text-primary-600 hover:border-primary-400 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-primary-50 flex items-center justify-center"><p className="text-primary-400">جاري البحث...</p></div>}>
        <SearchResults />
      </Suspense>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  )
}
