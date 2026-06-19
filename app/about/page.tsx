import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

export const metadata = {
  title: 'من نحن | NOVI',
  description: 'قصة NOVI — العلامة الأولى للمناديل الفاخرة في المملكة العربية السعودية منذ ٢٠١٩',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pb-nav">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-primary-900 py-20 md:py-28 px-4 text-center">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(26,52,97,0.18) 0%, transparent 70%)'}} />
          <div className="absolute inset-0 gradient-animated pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block bg-primary-300/10 border border-primary-400/30 text-primary-300 px-4 py-1.5 rounded-full text-xs font-bold mb-5">
              🇸🇦 علامة سعودية فاخرة منذ ٢٠١٩
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5" style={{fontFamily:'Amiri,serif'}}>
              قصة <span className="text-primary-300">NOVI</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              بدأت رحلتنا من قلب الرياض بحلم واحد:<br/>
              أن تحمل كل أسرة سعودية أفضل ما يُلامس بشرتها يومياً
            </p>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <div className="g-gold py-5">
          <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[['٢٠١٩','سنة التأسيس'],['+٥٠ألف','عميل سعيد'],['٤.٩⭐','متوسط التقييم'],['٩٢+','منتج في المتجر']].map(([n,l]) => (
              <div key={l}>
                <p className="text-2xl md:text-3xl font-black text-white">{n}</p>
                <p className="text-[11px] text-white/70 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Our Story ── */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-screen-lg mx-auto">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <ScrollReveal type="reveal-left">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&q=80"
                    alt="الرياض"
                    className="rounded-3xl w-full object-cover shadow-2xl"
                    style={{height:380}}
                  />
                  <div className="absolute -bottom-5 -right-5 bg-white border border-primary-100 rounded-2xl p-4 shadow-xl">
                    <p className="text-2xl font-black text-primary-600">+٥٠ ألف</p>
                    <p className="text-xs text-primary-400">عميل سعيد في المملكة</p>
                  </div>
                  <div className="absolute -top-4 -left-4 g-gold rounded-2xl px-4 py-2 shadow-lg">
                    <p className="text-xs font-black text-white">🏆 الأفضل تقييماً ٢٠٢٤</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal>
                <span className="text-primary-400 text-xs font-black uppercase tracking-widest mb-3 block">قصتنا</span>
                <h2 className="text-3xl md:text-4xl font-black text-primary-900 mb-5 leading-snug" style={{fontFamily:'Amiri,serif'}}>
                  من الرياض<span className="text-primary-400">،</span><br/>إلى كل بيت في المملكة
                </h2>
                <div className="space-y-4 text-primary-600 text-sm leading-loose">
                  <p>
                    في عام ٢٠١٩م، انطلقت <strong className="text-primary-800">NOVI</strong> بفكرة بسيطة وواضحة: السوق السعودي يستحق مناديل تليق بمستوى الحياة الراقية التي يعيشها أبناؤه.
                  </p>
                  <p>
                    بدأنا بمصنع متخصص في الرياض، واستخدمنا أجود الألياف الطبيعية النقية، وطورنا تقنية <strong className="text-primary-800">ثلاث طبقات ناعمة</strong> التي تجعل كل منديل تجربة حسية فريدة لا تُنسى.
                  </p>
                  <p>
                    اليوم، NOVI موجودة في أكثر من ٢٠ مدينة سعودية، وتثق بها أكثر من ٥٠,٠٠٠ أسرة كريمة يومياً. هذه الثقة هي التزامنا الأبدي.
                  </p>
                </div>
                <div className="flex gap-3 mt-7 flex-wrap">
                  <Link href="/#products" className="g-gold text-white font-black px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-shadow text-sm">
                    🛒 تسوق الآن
                  </Link>
                  <Link href="/category/bundles" className="bg-primary-900 text-primary-200 font-black px-6 py-2.5 rounded-full hover:bg-primary-800 transition-colors text-sm">
                    🎁 البكجات
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="py-16 px-4 bg-primary-50">
          <div className="max-w-screen-md mx-auto">
            <ScrollReveal className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>مسيرتنا عبر السنين<span className="text-primary-400">.</span></h2>
            </ScrollReveal>
            <div className="relative border-r-2 border-primary-200 pr-8 space-y-10">
              {[
                ['٢٠١٩','🚀','التأسيس','أسسنا NOVI في الرياض بفريق من ١٢ شخصاً وحلم بتغيير صناعة المناديل السعودية.'],
                ['٢٠٢٠','✅','اعتماد SFDA','حصلنا على الاعتماد الرسمي من هيئة الغذاء والدواء السعودية، ووصلنا لـ ١٠,٠٠٠ عميل.'],
                ['٢٠٢١','🌐','الإطلاق الرقمي','أطلقنا متجرنا الإلكتروني ووصلنا لجميع مناطق المملكة بالتوصيل السريع.'],
                ['٢٠٢٢','🏆','جائزة الجودة','حصلنا على لقب أفضل منتج منزلي وطني من منظمة الجودة السعودية.'],
                ['٢٠٢٣','💄','بيوتي كير','أطلقنا خط مناديل البيوتي كير المتخصص للعناية بالبشرة الحساسة.'],
                ['٢٠٢٤','👨‍👩‍👧‍👦','٥٠ ألف عائلة','تجاوزنا ٥٠,٠٠٠ عميل سعيد ووسّعنا خطوط إنتاجنا لتشمل ٩٢ منتجاً.'],
              ].map(([year, icon, title, desc]) => (
                <div key={year} className="relative">
                  <div className="absolute -right-[2.85rem] top-1 w-6 h-6 g-gold rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xs">{icon}</span>
                  </div>
                  <span className="text-[10px] text-primary-400 font-black uppercase tracking-widest">{year}</span>
                  <h3 className="text-base font-black text-primary-900 mt-0.5 mb-1.5">{title as string}</h3>
                  <p className="text-sm text-primary-500 leading-relaxed">{desc as string}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Brand Values ── */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-screen-xl mx-auto">
            <ScrollReveal className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>قيمنا وفلسفتنا<span className="text-primary-400">.</span></h2>
              <p className="text-primary-400 text-sm mt-2">ما يميّزنا ويُلزمنا</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                ['🌿','المسؤولية البيئية','نستخدم ألياف طبيعية قابلة للتحلل ونلتزم بمعايير بيئية صارمة في كل مرحلة إنتاج.'],
                ['✅','الجودة لا تُساوَم','كل علبة مناديل تمر بـ ١٢ مرحلة فحص قبل وصولها لبيتك. لا مجال للتهاون.'],
                ['🇸🇦','فخر سعودي ١٠٠٪','منتج سعودي بأيدٍ سعودية. نؤمن برؤية ٢٠٣٠ ودعم الاقتصاد الوطني.'],
                ['💛','خدمة من القلب','عميلنا هو سبب وجودنا. كل قرار يبدأ بسؤال: هل هذا يخدم عميلنا بشكل أفضل؟'],
                ['🔬','ابتكار مستمر','فريق بحث وتطوير متخصص يعمل على تطوير منتجاتنا باستمرار لتناسب احتياجاتك.'],
                ['🤝','شراكة حقيقية','نبني علاقات طويلة الأمد مع عملائنا وموردينا وموظفينا على أساس الثقة المتبادلة.'],
              ].map(([icon, title, desc]) => (
                <ScrollReveal key={title as string} type="reveal-scale">
                  <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 hover:shadow-md transition-shadow text-center h-full">
                    <div className="w-14 h-14 g-gold rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-md">{icon}</div>
                    <h3 className="font-black text-primary-900 mb-2">{title as string}</h3>
                    <p className="text-sm text-primary-500 leading-relaxed">{desc as string}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Certifications ── */}
        <section className="py-14 px-4 bg-primary-900">
          <div className="max-w-screen-lg mx-auto text-center">
            <h2 className="text-xl font-black text-primary-300 mb-8" style={{fontFamily:'Amiri,serif'}}>اعتماداتنا وشهاداتنا الرسمية</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ['✅','SFDA معتمدة','هيئة الغذاء والدواء'],
                ['🌿','ISO 9001','معيار الجودة الدولي'],
                ['🇸🇦','صُنع في السعودية','منتج وطني ١٠٠٪'],
                ['♻️','صديق للبيئة','ألياف قابلة للتحلل'],
              ].map(([icon, title, sub]) => (
                <div key={title as string} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl mb-3">{icon}</div>
                  <p className="font-black text-white text-sm">{title as string}</p>
                  <p className="text-white/40 text-[10px] mt-1">{sub as string}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 px-4 text-center bg-primary-50">
          <div className="max-w-lg mx-auto">
            <div className="text-5xl mb-5">🧻</div>
            <h2 className="text-2xl font-black text-primary-900 mb-3" style={{fontFamily:'Amiri,serif'}}>جرّب الفرق بنفسك</h2>
            <p className="text-primary-500 text-sm mb-7 leading-relaxed">
              أكثر من ٥٠,٠٠٠ أسرة سعودية اختارت NOVI.<br/>شحن مجاني فوق ١٥٠ ريال • إرجاع ٧ أيام مجاناً
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/#products" className="g-gold text-white font-black px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                🛒 تسوق الآن
              </Link>
              <Link href="/category/bundles" className="bg-primary-900 text-primary-200 font-black px-8 py-3.5 rounded-full hover:bg-primary-800 transition-colors">
                🎁 بكجات التوفير
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
