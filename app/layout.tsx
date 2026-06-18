import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import LanguageProvider from '@/components/LanguageProvider'
import CustomCursor from '@/components/CustomCursor'
import BrandSplash from '@/components/BrandSplash'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'NOVI نوفي | المناديل الفاخرة', template: '%s | NOVI نوفي' },
  description: 'أفخر مناديل وجه ومناشف في المملكة العربية السعودية. مواد طبيعية ١٠٠٪، معتمدة رسمياً، توصيل سريع.',
  keywords: ['مناديل', 'مناشف', 'مناديل وجه', 'مناديل مبللة', 'نوفي', 'NOVI'],
  manifest: '/manifest.json',
  themeColor: '#0c1a2e',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'NOVI' },
  openGraph: {
    title: 'NOVI نوفي | المناديل الفاخرة',
    description: 'أفخر مناديل وجه ومناشف في المملكة العربية السعودية',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>
        {children}
        </LanguageProvider>
        <CustomCursor />
        <BrandSplash />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
              background: '#110d03',
              color: '#e4c574',
              borderRadius: '14px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            },
            duration: 3000,
          }}
        />
      </body>
    </html>
  )
}
