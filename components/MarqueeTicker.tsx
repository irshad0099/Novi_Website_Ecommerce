'use client'

const ITEMS = [
  '🚚 شحن مجاني فوق ١٥٠ ريال',
  '✅ معتمدة SFDA رسمياً',
  '🌿 مواد طبيعية ١٠٠٪',
  '💳 تابي وتمارا — تقسيط بدون فائدة',
  '🔄 إرجاع مجاني ٧ أيام',
  '🏭 صُنع في المملكة العربية السعودية',
  '⭐ تقييم ٤.٩ من +٢٤٠٠ عميل',
  '🎁 كود NOVI10 — خصم ١٠٪ على أول طلب',
  '📦 توصيل ١–٣ أيام في الرياض',
  '🏆 الأكثر مبيعاً في السعودية ٢٠٢٥',
]

export default function MarqueeTicker() {
  const repeated = [...ITEMS, ...ITEMS]

  return (
    <div className="w-full overflow-hidden bg-primary-900 border-b border-primary-800" style={{ height: 36 }}>
      <div
        className="flex items-center h-full whitespace-nowrap"
        style={{
          animation: 'marquee 32s linear infinite',
          willChange: 'transform',
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-white/80 text-xs font-semibold px-8">
            {item}
            <span className="text-primary-500 mx-1">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
