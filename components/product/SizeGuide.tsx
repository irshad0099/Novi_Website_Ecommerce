'use client'
import { useState } from 'react'
import { useT } from '@/hooks/useT'
export default function SizeGuide() {
  const [open, setOpen] = useState(false)
  const { lang } = useT()
  const rows = [
    {size:'علبة كلاسيك',sheets:'٢٠٠ ورقة',layers:'٢ طبقات',use:lang==='ar'?'اليومي':'Daily'},
    {size:'علبة كبيرة',sheets:'٤٠٠ ورقة',layers:'٢ طبقات',use:lang==='ar'?'المنزل':'Home'},
    {size:'ماكسي',sheets:'٦٠٠ ورقة',layers:'٣ طبقات',use:lang==='ar'?'الفاخر':'Premium'},
    {size:'ضخم',sheets:'٩٠٠ ورقة',layers:'٣ طبقات',use:lang==='ar'?'التوفير':'Bulk'},
  ]
  return (
    <>
      <button onClick={()=>setOpen(true)} className="text-xs text-primary-500 underline hover:text-primary-700">
        📏 {lang==='ar'?'دليل الأحجام':'Size Guide'}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={()=>setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-primary-900">{lang==='ar'?'📏 دليل الأحجام':'Size Guide'}</h3>
              <button onClick={()=>setOpen(false)} className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">✕</button>
            </div>
            <div className="overflow-hidden rounded-xl border border-primary-100">
              <table className="w-full text-xs">
                <thead className="bg-primary-900 text-white">
                  <tr>{['الحجم','الأوراق','الطبقات','الاستخدام'].map(h=><th key={h} className="px-3 py-2 text-right font-bold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((r,i)=>(
                    <tr key={i} className={i%2===0?'bg-white':'bg-primary-50'}>
                      <td className="px-3 py-2 font-bold text-primary-800">{r.size}</td>
                      <td className="px-3 py-2 text-primary-600">{r.sheets}</td>
                      <td className="px-3 py-2 text-primary-600">{r.layers}</td>
                      <td className="px-3 py-2 text-primary-500">{r.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-primary-400 mt-3 text-center">{lang==='ar'?'جميع المناديل خالية من العطور والكيماويات':'All tissues are fragrance and chemical free'}</p>
          </div>
        </div>
      )}
    </>
  )
}
