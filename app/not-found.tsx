import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-primary-900 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Gold glow background */}
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(201,168,76,0.15) 0%, transparent 70%)'}} />
        <div className="absolute inset-0 gradient-animated pointer-events-none" />

        <div className="relative z-10 text-center max-w-md">
          {/* Brand logo */}
          <img src="/logo-combined.png" alt="نَدى الحرير" className="h-14 w-auto object-contain mx-auto mb-8 opacity-80" />

          {/* 404 */}
          <div className="text-[120px] font-black leading-none mb-2" style={{
            background:'linear-gradient(135deg,#c9a84c,#e8c97a,#a07830)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            fontFamily:'Amiri,serif',
          }}>
            ٤٠٤
          </div>

          <div className="text-5xl mb-5">🧻</div>
          <h1 className="text-xl font-black text-white mb-2" style={{fontFamily:'Amiri,serif'}}>
            الصفحة غير موجودة
          </h1>
          <p className="text-white/45 text-sm mb-8 leading-relaxed">
            يبدو أن هذه الصفحة ضاعت مثل منديل في الريح!<br/>
            لكن لا تقلق — لدينا الكثير من المنتجات الرائعة تنتظرك.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="g-gold text-primary-900 font-black px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              🏠 الرئيسية
            </Link>
            <Link href="/#products" className="bg-white/10 border border-white/20 text-white font-bold px-7 py-3 rounded-full hover:bg-white/20 transition-colors">
              🛒 تصفح المنتجات
            </Link>
          </div>

          {/* Brand tagline */}
          <p className="mt-10 text-primary-400/60 text-xs tracking-widest">
            نَدى الحرير • نعومة تلمسها، وجودة تثق بها
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
