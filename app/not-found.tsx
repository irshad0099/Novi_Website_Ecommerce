import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-primary-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-5">🧻</div>
          <h1 className="text-4xl font-black text-primary-900 mb-3" style={{fontFamily:'Amiri,serif'}}>٤٠٤</h1>
          <p className="text-xl font-bold text-primary-700 mb-2">الصفحة غير موجودة</p>
          <p className="text-primary-400 text-sm mb-8">يبدو أن هذه الصفحة نُسيت مثل منديل في الجيب!</p>
          <Link href="/" className="g-gold text-primary-900 font-black px-8 py-3.5 rounded-full inline-block shadow-md hover:shadow-lg transition-shadow">
            العودة للرئيسية
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
