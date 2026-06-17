'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { useAuth } from '@/store/auth'
import { ApiError } from '@/lib/api'

function AuthForm() {
  const router = useRouter()
  const params = useSearchParams()
  const defaultTab = (params.get('tab') as 'login' | 'register') || 'login'

  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPass, setShowPass] = useState(false)

  const { login, register, isAuthenticated } = useAuth()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm]   = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })

  useEffect(() => {
    if (isAuthenticated()) router.replace('/account')
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginForm.email || !loginForm.password) { setError('يرجى ملء جميع الحقول'); return }
    setError(''); setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      const redirect = params.get('redirect') || '/account'
      router.push(redirect)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'حدث خطأ، يرجى المحاولة مرة أخرى')
    } finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regForm.firstName || !regForm.email || !regForm.password) { setError('يرجى ملء الحقول المطلوبة'); return }
    if (regForm.password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    setError(''); setLoading(true)
    try {
      await register({ firstName: regForm.firstName, lastName: regForm.lastName, email: regForm.email, password: regForm.password, phone: regForm.phone || undefined })
      setSuccess('تم إنشاء الحساب بنجاح! جاري التحويل...')
      setTimeout(() => router.push('/account'), 1500)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'حدث خطأ، يرجى المحاولة مرة أخرى')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-primary-50 flex items-center justify-center px-4 py-12" dir="rtl">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="rounded-2xl px-6 py-3 inline-block" style={{ background: '#0c1a2e' }}>
              <img src="/logo-combined.png" alt="NOVI نوفي" className="h-14 w-auto object-contain" style={{ maxWidth: 200 }} />
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-primary-100 rounded-3xl shadow-lg overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-primary-100">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess('') }}
                className={`flex-1 py-4 font-black text-sm transition-colors ${tab === t ? 'bg-primary-900 text-white' : 'text-primary-500 hover:bg-primary-50'}`}
              >
                {t === 'login' ? '🔑 تسجيل الدخول' : '✨ إنشاء حساب'}
              </button>
            ))}
          </div>

          <div className="p-7">
            {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-4 py-3 rounded-xl">{error}</div>}
            {success && <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold px-4 py-3 rounded-xl">{success}</div>}

            {/* ── LOGIN ── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-primary-700 mb-1.5">البريد الإلكتروني *</label>
                  <input
                    type="email" required dir="ltr"
                    value={loginForm.email}
                    onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="example@email.com"
                    className="w-full border-2 border-primary-200 bg-primary-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-700 mb-1.5">كلمة المرور *</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'} required dir="ltr"
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full border-2 border-primary-200 bg-primary-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm">
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full g-gold text-primary-900 font-black py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري التحقق...' : '🔑 تسجيل الدخول'}
                </button>

                <div className="text-center pt-2">
                  <button type="button" onClick={() => { setTab('register'); setError('') }} className="text-xs text-primary-500 hover:text-primary-800 transition-colors font-bold">
                    ليس لديك حساب؟ أنشئ حساباً الآن ←
                  </button>
                </div>
              </form>
            )}

            {/* ── REGISTER ── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-primary-700 mb-1.5">الاسم الأول *</label>
                    <input
                      required
                      value={regForm.firstName}
                      onChange={e => setRegForm(f => ({ ...f, firstName: e.target.value }))}
                      placeholder="سارة"
                      className="w-full border-2 border-primary-200 bg-primary-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary-700 mb-1.5">اسم العائلة</label>
                    <input
                      value={regForm.lastName}
                      onChange={e => setRegForm(f => ({ ...f, lastName: e.target.value }))}
                      placeholder="المطيري"
                      className="w-full border-2 border-primary-200 bg-primary-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-700 mb-1.5">البريد الإلكتروني *</label>
                  <input
                    type="email" required dir="ltr"
                    value={regForm.email}
                    onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="example@email.com"
                    className="w-full border-2 border-primary-200 bg-primary-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-700 mb-1.5">رقم الجوال</label>
                  <input
                    type="tel" dir="ltr"
                    value={regForm.phone}
                    onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full border-2 border-primary-200 bg-primary-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-700 mb-1.5">كلمة المرور * (٦ أحرف على الأقل)</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'} required dir="ltr" minLength={6}
                      value={regForm.password}
                      onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full border-2 border-primary-200 bg-primary-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm">
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full g-gold text-primary-900 font-black py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري الإنشاء...' : '✨ إنشاء الحساب'}
                </button>

                <p className="text-[11px] text-primary-400 text-center">
                  بإنشاء الحساب، أنت توافق على{' '}
                  <button type="button" className="underline hover:text-primary-700">شروط الاستخدام</button>
                  {' '}و{' '}
                  <button type="button" className="underline hover:text-primary-700">سياسة الخصوصية</button>
                </p>

                <div className="text-center">
                  <button type="button" onClick={() => { setTab('login'); setError('') }} className="text-xs text-primary-500 hover:text-primary-800 transition-colors font-bold">
                    لديك حساب بالفعل؟ سجّل الدخول ←
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Guest checkout hint */}
        <p className="text-center text-xs text-primary-400 mt-5">
          يمكنك أيضاً{' '}
          <Link href="/checkout" className="font-bold text-primary-600 hover:text-primary-900 underline">الشراء كضيف</Link>
          {' '}بدون إنشاء حساب
        </p>
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-primary-50 flex items-center justify-center"><p className="text-primary-400">جاري التحميل...</p></div>}>
        <AuthForm />
      </Suspense>
      <Footer />
    </>
  )
}
