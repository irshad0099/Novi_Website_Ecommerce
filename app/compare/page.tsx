'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import { useCompare } from '@/store/compare'
import { useCart } from '@/store/cart'

export default function ComparePage() {
  const { items, remove, clear } = useCompare()
  const { addItem } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-primary-50 py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <div className="text-8xl mb-6">⚖️</div>
            <h1 className="text-2xl font-black text-primary-900 mb-3">لا توجد منتجات للمقارنة</h1>
            <p className="text-primary-400 mb-8">مقارنة منتجين على الأقل — أضف منتجات من المتجر</p>
            <Link href="/category/all" className="g-gold text-white font-black px-8 py-3.5 rounded-full inline-block shadow-md hover:shadow-lg transition-shadow">
              تصفح المنتجات →
            </Link>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </>
    )
  }

  // Build all the feature keys across all compared products
  const allFeatures = Array.from(
    new Set(items.flatMap(p => p.features))
  )

  const lowestPrice = Math.min(...items.map(p => p.price))
  const highestRating = Math.max(...items.map(p => p.rating))

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 py-8">
        <div className="max-w-screen-xl mx-auto px-4">

          {/* Page header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-primary-900">⚖️ مقارنة المنتجات</h1>
              <p className="text-sm text-primary-400 mt-1">مقارنة {items.length} منتجات</p>
            </div>
            <div className="flex gap-3">
              <button onClick={clear} className="px-4 py-2 border border-red-200 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors">
                مسح الكل
              </button>
              <Link href="/category/all" className="px-4 py-2 g-gold text-white text-sm font-bold rounded-xl hover:shadow-md transition-shadow">
                + إضافة منتج
              </Link>
            </div>
          </div>

          {/* Compare table */}
          <div className="overflow-x-auto rounded-2xl border border-primary-100 shadow-sm">
            <table className="w-full border-collapse bg-white min-w-[600px]">
              <colgroup>
                {/* Label column */}
                <col className="w-36" />
                {items.map(p => <col key={p.id} />)}
              </colgroup>

              {/* ── Product Images Row ── */}
              <thead>
                <tr>
                  <th className="sticky right-0 bg-white z-10 px-4 py-4 text-right border-b border-primary-100 border-l border-l-primary-100">
                    <span className="text-xs font-black text-primary-400 uppercase tracking-widest">المنتج</span>
                  </th>
                  {items.map(p => (
                    <th key={p.id} className="px-4 py-4 border-b border-primary-100 border-l border-l-primary-50 last:border-l-0 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-24 h-24 object-cover rounded-xl border border-primary-100"
                          />
                          <button
                            onClick={() => remove(p.id)}
                            className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        <Link
                          href={`/products/${p.slug}`}
                          className="text-sm font-black text-primary-900 hover:text-primary-600 transition-colors text-center leading-tight line-clamp-2"
                        >
                          {p.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* ── Price Row ── */}
                <tr className="bg-primary-50/40">
                  <td className="sticky right-0 bg-primary-50/80 z-10 px-4 py-3 border-b border-primary-100 border-l border-l-primary-100">
                    <span className="text-xs font-black text-primary-600">السعر</span>
                  </td>
                  {items.map(p => (
                    <td key={p.id} className="px-4 py-3 border-b border-primary-100 border-l border-l-primary-50 last:border-l-0 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-lg font-black ${p.price === lowestPrice ? 'text-emerald-600' : 'text-primary-700'}`}>
                          {p.price.toFixed(2)} ر.س
                        </span>
                        {p.price === lowestPrice && items.length > 1 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full">الأقل سعراً ✓</span>
                        )}
                        {p.comparePrice && (
                          <span className="text-xs text-primary-300 line-through">{p.comparePrice.toFixed(2)} ر.س</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* ── Rating Row ── */}
                <tr>
                  <td className="sticky right-0 bg-white z-10 px-4 py-3 border-b border-primary-100 border-l border-l-primary-100">
                    <span className="text-xs font-black text-primary-600">التقييم</span>
                  </td>
                  {items.map(p => (
                    <td key={p.id} className="px-4 py-3 border-b border-primary-100 border-l border-l-primary-50 last:border-l-0 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 justify-center">
                          <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(p.rating))}{'☆'.repeat(5 - Math.floor(p.rating))}</span>
                        </div>
                        <span className={`text-sm font-black ${p.rating === highestRating ? 'text-emerald-600' : 'text-primary-700'}`}>
                          {p.rating}
                        </span>
                        <span className="text-xs text-primary-400">({p.reviewCount} تقييم)</span>
                        {p.rating === highestRating && items.length > 1 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full">الأعلى تقييماً ✓</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* ── Stock Row ── */}
                <tr className="bg-primary-50/40">
                  <td className="sticky right-0 bg-primary-50/80 z-10 px-4 py-3 border-b border-primary-100 border-l border-l-primary-100">
                    <span className="text-xs font-black text-primary-600">المخزون</span>
                  </td>
                  {items.map(p => (
                    <td key={p.id} className="px-4 py-3 border-b border-primary-100 border-l border-l-primary-50 last:border-l-0 text-center">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        p.stock === 0
                          ? 'bg-red-100 text-red-600'
                          : p.stock < 50
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {p.stock === 0 ? 'نفد المخزون' : p.stock < 50 ? `${p.stock} قطعة فقط` : `${p.stock} متوفر`}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* ── Category Row ── */}
                <tr>
                  <td className="sticky right-0 bg-white z-10 px-4 py-3 border-b border-primary-100 border-l border-l-primary-100">
                    <span className="text-xs font-black text-primary-600">التصنيف</span>
                  </td>
                  {items.map(p => (
                    <td key={p.id} className="px-4 py-3 border-b border-primary-100 border-l border-l-primary-50 last:border-l-0 text-center">
                      <Link href={`/category/${p.category.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-900 bg-primary-50 px-3 py-1.5 rounded-full transition-colors">
                        {p.category.icon} {p.category.name}
                      </Link>
                    </td>
                  ))}
                </tr>

                {/* ── Features Rows (one row per feature) ── */}
                {allFeatures.map((feature, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-primary-50/40' : ''}>
                    <td className={`sticky right-0 z-10 px-4 py-3 border-b border-primary-100 border-l border-l-primary-100 ${idx % 2 === 0 ? 'bg-primary-50/80' : 'bg-white'}`}>
                      <span className="text-xs font-black text-primary-600">ميزة {idx + 1}</span>
                    </td>
                    {items.map(p => (
                      <td key={p.id} className="px-4 py-3 border-b border-primary-100 border-l border-l-primary-50 last:border-l-0 text-center">
                        {p.features.includes(feature) ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-emerald-500 font-black text-base">✓</span>
                            <span className="text-xs text-primary-600 leading-snug">{feature}</span>
                          </div>
                        ) : (
                          <span className="text-primary-200 font-black text-base">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* ── Add to Cart Row ── */}
                <tr>
                  <td className="sticky right-0 bg-white z-10 px-4 py-4 border-l border-l-primary-100">
                    <span className="text-xs font-black text-primary-600">الإجراء</span>
                  </td>
                  {items.map(p => (
                    <td key={p.id} className="px-4 py-4 border-l border-l-primary-50 last:border-l-0 text-center">
                      {p.stock > 0 ? (
                        <button
                          onClick={() => {
                            addItem(p)
                          }}
                          className="w-full g-gold text-white font-black text-sm py-2.5 px-4 rounded-xl hover:shadow-md transition-shadow"
                        >
                          🛒 أضف للسلة
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-primary-300 bg-primary-50 px-4 py-2.5 rounded-xl inline-block w-full">
                          نفد المخزون
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link href="/category/all" className="inline-flex items-center gap-2 text-primary-500 font-bold text-sm hover:text-primary-700 transition-colors">
              ← العودة لتصفح المنتجات
            </Link>
          </div>

        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
