'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import ProductCard from '@/components/product/ProductCard'
import PRODUCTS from '@/lib/products'

function SearchResults() {
  const params = useSearchParams()
  const router = useRouter()
  const q = params.get('q') || ''
  const [input, setInput] = useState(q)

  useEffect(() => { setInput(q) }, [q])

  const results = q.trim()
    ? PRODUCTS.filter(p =>
        p.name.includes(q) ||
        p.description.includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.category.name.includes(q) ||
        p.nameEn.toLowerCase().includes(q.toLowerCase())
      )
    : []

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) router.push(`/search?q=${encodeURIComponent(input.trim())}`)
  }

  return (
    <main className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className="text-2xl font-black text-primary-900 mb-5">🔍 نتائج البحث</h1>

        {/* Search box */}
        <form onSubmit={submit} className="flex gap-3 max-w-xl mb-8">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="ابحث عن مناديل، مناشف..." className="flex-1 px-4 py-3 border-2 border-primary-200 rounded-2xl text-sm bg-white text-primary-900 focus:outline-none focus:border-primary-400" />
          <button type="submit" className="g-gold text-primary-900 font-black px-6 py-3 rounded-2xl shadow-md">بحث</button>
        </form>

        {q ? (
          <>
            <p className="text-primary-500 text-sm mb-5">
              {results.length > 0 ? `${results.length} نتيجة لـ "${q}"` : `لا توجد نتائج لـ "${q}"`}
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-primary-100">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-black text-primary-700 mb-2">لا توجد نتائج</p>
                <p className="text-primary-400 text-sm mb-6">جرّب كلمات مختلفة مثل: مناديل، مبللة، مناشف</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['مناديل','مبللة','مناشف','صبار','أطفال','بامبو','ماكسي'].map(tag => (
                    <button key={tag} onClick={() => router.push(`/search?q=${tag}`)} className="px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-sm font-semibold text-primary-600 hover:border-primary-400 transition-colors">
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
              {['مناديل كلاسيك','مبللة أطفال','مناشف قطنية','بامبو','بكج توفير','ماكسي'].map(tag => (
                <button key={tag} onClick={() => router.push(`/search?q=${tag}`)} className="px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-sm font-semibold text-primary-600 hover:border-primary-400 transition-colors">
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
