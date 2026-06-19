// Scrolling partner / delivery logos strip
const PARTNERS = [
  { name: 'أرامكس', emoji: '📦' },
  { name: 'DHL', emoji: '🚀' },
  { name: 'SFDA', emoji: '✅' },
  { name: 'تابي', emoji: '💳' },
  { name: 'تمارا', emoji: '💰' },
  { name: 'مدى', emoji: '🏦' },
  { name: 'STC Pay', emoji: '📱' },
  { name: 'Apple Pay', emoji: '🍎' },
  { name: 'Visa', emoji: '💳' },
  { name: 'Mastercard', emoji: '🔴' },
  { name: 'أمازون', emoji: '🛒' },
  { name: 'نون', emoji: '🟡' },
]

export default function LogoStrip() {
  const doubled = [...PARTNERS, ...PARTNERS]

  return (
    <section className="py-8 border-y border-primary-100 bg-primary-50/40 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 mb-4 text-center">
        <p className="text-[11px] font-black tracking-[0.2em] text-primary-400 uppercase">شركاؤنا وطرق الدفع المتاحة</p>
      </div>

      <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div
          className="flex items-center gap-6 whitespace-nowrap"
          style={{ animation: 'marquee 24s linear infinite', willChange: 'transform' }}
        >
          {doubled.map((p, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 bg-white border border-primary-100 rounded-xl px-5 py-2.5 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex-shrink-0 cursor-default group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{p.emoji}</span>
              <span className="font-black text-primary-800 text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
