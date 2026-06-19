'use client'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import Link from 'next/link'

const POSTS = [
  {
    slug: 'tissue-skin-care',
    titleAr: '٥ أسباب تجعل مناديل NOVI الأفضل للبشرة الحساسة',
    category: 'skin-care',
    readTime: 3,
    img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80',
    excerpt: 'اكتشف لماذا تختار آلاف الأمهات السعوديات مناديلنا للعناية بالبشرة الحساسة',
    date: '١٥ مايو ٢٠٢٥',
    content: [
      { heading: 'مقدمة', body: 'في عالم يتسارع فيه الابتكار في مجال العناية بالبشرة، تبرز مناديل NOVI كخيار مثالي للنساء اللواتي يعانين من البشرة الحساسة. فالمنديل ليس مجرد أداة لتجفيف الوجه، بل هو ملامس يومي لبشرتك يستحق الاهتمام الكافي.' },
      { heading: 'نعومة فائقة تحمي البشرة', body: 'الميزة الأولى التي تجعلها متميزة هي درجة نعومتها العالية. تُصنع مناديل NOVI من ألياف قطنية مختارة بعناية تُخضع لعملية معالجة خاصة تجعلها أكثر ليونة من أي منديل آخر في السوق. لا مزيد من الاحمرار أو التهيج عند استخدام المنديل بعد غسيل الوجه.' },
      { heading: 'مواد طبيعية ١٠٠٪ خالية من المواد الكيميائية', body: 'تخلو مناديل NOVI من العطور الكيميائية والمواد المضافة الضارة كالفلورين والكلور، مما يجعلها مناسبة تماماً للبشرة الحساسة وبشرة الأطفال. خضعت منتجاتنا لاختبارات مخبرية معتمدة في المملكة العربية السعودية.' },
      { heading: 'معتمدة طبياً للاستخدام اليومي', body: 'تحمل مناديل NOVI شهادة الاعتماد من هيئة الغذاء والدواء السعودية، كما حصلت على توصية من أطباء الجلدية في عدد من المستشفيات الكبرى. اختيارك لمنتج معتمد يعني أنك في أمان تام.' },
    ],
  },
  {
    slug: 'how-to-choose-tissue',
    titleAr: 'كيف تختار المناديل المناسبة لمنزلك؟',
    category: 'home',
    readTime: 5,
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    excerpt: 'دليل شامل لاختيار أفضل أنواع المناديل لكل غرفة في منزلك',
    date: '٢٠ مايو ٢٠٢٥',
    content: [
      { heading: 'أهمية اختيار المنديل المناسب', body: 'لكل غرفة في منزلك احتياجاتها الخاصة من المناديل. منديل غرفة النوم يختلف عن منديل المطبخ، ومنديل الحمام يختلف عن منديل صالة الجلوس. التعرف على هذه الاحتياجات يوفر عليك الوقت والمال ويضمن الراحة القصوى لك ولأسرتك.' },
      { heading: 'مناديل غرفة النوم', body: 'في غرفة النوم، تريدين منديلاً ناعماً بما يكفي للتعامل مع بشرة الوجه وأطراف العين. اختاري مناديل ذات طبقتين أو ثلاث طبقات بألياف قطنية ناعمة. تجنبي المناديل المعطرة التي قد تسبب حساسية أثناء النوم.' },
      { heading: 'مناديل المطبخ', body: 'مناديل المطبخ يجب أن تكون متينة وقادرة على امتصاص السوائل بكفاءة. اختاري مناديل متعددة الأغراض يمكن استخدامها لتنظيف الأسطح وتجفيف الأيدي وحماية الطعام. متانة المنتج في المطبخ أهم من نعومته.' },
      { heading: 'نصائح اقتصادية عند الشراء', body: 'شراء المناديل بالكميات الكبيرة يوفر لك ما يصل إلى ٣٠٪ من التكلفة. استفيدي من عروض NOVI الأسبوعية والشحن المجاني للطلبات التي تتجاوز ١٥٠ ريال. احرصي على تخزين المناديل في مكان جاف بعيداً عن الرطوبة للحفاظ على جودتها.' },
    ],
  },
  {
    slug: 'tissue-eco-friendly',
    titleAr: 'المناديل الصديقة للبيئة — لماذا مهمة؟',
    category: 'health',
    readTime: 4,
    img: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&q=80',
    excerpt: 'تعرف على أثر اختياراتك اليومية على البيئة وكيف تساهم في حمايتها',
    date: '٢٥ مايو ٢٠٢٥',
    content: [
      { heading: 'الواقع البيئي للمناديل التقليدية', body: 'يستهلك العالم سنوياً مئات مليارات المناديل الورقية، وهو رقم ضخم له أثر بيئي غير قابل للتجاهل. تقطيع الأشجار لإنتاج الورق واستخدام الكيماويات في التبييض والمعالجة يشكّل تحدياً حقيقياً للبيئة.' },
      { heading: 'التزام NOVI بالاستدامة', body: 'تستخدم NOVI في منتجاتها نسبة ٧٠٪ من الألياف المعاد تدويرها. عبواتنا مصنوعة من مواد قابلة للتحلل الحيوي ونسعى لتقليل بصمتنا الكربونية في جميع مراحل الإنتاج والتوزيع.' },
      { heading: 'كيف تتخذ خيارات أكثر استدامة', body: 'ابحثي عن منتجات تحمل شهادات البيئية المعتمدة. قللي من الهدر باستخدام المنديل لغرض واحد وتجنبي الإسراف. وعند التخلص منها، احرصي على وضع المناديل المستخدمة في سلة القمامة العضوية وليس في المجاري.' },
    ],
  },
  {
    slug: 'tissue-decoration',
    titleAr: 'أفكار إبداعية لتزيين المنزل بعلب المناديل',
    category: 'home',
    readTime: 6,
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    excerpt: 'حوّل علب المناديل إلى قطع ديكور جميلة بأفكار بسيطة وإبداعية',
    date: '١ يونيو ٢٠٢٥',
    content: [
      { heading: 'علب المناديل كجزء من الديكور', body: 'لم تعد علب المناديل مجرد أداة وظيفية، بل أصبحت جزءاً من المشهد الجمالي للمنزل. صُممت عبوات NOVI بأناقة تجعلها لائقة لأي ركن في منزلك دون الحاجة لإخفائها.' },
      { heading: 'أفكار لغرفة الجلوس', body: 'ضعي علبة المناديل على طاولة القهوة مع ربطة من الخيش أو الريبون الفاخر لمظهر بوهيمي راقٍ. يمكنك أيضاً استخدام حامل معدني أو خشبي لرفع العلبة وإعطائها بعداً ثلاثياً أجمل.' },
      { heading: 'تزيين حمام الضيوف', body: 'في حمام الضيوف، ضعي علبة المناديل في صينية معدنية ذهبية مع شمعة وبعض قطع الديكور الصغيرة. الاهتمام بهذه التفاصيل يترك أثراً إيجابياً على ضيوفك ويعكس ذوقك الرفيع.' },
      { heading: 'أفكار لغرفة الأطفال', body: 'اختاري عبوات مناديل ملونة أو ذات طبعات مرحة وضعيها في متناول يد طفلك مع تنظيمها في صندوق صغير ملون. هذه الطريقة تعلّم الطفل الاستخدام الصحيح وتضيف لمسة جمالية على مكتبه أو طاولته.' },
    ],
  },
  {
    slug: 'baby-tissue-guide',
    titleAr: 'دليل اختيار المناديل للأطفال الرضّع',
    category: 'health',
    readTime: 4,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
    excerpt: 'كل ما تحتاج معرفته قبل اختيار المناديل المثالية لطفلك الرضيع',
    date: '٥ يونيو ٢٠٢٥',
    content: [
      { heading: 'لماذا يختلف المنديل المناسب للرضيع؟', body: 'بشرة الرضيع أرق وأكثر حساسية بثلاث مرات من بشرة البالغين، ما يجعل اختيار المنديل المناسب أمراً بالغ الأهمية. استخدام منديل غير مناسب قد يسبب طفحاً جلدياً أو تهيجاً في بشرة طفلك.' },
      { heading: 'المعايير الضرورية عند الاختيار', body: 'ابحثي عن مناديل خالية تماماً من العطور والمواد الكيميائية. تأكدي من أن المنديل حصل على اعتماد من هيئة الغذاء والدواء وأنه مناسب للأطفال. اختاري ذات طبقة مزدوجة لمزيد من الليونة والحماية.' },
      { heading: 'مناديل NOVI للأطفال', body: 'خط منتجات الأطفال من NOVI مصمم خصيصاً لبشرة الرضيع. تخضع لفحوصات مخبرية صارمة وتحمل شهادة الأمان للأطفال. يمكن استخدامها لتنظيف وجه الطفل ومناطق الحفاض بأمان تام.' },
    ],
  },
  {
    slug: 'bulk-saving-tips',
    titleAr: 'كيف توفر أكثر عند شراء المناديل بالجملة؟',
    category: 'offers',
    readTime: 3,
    img: 'https://images.unsplash.com/photo-1578895101003-571866c7d3c6?w=800&q=80',
    excerpt: 'نصائح ذكية لتوفير المال عند شراء المناديل بكميات كبيرة',
    date: '١٠ يونيو ٢٠٢٥',
    content: [
      { heading: 'لماذا شراء الجملة أذكى اقتصادياً؟', body: 'المناديل منتج استهلاكي يومي. شراؤها بكميات كبيرة يوفر لك من ٢٠٪ إلى ٤٠٪ مقارنة بالشراء الفردي. مع NOVI، كلما زادت الكمية، كلما انخفض سعر الوحدة وحصلت على قيمة أعلى.' },
      { heading: 'كيف تحدد الكمية المناسبة؟', body: 'احسبي متوسط استهلاكك الشهري من المناديل. عادةً يكفي عبوة لكل فرد في المنزل شهرياً. اشتري كمية تكفي لثلاثة أشهر للاستفادة من خصومات الجملة دون أن تتراكم المنتجات.' },
      { heading: 'عروض NOVI الحصرية', body: 'اشتركي في نشرة NOVI البريدية لتصلك تنبيهات عروض الجملة قبل الجميع. نقدم خصومات خاصة للعملاء المتكررين تصل إلى ٣٥٪ على الطلبات الكبيرة، مع شحن مجاني للطلبات فوق ٢٠٠ ريال.' },
    ],
  },
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

type Props = { params: { slug: string } }

export default function BlogPostPage({ params }: Props) {
  const post = POSTS.find(p => p.slug === params.slug)
  const related = POSTS.filter(p => p.slug !== params.slug).slice(0, 2)

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-primary-50 pb-nav flex items-center justify-center" dir="rtl">
          <div className="text-center py-20 px-4">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-black text-primary-900 mb-3">المقال غير موجود</h1>
            <p className="text-primary-500 text-sm mb-6">لم نجد المقال الذي تبحث عنه، ربما تم تغيير الرابط.</p>
            <Link href="/blog" className="g-gold text-white font-black px-6 py-3 rounded-xl text-sm hover:opacity-90">
              العودة للمدونة
            </Link>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </>
    )
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://nadaalhareer.sa/blog/${post.slug}`
  const shareText = encodeURIComponent(post.titleAr + ' — NOVI')
  const waShareUrl = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`
  const twShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-nav" dir="rtl">

        {/* Hero image */}
        <div className="relative h-64 md:h-96 overflow-hidden bg-primary-900">
          <img
            src={post.img}
            alt={post.titleAr}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 px-4 pb-8 max-w-screen-lg mx-auto">
            <span className={`inline-block text-xs font-black px-3 py-1 rounded-full mb-3 ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-700'}`}>
              {categoryLabels[post.category] ?? post.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-snug" style={{ fontFamily: 'Amiri,serif' }}>
              {post.titleAr}
            </h1>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-primary-100 py-3">
          <div className="max-w-screen-lg mx-auto px-4 text-xs text-primary-400 flex items-center gap-2">
            <Link href="/" className="hover:text-primary-700">الرئيسية</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-primary-700">المدونة</Link>
            <span>›</span>
            <span className="text-primary-800 font-semibold truncate max-w-[120px]">{post.titleAr}</span>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-10">
          <div className="flex gap-8 items-start">

            {/* Article content */}
            <article className="flex-1 min-w-0">
              {/* Author + meta */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-primary-100">
                <div className="w-12 h-12 g-gold rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  ن
                </div>
                <div>
                  <p className="font-black text-primary-900 text-sm">فريق NOVI</p>
                  <p className="text-xs text-primary-400 mt-0.5">{post.date} · {post.readTime} دقائق قراءة</p>
                </div>
                {/* Share */}
                <div className="flex items-center gap-2 mr-auto">
                  <a href={waShareUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-green-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-green-600 transition-colors">
                    💬
                  </a>
                  <a href={twShareUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-sky-600 transition-colors">
                    🐦
                  </a>
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-base text-primary-600 leading-relaxed font-semibold mb-8 bg-primary-50 rounded-xl px-5 py-4 border-r-4 border-primary-700">
                {post.excerpt}
              </p>

              {/* Content sections */}
              <div className="space-y-8">
                {post.content.map((section, i) => (
                  <div key={i}>
                    <h2 className="text-xl font-black text-primary-900 mb-3" id={`section-${i}`}>
                      {section.heading}
                    </h2>
                    <p className="text-sm text-primary-600 leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>

              {/* Share section */}
              <div className="mt-10 pt-8 border-t border-primary-100">
                <p className="font-black text-primary-800 text-sm mb-3">شارك هذا المقال</p>
                <div className="flex items-center gap-3">
                  <a href={waShareUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 text-white font-bold text-xs px-4 py-2.5 rounded-full hover:bg-green-600 transition-colors">
                    💬 واتساب
                  </a>
                  <a href={twShareUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-full hover:bg-sky-600 transition-colors">
                    🐦 تويتر
                  </a>
                </div>
              </div>
            </article>

            {/* Table of contents — desktop sidebar */}
            <aside className="hidden md:block w-56 flex-shrink-0 sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden">
                <div className="g-gold text-white px-4 py-3">
                  <p className="font-black text-xs">محتويات المقال</p>
                </div>
                <nav className="p-3 space-y-1">
                  {post.content.map((section, i) => (
                    <a
                      key={i}
                      href={`#section-${i}`}
                      className="block text-xs text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-900 font-semibold transition-colors"
                    >
                      {i + 1}. {section.heading}
                    </a>
                  ))}
                </nav>
              </div>
              <Link href="/blog" className="block mt-4 text-center text-xs font-black text-primary-600 hover:text-primary-900 underline underline-offset-2">
                ← عودة للمدونة
              </Link>
            </aside>
          </div>

          {/* Related articles */}
          <section className="mt-14 pt-10 border-t border-primary-100">
            <h3 className="text-xl font-black text-primary-900 mb-6">مقالات ذات صلة</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group flex gap-4 bg-white rounded-2xl shadow-sm border border-primary-100 p-4 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-primary-100">
                    <img src={rel.img} alt={rel.titleAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-xs font-black px-2 py-0.5 rounded-full mb-1.5 ${categoryColors[rel.category] ?? 'bg-gray-100 text-gray-700'}`}>
                      {categoryLabels[rel.category] ?? rel.category}
                    </span>
                    <p className="font-black text-primary-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {rel.titleAr}
                    </p>
                    <p className="text-xs text-primary-400 mt-1">{rel.readTime} دقائق قراءة</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  )
}
