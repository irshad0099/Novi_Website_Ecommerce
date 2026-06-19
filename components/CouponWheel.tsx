'use client'
import { useState, useRef } from 'react'
import { useT } from '@/hooks/useT'

const SEGMENTS = [
  { label: 'NOVI5',    desc: 'خصم ٥٪', color: '#1a3461' },
  { label: 'NOVI10',   desc: 'خصم ١٠٪', color: '#153d6a' },
  { label: 'شحن مجاني', desc: 'على أي طلب', color: '#2669a0' },
  { label: 'NOVI15',   desc: 'خصم ١٥٪', color: '#0f2a4d' },
  { label: 'WELCOME5', desc: 'خصم ٥٪', color: '#1a3461' },
  { label: 'NOVI20',   desc: 'خصم ٢٠٪', color: '#153d6a' },
  { label: 'NOVI10',   desc: 'خصم ١٠٪', color: '#2669a0' },
  { label: 'NOVI15',   desc: 'خصم ١٥٪', color: '#0f2a4d' },
]
const SIZE = 280
const CX = SIZE/2, CY = SIZE/2, R = SIZE/2 - 10
const sliceAngle = (2 * Math.PI) / SEGMENTS.length

export default function CouponWheel() {
  const [open, setOpen] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [won, setWon] = useState<typeof SEGMENTS[0]|null>(null)
  const [copied, setCopied] = useState(false)
  const [used, setUsed] = useState(false)
  const { lang } = useT()

  const spin = () => {
    if (spinning || used) return
    setSpinning(true)
    setWon(null)
    const extra = 5 * 360 + Math.random() * 360
    const finalRot = rotation + extra
    setRotation(finalRot)
    setTimeout(() => {
      const normalized = ((finalRot % 360) + 360) % 360
      const idx = Math.floor(((360 - normalized) % 360) / (360 / SEGMENTS.length)) % SEGMENTS.length
      setWon(SEGMENTS[idx])
      setSpinning(false)
      setUsed(true)
    }, 4000)
  }

  const copy = () => {
    if (won) navigator.clipboard?.writeText(won.label)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // SVG wheel
  const paths = SEGMENTS.map((seg, i) => {
    const startAngle = i * sliceAngle - Math.PI/2
    const endAngle = startAngle + sliceAngle
    const x1 = CX + R * Math.cos(startAngle), y1 = CY + R * Math.sin(startAngle)
    const x2 = CX + R * Math.cos(endAngle), y2 = CY + R * Math.sin(endAngle)
    const midAngle = startAngle + sliceAngle/2
    const tx = CX + (R*0.65)*Math.cos(midAngle), ty = CY + (R*0.65)*Math.sin(midAngle)
    return { d:`M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`, color: seg.color, tx, ty, label: seg.label, midAngle }
  })

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)}
        className="g-gold text-white font-black px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm flex items-center gap-2 mx-auto">
        🎰 {lang==='ar'?'العب واربح خصماً':'Spin & Win Discount'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={()=>!spinning&&setOpen(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center relative" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>!spinning&&setOpen(false)} className="absolute top-4 left-4 w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">✕</button>

            <h3 className="text-xl font-black text-primary-900 mb-1" style={{fontFamily:'Amiri,serif'}}>
              🎰 {lang==='ar'?'عجّل العجلة واربح!':'Spin & Win!'}
            </h3>
            <p className="text-xs text-primary-400 mb-5">{lang==='ar'?'دورة واحدة مجانية في اليوم':'One free spin per day'}</p>

            {/* Wheel */}
            <div className="relative mx-auto mb-4" style={{width:SIZE,height:SIZE}}>
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 text-2xl">▼</div>
              <svg width={SIZE} height={SIZE} style={{transform:`rotate(${rotation}deg)`,transition:spinning?'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)':'none'}}>
                {paths.map((p,i)=>(
                  <g key={i}>
                    <path d={p.d} fill={p.color} stroke="white" strokeWidth={2}/>
                    <text x={p.tx} y={p.ty} textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize={9} fontWeight="bold"
                      transform={`rotate(${(p.midAngle*180/Math.PI)+90},${p.tx},${p.ty})`}>
                      {p.label}
                    </text>
                  </g>
                ))}
                <circle cx={CX} cy={CY} r={22} fill="#1a3461" stroke="white" strokeWidth={3}/>
                <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={18}>🎁</text>
              </svg>
            </div>

            {won ? (
              <div className="bg-primary-50 border-2 border-primary-300 rounded-2xl p-4 mb-4 animate-[fadeUp_0.3s_ease]">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-black text-primary-900 mb-1">{lang==='ar'?`ربحت: ${won.desc}`:`You won: ${won.desc}`}</p>
                <div className="flex items-center justify-between bg-white border border-primary-200 rounded-xl px-4 py-2 mt-2">
                  <span className="font-black text-primary-700 tracking-widest">{won.label}</span>
                  <button onClick={copy} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${copied?'bg-emerald-500 text-white':'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}>
                    {copied?'✓ تم':'نسخ'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={spin} disabled={spinning||used}
                className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all ${spinning?'bg-primary-200 text-primary-400 cursor-not-allowed':used?'bg-emerald-100 text-emerald-700 cursor-not-allowed':'g-gold text-white hover:shadow-lg hover:scale-[1.02]'}`}>
                {spinning?(lang==='ar'?'⏳ جارٍ التدوير...':'Spinning...'):(lang==='ar'?'🎰 أدِّر العجلة!':'Spin the Wheel!')}
              </button>
            )}
            <p className="text-[10px] text-primary-400 mt-2">{lang==='ar'?'الكود صالح لمدة ٢٤ ساعة':'Code valid for 24 hours'}</p>
          </div>
        </div>
      )}
    </>
  )
}
