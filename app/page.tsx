import HeroSlider from '@/components/HeroSlider'
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
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import InstagramGrid from '@/components/InstagramGrid'
import AnimatedCounters from '@/components/AnimatedCounter'
import FAQSection from '@/components/FAQSection'
import FlashDeal from '@/components/FlashDeal'
import LoyaltyTiers from '@/components/LoyaltyTiers'
import ReferralProgram from '@/components/ReferralProgram'
import CouponWheel from '@/components/CouponWheel'
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

        {/* ─── HERO SLIDER ─── */}
        <HeroSlider />

        {/* ─── STATS STRIP ─── */}
        <div className="g-gold overflow-x-auto scrollbar-hide">
          <div className="max-w-screen-xl mx-auto px-4 py-3 md:py-4 flex items-center justify-around gap-4 md:gap-6 text-white" style={{minWidth:'max-content'}}>
            {[['🚚','شحن مجاني','فوق ١٥٠ ريال'],['✅','معتمدة رسمياً','SFDA'],['🔄','إرجاع مجاني','٧ أيام'],['💳','تابي وتمارا','تقسيط بدون فائدة'],['🌿','طبيعي ١٠٠٪','بدون كيماويات']].map(([i,tx,s]) => (
              <div key={tx as string} className="flex items-center gap-2">
                <span className="text-xl md:text-2xl">{i}</span>
                <div><p className="font-black text-xs md:text-sm whitespace-nowrap">{tx}</p><p className="text-[9px] md:text-[10px] opacity-70 whitespace-nowrap">{s}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FLASH DEAL ─── */}
        <FlashDeal />

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

        {/* ─── LOYALTY TIERS ─── */}
        <LoyaltyTiers />

        {/* ─── REFERRAL PROGRAM ─── */}
        <ReferralProgram />

        {/* ─── ANIMATED COUNTERS ─── */}
        <AnimatedCounters />

        {/* ─── TESTIMONIALS CAROUSEL ─── */}
        <TestimonialsCarousel />

        {/* ─── INSTAGRAM GRID ─── */}
        <InstagramGrid />

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
                <span className="text-primary-400 text-sm">★★★★★</span>
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
                    <div className="w-10 h-10 rounded-full g-gold flex items-center justify-center font-black text-white flex-shrink-0">{init}</div>
                    <div><p className="font-bold text-sm text-primary-900">{name}</p><p className="text-primary-400 text-[11px]">⭐⭐⭐⭐⭐ <span className="text-primary-400">{date}</span></p></div>
                  </div>
                  <p className="text-[13px] text-primary-700 leading-relaxed mb-3">{txt}</p>
                  <p className="text-[10px] text-primary-400 border-t border-primary-50 pt-2">المنتج: {prod}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BRAND STORY VIDEO ─── */}
        <section className="py-12 md:py-16 bg-primary-900 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(38,105,160,0.15) 0%, transparent 70%)'}} />
          <div className="relative z-10 max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-white" style={{fontFamily:'Amiri,serif'}}>
                شاهد قصة نَدى الحرير <span className="text-primary-300">🎬</span>
              </h2>
              <p className="text-white/50 text-sm mt-2">من الرياض إلى كل بيت سعودي</p>
            </div>
            <div className="max-w-3xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{aspectRatio:'16/9'}}>
              <img
                src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1280&q=90"
                alt="brand story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary-900/60 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white mr-[-4px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-4 right-4 bg-primary-900/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                ٢:٣٠ دقيقة
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <FAQSection />

        {/* ─── BRAND STORY STRIP ─── */}
        <section className="py-10 md:py-14 bg-primary-900 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(26,52,97,0.12) 0%, transparent 70%)'}} />
          <div className="relative z-10 max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <img src="/logo-combined.png" alt="نَدى الحرير" className="h-20 w-auto object-contain flex-shrink-0 opacity-90" />
              <div className="flex-1 text-center md:text-right">
                <h2 className="text-xl md:text-2xl font-black text-white mb-2" style={{fontFamily:'Amiri,serif'}}>
                  العلامة السعودية الأولى للمناديل الفاخرة <span className="text-primary-300">منذ ٢٠١٩</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
                  بدأنا من قلب الرياض بحلم واحد: أن تحمل كل أسرة سعودية أفضل ما يُلامس بشرتها. اليوم، يثق بنا أكثر من ٥٠,٠٠٠ عميل في أنحاء المملكة.
                </p>
                <div className="flex gap-4 mt-4 flex-wrap justify-center md:justify-start">
                  {[['✅','SFDA معتمدة'],['🇸🇦','صُنع في السعودية'],['🌿','طبيعي ١٠٠٪'],['♻️','صديق للبيئة']].map(([icon, label]) => (
                    <span key={label as string} className="flex items-center gap-1.5 bg-white/8 border border-white/10 text-white/60 text-[11px] font-bold px-3 py-1.5 rounded-full">
                      {icon} {label as string}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/about" className="flex-shrink-0 g-gold text-white font-black px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow text-sm">
                اعرف قصتنا ←
              </Link>
            </div>
          </div>
        </section>

        {/* ─── COUPON WHEEL ─── */}
        <section className="py-10 bg-primary-50 text-center">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-xl font-black text-primary-900 mb-2" style={{fontFamily:'Amiri,serif'}}>🎰 العب واربح خصماً<span className="text-primary-400">.</span></h2>
            <p className="text-primary-400 text-sm mb-5">دورة واحدة مجانية — اربح حتى ٢٠٪ خصم</p>
            <CouponWheel />
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
