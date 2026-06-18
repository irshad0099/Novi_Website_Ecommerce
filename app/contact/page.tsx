'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import WhatsAppButton from '@/components/WhatsAppButton'
import ScrollToTop from '@/components/ScrollToTop'
import Link from 'next/link'

const subjects = [
  { value: 'general', label: 'استفسار عام' },
  { value: 'complaint', label: 'شكوى' },
  { value: 'return', label: 'طلب إرجاع' },
  { value: 'suggestion', label: 'اقتراح' },
]

const contactCards = [
  { icon: '📞', title: 'هاتف', value: '920000000', sub: 'السبت–الخميس ٨ص–١٠م', href: 'tel:920000000' },
  { icon: '✉️', title: 'بريد إلكتروني', value: 'info@nadaalhareer.sa', sub: 'نرد خلال ٢٤ ساعة', href: 'mailto:info@nadaalhareer.sa' },
  { icon: '💬', title: 'واتساب', value: '+966 500 000 000', sub: 'دردشة مباشرة', href: 'https://wa.me/966500000000' },
  { icon: '🕐', title: 'أوقات العمل', value: 'السبت–الخميس', sub: '٨ صباحاً – ١٠ مساءً', href: null },
]

const socialLinks = [
  { label: 'Instagram', icon: '📸', href: 'https://instagram.com/nadaalhareer' },
  { label: 'Twitter', icon: '🐦', href: 'https://twitter.com/nadaalhareer' },
  { label: 'Snapchat', icon: '👻', href: 'https://snapchat.com/add/nadaalhareer' },
  { label: 'TikTok', icon: '🎵', href: 'https://tiktok.com/@nadaalhareer' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'general', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'الاسم مطلوب'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'بريد إلكتروني غير صالح'
    if (!form.phone.trim() || form.phone.length < 9) e.phone = 'رقم جوال غير صالح'
    if (!form.message.trim() || form.message.length < 10) e.message = 'الرسالة يجب أن تكون أكثر من ١٠ أحرف'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1200)
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }))
    if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-nav" dir="rtl">

        {/* Page header */}
        <div className="g-gold text-white py-12 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-3">💬</div>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: 'Amiri,serif' }}>
              تواصل معنا
            </h1>
            <p className="text-white/70 text-sm">
              نحن هنا للإجابة على جميع استفساراتك ومساعدتك في أي وقت
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-primary-100 py-3">
          <div className="max-w-screen-xl mx-auto px-4 text-xs text-primary-400 flex items-center gap-2">
            <Link href="/" className="hover:text-primary-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-primary-800 font-semibold">تواصل معنا</span>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-10">

          {/* Contact info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {contactCards.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-primary-100 p-5 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{card.icon}</div>
                <p className="text-xs text-primary-400 font-semibold mb-1">{card.title}</p>
                {card.href ? (
                  <a href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="font-black text-primary-800 text-sm hover:text-primary-500 transition-colors block mb-0.5">
                    {card.value}
                  </a>
                ) : (
                  <p className="font-black text-primary-800 text-sm mb-0.5">{card.value}</p>
                )}
                <p className="text-xs text-primary-400">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Contact form */}
            <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 g-gold rounded-full flex items-center justify-center text-3xl mb-5 text-white">
                    ✓
                  </div>
                  <h3 className="text-2xl font-black text-primary-900 mb-3">تم إرسال رسالتك!</h3>
                  <p className="text-primary-500 text-sm leading-relaxed max-w-xs">
                    شكراً لتواصلك معنا. سيقوم فريقنا بالرد عليك خلال ٢٤ ساعة عمل.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: 'general', message: '' }) }}
                    className="mt-6 border-2 border-primary-200 text-primary-700 font-bold px-6 py-2.5 rounded-xl hover:border-primary-400 transition-colors text-sm"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black text-primary-900 mb-6">أرسل لنا رسالة</h2>
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-primary-700 mb-1.5">الاسم الكامل *</label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder="محمد العلي"
                          className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm text-primary-900 placeholder:text-primary-300 focus:outline-none transition-colors ${errors.name ? 'border-red-300 focus:border-red-400' : 'border-primary-200 focus:border-primary-500'}`} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary-700 mb-1.5">رقم الجوال *</label>
                        <input type="tel" value={form.phone} onChange={set('phone')} placeholder="05xxxxxxxx"
                          className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm text-primary-900 placeholder:text-primary-300 focus:outline-none transition-colors ${errors.phone ? 'border-red-300 focus:border-red-400' : 'border-primary-200 focus:border-primary-500'}`} />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary-700 mb-1.5">البريد الإلكتروني *</label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="example@email.com"
                        className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm text-primary-900 placeholder:text-primary-300 focus:outline-none transition-colors ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-primary-200 focus:border-primary-500'}`} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary-700 mb-1.5">الموضوع</label>
                      <select value={form.subject} onChange={set('subject')}
                        className="w-full border-2 border-primary-200 rounded-xl px-4 py-2.5 text-sm text-primary-900 focus:outline-none focus:border-primary-500 transition-colors bg-white">
                        {subjects.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary-700 mb-1.5">الرسالة *</label>
                      <textarea value={form.message} onChange={set('message')} rows={5} placeholder="اكتب رسالتك هنا..."
                        className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm text-primary-900 placeholder:text-primary-300 focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-300 focus:border-red-400' : 'border-primary-200 focus:border-primary-500'}`} />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full g-gold text-white font-black py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          جارٍ الإرسال...
                        </>
                      ) : '📤 إرسال الرسالة'}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Map + Social */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden">
                <div className="g-gold text-white px-5 py-3">
                  <p className="font-black text-sm">📍 موقعنا — الرياض، المملكة العربية السعودية</p>
                </div>
                <iframe
                  src="https://maps.google.com/maps?q=Riyadh,Saudi+Arabia&output=embed"
                  className="w-full h-56 md:h-72 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع نَدى الحرير"
                />
              </div>

              {/* Social links */}
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6">
                <h3 className="font-black text-primary-900 text-base mb-4">تابعنا على منصات التواصل</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 border-2 border-primary-100 rounded-xl px-4 py-3 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                      <span className="text-xl">{s.icon}</span>
                      <span className="font-bold text-sm text-primary-700 group-hover:text-primary-900">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick WhatsApp */}
              <a
                href="https://wa.me/966500000000?text=السلام عليكم، أود الاستفسار عن منتجاتكم"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-green-600 text-white rounded-2xl p-5 hover:bg-green-700 transition-colors"
              >
                <span className="text-3xl">💬</span>
                <div>
                  <p className="font-black text-base">تحدّث معنا على واتساب</p>
                  <p className="text-green-100 text-xs mt-0.5">نرد فورياً خلال دقائق</p>
                </div>
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
