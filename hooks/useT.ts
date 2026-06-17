import { useLanguage } from '@/store/language'
import { translations } from '@/lib/translations'

export function useT() {
  const lang = useLanguage(s => s.lang)

  function t(section: keyof typeof translations, key: string): string {
    const sec = translations[section] as Record<string, { ar: string; en: string } | { ar: string[]; en: string[] }>
    const entry = sec[key]
    if (!entry) return key
    const val = (entry as { ar: string; en: string })[lang]
    return val ?? key
  }

  function tArr(section: keyof typeof translations, key: string): string[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sec = translations[section] as any
    const entry = sec?.[key]
    if (!entry) return []
    return (entry[lang] as string[]) ?? []
  }

  return { t, tArr, lang, isAr: lang === 'ar', isEn: lang === 'en' }
}
