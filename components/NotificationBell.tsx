'use client'
import { useState, useRef, useEffect } from 'react'

type Notification = {
  id: number
  text: string
  icon: string
  time: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, text: 'طلبك #1234 تم شحنه 🚚', icon: '📦', time: 'منذ ١٠ دقائق', read: false },
  { id: 2, text: 'خصم ١٥٪ على المناشف اليوم', icon: '🎉', time: 'منذ ساعة', read: false },
  { id: 3, text: 'مناديل البامبو متوفرة مجدداً', icon: '🌿', time: 'منذ ٣ ساعات', read: false },
  { id: 4, text: 'رصيدك: ١٢٠ نقطة ✨', icon: '⭐', time: 'أمس', read: true },
]

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: number) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="الإشعارات"
        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          open ? 'bg-primary-100 text-primary-700' : 'text-primary-500 hover:bg-primary-50 hover:text-primary-700'
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 border-2 border-white leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 top-10 w-[300px] sm:w-[320px] bg-white rounded-2xl border border-primary-100 shadow-2xl z-50 overflow-hidden"
          dir="rtl"
          style={{ right: 'auto', left: '-8rem' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-primary-900">الإشعارات</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-primary-500 hover:text-primary-700 font-semibold transition-colors"
              >
                تعليم الكل مقروء ✓
              </button>
            )}
          </div>

          {/* Notifications list */}
          <ul className="divide-y divide-primary-50 max-h-72 overflow-y-auto">
            {notifications.map(n => (
              <li
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-primary-50 ${
                  !n.read ? 'bg-primary-50/40' : ''
                }`}
              >
                {/* Icon bubble */}
                <div className="w-9 h-9 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 text-base mt-0.5">
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] leading-snug ${n.read ? 'text-primary-500' : 'text-primary-900 font-semibold'}`}>
                    {n.text}
                  </p>
                  <p className="text-[10px] text-primary-400 mt-0.5">{n.time}</p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <span className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0 mt-1.5" />
                )}
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-primary-50 text-center">
            <button
              onClick={() => setOpen(false)}
              className="text-[11px] text-primary-500 hover:text-primary-700 font-semibold transition-colors"
            >
              عرض كل الإشعارات
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
