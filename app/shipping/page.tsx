'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import Link from 'next/link'

const faqs = [
  {
    q: 'هل الشحن مجاني لجميع الطلبات؟',
    a: 'الشحن مجاني للطلبات التي تتجاوز ١٥٠ ر.س داخل الرياض، وفوق ٢٠٠ ر.س لباقي المدن. للطلبات الأقل يُطبَّق رسم شحن بسيط.',
  },
  {
    q: 'كم يستغرق وصول الطلب؟',
    a: 'داخل الرياض ١–٢ يوم عمل. باقي مناطق المملكة ٢–٤ أيام عمل عبر شركة أرامكس.',
  },
  {
    q: 'ماذا أفعل إذا وصلني المنتج تالفاً؟',
    a: 'تواصل معنا خلال ٤٨ ساعة من الاستلام عبر الواتساب أو البريد الإلكتروني مع صورة للمنتج، وسنعالج طلبك فوراً.',
  },
  {
    q: 'هل يمكنني تغيير عنوان التوصيل بعد تأكيد الطلب؟',
    a: 'يمكن تعديل العنوان قبل شحن الطلب. تواصل معنا فور وضع الطلب وسنبذل قصارى جهدنا لتعديله.',
  },
]

const returnSteps = [
  { num: '١', title: 'تواصل معنا', desc: 'أرسل طلب الإرجاع عبر الواتساب أو البريد الإلكتروني مع ذكر رقم الطلب وسبب الإرجاع.' },
  { num: '٢', title: 'تأكيد الطلب', desc: 'سيراجع فريقنا طلبك ويرسل تأكيداً بالموافقة خلال ٢٤ ساعة عمل.' },
  { num: '٣', title: 'الاستلام والاسترداد', desc: 'سيُرسل مندوب لاستلام المنتج من منزلك، ويُسترد المبلغ خلال ٣–٥ أيام عمل.' },
]

export default function ShippingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-nav" dir="rtl">

        {/* Page header */}
        <div className="g-gold text-white py-12 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-3">🚚</div>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: 'Amiri,serif' }}>
              الشحن والإرجاع
            </h1>
            <p className="text-white/70 text-sm">
              كل ما تحتاج معرفته عن التوصيل وسياسة الاسترجاع
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-primary-100 py-3">
          <div className="max-w-screen-xl mx-auto px-4 text-xs text-primary-400 flex items-center gap-2">
            <Link href="/" className="hover:text-primary-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-primary-800 font-semibold">الشحن والإرجاع</span>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-10 space-y-10">

          {/* Shipping rates table */}
          <section className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden">
            <div className="g-gold text-white px-6 py-4">
              <h2 className="font-black text-lg">أسعار الشحن</h2>
              <p className="text-white/70 text-xs mt-0.5">رسوم التوصيل حسب المنطقة</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="text-right px-6 py-3 font-black text-primary-800 border-b border-primary-100">المنطقة</th>
                    <th className="text-center px-6 py-3 font-black text-primary-800 border-b border-primary-100">الشحن المجاني</th>
                    <th className="text-center px-6 py-3 font-black text-primary-800 border-b border-primary-100">رسوم الشحن</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-primary-50 hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary-900">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-600 rounded-full inline-block" />
                        الرياض
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-100 text-green-800 font-black text-xs px-3 py-1 rounded-full">فوق ١٥٠ ر.س</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-primary-700">١٥ ر.س</td>
                  </tr>
                  <tr className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary-900">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-400 rounded-full inline-block" />
                        المدن الأخرى
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-100 text-green-800 font-black text-xs px-3 py-1 rounded-full">فوق ٢٠٠ ر.س</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-primary-700">٢٥ ر.س</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Delivery timeframes */}
          <section>
            <h2 className="text-xl font-black text-primary-900 mb-5">
              <span className="inline-block border-r-4 border-primary-700 pr-3">مواعيد التوصيل</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-5 text-center">
                <div className="text-3xl mb-3">🏙️</div>
                <h3 className="font-black text-primary-900 text-base mb-1">الرياض</h3>
                <p className="text-2xl font-black text-primary-600 mb-1">١–٢</p>
                <p className="text-xs text-primary-400">يوم عمل</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-5 text-center">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="font-black text-primary-900 text-base mb-1">باقي المدن</h3>
                <p className="text-2xl font-black text-primary-600 mb-1">٢–٤</p>
                <p className="text-xs text-primary-400">أيام عمل</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-5 text-center">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-black text-primary-900 text-base mb-1">شركة الشحن</h3>
                <p className="text-xl font-black text-primary-600 mb-1">أرامكس</p>
                <p className="text-xs text-primary-400">Aramex Express</p>
              </div>
            </div>
          </section>

          {/* Returns policy */}
          <section className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden">
            <div className="g-gold text-white px-6 py-4">
              <h2 className="font-black text-lg">سياسة الإرجاع والاستبدال</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 bg-primary-50 rounded-xl p-4">
                  <div className="text-2xl">📅</div>
                  <div>
                    <p className="font-black text-primary-900 text-sm">مدة الإرجاع</p>
                    <p className="text-primary-600 text-xs mt-0.5">٧ أيام من تاريخ الاستلام</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-primary-50 rounded-xl p-4">
                  <div className="text-2xl">💰</div>
                  <div>
                    <p className="font-black text-primary-900 text-sm">رسوم الإرجاع</p>
                    <p className="text-green-600 font-black text-xs mt-0.5">مجاني ١٠٠٪</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-primary-50 rounded-xl p-4">
                  <div className="text-2xl">📦</div>
                  <div>
                    <p className="font-black text-primary-900 text-sm">شرط الإرجاع</p>
                    <p className="text-primary-600 text-xs mt-0.5">العبوة الأصلية مغلقة</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-primary-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                ⚠️ لا يُقبل إرجاع المنتجات المفتوحة أو المستعملة لأسباب صحية وسلامة المستخدمين.
              </p>
            </div>
          </section>

          {/* How to return */}
          <section>
            <h2 className="text-xl font-black text-primary-900 mb-5">
              <span className="inline-block border-r-4 border-primary-700 pr-3">كيفية إرجاع المنتج</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {returnSteps.map((step, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 relative overflow-hidden">
                  <div className="absolute top-4 left-4 text-6xl font-black text-primary-50 select-none" style={{ lineHeight: 1 }}>
                    {step.num}
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 g-gold rounded-xl flex items-center justify-center text-white font-black text-lg mb-4">
                      {step.num}
                    </div>
                    <h3 className="font-black text-primary-900 text-base mb-2">{step.title}</h3>
                    <p className="text-xs text-primary-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-xl font-black text-primary-900 mb-5">
              <span className="inline-block border-r-4 border-primary-700 pr-3">الأسئلة الشائعة</span>
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-right hover:bg-primary-50/50 transition-colors"
                  >
                    <span className="font-bold text-primary-900 text-sm">{faq.q}</span>
                    <span className={`text-primary-500 transition-transform text-lg flex-shrink-0 mr-4 ${openFaq === i ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 pt-1 border-t border-primary-50">
                      <p className="text-sm text-primary-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="g-gold text-white rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="text-xl font-black mb-2">لديك سؤال آخر؟</h3>
            <p className="text-white/70 text-sm mb-5">فريق خدمة العملاء لدينا مستعد لمساعدتك في أي وقت</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/contact" className="bg-white text-primary-800 font-black px-6 py-2.5 rounded-full text-sm hover:bg-primary-50 transition-colors">
                تواصل معنا
              </Link>
              <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer"
                className="bg-green-500 text-white font-black px-6 py-2.5 rounded-full text-sm hover:bg-green-600 transition-colors">
                واتساب
              </a>
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
