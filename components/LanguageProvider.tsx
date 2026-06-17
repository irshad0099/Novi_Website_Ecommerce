'use client'
import { useEffect } from 'react'
import { useLanguage } from '@/store/language'

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useLanguage(s => s.lang)

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  }, [lang])

  return <>{children}</>
}
