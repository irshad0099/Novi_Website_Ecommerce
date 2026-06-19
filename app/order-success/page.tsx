'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

function SuccessContent() {
  const params = useSearchParams()
  const id = params.get('id') || 'NADA-00001'
  const total = params.get('total') || '0.00'

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white border border-primary-100 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl">
        {/* Brand logo */}
        <img src="/logo-combined.png" alt="NOVI" className="h-10 w-auto object-contain mx-auto mb-5 opacity-70" />

        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-2xl md:text-3xl font-black text-primary-900 mb-2" style={{fontFamily:'Amiri,serif'}}>
          مرحباً بك في عائلة NOVI!
        </h1>
        <p className="text-primary-400 text-xs mb-1">أنت الآن جزء من أكثر من ٥٠,٠٠٠ أسرة سعودية تثق بنا</p>
        <p className="text-primary-500 mb-6 text-sm leading-relaxed mt-3">
          تم تأكيد طلبك وسيصلك خلال ١–٣ أيام عمل.<br />
          ستصلك رسالة تأكيد على هاتفك قريباً.
        </p>

        <div className="bg-primary-50 border-2 border-dashed border-primary-300 rounded-2xl p-5 mb-7">
          <p className="text-xs text-primary-500 font-semibold mb-1">رقم الطلب</p>
          <p className="text-2xl font-black text-primary-700 tracking-widest">{id}</p>
          <p className="text-sm text-primary-500 mt-2">الإجمالي: <strong className="text-primary-700">{total} ر.س</strong></p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-7">
          {[['📦','تأكيد الطلب','الآن'],['🚚','الشحن','خلال ٢٤ ساعة'],['🏠','التوصيل','١–٣ أيام']].map(([icon,t,s]) => (
            <div key={t} className="bg-primary-50 rounded-xl p-3">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-[11px] font-bold text-primary-800">{t}</p>
              <p className="text-[9px] text-primary-400">{s}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link href="/" className="w-full g-gold text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow">
            🛍️ متابعة التسوق
          </Link>
          <Link href="/category/bundles" className="w-full bg-primary-900 text-primary-200 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-800 transition-colors">
            🎁 اكتشف بكجات التوفير
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <main className="bg-primary-50">
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><p className="text-primary-400">جاري التحميل...</p></div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
