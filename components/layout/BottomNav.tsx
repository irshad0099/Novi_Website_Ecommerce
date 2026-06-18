'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'
import { useT } from '@/hooks/useT'

export default function BottomNav() {
  const path = usePathname()
  const [mounted, setMounted] = useState(false)
  const count = useCart(s => s.count())
  const { t } = useT()

  useEffect(() => { setMounted(true) }, [])

  const ITEMS = [
    { href: '/',         labelKey: 'home',     icon: (a: boolean) => (
      <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { href: '/products', labelKey: 'products', icon: (a: boolean) => (
      <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      </svg>
    )},
    { href: '/search',   labelKey: 'search',   icon: (_a: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    )},
    { href: '/wishlist', labelKey: 'wishlist', icon: (a: boolean) => (
      <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    )},
    { href: '/account',  labelKey: 'account',  icon: (a: boolean) => (
      <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )},
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-primary-100 bg-white/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16">
        {ITEMS.map(({ href, labelKey, icon }) => {
          const active = path === href || (href !== '/' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors relative
                ${active ? 'text-primary-700' : 'text-primary-400 hover:text-primary-600'}`}
            >
              {/* Active background pill */}
              {active && (
                <span className="absolute inset-x-2 inset-y-1.5 rounded-xl bg-primary-50 -z-10" />
              )}
              {href === '/products' && mounted && count > 0 && (
                <span className="absolute top-2 right-[calc(50%-14px)] min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 border border-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
              {icon(active)}
              <span className={`text-[9px] ${active ? 'font-black text-primary-700' : 'font-bold'}`}>{t('nav', labelKey)}</span>
              {active && (
                <>
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary-700" />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-700" />
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
