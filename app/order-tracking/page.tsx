'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import Link from 'next/link'

const steps = [
  { icon: '📝', labelAr: 'تم استقبال الطلب', done: true, active: false, date: 'الأحد، ١٥ يونيو ٢٠٢٥', time: '١٠:٣٢ ص', desc: 'تم استلام طلبك بنجاح وجاري المعالجة' },
  { icon: '✅', labelAr: 'تأكيد الطلب', done: true, active: false, date: 'الأحد، ١٥ يونيو ٢٠٢٥', time: '١١:١٥ ص', desc: 'تم تأكيد طلبك ومعالجة الدفع' },
  { icon: '📦', labelAr: 'جارٍ التحضير', done: true, active: false, date: 'الإثنين، ١٦ يونيو ٢٠٢٥', time: '٩:٠٠ ص', desc: 'فريقنا يحضّر طلبك بعناية' },
  { icon: '🚚', labelAr: 'تم الشحن', done: false, active: true, date: 'اليوم', time: '٢:٤٥ م', desc: 'طلبك في الطريق إليك عبر أرامكس' },
  { icon: '🏠', labelAr: 'تم التسليم', done: false, active: false, date: 'متوقع غداً', time: '', desc: 'سيصلك الطلب في أقرب وقت' },
]

export default function OrderTrackingPage() {
  const [orderNum, setOrderNum] = useState('')
  const [contact, setContact] = useState('')
  const [tracked, setTracked] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = () => {
    if (!orderNum.trim()) {
      setError('الرجاء إدخال رقم الطلب')
      return
    }
    if (!contact.trim()) {
      setError('الرجاء إدخال رقم الجوال أو البريد الإلكتروني')
      return
    }
    if (orderNum.trim().toUpperCase().startsWith('NOVI')) {
      setError('')
      setTracked(true)
    } else {
      setError('رقم الطلب غير موجود. جرّب رقماً يبدأ بـ NOVI مثل: NOVI-12345')
      setTracked(false)
    }
  }

  const handleReset = () => {
    setTracked(false)
    setOrderNum('')
    setContact('')
    setError('')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-nav" dir="rtl">

        {/* Page header */}
        <div className="g-gold text-white py-10 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-3">📦</div>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: 'Amiri,serif' }}>
              تتبّع طلبك
            </h1>
            <p className="text-white/70 text-sm">
              أدخل رقم طلبك لمعرفة حالته الآن
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-primary-100 py-3">
          <div className="max-w-screen-lg mx-auto px-4 text-xs text-primary-400 flex items-center gap-2">
            <Link href="/" className="hover:text-primary-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-primary-800 font-semibold">تتبّع الطلب</span>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-10">

          {/* Search form */}
          {!tracked && (
            <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 md:p-10 max-w-xl mx-auto mb-8">
              <h2 className="text-xl font-black text-primary-900 mb-6 text-center">أدخل بيانات الطلب</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-primary-700 mb-1.5">رقم الطلب *</label>
                  <input
                    type="text"
                    placeholder="مثال: NOVI-12345"
                    value={orderNum}
                    onChange={e => setOrderNum(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTrack()}
                    className="w-full border-2 border-primary-200 rounded-xl px-4 py-3 text-primary-900 font-bold placeholder:font-normal placeholder:text-primary-300 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-700 mb-1.5">رقم الجوال أو البريد الإلكتروني *</label>
                  <input
                    type="text"
                    placeholder="05xxxxxxxx أو example@email.com"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTrack()}
                    className="w-full border-2 border-primary-200 rounded-xl px-4 py-3 text-primary-900 placeholder:font-normal placeholder:text-primary-300 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-semibold">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={handleTrack}
                  className="w-full g-gold text-white font-black py-3.5 rounded-xl text-base hover:opacity-90 transition-opacity"
                >
                  🔍 تتبّع الطلب
                </button>
              </div>

              <p className="text-center text-xs text-primary-400 mt-4">
                وضع تجريبي: استخدم رقم طلب يبدأ بـ{' '}
                <span className="font-black text-primary-600">NOVI</span>{' '}
                لرؤية نتيجة تجريبية
              </p>
            </div>
          )}

          {/* Tracking result */}
          {tracked && (
            <div className="max-w-2xl mx-auto">
              {/* Order summary card */}
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 mb-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-primary-400 font-semibold mb-1">رقم الطلب</p>
                    <p className="text-lg font-black text-primary-900 tracking-wide">{orderNum.toUpperCase()}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1.5 rounded-full">
                    🚚 قيد الشحن
                  </span>
                </div>
                <div className="border-t border-primary-100 mt-4 pt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-primary-400 text-xs mb-1">تاريخ الطلب</p>
                    <p className="font-bold text-primary-800">الأحد، ١٥ يونيو ٢٠٢٥</p>
                  </div>
                  <div>
                    <p className="text-primary-400 text-xs mb-1">التسليم المتوقع</p>
                    <p className="font-bold text-green-700">غداً، ١٧ يونيو ٢٠٢٥</p>
                  </div>
                </div>
              </div>

              {/* Carrier info */}
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 g-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🚚</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-primary-900">أرامكس — Aramex</p>
                  <p className="text-xs text-primary-500 mt-0.5">رقم التتبع: <span className="font-bold text-primary-700">ARX-9874562310-SA</span></p>
                </div>
                <a
                  href="https://www.aramex.com/sa/ar/track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-black text-primary-600 underline underline-offset-2"
                >
                  تتبع مباشر
                </a>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 mb-6">
                <h3 className="font-black text-primary-900 text-base mb-6">مراحل الطلب</h3>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute right-5 top-5 bottom-5 w-0.5 bg-primary-100" />

                  <div className="space-y-6">
                    {steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        {/* Step circle */}
                        <div className={`
                          relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                          border-2 transition-all
                          ${step.done
                            ? 'bg-primary-700 border-primary-700 text-white'
                            : step.active
                              ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                              : 'bg-white border-primary-200 text-primary-300'
                          }
                        `}>
                          {step.done ? '✓' : step.icon}
                        </div>
                        {/* Step content */}
                        <div className={`flex-1 pt-1 ${!step.done && !step.active ? 'opacity-40' : ''}`}>
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <p className={`font-black text-sm ${step.active ? 'text-amber-700' : step.done ? 'text-primary-900' : 'text-primary-400'}`}>
                              {step.labelAr}
                              {step.active && (
                                <span className="mr-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">جاري الآن</span>
                              )}
                            </p>
                            <div className="text-left text-xs text-primary-400">
                              <span>{step.date}</span>
                              {step.time && <span className="mr-2">{step.time}</span>}
                            </div>
                          </div>
                          <p className="text-xs text-primary-500 mt-1">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 border-2 border-primary-200 text-primary-700 font-bold py-3 rounded-xl hover:border-primary-400 transition-colors"
                >
                  تتبّع طلب آخر
                </button>
                <Link
                  href="/contact"
                  className="flex-1 g-gold text-white font-black py-3 rounded-xl text-center hover:opacity-90 transition-opacity"
                >
                  💬 تواصل مع الدعم
                </Link>
              </div>
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
