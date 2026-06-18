import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import ProductDetails from '@/components/product/ProductDetails'
import ImageZoom from '@/components/product/ImageZoom'
import ReviewsSection from '@/components/product/ReviewsSection'
import RecentlyViewedTracker from '@/components/product/RecentlyViewedTracker'
import CompareDrawer from '@/components/product/CompareDrawer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import PRODUCTS from '@/lib/products'
import Link from 'next/link'

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

type Props = { params: { slug: string } }

export default function ProductPage({ params }: Props) {
  const p = PRODUCTS.find(x => x.slug === params.slug)
  if (!p) notFound()

  const related = PRODUCTS.filter(x => x.category.slug === p.category.slug && x.id !== p.id).slice(0, 4)

  return (
    <>
      <Header />
      <RecentlyViewedTracker product={p} />
      <main className="min-h-screen bg-white pb-nav">
        {/* Breadcrumb */}
        <div className="bg-primary-50 border-b border-primary-100 py-3">
          <div className="max-w-screen-xl mx-auto px-4 text-xs text-primary-400 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-primary-700">الرئيسية</Link><span>›</span>
            <Link href={`/category/${p.category.slug}`} className="hover:text-primary-700">{p.category.name}</Link><span>›</span>
            <span className="text-primary-800 font-semibold clamp-1">{p.name}</span>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {/* Images */}
            <div>
              <ImageZoom images={p.images} name={p.name} />
            </div>
            {/* All interactive info (client component) */}
            <ProductDetails product={p} />
          </div>

          {/* Reviews */}
          <ReviewsSection productRating={p.rating} reviewCount={p.reviewCount} />

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-black text-primary-900 mb-5" style={{fontFamily:'Amiri,serif'}}>
                قد يعجبك أيضاً 🛍️
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {related.map(rp => <ProductCard key={rp.id} product={rp} />)}
              </div>
            </section>
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
