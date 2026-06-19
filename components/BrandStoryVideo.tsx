'use client'
import { useRef, useState } from 'react'

export default function BrandStoryVideo() {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <section className="py-12 md:py-16 bg-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(38,105,160,0.15) 0%, transparent 70%)'}} />
      <div className="relative z-10 max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white" style={{fontFamily:'Amiri,serif'}}>
            شاهد قصة NOVI <span className="text-primary-300">🎬</span>
          </h2>
          <p className="text-white/50 text-sm mt-2">من الرياض إلى كل بيت سعودي</p>
        </div>

        <div
          className="max-w-3xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer group"
          style={{aspectRatio:'16/9'}}
          onClick={toggle}
        >
          {/* Actual video */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/brand-story.mp4"
            playsInline
            onEnded={() => setPlaying(false)}
          />

          {/* Play/Pause overlay — hides when playing */}
          <div className={`absolute inset-0 bg-primary-900/55 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center hover:bg-white/35 hover:scale-110 transition-all backdrop-blur-sm shadow-2xl">
              {playing ? (
                /* Pause icon */
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                /* Play icon */
                <svg className="w-8 h-8 text-white mr-[-4px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
          </div>

          {/* Duration badge — hides when playing */}
          {!playing && (
            <div className="absolute bottom-4 right-4 bg-primary-900/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              ▶ اضغط للتشغيل
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
