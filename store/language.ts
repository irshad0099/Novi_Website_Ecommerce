import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'ar' | 'en'

interface LanguageState {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: 'ar',
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === 'ar' ? 'en' : 'ar' }),
    }),
    { name: 'novi-lang' }
  )
)
