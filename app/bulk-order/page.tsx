'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'

const CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'الدمام', 'الخبر', 'الطائف', 'أخرى']

const PRODUCT_TYPES = [
  { id: 'face', label: 'مناديل الوجه' },
  { id: 'wet', label: 'مناديل مبللة' },
  { id: 'cotton', label: 'مناشف قطنية' },
  { id: 'kitchen', label: 'مناشف مطبخ' },
  { id: 'pocket', label: 'مناديل جيب' },
  { id: 'bundles', label: 'بكجات توفير' },
]

const QUANTITY_OPTIONS = [
  '١٠٠-٥٠٠',
  '٥٠٠-١٠٠٠',
  '١٠٠٠-٥٠٠٠',
  'أكثر من ٥٠٠٠',
]

const BENEFITS = [
  { icon: '💰', title: 'خصم ٢٠٪ على الطلبيات الكبيرة', desc: 'وفّر أكثر كلما طلبت أكثر مع خصوماتنا الخاصة للجملة' },
  { icon: '🚚', title: 'توصيل مجاني', desc: 'نوصل طلبك لأي مكان في المملكة بدون رسوم شحن' },
  { icon: '🧾', title: 'فاتورة رسمية', desc: 'نصدر فواتير ضريبية رسمية معتمدة لجميع طلبات الشركات' },
  { icon: '👤', title: 'مدير حساب مخصص', desc: 'مندوب متخصص يتابع طلبك ويضمن رضاك الكامل' },
]

export default function BulkOrderPage() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    city: 'الرياض',
    products: [] as string[],
    quantity: '',
    notes: '',
    deliveryDate: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const toggleProduct = (id: string) => {
    setForm(f => ({
      ...f,
      products: f.products.includes(id)
        ? f.products.filter(p => p !== id)
        : [...f.products, id],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName.trim() || !form.contactName.trim() || !form.phone.trim() || !form.email.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 pb-20 md:pb-0">

        {/* Hero section */}
        <div className="bg-primary-900 text-white py-16 px-4">
          <div className="max-w-screen-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4 text-xs font-bold text-primary-200">
              🏢 للشركات والجهات
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: 'Amiri, serif' }}>
              طلبات الجملة والشركات
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              نوفّر حلول مناديل متكاملة للشركات والفنادق والمستشفيات والجهات الحكومية. أسعار خاصة وخدمة مميزة.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-screen-xl mx-auto px-4 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4 shadow-sm text-center">
                <div className="text-3xl mb-2">{b.icon}</div>
                <h3 className="text-xs font-black text-primary-900 mb-1 leading-snug">{b.title}</h3>
                <p className="text-[10px] text-primary-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form or Success */}
        <div className="max-w-screen-lg mx-auto px-4 py-10">
          {submitted ? (
            <div className="bg-white border border-primary-100 rounded-3xl p-10 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full g-gold text-white flex items-center justify-center text-4xl mx-auto mb-5">
                ✅
              </div>
              <h2 className="text-2xl font-black text-primary-900 mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                تم إرسال طلبك بنجاح!
              </h2>
              <p className="text-primary-600 font-bold mb-1">سنتواصل معك خلال ٢٤ ساعة</p>
              <p className="text-primary-400 text-sm mb-6">فريقنا المتخصص سيراجع طلبك ويرسل لك عرض السعر المناسب</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ companyName: '', contactName: '', phone: '', email: '', city: 'الرياض', products: [], quantity: '', notes: '', deliveryDate: '' }) }}
                className="g-gold text-white font-black px-8 py-3 rounded-full text-sm"
              >
                تقديم طلب جديد
              </button>
            </div>
          ) : (
            <div className="bg-white border border-primary-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-black text-primary-900 mb-6 flex items-center gap-2">
                📋 <span>تفاصيل طلب الجملة</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Company info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary-700 mb-1.5">اسم الشركة *</label>
                    <input
                      required
                      value={form.companyName}
                      onChange={e => set('companyName', e.target.value)}
                      placeholder="مثال: شركة الأمل للتجارة"
                      className="w-full px-4 py-3 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary-700 mb-1.5">اسم جهة الاتصال *</label>
                    <input
                      required
                      value={form.contactName}
                      onChange={e => set('contactName', e.target.value)}
                      placeholder="مثال: أحمد الرشيدي"
                      className="w-full px-4 py-3 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary-700 mb-1.5">رقم الهاتف *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="+٩٦٦ ٥X XXX XXXX"
                      className="w-full px-4 py-3 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary-700 mb-1.5">البريد الإلكتروني *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="info@company.com"
                      className="w-full px-4 py-3 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-primary-700 mb-1.5">المدينة</label>
                  <select
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400 transition-colors"
                  >
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Products checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-primary-700 mb-3">المنتجات المطلوبة</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PRODUCT_TYPES.map(pt => (
                      <label
                        key={pt.id}
                        className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${form.products.includes(pt.id) ? 'border-primary-500 bg-primary-50' : 'border-primary-100 bg-white hover:border-primary-200'}`}
                      >
                        <input
                          type="checkbox"
                          checked={form.products.includes(pt.id)}
                          onChange={() => toggleProduct(pt.id)}
                          className="accent-primary-600 w-4 h-4 flex-shrink-0"
                        />
                        <span className="text-sm font-bold text-primary-800">{pt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quantity + Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary-700 mb-1.5">الكمية التقريبية</label>
                    <select
                      value={form.quantity}
                      onChange={e => set('quantity', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400 transition-colors"
                    >
                      <option value="">اختر الكمية...</option>
                      {QUANTITY_OPTIONS.map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary-700 mb-1.5">تاريخ التوصيل المفضل</label>
                    <input
                      type="date"
                      value={form.deliveryDate}
                      onChange={e => set('deliveryDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Special requirements */}
                <div>
                  <label className="block text-xs font-bold text-primary-700 mb-1.5">متطلبات خاصة (اختياري)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    placeholder="أي تفاصيل أو متطلبات خاصة تودّ إضافتها..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-lg ${loading ? 'bg-primary-400 text-white cursor-wait' : 'g-gold text-white hover:shadow-xl'}`}
                >
                  {loading ? '⏳ جاري الإرسال...' : '📤 إرسال طلب الجملة'}
                </button>

                <p className="text-center text-xs text-primary-400">
                  بإرسال هذا النموذج توافق على تلقي رد من فريق المبيعات خلال ٢٤ ساعة
                </p>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
