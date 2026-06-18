'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/store/cart'
import { useAuth } from '@/store/auth'
import { orders as ordersApi, coupons as couponsApi, ApiError } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'

const CITIES = ['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الطائف','تبوك','أبها','نجران','حائل','جازان','القصيم']
const PAYMENTS = [
  { id:'cod',    icon:'💵', label:'الدفع عند الاستلام',    sub:'ادفع نقداً عند وصول طلبك',         logos:['COD'] },
  { id:'card',   icon:'💳', label:'بطاقة ائتمانية / مدى', sub:'فيزا، ماستركارد، مدى',             logos:['VISA','MC','مدى'] },
  { id:'apple',  icon:'🍎', label:'Apple Pay',             sub:'دفع سريع بلمسة واحدة',              logos:['Apple Pay'] },
  { id:'tabby',  icon:'📅', label:'تابي — ٤ أقساط',        sub:'بدون فائدة، موافقة فورية',         logos:['تابي'] },
  { id:'tamara', icon:'🟢', label:'تمارا — ٣ أقساط',       sub:'تقسيط شهري مريح',                  logos:['تمارا'] },
]

export default function CheckoutPage() {
  const { items, subtotal, shipping, discount, total, couponCode, couponPct, clearCart, applyCoupon } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [pay, setPay] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const POINTS_BALANCE = 240
  const POINTS_VALUE = Number((POINTS_BALANCE * 0.05).toFixed(2))
  const [usePoints, setUsePoints] = useState(false)

  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', email:'', address:'', city:'الرياض', postal:'', notes:'' })
  const [card, setCard] = useState({ number:'', expiry:'', cvv:'', name:'' })
  const [errors, setErrors] = useState<Record<string,string>>({})

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const sub = subtotal(), ship = shipping(), disc = discount(), tot = total()
  const finalTotal = usePoints ? Math.max(0, tot - POINTS_VALUE) : tot

  const set = (k: string, v: string) => setForm(f => ({...f, [k]: v}))

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.firstName.trim()) e.firstName = 'الاسم مطلوب'
    if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب'
    if (!form.address.trim()) e.address = 'العنوان مطلوب'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'بريد إلكتروني غير صالح'
    if (pay === 'card') {
      if (card.number.replace(/\s/g,'').length < 16) e.cardNumber = 'رقم البطاقة غير صحيح'
      if (!card.cvv || card.cvv.length < 3) e.cvv = 'CVV مطلوب'
      if (!card.expiry) e.expiry = 'تاريخ الانتهاء مطلوب'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateCouponWithApi = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const res = await couponsApi.validate(couponInput.trim(), sub)
      if (res.valid) {
        const applied = applyCoupon(couponInput.trim().toUpperCase())
        if (applied) toast.success(`✅ تم تطبيق الكوبون — خصم ${res.discountValue}${res.discountType === 'percentage' ? '٪' : ' ر.س'}`)
        else toast.error('الكوبون غير صالح لهذا الطلب')
      } else {
        toast.error(res.message || 'الكوبون غير صالح')
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'تعذّر التحقق من الكوبون')
    } finally { setCouponLoading(false) }
  }

  const placeOrder = async () => {
    if (!validate()) { toast.error('⚠️ يرجى ملء جميع الحقول المطلوبة'); return }
    if (items.length === 0) { toast.error('السلة فارغة'); return }
    setPlacing(true)
    try {
      const orderItems = items.map(i => ({ productId: i.slug, qty: i.qty }))
      const res = await ordersApi.create({
        items: orderItems,
        shippingAddress: { address: form.address, city: form.city, postal: form.postal || undefined, notes: form.notes || undefined },
        paymentMethod: pay,
        couponCode: couponCode || undefined,
        ...(!isAuthenticated() && { guestInfo: { firstName: form.firstName, lastName: form.lastName, phone: form.phone, email: form.email || undefined } }),
      })
      clearCart()
      router.push(`/order-success?id=${res.order.orderNumber}&total=${res.order.total.toFixed(2)}`)
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'حدث خطأ أثناء تقديم الطلب، يرجى المحاولة مرة أخرى')
      setPlacing(false)
    }
  }

  const fmtCard = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const fmtExp  = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? `${d.slice(0,2)} / ${d.slice(2)}` : d }

  const InputField = ({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-xs font-bold text-primary-700 mb-1">{label}</label>
      <input {...props} className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm text-primary-900 focus:outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-primary-200 bg-primary-50 focus:border-primary-400'}`} />
      {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
    </div>
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Connecting line background */}
              <div className="absolute top-5 right-0 left-0 h-0.5 bg-primary-200 z-0" />
              {/* Connecting line fill */}
              <div className="absolute top-5 right-0 h-0.5 bg-primary-700 z-0 transition-all" style={{ width: '50%' }} />
              {[
                { step: 1, label: 'سلة التسوق', done: true },
                { step: 2, label: 'التفاصيل', active: true },
                { step: 3, label: 'الدفع', upcoming: true },
                { step: 4, label: 'تم الطلب', upcoming: true },
              ].map(s => (
                <div key={s.step} className="flex flex-col items-center gap-2 z-10 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all
                    ${s.done ? 'g-gold text-white border-primary-700' :
                      s.active ? 'bg-white border-primary-700 text-primary-700 animate-pulse' :
                      'bg-white border-primary-200 text-primary-300'}`}>
                    {s.done ? '✓' : s.step}
                  </div>
                  <span className={`text-xs font-bold ${s.done || s.active ? 'text-primary-700' : 'text-primary-300'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-7">
            <Link href="/cart" className="text-primary-400 hover:text-primary-700 transition-colors">← السلة</Link>
            <span className="text-primary-200">›</span>
            <h1 className="text-xl font-black text-primary-900">🔒 إتمام الشراء</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl"><p className="text-lg font-black text-primary-700 mb-4">السلة فارغة</p><Link href="/" className="g-gold text-white font-black px-6 py-3 rounded-full">تسوق الآن</Link></div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">

              {/* Left: Form */}
              <div className="lg:col-span-2 space-y-5">

                {/* Delivery */}
                <div className="bg-white border border-primary-100 rounded-2xl p-6">
                  <h2 className="font-black text-primary-900 mb-4 flex items-center gap-2">📍 <span>معلومات التوصيل</span></h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="الاسم الأول *" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="أحمد" error={errors.firstName} />
                    <InputField label="اسم العائلة" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="الرشيدي" />
                    <InputField label="رقم الهاتف *" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+٩٦٦ ٥X XXX XXXX" type="tel" error={errors.phone} />
                    <InputField label="البريد الإلكتروني" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ahmed@email.com" type="email" error={errors.email} />
                    <div className="sm:col-span-2">
                      <InputField label="عنوان الشارع *" value={form.address} onChange={e => set('address', e.target.value)} placeholder="رقم المبنى، اسم الشارع، الحي" error={errors.address} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary-700 mb-1">المدينة</label>
                      <select value={form.city} onChange={e => set('city', e.target.value)} className="w-full px-3 py-2.5 border-2 border-primary-200 bg-primary-50 rounded-xl text-sm text-primary-900 focus:outline-none focus:border-primary-400">
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <InputField label="الرمز البريدي" value={form.postal} onChange={e => set('postal', e.target.value)} placeholder="١٢٣٤٥" />
                    <div className="sm:col-span-2">
                      <InputField label="ملاحظات التوصيل (اختياري)" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="الدور، الشقة، أي تعليمات خاصة..." />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-white border border-primary-100 rounded-2xl p-6">
                  <h2 className="font-black text-primary-900 mb-4 flex items-center gap-2">💳 <span>طريقة الدفع</span></h2>
                  <div className="space-y-3">
                    {PAYMENTS.map(pm => (
                      <label key={pm.id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${pay === pm.id ? 'border-primary-500 bg-primary-50' : 'border-primary-100 hover:border-primary-200 bg-white'}`} onClick={() => setPay(pm.id)}>
                        <input type="radio" name="pay" value={pm.id} checked={pay === pm.id} onChange={() => setPay(pm.id)} className="accent-primary-600 w-4 h-4" />
                        <span className="text-2xl">{pm.icon}</span>
                        <div className="flex-1">
                          <p className="font-black text-sm text-primary-900">{pm.label}</p>
                          <p className="text-xs text-primary-400">{pm.sub}</p>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {pm.logos.map(l => <span key={l} className="bg-primary-900 text-primary-300 text-[9px] font-black px-2 py-0.5 rounded">{l}</span>)}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Card form */}
                  {pay === 'card' && (
                    <div className="mt-4 bg-primary-50 border border-primary-200 rounded-2xl p-4 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-primary-700 mb-1">رقم البطاقة *</label>
                        <input value={card.number} onChange={e => setCard(c => ({...c, number: fmtCard(e.target.value)}))} placeholder="١٢٣٤ ٥٦٧٨ ٩٠١٢ ٣٤٥٦" maxLength={19} className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm font-mono tracking-widest focus:outline-none transition-colors ${errors.cardNumber ? 'border-red-400 bg-red-50' : 'border-primary-200 bg-white focus:border-primary-400'}`} />
                        {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-primary-700 mb-1">تاريخ الانتهاء *</label>
                          <input value={card.expiry} onChange={e => setCard(c => ({...c, expiry: fmtExp(e.target.value)}))} placeholder="MM / YY" maxLength={7} className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors ${errors.expiry ? 'border-red-400 bg-red-50' : 'border-primary-200 bg-white focus:border-primary-400'}`} />
                          {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-primary-700 mb-1">CVV *</label>
                          <input value={card.cvv} onChange={e => setCard(c => ({...c, cvv: e.target.value.slice(0,4)}))} placeholder="١٢٣" maxLength={4} type="password" className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors ${errors.cvv ? 'border-red-400 bg-red-50' : 'border-primary-200 bg-white focus:border-primary-400'}`} />
                          {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary-700 mb-1">اسم حامل البطاقة</label>
                        <input value={card.name} onChange={e => setCard(c => ({...c, name: e.target.value.toUpperCase()}))} placeholder="AHMED AL RASHIDI" className="w-full px-3 py-2.5 border-2 border-primary-200 bg-white rounded-xl text-sm focus:outline-none focus:border-primary-400 uppercase" />
                      </div>
                      <p className="text-[10px] text-primary-400 flex items-center gap-1">🔒 دفعتك مشفرة بتقنية SSL 256 بت — بياناتك آمنة تماماً</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Summary */}
              <div className="space-y-4">
                <div className="bg-white border border-primary-100 rounded-2xl p-5 sticky top-24">
                  <h3 className="font-black text-primary-900 mb-4">📋 ملخص الطلب</h3>
                  <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-primary-50 overflow-hidden">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-primary-800 font-semibold text-xs clamp-1">{item.name}</p>
                          <p className="text-primary-400 text-xs">×{item.qty}</p>
                        </div>
                        <p className="font-black text-primary-700 text-xs flex-shrink-0">{(item.price*item.qty).toFixed(2)} ر.س</p>
                      </div>
                    ))}
                  </div>
                  {/* Loyalty points */}
                  <div className="border border-primary-200 rounded-xl p-3 mb-3 bg-primary-50">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} className="accent-primary-600 w-4 h-4" />
                      <div className="flex-1">
                        <p className="text-sm font-black text-primary-900">استخدم نقاطك</p>
                        <p className="text-xs text-primary-500">{POINTS_BALANCE} نقطة = {POINTS_VALUE} ر.س خصم</p>
                      </div>
                      <span className="text-xs font-black text-primary-600 bg-white border border-primary-200 px-2 py-1 rounded-lg">{POINTS_BALANCE} نقطة</span>
                    </label>
                  </div>

                  <div className="space-y-2 text-sm border-t border-primary-100 pt-3">
                    <div className="flex justify-between text-primary-600"><span>المجموع</span><span>{sub.toFixed(2)} ر.س</span></div>
                    <div className="flex justify-between text-primary-600">
                      <span>الشحن</span>
                      <span className={ship===0?'text-emerald-600 font-bold':''}>{ship===0?'مجاني 🎉':`${ship.toFixed(2)} ر.س`}</span>
                    </div>
                    {disc > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>خصم {couponPct}٪</span><span>-{disc.toFixed(2)} ر.س</span></div>}
                    {couponCode && <div className="text-xs text-primary-400 text-left">كود: {couponCode}</div>}
                    {usePoints && <div className="flex justify-between text-emerald-600 font-bold"><span>خصم النقاط</span><span>-{POINTS_VALUE} ر.س</span></div>}
                  </div>
                  <div className="flex justify-between font-black text-base mt-3 pt-3 border-t border-primary-100">
                    <span>الإجمالي</span>
                    <span className="text-primary-600">{finalTotal.toFixed(2)} ر.س</span>
                  </div>

                  <button onClick={placeOrder} disabled={placing}
                    className={`w-full py-4 rounded-2xl font-black text-[15px] mt-4 transition-all shadow-lg ${placing ? 'bg-emerald-500 text-white' : 'g-gold text-white hover:shadow-xl'}`}>
                    {placing ? '⏳ جاري تأكيد الطلب...' : `✅ تأكيد الطلب — ${finalTotal.toFixed(2)} ر.س`}
                  </button>
                  <p className="text-center text-[10px] text-primary-400 mt-2">🔒 بيانات مشفرة بالكامل</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
