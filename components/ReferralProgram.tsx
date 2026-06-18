'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/hooks/useT'

export default function ReferralProgram() {
  const [code, setCode] = useState('NOVI-XXXX')
  const [copied, setCopied] = useState(false)
  const { lang } = useT()

  useEffect(() => {
    const stored = localStorage.getItem('referral-code')
    if (stored) { setCode(stored); return }
    const c = 'NOVI-' + Math.random().toString(36).substring(2,6).toUpperCase()
    localStorage.setItem('referral-code', c)
    setCode(c)
  }, [])

  const copy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const waShare = `https://wa.me/?text=${encodeURIComponent(`استخدم كودي ${code} واحصل على خصم ١٠٪ من نَدى الحرير! 🎁`)}`

  return (
    <section className="py-12 md:py-16 bg-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(38,105,160,0.15) 0%, transparent 70%)'}}/>
      <div className="relative z-10 max-w-screen-xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-white/10 border border-white/20 text-primary-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4">🎁 برنامج الإحالة</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{fontFamily:'Amiri,serif'}}>
              {lang==='ar'?'أدعُ أصدقاءك واربح معاً':'Refer Friends & Earn Together'}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {lang==='ar'?'شارك كودك الخاص مع أصدقائك. عندما يشترون لأول مرة، تحصل أنت على ٢٠ ريال وهم على خصم ١٠٪. الجميع يستفيد!':'Share your code with friends. When they make their first purchase, you get 20 SAR and they get 10% off. Everyone wins!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Code box */}
              <div className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-white font-black tracking-widest text-lg">{code}</span>
                <button onClick={copy} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${copied?'bg-emerald-500 text-white':'bg-white/20 text-white hover:bg-white/30'}`}>
                  {copied?'✓ تم النسخ':'نسخ'}
                </button>
              </div>
              {/* WhatsApp share */}
              <a href={waShare} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 text-white font-black px-5 py-3 rounded-xl text-sm hover:bg-emerald-600 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.07 1.5 5.785L0 24l6.435-1.487A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.85 0-3.583-.497-5.078-1.363L3 21.5l.88-3.82A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                واتساب
              </a>
            </div>
          </div>
          {/* Steps */}
          <div className="grid grid-cols-1 gap-4">
            {[
              ['١','شارك كودك','أرسل كودك الخاص لأصدقائك عبر واتساب أو الرسائل'],
              ['٢','يشترون ويوفرون','يستخدمون الكود ويحصلون على خصم ١٠٪ من أول طلب'],
              ['٣','تربح معهم','تحصل أنت على ٢٠ ريال رصيد في محفظتك فوراً'],
            ].map(([n,t,d])=>(
              <div key={n as string} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-full g-gold flex items-center justify-center font-black text-white text-lg flex-shrink-0">{n}</div>
                <div><p className="font-black text-white text-sm">{t as string}</p><p className="text-white/50 text-xs mt-0.5">{d as string}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
