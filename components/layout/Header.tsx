'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useAuth } from '@/store/auth'
import PRODUCTS, { CATEGORIES } from '@/lib/products'
import { useT } from '@/hooks/useT'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NotificationBell from '@/components/NotificationBell'
import DarkModeToggle from '@/components/DarkModeToggle'
import CartDrawer from './CartDrawer'

export default function Header() {
  const [q, setQ] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [megaOpen, setMegaOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const count = useCart(s => s.count())
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const path = usePathname()
  const { t, lang } = useT()

  // Featured products for mega menu (first 2 isFeatured)
  const featuredProducts = PRODUCTS.filter(p => p.isFeatured).slice(0, 2)

  const suggestions = q.trim().length >= 1
    ? PRODUCTS.filter(p =>
        p.name.includes(q) ||
        p.nameEn.toLowerCase().includes(q.toLowerCase()) ||
        p.tags.some(tag => tag.includes(q))
      ).slice(0, 6)
    : []

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('recentSearches')
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch {}
  }, [])
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  useEffect(() => { setMobileMenuOpen(false); setSearchOpen(false); setShowSuggestions(false); setMegaOpen(false) }, [path])
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const saveRecentSearch = (term: string) => {
    try {
      const updated = [term, ...recentSearches.filter(r => r !== term)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    } catch {}
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try { localStorage.removeItem('recentSearches') } catch {}
  }

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) {
      saveRecentSearch(q.trim())
      router.push(`/search?q=${encodeURIComponent(q.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <>
      {/* Topbar */}
      <div className="bg-primary-900 text-primary-200 text-center py-1 text-[10px] sm:text-[11px] font-semibold tracking-wide px-3 hidden sm:block">
        {t('header', 'topbar')} &nbsp;·&nbsp; 🎁 <span className="text-primary-300 font-black">NADA10</span>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-40 bg-white border-b border-primary-100 transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>

        {/* Mobile search bar — slides down when open */}
        {searchOpen && (
          <div className="md:hidden bg-white border-b border-primary-100 px-3 py-2 anim-fade-up">
            <form onSubmit={search} className="flex gap-2">
              <input
                autoFocus
                value={q} onChange={e => setQ(e.target.value)}
                placeholder={t('header', 'searchPlh')}
                className="flex-1 px-4 py-2 rounded-full border-2 border-primary-200 bg-primary-50 text-sm text-primary-900 placeholder:text-primary-400 focus:outline-none focus:border-primary-400"
              />
              <button type="submit" className="g-gold text-white font-bold text-xs px-4 py-2 rounded-full flex-shrink-0">
                🔍
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-primary-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </form>
          </div>
        )}

        <div className="max-w-screen-xl mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center gap-2 md:gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="rounded-lg md:rounded-xl px-2 md:px-3 py-1 md:py-1.5 flex items-center" style={{ background: '#0c1a2e' }}>
              <img
                src="/logo-combined.png"
                alt="NOVI"
                className="h-7 md:h-11 w-auto object-contain"
                style={{ maxWidth: 120, minWidth: 60 }}
              />
            </div>
          </Link>

          {/* Desktop search with autocomplete */}
          <div ref={searchRef} className="flex-1 hidden md:flex relative max-w-xl">
            <form onSubmit={search} className="w-full">
              <input
                value={q}
                onChange={e => { setQ(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t('header', 'searchPlh')}
                className="w-full pr-4 pl-24 py-2.5 rounded-full border-2 border-primary-200 bg-primary-50 text-sm text-primary-900 placeholder:text-primary-400 focus:outline-none focus:border-primary-400 transition-colors"
              />
              <button type="submit" className="absolute left-1 top-[5px] g-gold text-white font-bold text-xs px-4 py-1.5 rounded-full">
                {t('header', 'searchBtn')}
              </button>
            </form>
            {/* Suggestions dropdown */}
            {showSuggestions && (suggestions.length > 0 || (q.trim().length === 0 && recentSearches.length > 0)) && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white border border-primary-100 rounded-2xl shadow-xl z-50 overflow-hidden anim-fade-up">
                {/* Recent searches (shown when query is empty) */}
                {q.trim().length === 0 && recentSearches.length > 0 && (
                  <>
                    <div className="flex items-center justify-between px-4 py-2 border-b border-primary-50">
                      <span className="text-xs font-black text-primary-500">🕐 {lang === 'ar' ? 'بحث أخير' : 'Recent Searches'}</span>
                      <button onClick={clearRecentSearches} className="text-[10px] text-primary-400 hover:text-primary-600 font-bold">
                        {lang === 'ar' ? 'مسح' : 'Clear'}
                      </button>
                    </div>
                    {recentSearches.map((term, idx) => (
                      <button key={idx}
                        onClick={() => { setQ(term); saveRecentSearch(term); router.push(`/search?q=${encodeURIComponent(term)}`); setShowSuggestions(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 transition-colors border-b border-primary-50 last:border-0 text-right">
                        <span className="text-primary-300 text-sm">🕐</span>
                        <span className="text-sm text-primary-700 font-semibold">{term}</span>
                      </button>
                    ))}
                  </>
                )}
                {/* Product suggestions */}
                {suggestions.map(p => (
                  <Link key={p.id} href={`/products/${p.slug}`}
                    onClick={() => { saveRecentSearch(q.trim()); setShowSuggestions(false); setQ('') }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 transition-colors border-b border-primary-50 last:border-0">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary-900 clamp-1">{lang === 'ar' ? p.name : p.nameEn}</p>
                      <p className="text-xs text-primary-400">{p.price.toFixed(2)} ر.س</p>
                    </div>
                    <span className="text-xs text-primary-300 flex-shrink-0">{p.category.icon}</span>
                  </Link>
                ))}
                {suggestions.length > 0 && (
                  <Link href={`/search?q=${encodeURIComponent(q)}`} onClick={() => { saveRecentSearch(q.trim()); setShowSuggestions(false) }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 text-primary-600 text-xs font-bold hover:bg-primary-100 transition-colors">
                    🔍 {lang === 'ar' ? `عرض كل نتائج "${q}"` : `See all results for "${q}"`}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-1.5 mr-auto">

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Dark mode toggle — desktop only */}
            <DarkModeToggle className="hidden md:flex" />

            {/* Notification bell */}
            <NotificationBell />

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(o => !o)}
              className="md:hidden p-2 text-primary-700 hover:bg-primary-50 rounded-lg"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist — desktop only (in BottomNav on mobile) */}
            <Link href="/wishlist" className="hidden md:flex p-2 text-primary-700 hover:bg-primary-50 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </Link>

            {/* Account — desktop only */}
            {mounted && isAuthenticated() ? (
              <Link href="/account" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full g-gold text-white text-xs font-black">
                <span>{user?.firstName?.[0] || '؟'}</span>
                <span className="max-w-[80px] truncate">{user?.firstName}</span>
              </Link>
            ) : (
              <Link href="/auth" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-200 text-primary-700 text-xs font-bold hover:bg-primary-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {t('header', 'login')}
              </Link>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-primary-700 hover:bg-primary-50 rounded-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 md:min-w-[18px] md:h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-0.5">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden p-2 text-primary-700 hover:bg-primary-50 rounded-lg"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path d="M18 6L6 18M6 6l12 12"/>
                  : <path d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop category nav with mega menu */}
        <nav
          className="bg-primary-900 hidden md:block overflow-x-auto scrollbar-hide relative"
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="max-w-screen-xl mx-auto px-4 flex">
            <Link href="/" className="px-4 py-3 text-[13px] font-semibold text-white/70 hover:text-primary-300 border-b-2 border-transparent hover:border-primary-400 transition-all whitespace-nowrap">
              {t('header', 'home')}
            </Link>

            {/* Mega menu trigger */}
            <button
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(o => !o)}
              className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1 ${
                megaOpen
                  ? 'text-white border-primary-400'
                  : 'text-white/70 hover:text-primary-300 border-transparent hover:border-primary-400'
              }`}
            >
              التصنيفات
              <span className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {/* Individual category links */}
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={`/category/${c.slug}`}
                className={`px-4 py-3 text-[13px] font-semibold text-white/70 hover:text-primary-300 border-b-2 border-transparent hover:border-primary-400 transition-all whitespace-nowrap ${c.slug === 'bundles' ? 'text-primary-300 font-black' : ''}`}>
                {c.icon} {lang === 'en' ? ((c as any).nameEn ?? c.name) : c.name}
              </Link>
            ))}
            <Link href="/about" className="px-4 py-3 text-[13px] font-semibold text-white/70 hover:text-primary-300 border-b-2 border-transparent hover:border-primary-400 transition-all whitespace-nowrap">
              🏢 {lang === 'ar' ? 'من نحن' : 'About Us'}
            </Link>
          </div>

          {/* Mega Menu Panel */}
          <div
            className={`absolute right-0 left-0 top-full bg-white shadow-xl z-50 transition-all duration-200 overflow-hidden ${
              megaOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="max-w-screen-xl mx-auto flex">
              {/* Left: 2/3 — categories grid */}
              <div className="flex-1 p-6">
                <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-4">جميع التصنيفات</p>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.map(c => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-all group"
                    >
                      <span className="text-2xl flex-shrink-0">{c.icon}</span>
                      <div>
                        <p className="text-sm font-black text-primary-900 group-hover:text-primary-600 transition-colors">
                          {lang === 'en' ? ((c as any).nameEn ?? c.name) : c.name}
                        </p>
                        {(c as any).nameEn && (
                          <p className="text-[11px] text-primary-400">{(c as any).nameEn}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-primary-100">
                  <Link
                    href="/category/all"
                    onClick={() => setMegaOpen(false)}
                    className="inline-flex items-center gap-2 g-gold text-white font-black text-sm px-5 py-2.5 rounded-xl hover:shadow-md transition-shadow"
                  >
                    عرض كل المنتجات →
                  </Link>
                </div>
              </div>

              {/* Right: 1/3 — featured products */}
              <div className="w-72 bg-primary-900 p-6 flex-shrink-0">
                <p className="text-xs font-black text-primary-300 uppercase tracking-widest mb-4">منتجات مميزة ⭐</p>
                <div className="space-y-4">
                  {featuredProducts.map(p => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-2 border-primary-700 group-hover:border-primary-400 transition-colors"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white/90 group-hover:text-white transition-colors line-clamp-2 leading-tight">
                          {lang === 'ar' ? p.name : p.nameEn}
                        </p>
                        <p className="text-primary-300 font-black text-sm mt-1">{p.price.toFixed(2)} ر.س</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile full-screen menu overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-14 z-50 bg-primary-900 overflow-y-auto anim-fade-up">
            {/* Close strip */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-primary-800">
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">القائمة</span>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Nav links */}
            <Link href="/" className="flex items-center gap-3 px-5 py-4 text-white/80 hover:bg-primary-800 border-b border-primary-800/60 text-sm font-bold">
              🏠 {t('header', 'home')}
            </Link>
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={`/category/${c.slug}`}
                className={`flex items-center gap-3 px-5 py-4 text-white/80 hover:bg-primary-800 border-b border-primary-800/60 text-sm font-bold ${c.slug === 'bundles' ? 'text-primary-300' : ''}`}>
                <span className="text-xl">{c.icon}</span>
                {lang === 'en' ? ((c as any).nameEn ?? c.name) : c.name}
              </Link>
            ))}

            {/* About link */}
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 text-white/80 hover:bg-primary-800 border-b border-primary-800/60 text-sm font-bold">
              <span className="text-xl">🏢</span>
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 text-white/80 hover:bg-primary-800 border-b border-primary-800/60 text-sm font-bold">
              <span className="text-xl">📝</span>
              المدونة
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 text-white/80 hover:bg-primary-800 border-b border-primary-800/60 text-sm font-bold">
              <span className="text-xl">📞</span>
              تواصل معنا
            </Link>

            {/* Bundle builder highlight link */}
            <Link href="/bundles" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 border-b border-primary-800/60 text-primary-300 font-black text-sm g-gold-text">
              <span className="text-xl">🎁</span>
              {lang === 'ar' ? 'بكج التوفير — وفّر ١٥٪' : 'Bundle Builder — Save 15%'}
            </Link>

            {/* Account quick links */}
            <div className="px-4 py-4 grid grid-cols-2 gap-3 mt-2">
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-primary-600 text-primary-300 text-sm font-bold hover:bg-primary-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {t('header', 'login')}
              </Link>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-primary-600 text-primary-300 text-sm font-bold hover:bg-primary-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                المفضلة
              </Link>
            </div>

            {/* Dark mode toggle */}
            <div className="px-4 pb-6 flex items-center gap-3">
              <span className="text-primary-400 text-xs font-semibold">{lang === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</span>
              <DarkModeToggle />
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
