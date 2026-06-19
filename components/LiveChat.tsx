'use client'
import { useState, useEffect, useRef } from 'react'

const QUICK_REPLIES = [
  { id: 'order', label: 'استفسار عن طلب', response: 'سيدي/سيدتي، لتتبع طلبك يرجى التوجه لصفحة تتبع الطلبات أو إرسال رقم الطلب هنا.' },
  { id: 'product', label: 'مشكلة في المنتج', response: 'نعتذر عن هذا الأمر. يرجى إرسال صورة للمشكلة وسيتواصل معك فريق الدعم خلال ساعة.' },
  { id: 'offers', label: 'عروض وخصومات', response: 'لدينا عروض رائعة الآن! استخدم كود NADA10 للحصول على خصم ١٠٪ على أول طلب.' },
]

export default function LiveChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; from: 'bot' | 'user' }[]>([
    { text: 'مرحباً! كيف يمكنني مساعدتك؟ 😊', from: 'bot' }
  ])
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const handleQuickReply = (reply: typeof QUICK_REPLIES[0]) => {
    setMessages(m => [...m, { text: reply.label, from: 'user' }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { text: reply.response, from: 'bot' }])
    }, 1500)
  }

  return (
    <>
      {/* Floating button - bottom left */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-20 left-4 md:bottom-6 z-50 w-14 h-14 rounded-full g-gold text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        aria-label="Live Chat"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-36 left-4 md:bottom-24 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-primary-100 overflow-hidden flex flex-col"
          style={{ maxHeight: '420px' }}
        >
          {/* Header */}
          <div className="g-gold text-white p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-black text-sm">ن</div>
            <div>
              <p className="font-black text-sm">دعم NOVI</p>
              <p className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                فريق الدعم متاح ٢٤/٧
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs font-semibold leading-relaxed
                  ${msg.from === 'bot' ? 'g-gold text-white rounded-tl-sm' : 'bg-primary-100 text-primary-900 rounded-tr-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-end">
                <div className="g-gold text-white px-3 py-2 rounded-2xl rounded-tl-sm text-xs">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="p-3 border-t border-primary-100 space-y-2">
              <p className="text-[10px] text-primary-400 font-bold mb-2">اختر من الأسئلة الشائعة:</p>
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr.id}
                  onClick={() => handleQuickReply(qr)}
                  className="w-full text-right text-xs font-bold py-2 px-3 rounded-xl border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
