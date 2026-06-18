'use client'
import { useState } from 'react'
import { useT } from '@/hooks/useT'
export default function BackInStock({ productName }: { productName: string }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { lang } = useT()
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }
  if (submitted) return (
    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 text-center">
      <p className="text-2xl mb-1">✅</p>
      <p className="font-black text-primary-800 text-sm">{lang==='ar'?'سنخبرك فور توفر المنتج!':'We will notify you when available!'}</p>
    </div>
  )
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
      <p className="font-black text-primary-900 text-sm mb-1">🔔 {lang==='ar'?'أخبرني عند التوفر':'Notify me when available'}</p>
      <p className="text-xs text-primary-400 mb-3">{lang==='ar'?`سنرسل لك إشعاراً عند إضافة "${productName}" للمخزون`:`We'll notify you when "${productName}" is back.`}</p>
      <form onSubmit={submit} className="flex gap-2">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={lang==='ar'?'بريدك الإلكتروني...':'Your email...'} className="flex-1 px-3 py-2 border border-primary-200 rounded-xl text-xs bg-white focus:outline-none focus:border-primary-400"/>
        <button type="submit" className="g-gold text-white font-black text-xs px-4 py-2 rounded-xl">{lang==='ar'?'أبلّغني':'Notify'}</button>
      </form>
    </div>
  )
}
