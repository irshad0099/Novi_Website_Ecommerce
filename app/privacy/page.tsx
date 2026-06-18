'use client'
import { useState, useEffect, useRef } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import Link from 'next/link'

const sections = [
  {
    id: 'collection',
    num: '١',
    title: 'جمع المعلومات',
    icon: '📋',
    paragraphs: [
      'نقوم بجمع المعلومات الشخصية التي تقدمها طوعاً عند إنشاء حساب على منصتنا أو إجراء عملية شراء، بما في ذلك الاسم الكامل وعنوان البريد الإلكتروني ورقم الهاتف وعنوان التوصيل.',
      'كما نجمع معلومات تقنية تلقائياً عند استخدامك لموقعنا، مثل عنوان IP ونوع المتصفح ونظام التشغيل وصفحات الموقع التي تزورها وتواريخ وأوقات الزيارات.',
      'قد نحصل أيضاً على معلومات من مصادر خارجية موثوقة مثل شركاء الأعمال أو مواقع التواصل الاجتماعي إذا اخترت الربط مع حساباتك على تلك المنصات.',
    ],
  },
  {
    id: 'usage',
    num: '٢',
    title: 'استخدام المعلومات',
    icon: '🔍',
    paragraphs: [
      'نستخدم المعلومات التي نجمعها لمعالجة طلباتك وتسهيل عمليات الشراء وتوصيل المنتجات، والتواصل معك بشأن حالة طلبك وتقديم خدمة العملاء.',
      'قد نستخدم بياناتك لإرسال عروض ترويجية وتحديثات عن منتجاتنا الجديدة، ولك الحق في إلغاء الاشتراك في هذه الرسائل في أي وقت.',
      'نستخدم البيانات التجميعية غير الشخصية لتحليل سلوك المستخدمين وتحسين تجربة التسوق على موقعنا وتطوير منتجاتنا وخدماتنا بشكل مستمر.',
    ],
  },
  {
    id: 'protection',
    num: '٣',
    title: 'حماية البيانات',
    icon: '🔒',
    paragraphs: [
      'نلتزم بحماية بياناتك الشخصية باستخدام أحدث تقنيات التشفير SSL/TLS لتأمين جميع البيانات المنقولة بين متصفحك وخوادمنا.',
      'يتم تخزين بياناتك على خوادم آمنة محمية بجدران حماية متعددة الطبقات وأنظمة الكشف عن التسلل، مع إجراء نسخ احتياطية منتظمة لضمان سلامة البيانات.',
      'نقتصر في الوصول إلى بياناتك الشخصية على الموظفين المخوّلين الذين يحتاجون إليها لأداء مهامهم، ونُلزم جميع العاملين بالحفاظ على سرية البيانات.',
    ],
  },
  {
    id: 'cookies',
    num: '٤',
    title: 'ملفات الكوكيز',
    icon: '🍪',
    paragraphs: [
      'نستخدم ملفات الكوكيز لتحسين تجربتك على موقعنا. تساعدنا هذه الملفات على تذكر تفضيلاتك وحفظ محتويات سلة التسوق وتسريع عملية تسجيل الدخول.',
      'هناك نوعان من الكوكيز نستخدمهما: الكوكيز الأساسية الضرورية لعمل الموقع بشكل صحيح، والكوكيز الاختيارية المستخدمة لأغراض التحليل والتسويق.',
      'يمكنك التحكم في إعدادات الكوكيز من خلال إعدادات متصفحك، غير أن تعطيل بعض الكوكيز قد يؤثر على تجربة استخدامك للموقع.',
    ],
  },
  {
    id: 'rights',
    num: '٥',
    title: 'حقوق المستخدم',
    icon: '⚖️',
    paragraphs: [
      'بموجب نظام حماية البيانات الشخصية في المملكة العربية السعودية، لديك الحق في الاطلاع على بياناتك الشخصية التي نحتفظ بها وطلب تصحيحها أو تحديثها في أي وقت.',
      'يحق لك طلب حذف بياناتك الشخصية من أنظمتنا وفق الشروط المنصوص عليها في الأنظمة المعمول بها. يمكنك الاعتراض على استخدام بياناتك لأغراض التسويق المباشر.',
      'للممارسة أي من هذه الحقوق، يرجى التواصل معنا عبر البريد الإلكتروني أو نموذج الاتصال. سنسعى للرد على طلبك خلال ٣٠ يوماً من تاريخ استلامه.',
    ],
  },
  {
    id: 'contact-us',
    num: '٦',
    title: 'التواصل معنا',
    icon: '📧',
    paragraphs: [
      'إذا كان لديك أي استفسار أو قلق يتعلق بسياسة الخصوصية أو بياناتك الشخصية، يسعدنا التواصل معك ومعالجة أي مخاوف.',
      'يمكنك التواصل مع مسؤول حماية البيانات لدينا عبر البريد الإلكتروني: privacy@nadaalhareer.sa أو عبر الهاتف على الرقم 920000000.',
      'نحتفظ بحق تحديث هذه السياسة من وقت لآخر لتعكس التغييرات في ممارساتنا أو المتطلبات القانونية، وسنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني.',
    ],
  },
]

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('collection')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach(section => {
      const el = sectionRefs.current[section.id]
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(section.id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-nav" dir="rtl">

        {/* Page header */}
        <div className="g-gold text-white py-12 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-3">🔒</div>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: 'Amiri,serif' }}>
              سياسة الخصوصية
            </h1>
            <p className="text-white/70 text-sm">
              آخر تحديث: ١٥ يونيو ٢٠٢٥
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-primary-100 py-3">
          <div className="max-w-screen-xl mx-auto px-4 text-xs text-primary-400 flex items-center gap-2">
            <Link href="/" className="hover:text-primary-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-primary-800 font-semibold">سياسة الخصوصية</span>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <div className="flex gap-8 items-start">

            {/* Sticky sidebar — desktop only */}
            <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden">
                <div className="g-gold text-white px-4 py-3">
                  <p className="font-black text-sm">المحتويات</p>
                </div>
                <nav className="p-2">
                  {sections.map(s => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5
                        ${activeSection === s.id
                          ? 'bg-primary-900 text-white font-black'
                          : 'text-primary-600 hover:bg-primary-50 hover:text-primary-900 font-semibold'
                        }`}
                    >
                      <span className="text-base">{s.icon}</span>
                      <span className="text-xs">{s.num}. {s.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-xs text-amber-800 font-bold mb-1">تاريخ السريان</p>
                <p className="text-xs text-amber-700">١ يناير ٢٠٢٥</p>
                <p className="text-xs text-amber-800 font-bold mt-2 mb-1">آخر تحديث</p>
                <p className="text-xs text-amber-700">١٥ يونيو ٢٠٢٥</p>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 md:p-8 mb-6">
                <p className="text-sm text-primary-600 leading-relaxed">
                  تلتزم نَدى الحرير بحماية خصوصيتك وصون بياناتك الشخصية. توضح هذه الوثيقة كيفية جمع معلوماتك واستخدامها والحفاظ عليها وفقاً للأنظمة والتشريعات المعمول بها في المملكة العربية السعودية.
                </p>
              </div>

              <div className="space-y-6">
                {sections.map(section => (
                  <section
                    key={section.id}
                    id={section.id}
                    ref={el => { sectionRefs.current[section.id] = el }}
                    className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-primary-50">
                      <span className="text-2xl">{section.icon}</span>
                      <h2 className="font-black text-primary-900 text-lg">
                        {section.num}. {section.title}
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      {section.paragraphs.map((para, i) => (
                        <p key={i} className="text-sm text-primary-600 leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-6 bg-primary-50 border border-primary-100 rounded-2xl p-5 text-center">
                <p className="text-sm text-primary-600">
                  باستخدام موقع نَدى الحرير، فإنك توافق على هذه السياسة وشروط الاستخدام.
                </p>
                <Link href="/contact" className="inline-block mt-3 text-xs font-black text-primary-700 underline underline-offset-2">
                  هل لديك استفسار؟ تواصل معنا
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  )
}
