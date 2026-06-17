'use client'
import { useLanguage } from '@/store/language'
import { useEffect, useState } from 'react'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="flex items-center rounded-full border border-primary-200 overflow-hidden text-[10px] md:text-[11px] font-black select-none flex-shrink-0">
      <button
        onClick={() => setLang('ar')}
        className={`px-2 md:px-2.5 py-1 md:py-1.5 transition-all ${
          lang === 'ar'
            ? 'bg-primary-900 text-primary-300'
            : 'text-primary-500 hover:bg-primary-50'
        }`}
      >
        ع
      </button>
      <div className="w-px h-3 md:h-4 bg-primary-200" />
      <button
        onClick={() => setLang('en')}
        className={`px-2 md:px-2.5 py-1 md:py-1.5 transition-all ${
          lang === 'en'
            ? 'bg-primary-900 text-primary-300'
            : 'text-primary-500 hover:bg-primary-50'
        }`}
      >
        EN
      </button>
    </div>
  )
}
