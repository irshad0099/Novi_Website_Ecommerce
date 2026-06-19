'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import Link from 'next/link'
import Image from 'next/image'

const POSTS = [
  {
    slug: 'tissue-skin-care',
    titleAr: '٥ أسباب تجعل مناديل NOVI الأفضل للبشرة الحساسة',
    category: 'skin-care',
    readTime: 3,
    img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80',
    excerpt: 'اكتشف لماذا تختار آلاف الأمهات السعوديات مناديلنا للعناية بالبشرة الحساسة',
    date: '١٥ مايو ٢٠٢٥',
  },
  {
    slug: 'how-to-choose-tissue',
    titleAr: 'كيف تختار المناديل المناسبة لمنزلك؟',
    category: 'home',
    readTime: 5,
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    excerpt: 'دليل شامل لاختيار أفضل أنواع المناديل لكل غرفة في منزلك',
    date: '٢٠ مايو ٢٠٢٥',
  },
  {
    slug: 'tissue-eco-friendly',
    titleAr: 'المناديل الصديقة للبيئة — لماذا مهمة؟',
    category: 'health',
    readTime: 4,
    img: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600&q=80',
    excerpt: 'تعرف على أثر اختياراتك اليومية على البيئة وكيف تساهم في حمايتها',
    date: '٢٥ مايو ٢٠٢٥',
  },
  {
    slug: 'tissue-decoration',
    titleAr: 'أفكار إبداعية لتزيين المنزل بعلب المناديل',
    category: 'home',
    readTime: 6,
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    excerpt: 'حوّل علب المناديل إلى قطع ديكور جميلة بأفكار بسيطة وإبداعية',
    date: '١ يونيو ٢٠٢٥',
  },
  {
    slug: 'baby-tissue-guide',
    titleAr: 'دليل اختيار المناديل للأطفال الرضّع',
    category: 'health',
    readTime: 4,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
    excerpt: 'كل ما تحتاج معرفته قبل اختيار المناديل المثالية لطفلك الرضيع',
    date: '٥ يونيو ٢٠٢٥',
  },
  {
    slug: 'bulk-saving-tips',
    titleAr: 'كيف توفر أكثر عند شراء المناديل بالجملة؟',
    category: 'offers',
    readTime: 3,
    img: 'https://images.unsplash.com/photo-1578895101003-571866c7d3c6?w=600&q=80',
    excerpt: 'نصائح ذكية لتوفير المال عند شراء المناديل بكميات كبيرة',
    date: '١٠ يونيو ٢٠٢٥',
  },
]

const categoryFilters = [
  { id: 'all', label: 'كل المقالات' },
  { id: 'health', label: 'نصائح صحية' },
  { id: 'skin-care', label: 'العناية بالبشرة' },
  { id: 'home', label: 'منزل وديكور' },
  { id: 'offers', label: 'عروض وأخبار' },
]

const categoryColors: Record<string, string> = {
  health: 'bg-green-100 text-green-800',
  'skin-care': 'bg-pink-100 text-pink-800',
  home: 'bg-amber-100 text-amber-800',
  offers: 'bg-blue-100 text-blue-800',
}

const categoryLabels: Record<string, string> = {
  health: 'نصائح صحية',
  'skin-care': 'العناية بالبشرة',
  home: 'منزل وديكور',
  offers: 'عروض وأخبار',
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-nav" dir="rtl">

        {/* Page header */}
        <div className="g-gold text-white py-14 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-3">📰</div>
            <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: 'Amiri,serif' }}>
              مدونة NOVI
            </h1>
            <p className="text-white/70 text-sm max-w-md mx-auto leading-relaxed">
              نصائح وأفكار حول العناية بالمنزل والصحة والتميز اليومي
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-primary-100 py-3">
          <div className="max-w-screen-xl mx-auto px-4 text-xs text-primary-400 flex items-center gap-2">
            <Link href="/" className="hover:text-primary-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-primary-800 font-semibold">المدونة</span>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-10">

          {/* Category filter chips */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categoryFilters.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveCategory(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border-2 transition-all flex-shrink-0
                  ${activeCategory === f.id
                    ? 'bg-primary-900 text-white border-primary-900'
                    : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-primary-400 mb-5 font-semibold">
            {filtered.length} {filtered.length === 1 ? 'مقال' : 'مقالات'}
          </p>

          {/* Posts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-primary-100">
                  <img
                    src={post.img}
                    alt={post.titleAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category badge */}
                  <span className={`absolute top-3 right-3 text-xs font-black px-2.5 py-1 rounded-full ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-700'}`}>
                    {categoryLabels[post.category] ?? post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-black text-primary-900 text-base leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.titleAr}
                  </h3>
                  <p className="text-xs text-primary-500 leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-primary-400">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <span>⏱</span>
                      {post.readTime} دقائق قراءة
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-black text-primary-700 text-lg mb-2">لا توجد مقالات في هذا القسم</p>
              <button onClick={() => setActiveCategory('all')} className="text-sm font-bold text-primary-500 underline underline-offset-2">
                عرض جميع المقالات
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  )
}
