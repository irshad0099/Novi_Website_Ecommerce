'use client'
import { useEffect, useState } from 'react'
import { useDarkMode } from '@/store/darkMode'

export default function DarkModeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggle } = useDarkMode()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark, mounted])

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${isDark ? 'bg-primary-600' : 'bg-primary-200'} ${className}`}
      title={isDark ? 'Light mode' : 'Dark mode'}
      aria-label="Toggle dark mode"
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center text-[10px]
          ${isDark ? 'right-0.5 bg-primary-900' : 'left-0.5 bg-white'}`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
