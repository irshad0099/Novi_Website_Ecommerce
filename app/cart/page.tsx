'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/store/cart'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, shipping, discount, total, applyCoupon, removeCoupon, couponCode, couponPct } = useCart()
  const [coupon, setCoupon] = useState('')
  const [mounted, setMounted] = useState(false)
  const [giftMsg, setGiftMsg] = useState('')
  const [showGift, setShowGift] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const sub = subtotal(), ship = shipping(), disc = discount(), tot = total()

  const handleCoupon = () => {
    const ok = applyCoupon(coupon)
    if (ok) { toast.success(`🎉 خصم ${useCart.getState().couponPct}٪ مفعّل!`); setCoupon('') }
    else toast.error('❌ كود غير صالح. جرّب NADA10')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-50 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-black text-primary-900 mb-7" style={{fontFamily:'Amiri,serif'}}>🛒 سلة التسوق</h1>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-primary-100">
              <div className="text-7xl mb-5">🛒</div>
              <p className="text-xl font-black text-primary-700 mb-2">سلتك فارغة</p>
              <p className="text-primary-400 mb-7">أضف منتجات من متجرنا للبدء</p>
              <Link href="/" className="g-gold text-white font-black px-8 py-3.5 rounded-full inline-block shadow-md">تسوق الآن →</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Items list */}
              <div className="md:col-span-2 space-y-3">
                {items.map(item => {
                  const disc2 = item.comparePrice ? Math.round((1 - item.price / item.comparePrice) * 100) : 0
                  return (
                    <div key={item.id} className="bg-white border border-primary-100 rounded-2xl p-4 flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-primary-50 border border-primary-100">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display='none')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.slug}`} className="text-sm font-bold text-primary-900 hover:text-primary-600 leading-snug line-clamp-2 block mb-1">{item.name}</Link>
                        <p className="text-xs text-primary-400 mb-3">{item.category.name} · {item.sku}</p>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-2 border border-primary-200 rounded-xl overflow-hidden">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-9 h-9 flex items-center justify-center text-lg font-black text-primary-700 hover:bg-primary-50">−</button>
                            <span className="w-8 text-center font-black text-sm">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-9 h-9 flex items-center justify-center text-lg font-black text-primary-700 hover:bg-primary-50">+</button>
                          </div>
                          <div className="text-left">
                            <p className="font-black text-base text-primary-600">{(item.price * item.qty).toFixed(2)} ر.س</p>
                            {item.comparePrice && <p className="text-xs text-primary-300 line-through">{(item.comparePrice * item.qty).toFixed(2)} ر.س</p>}
                          </div>
                          <button onClick={() => { removeItem(item.id); toast('🗑️ تم الحذف') }} className="p-2 text-primary-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <Link href="/category/all" className="flex items-center gap-2 text-primary-500 font-bold text-sm hover:text-primary-700 pt-2">
                  ← متابعة التسوق
                </Link>

                {/* Gift Message */}
                <div className="bg-white border border-primary-100 rounded-2xl p-5">
                  <button
                    onClick={() => setShowGift(v => !v)}
                    className={`w-full flex items-center justify-between text-sm font-bold transition-all ${showGift ? 'text-primary-900' : 'text-primary-600'}`}
                  >
                    <span>🎁 إضافة رسالة هدية</span>
                    <span>{showGift ? '▲' : '▼'}</span>
                  </button>
                  {showGift && (
                    <div className="mt-3">
                      <div className={`border-2 rounded-xl overflow-hidden transition-colors ${giftMsg ? 'border-primary-400' : 'border-primary-200'}`}>
                        <textarea
                          value={giftMsg}
                          onChange={e => setGiftMsg(e.target.value.slice(0, 150))}
                          placeholder="اكتب رسالتك هنا... مثال: كل عام وأنت بخير يا أمي 💙"
                          rows={3}
                          className="w-full px-4 py-3 text-sm text-primary-900 bg-white resize-none focus:outline-none"
                        />
                        <div className="flex items-center justify-between px-4 py-2 bg-primary-50 border-t border-primary-100">
                          <span className="text-xs text-primary-400">الحد الأقصى ١٥٠ حرفاً</span>
                          <span className={`text-xs font-bold ${giftMsg.length >= 140 ? 'text-red-500' : 'text-primary-400'}`}>
                            {giftMsg.length}/150
                          </span>
                        </div>
                      </div>
                      {giftMsg && (
                        <div className="mt-2 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
                          <p className="text-xs font-bold text-primary-600 mb-1">معاينة الرسالة:</p>
                          <p className="text-sm text-primary-800 italic">"{giftMsg}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                {/* Coupon */}
                <div className="bg-white border border-primary-100 rounded-2xl p-5">
                  <h3 className="font-black text-sm text-primary-900 mb-3">🏷️ كود الخصم</h3>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <span className="text-sm font-bold text-emerald-700">✅ {couponCode} — خصم {couponPct}٪</span>
                      <button onClick={removeCoupon} className="text-xs text-red-500 font-bold">إلغاء</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && handleCoupon()} placeholder="NADA10..." className="flex-1 px-3 py-2.5 border border-primary-200 rounded-xl text-sm bg-primary-50 focus:outline-none focus:border-primary-400" />
                      <button onClick={handleCoupon} className="px-4 py-2.5 border-2 border-primary-400 text-primary-700 font-bold text-sm rounded-xl hover:bg-primary-50">تطبيق</button>
                    </div>
                  )}
                  <p className="text-[10px] text-primary-400 mt-2">أكواد متاحة: NADA10 · NADA15 · NADA20 · WELCOME5</p>
                </div>

                {/* Totals */}
                <div className="bg-white border border-primary-100 rounded-2xl p-5 space-y-3">
                  <h3 className="font-black text-sm text-primary-900 mb-1">📋 ملخص الطلب</h3>
                  <div className="flex justify-between text-sm text-primary-600"><span>المجموع الفرعي</span><span>{sub.toFixed(2)} ر.س</span></div>
                  <div className="flex justify-between text-sm text-primary-600">
                    <span>الشحن</span>
                    <span className={ship === 0 ? 'text-emerald-600 font-bold' : ''}>{ship === 0 ? 'مجاني 🎉' : `${ship.toFixed(2)} ر.س`}</span>
                  </div>
                  {disc > 0 && <div className="flex justify-between text-sm text-emerald-600 font-bold"><span>الخصم ({couponPct}٪)</span><span>-{disc.toFixed(2)} ر.س</span></div>}
                  {giftMsg && (
                    <div className="flex justify-between text-sm text-primary-600">
                      <span>رسالة هدية</span>
                      <span className="text-emerald-600 font-bold">✓ مضافة</span>
                    </div>
                  )}
                  {sub < 150 && (
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 text-center">
                      <p className="text-xs text-primary-700 font-semibold">🚚 أضف <strong>{(150-sub).toFixed(2)} ر.س</strong> للشحن المجاني!</p>
                      <div className="mt-2 bg-primary-200 rounded-full h-1.5">
                        <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{width:`${Math.min(100,(sub/150)*100)}%`}} />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-base pt-2 border-t border-primary-100">
                    <span>الإجمالي</span>
                    <span className="text-primary-600">{tot.toFixed(2)} ر.س</span>
                  </div>
                  <Link href="/checkout" className="w-full g-gold text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-[15px] shadow-lg hover:shadow-xl transition-shadow">
                    🔒 إتمام الشراء
                  </Link>
                  <p className="text-center text-[10px] text-primary-400">🔒 دفع آمن SSL 256bit</p>
                </div>

                {/* Payment icons */}
                <div className="bg-white border border-primary-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-primary-500 mb-3 text-center">طرق الدفع المتاحة</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['VISA','Mastercard','مدى','Apple Pay','تابي','تمارا','COD'].map(m => (
                      <span key={m} className="bg-primary-50 border border-primary-100 px-2 py-1 rounded text-[10px] font-bold text-primary-600">{m}</span>
                    ))}
                  </div>
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
