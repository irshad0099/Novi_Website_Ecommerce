const AWARDS = [
  {
    icon: '🏅',
    title: 'معتمدة SFDA',
    sub: 'هيئة الغذاء والدواء السعودية',
    color: 'from-amber-50 to-amber-100/60',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
  },
  {
    icon: '🌿',
    title: 'طبيعي ١٠٠٪',
    sub: 'ألياف طبيعية نقية — بدون كيماويات',
    color: 'from-emerald-50 to-emerald-100/60',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: '🇸🇦',
    title: 'صُنع في المملكة',
    sub: 'منتج وطني بأيدٍ سعودية منذ ٢٠١٩',
    color: 'from-green-50 to-green-100/60',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
  },
  {
    icon: '⭐',
    title: 'تقييم ٤.٩ / ٥',
    sub: 'من أكثر من ٢٤٠٠ تقييم حقيقي',
    color: 'from-yellow-50 to-yellow-100/60',
    border: 'border-yellow-200',
    iconBg: 'bg-yellow-100',
  },
  {
    icon: '♻️',
    title: 'صديق للبيئة',
    sub: 'تغليف قابل للتدوير ١٠٠٪',
    color: 'from-teal-50 to-teal-100/60',
    border: 'border-teal-200',
    iconBg: 'bg-teal-100',
  },
  {
    icon: '🔬',
    title: '١٢ مرحلة فحص',
    sub: 'جودة مضمونة في كل مرحلة إنتاج',
    color: 'from-blue-50 to-blue-100/60',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
  },
]

export default function AwardsStrip() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-[11px] font-black tracking-[0.25em] text-primary-400 uppercase mb-2">شهادات الجودة والاعتماد</p>
          <h2 className="text-2xl md:text-3xl font-black text-primary-900" style={{ fontFamily: 'Amiri, serif' }}>
            لماذا تختار NOVI؟
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {AWARDS.map((a) => (
            <div
              key={a.title}
              className={`group relative rounded-2xl border bg-gradient-to-br ${a.color} ${a.border} p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden`}
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(26,52,97,0.06) 0%, transparent 70%)' }} />

              <div className={`w-12 h-12 ${a.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                {a.icon}
              </div>
              <p className="font-black text-primary-900 text-[13px] leading-tight mb-1">{a.title}</p>
              <p className="text-primary-500 text-[10px] leading-snug">{a.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
