'use client'
import { useT } from '@/hooks/useT'

const POSTS = [
  { img: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&q=80', likes: '١.٢ك', comments: '٤٨' },
  { img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80', likes: '٩٨٤', comments: '٣٢' },
  { img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80', likes: '٢.١ك', comments: '٧٦' },
  { img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', likes: '١.٥ك', comments: '٥٩' },
  { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80', likes: '٨٧٣', comments: '٢٧' },
  { img: 'https://images.unsplash.com/photo-1578895101003-571866c7d3c6?w=400&q=80', likes: '١.٨ك', comments: '٦٣' },
]

export default function InstagramGrid() {
  const { lang } = useT()

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-primary-900" style={{ fontFamily: 'Amiri, serif' }}>
              {lang === 'ar' ? 'تابعونا على إنستغرام' : 'Follow Us on Instagram'}
              <span className="text-primary-400">.</span>
            </h2>
            <p className="text-primary-400 text-sm mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />
              {lang === 'ar' ? '@nada_alhareer_sa' : '@nada_alhareer_sa'}
            </p>
          </div>
          <a
            href="#"
            className="g-gold text-white font-black text-xs px-5 py-2.5 rounded-full shadow hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {lang === 'ar' ? 'تابع الحساب' : 'Follow Us'}
          </a>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
          {POSTS.map((post, i) => (
            <a
              key={i}
              href="#"
              className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden group block"
            >
              <img
                src={post.img}
                alt={`post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <span className="text-white text-xs font-black flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  {post.likes}
                </span>
                <span className="text-white text-xs font-black flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  {post.comments}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
