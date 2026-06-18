'use client'
import { useState } from 'react'
import { useT } from '@/hooks/useT'
import { useCart } from '@/store/cart'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

export default function SubscriptionModal({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)
  const [freq, setFreq] = useState('monthly')
  const [qty, setQty] = useState(1)
  const [subscribed, setSubscribed] = useState(false)
  const { lang } = useT()
  const addItem = useCart(s => s.addItem)

  const FREQS = [
    {id:'weekly',labelAr:'أسبوعياً',labelEn:'Weekly'},
    {id:'monthly',labelAr:'شهرياً',labelEn:'Monthly'},
    {id:'quarterly',labelAr:'كل ٣ أشهر',labelEn:'Every 3 Months'},
  ]

  const subscribe = () => {
    addItem(product)
    setSubscribed(true)
    toast.success(lang==='ar'?'✅ تم تفعيل الاشتراك! خصم ١٠٪ دائم.':'Subscription activated! 10% off always.')
    setTimeout(() => { setOpen(false); setSubscribed(false) }, 2000)
  }

  return (
    <>
      <button onClick={()=>setOpen(true)} className="w-full border-2 border-primary-300 text-primary-700 font-black py-3 rounded-2xl text-sm hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
        🔄 {lang==='ar'?'اشترك واوفر ١٠٪ دائماً':'Subscribe & Save 10% Always'}
      </button>
      {open&&(
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={()=>setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e=>e.stopPropagation()}>
            {subscribed?(
              <div className="text-center py-4">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-black text-primary-900 text-lg">{lang==='ar'?'تم تفعيل اشتراكك!':'Subscription Activated!'}</p>
                <p className="text-primary-400 text-sm mt-1">{lang==='ar'?'ستصلك طلباتك تلقائياً مع خصم ١٠٪':'Orders will arrive automatically with 10% off'}</p>
              </div>
            ):(
              <>
                <h3 className="font-black text-primary-900 text-lg mb-1" style={{fontFamily:'Amiri,serif'}}>🔄 {lang==='ar'?'اشتراك وتوفير':'Subscribe & Save'}</h3>
                <p className="text-primary-400 text-xs mb-5">{lang==='ar'?'اطلب تلقائياً واحصل على خصم ١٠٪ دائماً':'Auto-order and always get 10% off'}</p>
                {/* Frequency */}
                <p className="text-xs font-black text-primary-700 mb-2">{lang==='ar'?'تكرار الطلب:':'Order Frequency:'}</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {FREQS.map(f=>(
                    <button key={f.id} onClick={()=>setFreq(f.id)}
                      className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${freq===f.id?'border-primary-500 bg-primary-50 text-primary-800':'border-primary-100 text-primary-500 hover:border-primary-300'}`}>
                      {lang==='ar'?f.labelAr:f.labelEn}
                    </button>
                  ))}
                </div>
                {/* Qty */}
                <p className="text-xs font-black text-primary-700 mb-2">{lang==='ar'?'الكمية:':'Quantity:'}</p>
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 font-black flex items-center justify-center">−</button>
                  <span className="font-black text-primary-900 text-lg w-8 text-center">{qty}</span>
                  <button onClick={()=>setQty(q=>q+1)} className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 font-black flex items-center justify-center">+</button>
                </div>
                <div className="bg-primary-50 rounded-xl p-3 mb-4 text-center">
                  <p className="text-xs text-primary-500">{lang==='ar'?'ستوفر':'You will save'}</p>
                  <p className="text-xl font-black text-emerald-600">{(product.price*qty*0.1).toFixed(2)} {lang==='ar'?'ر.س':'SAR'} {lang==='ar'?'في كل طلب':'per order'}</p>
                </div>
                <button onClick={subscribe} className="w-full g-gold text-white font-black py-3 rounded-2xl text-sm">
                  ✅ {lang==='ar'?'تأكيد الاشتراك':'Confirm Subscription'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
