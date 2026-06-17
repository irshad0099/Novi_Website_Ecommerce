'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { useAuth } from '@/store/auth'
import { users as usersApi, orders as ordersApi, coupons as couponsApi, type Order, type Address, ApiError } from '@/lib/api'
import toast from 'react-hot-toast'

/* ─── Types ─── */
const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string; steps: number }> = {
  pending:    { color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: '⏳', steps: 1 },
  confirmed:  { color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',     icon: '✅', steps: 2 },
  processing: { color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200', icon: '📦', steps: 2 },
  shipped:    { color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200', icon: '🚚', steps: 3 },
  delivered:  { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',icon: '✅', steps: 4 },
  cancelled:  { color: 'text-red-700',     bg: 'bg-red-50 border-red-200',       icon: '❌', steps: 0 },
  refunded:   { color: 'text-gray-700',    bg: 'bg-gray-50 border-gray-200',     icon: '↩️', steps: 0 },
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار', confirmed: 'مؤكد', processing: 'قيد التجهيز',
  shipped: 'قيد الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي', refunded: 'مسترجع',
}
type Tab = 'dashboard' | 'orders' | 'profile' | 'addresses' | 'wishlist' | 'settings'
const NAV: { id: Tab; icon: string; label: string }[] = [
  { id: 'dashboard',  icon: '🏠', label: 'لوحة التحكم' },
  { id: 'orders',     icon: '📦', label: 'طلباتي' },
  { id: 'profile',    icon: '👤', label: 'الملف الشخصي' },
  { id: 'addresses',  icon: '📍', label: 'عناويني' },
  { id: 'wishlist',   icon: '❤️', label: 'المفضلة' },
  { id: 'settings',   icon: '⚙️', label: 'الإعدادات' },
]

/* ─── Skeleton ─── */
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-primary-100 rounded-lg ${className}`} />
)

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, updateUser } = useAuth()

  const [tab, setTab]           = useState<Tab>('dashboard')
  const [orders, setOrders]     = useState<Order[]>([])
  const [orderStats, setOrderStats] = useState<Record<string, number>>({})
  const [addresses, setAddresses] = useState<Address[]>([])
  const [wishlist, setWishlist]   = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [loadingWishlist, setLoadingWishlist]   = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [orderFilter, setOrderFilter] = useState<string>('all')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const [profile, setProfile]     = useState({ firstName: '', lastName: '', phone: '', email: '', gender: '', birthday: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [pwdForm, setPwdForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwdSaving, setPwdSaving] = useState(false)
  const [notifications, setNotifications] = useState({ orders: true, offers: true, news: false, sms: true })

  const [addingAddress, setAddingAddress]   = useState(false)
  const [newAddress, setNewAddress]         = useState<Omit<Address, '_id'>>({ label: 'المنزل', name: '', phone: '', address: '', city: 'الرياض', postal: '', isDefault: false })

  /* ── Guard ── */
  useEffect(() => {
    if (!isAuthenticated()) router.replace('/auth?redirect=/account')
  }, [isAuthenticated, router])

  /* ── Populate profile from user ── */
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName:  user.lastName  || '',
        phone:     user.phone     || '',
        email:     user.email     || '',
        gender:    user.gender    || '',
        birthday:  user.birthday  || '',
      })
    }
  }, [user])

  /* ── Fetch helpers ── */
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true)
    try {
      const [ordRes, statsRes] = await Promise.all([ordersApi.list({ limit: 50 }), ordersApi.stats()])
      setOrders(ordRes.orders || [])
      setOrderStats(statsRes.stats || {})
    } catch { /* silent */ }
    finally { setLoadingOrders(false) }
  }, [])

  const fetchAddresses = useCallback(async () => {
    setLoadingAddresses(true)
    try {
      const res = await usersApi.getAddresses()
      setAddresses(res.addresses || [])
    } catch { /* silent */ }
    finally { setLoadingAddresses(false) }
  }, [])

  const fetchWishlist = useCallback(async () => {
    setLoadingWishlist(true)
    try {
      const res = await usersApi.getWishlist()
      setWishlist(res.wishlist || [])
    } catch { /* silent */ }
    finally { setLoadingWishlist(false) }
  }, [])

  useEffect(() => { if (isAuthenticated()) { fetchOrders(); fetchAddresses() } }, [isAuthenticated, fetchOrders, fetchAddresses])
  useEffect(() => { if (tab === 'wishlist' && isAuthenticated()) fetchWishlist() }, [tab, isAuthenticated, fetchWishlist])

  /* ── Actions ── */
  const saveProfile = async () => {
    setProfileSaving(true)
    try {
      const res = await usersApi.updateProfile({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone, gender: profile.gender, birthday: profile.birthday || undefined })
      updateUser(res.user)
      toast.success('✅ تم حفظ التغييرات بنجاح')
    } catch (e) { toast.error(e instanceof ApiError ? e.message : 'حدث خطأ') }
    finally { setProfileSaving(false) }
  }

  const savePassword = async () => {
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('كلمتا المرور غير متطابقتين'); return }
    if (pwdForm.newPassword.length < 6) { toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    setPwdSaving(true)
    try {
      await usersApi.updatePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword })
      toast.success('✅ تم تغيير كلمة المرور')
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) { toast.error(e instanceof ApiError ? e.message : 'حدث خطأ') }
    finally { setPwdSaving(false) }
  }

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    try {
      const res = await usersApi.addAddress(newAddress)
      setAddresses(res.addresses)
      setAddingAddress(false)
      setNewAddress({ label: 'المنزل', name: '', phone: '', address: '', city: 'الرياض', postal: '', isDefault: false })
      toast.success('✅ تم إضافة العنوان')
    } catch (e) { toast.error(e instanceof ApiError ? e.message : 'حدث خطأ') }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await usersApi.deleteAddress(id)
      setAddresses(res.addresses)
      toast.success('تم حذف العنوان')
    } catch (e) { toast.error(e instanceof ApiError ? e.message : 'حدث خطأ') }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const res = await usersApi.updateAddress(id, { isDefault: true })
      setAddresses(res.addresses)
    } catch (e) { toast.error(e instanceof ApiError ? e.message : 'حدث خطأ') }
  }

  const handleCancelOrder = async (orderId: string) => {
    setCancellingId(orderId)
    try {
      const res = await ordersApi.cancel(orderId)
      setOrders(prev => prev.map(o => o._id === orderId ? res.order : o))
      toast.success('تم إلغاء الطلب')
    } catch (e) { toast.error(e instanceof ApiError ? e.message : 'حدث خطأ') }
    finally { setCancellingId(null) }
  }

  const handleRemoveWishlist = async (productId: string) => {
    try {
      await usersApi.toggleWishlist(productId)
      setWishlist(prev => prev.filter(p => p._id !== productId))
      toast.success('تم الحذف من المفضلة')
    } catch { /* silent */ }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  /* ── Derived ── */
  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter)
  const fullName = user ? `${user.firstName} ${user.lastName || ''}`.trim() : ''
  const initials = user?.firstName?.[0] || '؟'

  if (!user) return null

  return (
    <>
      <Header />
      <main className="bg-primary-50 min-h-screen" dir="rtl">

        {/* ── Banner ── */}
        <div className="bg-primary-900 py-8 px-4">
          <div className="max-w-screen-xl mx-auto flex items-center gap-4">
            <div className="w-16 h-16 rounded-full g-gold flex items-center justify-center text-2xl font-black text-primary-900 shadow-lg flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-white/55 text-xs mb-0.5">مرحباً بك</p>
              <h1 className="text-white text-xl font-black">{fullName}</h1>
              <p className="text-primary-300 text-xs mt-0.5">{user.email}</p>
            </div>
            <div className="mr-auto hidden md:flex gap-8">
              {[
                [String(orderStats.total ?? orders.length), 'إجمالي الطلبات'],
                [String(addresses.length), 'عنوان محفوظ'],
                [String(wishlist.length || '—'), 'في المفضلة'],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-primary-300 text-xl font-black">{n}</p>
                  <p className="text-white/50 text-[11px]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 items-start">

          {/* ── Sidebar ── */}
          <aside className="w-full md:w-60 flex-shrink-0">
            <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm sticky top-4">
              <div className="px-4 py-3 border-b border-primary-50">
                <p className="text-[11px] font-bold text-primary-400 uppercase tracking-wider">حسابي</p>
              </div>
              <nav className="py-2">
                {NAV.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors text-right ${tab === item.id ? 'bg-primary-900 text-white' : 'text-primary-700 hover:bg-primary-50'}`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                    {item.id === 'orders' && orders.length > 0 && (
                      <span className={`mr-auto text-[10px] px-1.5 py-0.5 rounded-full font-black ${tab === 'orders' ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-600'}`}>
                        {orders.length}
                      </span>
                    )}
                    {item.id === 'wishlist' && wishlist.length > 0 && (
                      <span className={`mr-auto text-[10px] px-1.5 py-0.5 rounded-full font-black ${tab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              <div className="border-t border-primary-50 p-3">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm font-bold transition-colors">
                  <span>🚪</span> تسجيل الخروج
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">

            {/* ══ DASHBOARD ══ */}
            {tab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: '📦', label: 'إجمالي الطلبات',  value: String(orderStats.total ?? orders.length), color: 'bg-blue-50 border-blue-100', vc: 'text-blue-700' },
                    { icon: '🚚', label: 'قيد الشحن',        value: String(orderStats.shipped ?? 0),           color: 'bg-amber-50 border-amber-100', vc: 'text-amber-700' },
                    { icon: '✅', label: 'تم التوصيل',       value: String(orderStats.delivered ?? 0),          color: 'bg-emerald-50 border-emerald-100', vc: 'text-emerald-700' },
                    { icon: '❤️', label: 'في المفضلة',      value: String(wishlist.length || '—'),             color: 'bg-red-50 border-red-100', vc: 'text-red-700' },
                  ].map(c => (
                    <div key={c.label} className={`${c.color} border rounded-2xl p-4`}>
                      <div className="text-2xl mb-2">{c.icon}</div>
                      <p className={`text-2xl font-black ${c.vc}`}>{c.value}</p>
                      <p className="text-[11px] text-primary-500 mt-0.5">{c.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-primary-50">
                    <h2 className="font-black text-primary-900">آخر الطلبات</h2>
                    <button onClick={() => setTab('orders')} className="text-xs font-bold text-primary-400 hover:text-primary-600">عرض الكل ←</button>
                  </div>
                  {loadingOrders ? (
                    <div className="p-4 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}</div>
                  ) : orders.length === 0 ? (
                    <div className="py-10 text-center text-primary-400 text-sm">لا توجد طلبات بعد</div>
                  ) : (
                    <div className="divide-y divide-primary-50">
                      {orders.slice(0, 4).map(order => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                        return (
                          <div key={order._id} className="flex items-center gap-4 px-5 py-4">
                            <div className={`text-xl w-10 h-10 flex items-center justify-center rounded-full border ${cfg.bg} flex-shrink-0`}>{cfg.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-primary-900">{order.orderNumber}</p>
                              <p className="text-xs text-primary-400">{new Date(order.createdAt).toLocaleDateString('ar-SA')} · {order.items.length} منتج</p>
                            </div>
                            <div className="text-left flex-shrink-0">
                              <p className="font-black text-sm text-primary-900">{order.total.toFixed(2)} ر.س</p>
                              <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${cfg.bg} ${cfg.color}`}>{STATUS_LABELS[order.status] || order.status}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: '🛍️', label: 'تسوق الآن',     sub: 'اكتشف أحدث المنتجات',    href: '/' },
                    { icon: '🎁', label: 'بكجات التوفير',  sub: 'عروض حصرية للأعضاء',     href: '/category/bundles' },
                    { icon: '📍', label: 'عناويني',         sub: 'إدارة عناوين التوصيل',   href: '#' },
                  ].map(q => (
                    q.href !== '#'
                      ? <Link key={q.label} href={q.href} className="bg-white border border-primary-100 rounded-2xl p-4 hover:border-primary-300 hover:shadow-md transition-all group">
                          <span className="block text-2xl mb-2">{q.icon}</span>
                          <span className="block font-bold text-sm text-primary-900 group-hover:text-primary-600">{q.label}</span>
                          <span className="block text-[11px] text-primary-400 mt-0.5">{q.sub}</span>
                        </Link>
                      : <button key={q.label} onClick={() => setTab('addresses')} className="bg-white border border-primary-100 rounded-2xl p-4 hover:border-primary-300 hover:shadow-md transition-all group text-right w-full">
                          <span className="block text-2xl mb-2">{q.icon}</span>
                          <span className="block font-bold text-sm text-primary-900 group-hover:text-primary-600">{q.label}</span>
                          <span className="block text-[11px] text-primary-400 mt-0.5">{q.sub}</span>
                        </button>
                  ))}
                </div>
              </div>
            )}

            {/* ══ ORDERS ══ */}
            {tab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-black text-primary-900 text-lg">طلباتي</h2>
                    <span className="text-xs text-primary-400">{filteredOrders.length} طلب</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(['all','delivered','shipped','processing','pending','cancelled'] as const).map(v => (
                      <button key={v} onClick={() => setOrderFilter(v)}
                        className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-colors ${orderFilter === v ? 'bg-primary-900 text-white border-primary-900' : 'border-primary-200 text-primary-600 hover:border-primary-400'}`}>
                        {v === 'all' ? 'الكل' : STATUS_LABELS[v]}
                        {v !== 'all' && orderStats[v] ? ` (${orderStats[v]})` : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {loadingOrders && <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>}

                {!loadingOrders && filteredOrders.length === 0 && (
                  <div className="bg-white border border-primary-100 rounded-2xl p-12 text-center shadow-sm">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="font-bold text-primary-600 mb-1">لا توجد طلبات</p>
                    <Link href="/" className="mt-3 g-gold text-primary-900 font-black px-6 py-2.5 rounded-full text-sm inline-block">🛍️ تسوق الآن</Link>
                  </div>
                )}

                {!loadingOrders && filteredOrders.map(order => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                  const isExpanded = expandedOrder === order._id
                  const steps = ['تأكيد الطلب','قيد التجهيز','في الطريق','تم التوصيل']
                  return (
                    <div key={order._id} className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-5 py-4 border-b border-primary-50 flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-black text-primary-900 text-sm">{order.orderNumber}</p>
                            <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 ${cfg.bg} ${cfg.color}`}>{cfg.icon} {STATUS_LABELS[order.status]}</span>
                          </div>
                          <p className="text-xs text-primary-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('ar-SA')} · {order.items.length} منتج · الإجمالي: <strong className="text-primary-700">{order.total.toFixed(2)} ر.س</strong>
                          </p>
                        </div>
                        <button onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                          className="text-xs font-bold text-primary-500 hover:text-primary-800 border border-primary-200 px-3 py-1.5 rounded-full transition-colors">
                          {isExpanded ? 'إخفاء ▲' : 'التفاصيل ▼'}
                        </button>
                      </div>

                      <div className="px-5 py-3 flex gap-3 overflow-x-auto">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 flex-shrink-0 bg-primary-50 rounded-xl p-2.5 min-w-[200px]">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-primary-100 flex-shrink-0">
                              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-primary-800 leading-snug line-clamp-2">{item.name}</p>
                              <p className="text-[10px] text-primary-400 mt-0.5">الكمية: {item.qty} · {item.price.toFixed(2)} ر.س</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {isExpanded && (
                        <div className="border-t border-primary-50 px-5 py-4 space-y-4">
                          {order.status !== 'cancelled' && order.status !== 'refunded' && (
                            <div>
                              <p className="text-xs font-bold text-primary-600 mb-3">تتبع الطلب</p>
                              <div className="flex items-center">
                                {steps.map((step, i) => {
                                  const done = i < cfg.steps
                                  const active = i === cfg.steps - 1
                                  return (
                                    <div key={step} className="flex-1 flex flex-col items-center relative">
                                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border-2 z-10 ${done ? 'bg-primary-900 border-primary-900 text-white' : 'bg-white border-primary-200 text-primary-300'} ${active ? 'ring-4 ring-primary-200' : ''}`}>
                                        {done ? '✓' : i + 1}
                                      </div>
                                      {i < steps.length - 1 && <div className={`absolute top-3.5 right-1/2 w-full h-0.5 -z-0 ${i < cfg.steps - 1 ? 'bg-primary-900' : 'bg-primary-100'}`} />}
                                      <p className={`text-[9px] mt-1.5 font-bold text-center ${done ? 'text-primary-700' : 'text-primary-300'}`}>{step}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                          <div className="bg-primary-50 rounded-xl p-3 text-xs space-y-1">
                            <div className="flex justify-between text-primary-600"><span>المجموع الفرعي</span><span>{order.subtotal?.toFixed(2)} ر.س</span></div>
                            <div className="flex justify-between text-primary-600"><span>رسوم الشحن</span><span className={order.shippingCost === 0 ? 'text-emerald-600' : ''}>{order.shippingCost === 0 ? 'مجاني' : `${order.shippingCost} ر.س`}</span></div>
                            {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>الخصم</span><span>-{order.discount?.toFixed(2)} ر.س</span></div>}
                            <div className="flex justify-between font-black text-primary-900 border-t border-primary-200 pt-1 mt-1"><span>الإجمالي</span><span>{order.total?.toFixed(2)} ر.س</span></div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {order.status === 'delivered' && <button className="g-gold text-primary-900 font-black text-xs px-4 py-2 rounded-full">⭐ تقييم الطلب</button>}
                            {['pending','confirmed'].includes(order.status) && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={cancellingId === order._id}
                                className="border border-red-200 text-red-600 font-bold text-xs px-4 py-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50">
                                {cancellingId === order._id ? 'جاري الإلغاء...' : '❌ إلغاء الطلب'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ══ PROFILE ══ */}
            {tab === 'profile' && (
              <div className="bg-white border border-primary-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-primary-50">
                  <h2 className="font-black text-primary-900 text-lg">الملف الشخصي</h2>
                </div>
                <div className="px-6 py-5 border-b border-primary-50 flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full g-gold flex items-center justify-center text-3xl font-black text-primary-900 shadow-md flex-shrink-0">{initials}</div>
                  <div>
                    <p className="font-black text-primary-900">{fullName}</p>
                    <p className="text-xs text-primary-400 mt-0.5">{user.email}</p>
                    {user.createdAt && <p className="text-xs text-primary-400 mt-0.5">عضو منذ {new Date(user.createdAt).toLocaleDateString('ar-SA', { year:'numeric', month:'long' })}</p>}
                  </div>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'الاسم الأول', key: 'firstName', type: 'text', placeholder: 'سارة' },
                      { label: 'اسم العائلة', key: 'lastName',  type: 'text', placeholder: 'المطيري' },
                      { label: 'رقم الجوال',  key: 'phone',     type: 'tel',  placeholder: '05XXXXXXXX', dir: 'ltr' },
                      { label: 'البريد الإلكتروني', key: 'email', type: 'email', placeholder: '', dir: 'ltr', readOnly: true },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold text-primary-600 mb-1.5">{f.label}</label>
                        <input
                          type={f.type} dir={f.dir} readOnly={f.readOnly} placeholder={f.placeholder}
                          value={(profile as any)[f.key]}
                          onChange={e => !f.readOnly && setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                          className={`w-full border border-primary-200 rounded-xl px-4 py-2.5 text-sm text-primary-900 focus:outline-none focus:border-primary-500 ${f.readOnly ? 'bg-primary-100 cursor-not-allowed' : 'bg-primary-50/50'}`}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold text-primary-600 mb-1.5">الجنس</label>
                      <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
                        className="w-full border border-primary-200 rounded-xl px-4 py-2.5 text-sm text-primary-900 focus:outline-none focus:border-primary-500 bg-primary-50/50">
                        <option value="">اختر</option>
                        <option value="female">أنثى</option>
                        <option value="male">ذكر</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button onClick={saveProfile} disabled={profileSaving}
                      className="g-gold text-primary-900 font-black px-7 py-2.5 rounded-full text-sm shadow hover:shadow-md transition-shadow disabled:opacity-60">
                      {profileSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                  </div>
                </div>
                <div className="px-6 py-5 border-t border-primary-50 bg-primary-50/40">
                  <h3 className="font-bold text-primary-800 text-sm mb-3">تغيير كلمة المرور</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { label: 'كلمة المرور الحالية', key: 'currentPassword' },
                      { label: 'كلمة المرور الجديدة', key: 'newPassword' },
                      { label: 'تأكيد كلمة المرور',   key: 'confirmPassword' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-[11px] font-bold text-primary-500 mb-1">{f.label}</label>
                        <input type="password" dir="ltr"
                          value={(pwdForm as any)[f.key]}
                          onChange={e => setPwdForm(p => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full border border-primary-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-white" />
                      </div>
                    ))}
                  </div>
                  <button onClick={savePassword} disabled={pwdSaving}
                    className="mt-3 border border-primary-300 text-primary-700 font-bold text-xs px-5 py-2 rounded-full hover:bg-primary-100 transition-colors disabled:opacity-60">
                    {pwdSaving ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                  </button>
                </div>
              </div>
            )}

            {/* ══ ADDRESSES ══ */}
            {tab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-black text-primary-900 text-lg">عناويني</h2>
                    <p className="text-xs text-primary-400">{addresses.length} عنوان محفوظ</p>
                  </div>
                  <button onClick={() => setAddingAddress(true)} className="g-gold text-primary-900 font-black text-xs px-4 py-2.5 rounded-full shadow">+ إضافة عنوان</button>
                </div>

                {loadingAddresses && <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>}

                {/* Add address form */}
                {addingAddress && (
                  <div className="bg-white border-2 border-primary-300 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-primary-900 text-sm mb-4">عنوان جديد</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {[
                        { label: 'التسمية', key: 'label', placeholder: 'المنزل / العمل' },
                        { label: 'الاسم الكامل *', key: 'name', placeholder: 'الاسم الكامل' },
                        { label: 'رقم الهاتف *', key: 'phone', placeholder: '05XXXXXXXX', dir: 'ltr' },
                        { label: 'المدينة', key: 'city', placeholder: 'الرياض' },
                        { label: 'الرمز البريدي', key: 'postal', placeholder: '12345', dir: 'ltr' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-[11px] font-bold text-primary-600 mb-1">{f.label}</label>
                          <input dir={f.dir} placeholder={f.placeholder}
                            value={(newAddress as any)[f.key] || ''}
                            onChange={e => setNewAddress(a => ({ ...a, [f.key]: e.target.value }))}
                            className="w-full border border-primary-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-primary-50" />
                        </div>
                      ))}
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-primary-600 mb-1">العنوان التفصيلي *</label>
                        <input placeholder="رقم المبنى، الشارع، الحي"
                          value={newAddress.address}
                          onChange={e => setNewAddress(a => ({ ...a, address: e.target.value }))}
                          className="w-full border border-primary-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-primary-50" />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-bold text-primary-700 mb-4 cursor-pointer">
                      <input type="checkbox" checked={newAddress.isDefault} onChange={e => setNewAddress(a => ({ ...a, isDefault: e.target.checked }))} className="rounded" />
                      تعيين كعنوان افتراضي
                    </label>
                    <div className="flex gap-2">
                      <button onClick={handleAddAddress} className="g-gold text-primary-900 font-black text-xs px-5 py-2 rounded-full shadow">حفظ العنوان</button>
                      <button onClick={() => setAddingAddress(false)} className="border border-primary-200 text-primary-600 font-bold text-xs px-5 py-2 rounded-full">إلغاء</button>
                    </div>
                  </div>
                )}

                {!loadingAddresses && addresses.map(addr => (
                  <div key={addr._id} className={`bg-white border rounded-2xl p-5 shadow-sm ${addr.isDefault ? 'border-primary-400' : 'border-primary-100'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${addr.isDefault ? 'g-gold text-primary-900' : 'bg-primary-100 text-primary-600'}`}>
                          {addr.label === 'المنزل' ? '🏠' : '🏢'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-black text-primary-900 text-sm">{addr.label}</p>
                            {addr.isDefault && <span className="text-[10px] font-bold bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">افتراضي</span>}
                          </div>
                          <p className="text-xs text-primary-600 mt-0.5">{addr.name} · {addr.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!addr.isDefault && <button onClick={() => handleSetDefault(addr._id)} className="text-xs font-bold text-primary-500 hover:text-primary-800 border border-primary-200 px-3 py-1.5 rounded-full transition-colors">تعيين افتراضي</button>}
                        <button onClick={() => handleDeleteAddress(addr._id)} className="text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-full transition-colors">حذف</button>
                      </div>
                    </div>
                    <div className="mt-3 pr-12 text-xs text-primary-500 leading-relaxed">
                      <p>📍 {addr.address}</p>
                      <p className="mt-0.5">{addr.city}{addr.postal ? ` · ${addr.postal}` : ''}</p>
                    </div>
                  </div>
                ))}

                {!loadingAddresses && addresses.length === 0 && !addingAddress && (
                  <div className="bg-white border-2 border-dashed border-primary-200 rounded-2xl p-8 text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="font-bold text-primary-600 text-sm">لا توجد عناوين محفوظة</p>
                    <button onClick={() => setAddingAddress(true)} className="mt-3 g-gold text-primary-900 font-black text-xs px-5 py-2 rounded-full shadow inline-block">+ إضافة عنوان</button>
                  </div>
                )}
              </div>
            )}

            {/* ══ WISHLIST ══ */}
            {tab === 'wishlist' && (
              <div className="space-y-4">
                <h2 className="font-black text-primary-900 text-lg">المفضلة</h2>
                {loadingWishlist && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>}
                {!loadingWishlist && wishlist.length === 0 && (
                  <div className="bg-white border border-primary-100 rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">❤️</div>
                    <p className="font-bold text-primary-600">لا توجد منتجات في المفضلة</p>
                    <Link href="/" className="mt-3 g-gold text-primary-900 font-black px-6 py-2.5 rounded-full text-sm inline-block">تسوق الآن</Link>
                  </div>
                )}
                {!loadingWishlist && wishlist.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((p: any) => (
                      <div key={p._id} className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm group">
                        <div className="aspect-square overflow-hidden bg-primary-50">
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                        </div>
                        <div className="p-3">
                          <p className="font-bold text-xs text-primary-900 line-clamp-2 mb-1">{p.name}</p>
                          <p className="text-primary-300 font-black text-sm mb-2">{p.price} ر.س</p>
                          <div className="flex gap-2">
                            <Link href={`/products/${p.slug}`} className="flex-1 g-gold text-primary-900 font-black text-[10px] py-1.5 rounded-full text-center">عرض المنتج</Link>
                            <button onClick={() => handleRemoveWishlist(p._id)} className="border border-red-200 text-red-500 font-bold text-[10px] px-2 py-1.5 rounded-full hover:bg-red-50">✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ SETTINGS ══ */}
            {tab === 'settings' && (
              <div className="space-y-4">
                <h2 className="font-black text-primary-900 text-lg">الإعدادات</h2>
                <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-primary-50">
                    <h3 className="font-black text-primary-900 text-sm">إعدادات الإشعارات</h3>
                  </div>
                  <div className="divide-y divide-primary-50">
                    {([
                      ['orders', '📦', 'إشعارات الطلبات',   'حالة الطلب والشحن والتوصيل'],
                      ['offers', '🎁', 'العروض والخصومات',   'كوبونات وعروض حصرية للأعضاء'],
                      ['news',   '📰', 'الأخبار والمنتجات',  'منتجات جديدة ومحتوى المدونة'],
                      ['sms',    '💬', 'رسائل SMS',          'إشعارات عبر الرسائل القصيرة'],
                    ] as const).map(([key, icon, label, sub]) => (
                      <div key={key} className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{icon}</span>
                          <div>
                            <p className="font-bold text-sm text-primary-900">{label}</p>
                            <p className="text-[11px] text-primary-400">{sub}</p>
                          </div>
                        </div>
                        <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notifications[key] ? 'bg-primary-900' : 'bg-primary-200'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifications[key] ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-primary-50">
                    <h3 className="font-black text-primary-900 text-sm">الخصوصية والحساب</h3>
                  </div>
                  <div className="divide-y divide-primary-50">
                    {[
                      ['📋', 'سياسة الخصوصية', 'اقرأ كيف نحمي بياناتك'],
                      ['📄', 'شروط الاستخدام', 'اطلع على شروط استخدام المنصة'],
                      ['🗑️', 'حذف الحساب',     'حذف حسابك وجميع بياناتك نهائياً'],
                    ].map(([icon, label, sub]) => (
                      <button key={label} className={`w-full flex items-center gap-3 px-5 py-4 text-right hover:bg-primary-50 transition-colors ${label === 'حذف الحساب' ? 'text-red-600' : 'text-primary-700'}`}>
                        <span className="text-lg">{icon}</span>
                        <span className="flex-1">
                          <span className="block font-bold text-sm">{label}</span>
                          <span className="block text-[11px] text-primary-400">{sub}</span>
                        </span>
                        <span className="text-primary-300 text-xs">←</span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-center text-[11px] text-primary-300">نَدى الحرير · الإصدار ١.٠.٠ · جميع الحقوق محفوظة ٢٠٢٥</p>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
