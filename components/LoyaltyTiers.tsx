'use client'
import { useT } from '@/hooks/useT'
const TIERS = [
  { nameAr:'برونزي',nameEn:'Bronze',icon:'🥉',min:0,max:499,color:'#cd7f32',bg:'#fdf6ee',border:'#e8c99a',perks:['خصم ٣٪','شحن مجاني فوق ١٥٠ ر.س','نقاط مكافأة']},
  { nameAr:'فضي',nameEn:'Silver',icon:'🥈',min:500,max:1499,color:'#9e9e9e',bg:'#f8f8f8',border:'#d0d0d0',perks:['خصم ٥٪','شحن مجاني فوق ١٠٠ ر.س','هدية في الأعياد','أولوية الدعم']},
  { nameAr:'ذهبي',nameEn:'Gold',icon:'🥇',min:1500,max:null,color:'#1a3461',bg:'#f0f5fb',border:'#82b0d5',perks:['خصم ١٠٪','شحن مجاني دائماً','هدية شهرية','مدير حساب خاص','وصول مبكر للعروض']},
]
export default function LoyaltyTiers() {
  const { lang } = useT()
  return (
    <section className="py-12 md:py-16 bg-primary-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-primary-900" style={{fontFamily:'Amiri,serif'}}>
            {lang==='ar'?'برنامج المكافآت':'Rewards Program'}<span className="text-primary-400">.</span>
          </h2>
          <p className="text-primary-400 text-sm mt-2">{lang==='ar'?'كلما اشتريت أكثر، كلما حصلت على مزايا أكثر':'The more you buy, the more benefits you get'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier,i) => (
            <div key={i} className="bg-white rounded-2xl border-2 p-6 text-center hover:shadow-lg transition-shadow" style={{borderColor:tier.border}}>
              <div className="text-5xl mb-3">{tier.icon}</div>
              <h3 className="text-xl font-black text-primary-900 mb-1">{lang==='ar'?tier.nameAr:tier.nameEn}</h3>
              <p className="text-xs text-primary-400 mb-4">
                {tier.max?`${lang==='ar'?'من':'from'} ${tier.min} ${lang==='ar'?'حتى':'to'} ${tier.max} ${lang==='ar'?'ر.س':'SAR'}`:`${tier.min}+ ${lang==='ar'?'ر.س':'SAR'}`}
              </p>
              <ul className="space-y-2">
                {tier.perks.map((p,j)=>(
                  <li key={j} className="flex items-center gap-2 text-sm text-primary-700">
                    <span className="text-emerald-500 font-black flex-shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
              <div className="mt-5 py-2 rounded-xl text-xs font-black text-white g-gold">
                {lang==='ar'?'اشترك مجاناً':'Join Free'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
