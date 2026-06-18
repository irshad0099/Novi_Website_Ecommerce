import ParallaxImage from '@/components/ParallaxImage'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import ProductCard from '@/components/product/ProductCard'
import NewsletterForm from '@/components/NewsletterForm'
import PromoPopup from '@/components/PromoPopup'
import FlashSaleBanner from '@/components/FlashSaleBanner'
import RecentlyViewed from '@/components/RecentlyViewed'
import WhatsAppButton from '@/components/WhatsAppButton'
import CompareDrawer from '@/components/product/CompareDrawer'
import ScrollReveal from '@/components/ScrollReveal'
import ScrollToTop from '@/components/ScrollToTop'
import PRODUCTS, { CATEGORIES } from '@/lib/products'
import Link from 'next/link'

export default function Home() {
  const featured  = PRODUCTS.filter(p => p.isFeatured).slice(0, 8)
  const bestSell  = PRODUCTS.filter(p => p.isBestSeller).slice(0, 6)
  const newArrivals = PRODUCTS.filter(p => (p as any).isNewArrival).slice(0, 4)

  return (
    <>
      <Header />
      <FlashSaleBanner />
      <PromoPopup />
      <main className="pb-nav">

        {/* ─── HERO — full-banner ─── */}
        <section className="relative overflow-hidden" style={{minHeight:'88vh'}}>

          {/* ── BACKGROUND IMAGE with parallax ── */}
          <div className="absolute inset-0 overflow-hidden">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1920&q=90"
              alt="الرياض — المملكة العربية السعودية"
            />
          </div>

          {/* ── DARK OVERLAY ── */}
          <div
            className="absolute inset-0"
            style={{background:'linear-gradient(to bottom, rgba(10,7,2,0.45) 0%, rgba(10,7,2,0.55) 50%, rgba(10,7,2,0.80) 100%)'}}
          />
          {/* animated gold shimmer overlay */}
          <div className="absolute inset-0 gradient-animated" />
          {/* radial glow */}
          <div
            className="absolute inset-0"
            style={{background:'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201,168,76,0.22) 0%, transparent 65%)'}}
          />

          {/* ── CORNER BADGES — hidden on small phones ── */}
          <div className="absolute top-4 md:top-6 right-4 md:right-6 z-20 g-gold rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-primary-900 shadow-lg text-center hidden sm:block">
            <p className="text-[10px] font-bold leading-none">شحن مجاني</p>
            <p className="text-xs font-black">فوق ١٥٠ ريال</p>
          </div>
          <div className="absolute top-4 md:top-6 left-4 md:left-6 z-20 bg-black/50 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-white text-center hidden sm:block">
            <p className="text-[10px] text-white/60 leading-none">تقييم العملاء</p>
            <p className="text-sm md:text-base font-black text-primary-300">⭐ ٤.٩ / ٥</p>
          </div>

          {/* ── CENTRED TEXT CONTENT ── */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8" style={{minHeight:'88vh'}}>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-primary-200 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold mb-4 md:mb-6">
              ✨ العلامة الأولى للمناديل الفاخرة في المملكة
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-4 md:mb-5 drop-shadow-2xl" style={{fontFamily:'Amiri,serif', textShadow:'0 4px 24px rgba(0,0,0,0.6)'}}>
              نعومة <span className="text-primary-300">تلمسها</span><br/>
              وجودة <span className="text-primary-300">تثق</span> بها
            </h1>

            <p className="text-white/80 text-sm md:text-lg mb-6 md:mb-8 max-w-xl leading-relaxed drop-shadow" style={{textShadow:'0 2px 12px rgba(0,0,0,0.7)'}}>
              مناديل نَدى الحرير الفاخرة بـ٣ طبقات من الألياف الطبيعية النقية.<br className="hidden sm:block"/>
              ٦٠٠ منديل في كل علبة.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 md:gap-10 mb-7 md:mb-9 w-full sm:w-auto justify-items-center">
              {[['٦٠٠+','منديل/علبة'],['٣','طبقات ناعمة'],['+٥٠ألف','عميل سعيد'],['٤.٩⭐','تقييم']].map(([n,l]) => (
                <div key={l} className="text-center">
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-primary-300 drop-shadow">{n}</p>
                  <p className="text-[10px] sm:text-[11px] text-white/60 mt-0.5">{l}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
              <Link href="#products" className="g-gold text-primary-900 font-black px-7 md:px-9 py-3 md:py-3.5 rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all text-sm">
                🛒 تسوق الآن
              </Link>
              <Link href="/category/bundles" className="bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-7 md:px-9 py-3 md:py-3.5 rounded-full hover:bg-white/25 transition-colors text-sm">
                🎁 بكجات التوفير
              </Link>
            </div>

            {/* Landmark label bottom */}
            <p className="absolute bottom-6 text-white/40 text-xs tracking-widest">🏙️ الرياض — المملكة العربية السعودية</p>
          </div>
        </section>

        {/* ─── STATS STRIP ─── */}
        <div className="g-gold overflow-x-auto scrollbar-hide">
          <div className="max-w-screen-xl mx-auto px-4 py-3 md:py-4 flex items-center justify-around gap-4 md:gap-6 text-primary-900" style={{minWidth:'max-content'}}>
            {[['🚚','شحن مجاني','فوق ١٥٠ ريال'],['✅','معتمدة رسمياً','SFDA'],['🔄','إرجاع مجاني','٧ أيام'],['💳','تابي وتمارا','تقسيط بدون فائدة'],['🌿','طبيعي ١٠٠٪','بدون كيماويات']].map(([i,tx,s]) => (
              <div key={tx as string} className="flex items-center gap-2">
                <span className="text-xl md:text-2xl">{i}</span>
                <div><p className="font-black text-xs md:text-sm whitespace-nowrap">{tx}</p><p className="text-[9px] md:text-[10px] opacity-70 whitespace-nowrap">{s}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CATEGORIES ─── */}
        <section className="py-8 md:py-12 bg-primary-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <ScrollReveal className="mb-5 md:mb-7">
              <h2 className="text-xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>تسوّق حسب الفئة<span className="text-primary-400">.</span></h2>
              <p className="text-primary-400 text-sm mt-1">٨٠+ منتج في ٧ فئات</p>
            </ScrollReveal>
            <ScrollReveal className="stagger-children grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
              {CATEGORIES.map(c => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="reveal-scale bg-white border border-primary-100 rounded-xl md:rounded-2xl p-2 md:p-3 text-center hover:border-primary-300 hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="text-2xl md:text-3xl mb-1 md:mb-2">{c.icon}</div>
                  <p className="text-[9px] md:text-[11px] font-bold text-primary-800 leading-tight">{c.name}</p>
                </Link>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* ─── FEATURED ─── */}
        <section className="py-8 md:py-12" id="products">
          <div className="max-w-screen-xl mx-auto px-4">
            <ScrollReveal className="flex items-end justify-between mb-5 md:mb-7">
              <div>
                <h2 className="text-xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>منتجات مميزة<span className="text-primary-400">.</span></h2>
                <p className="text-primary-400 text-sm mt-1">مختارة خصيصاً لك بجودة مضمونة</p>
              </div>
              <Link href="/category/face-tissue" className="text-primary-600 font-bold text-xs md:text-sm hover:text-primary-800 flex-shrink-0">عرض الكل ←</Link>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* ─── PROMO ─── */}
        <section className="py-6 md:py-8 bg-primary-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <ScrollReveal type="reveal-scale">
              <div className="bg-primary-900 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                <div>
                  <h3 className="text-2xl font-black text-primary-200 mb-2" style={{fontFamily:'Amiri,serif'}}>🎉 وفّر ١٠٪ على أول طلب!</h3>
                  <p className="text-white/55 text-sm">استخدم كود الخصم عند الدفع. صالح فوق ١٠٠ ريال.</p>
                </div>
                <div className="bg-white/10 border-2 border-dashed border-primary-400 rounded-2xl px-8 py-4 text-center flex-shrink-0 cursor-pointer hover:bg-white/20 transition-colors">
                  <p className="text-2xl font-black text-primary-300 tracking-widest">🏷️ NADA10</p>
                  <p className="text-[10px] text-white/45 mt-1">انقر للنسخ</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── BEST SELLERS ─── */}
        <section className="py-8 md:py-12">
          <div className="max-w-screen-xl mx-auto px-4">
            <ScrollReveal className="flex items-end justify-between mb-5 md:mb-7">
              <div>
                <h2 className="text-xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>الأكثر مبيعاً<span className="text-primary-400">.</span></h2>
                <p className="text-primary-400 text-sm mt-1">اختيار أكثر من ٥٠,٠٠٠ عميل</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {bestSell.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* ─── NEW ARRIVALS ─── */}
        {newArrivals.length > 0 && (
          <section className="py-12 bg-primary-50">
            <div className="max-w-screen-xl mx-auto px-4">
              <div className="mb-7">
                <h2 className="text-2xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>وصل حديثاً<span className="text-primary-400">.</span></h2>
                <p className="text-primary-400 text-sm mt-1">أحدث الإضافات لمتجرنا</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* ─── WHY US ─── */}
        <section className="py-8 md:py-12">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-3xl font-black text-primary-900 mb-1" style={{fontFamily:'Amiri,serif'}}>لماذا نَدى الحرير<span className="text-primary-400">؟</span></h2>
              <p className="text-primary-400 text-sm">جودة لا تُنافَس بثقة تستحقها</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                ['🌿','مواد طبيعية ١٠٠٪','بدون كيماويات ضارة، آمنة للبشرة الحساسة'],
                ['✅','معتمدة رسمياً','معتمدة من هيئة الغذاء والدواء السعودية SFDA'],
                ['🚚','توصيل سريع','١–٣ أيام في الرياض، ٢–٥ أيام في المملكة'],
                ['🔄','إرجاع مجاني','٧ أيام إرجاع كامل بدون أسئلة'],
                ['💳','دفع متعدد','مدى، فيزا، تابي، تمارا، Apple Pay، COD'],
                ['💬','دعم ٢٤/٧','واتساب والهاتف متاحان دائماً'],
                ['🎁','تغليف هدايا','تغليف مجاني للمناسبات والأعياد'],
                ['⭐','ضمان الجودة','كل منتج يمر بفحص دقيق قبل الشحن'],
              ].map(([icon,title,desc]) => (
                <div key={title as string} className="bg-white border border-primary-100 rounded-2xl p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 g-gold rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">{icon}</div>
                  <h3 className="font-black text-[13px] text-primary-900 mb-1.5">{title}</h3>
                  <p className="text-[11px] text-primary-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── REVIEWS ─── */}
        <section className="py-8 md:py-12 bg-primary-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex items-end justify-between mb-5 md:mb-7 flex-wrap gap-3">
              <div>
                <h2 className="text-xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>آراء عملائنا<span className="text-primary-400">.</span></h2>
                <p className="text-primary-400 text-sm mt-1">+٥٠,٠٠٠ عميل سعيد</p>
              </div>
              <div className="flex items-center gap-2 bg-white border border-primary-200 px-3 py-1.5 md:px-4 md:py-2 rounded-xl">
                <span className="text-lg md:text-xl font-black text-primary-600">٤.٩</span>
                <span className="text-amber-400 text-sm">★★★★★</span>
                <span className="text-[11px] text-primary-400">(+٢,٤٠٠)</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {[
                ['س','سعود المطيري','مناديل نَدى كلاسيك ٦٠٠','منذ ٣ أيام','مرة ممتازة شكراً لكم! المنتج رائع والمناديل ناعمة ومريحة جداً.'],
                ['ص','صالح الحربي','بكج التوفير ٦ علب','منذ أسبوع','متجر ممتاز والمناديل من أفضل الماركات. التوصيل سريع والتغليف محترم.'],
                ['ب','بدرية الشهري','مناديل ماكسي ١٨٠٠','منذ أسبوعين','روعة! قوية وناعمة. جربت كثير من الماركات وهذه الأفضل بلا منازع.'],
                ['ع','عمر الزهراني','المناشف القطنية','منذ ٣ أسابيع','ممتاز من أول استخدام. توصيل خارق السرعة. سأطلب مجدداً!'],
                ['أ','أمل العتيبي','مبللة أطفال ١٠٠','منذ شهر','لطيفة جداً على بشرة طفلتي الحساسة. قيمة ممتازة مقابل السعر.'],
                ['م','محمد الدوسري','بكج المنزل الشامل','منذ شهر','طلبت للمكتب كميات كبيرة. الرد سريع والسعر ممتاز. شكراً نَدى الحرير!'],
              ].map(([init,name,prod,date,txt]) => (
                <div key={name as string} className="bg-white border border-primary-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full g-gold flex items-center justify-center font-black text-primary-900 flex-shrink-0">{init}</div>
                    <div><p className="font-bold text-sm text-primary-900">{name}</p><p className="text-amber-400 text-[11px]">⭐⭐⭐⭐⭐ <span className="text-primary-400">{date}</span></p></div>
                  </div>
                  <p className="text-[13px] text-primary-700 leading-relaxed mb-3">{txt}</p>
                  <p className="text-[10px] text-primary-400 border-t border-primary-50 pt-2">المنتج: {prod}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── NEWSLETTER ─── */}
        <section className="bg-primary-900 py-14 text-center px-4">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2" style={{fontFamily:'Amiri,serif'}}>ابقَ على اطلاع 📬</h2>
          <p className="text-white/55 mb-7 text-sm">اشترك للحصول على عروض حصرية وكودات خصم خاصة</p>
          <NewsletterForm />
        </section>

        {/* Recently Viewed */}
        <RecentlyViewed />
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
      <CompareDrawer />
      <ScrollToTop />
    </>
  )
}
