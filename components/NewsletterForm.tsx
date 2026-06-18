'use client'

export default function NewsletterForm() {
  return (
    <form className="flex gap-3 max-w-sm mx-auto" onSubmit={e => e.preventDefault()}>
      <input
        type="email"
        placeholder="بريدك الإلكتروني..."
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/35 focus:outline-none focus:border-primary-400 text-sm"
      />
      <button type="submit" className="g-gold text-white font-black px-5 py-3 rounded-xl text-sm whitespace-nowrap">
        اشترك
      </button>
    </form>
  )
}
