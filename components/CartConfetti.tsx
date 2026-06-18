'use client'
import { useEffect, useState } from 'react'
const COLORS = ['#1a3461','#2669a0','#82b0d5','#ffffff','#153d6a']
export default function CartConfetti({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<{x:number,y:number,c:string,r:number,d:number}[]>([])
  useEffect(() => {
    if (!trigger) return
    setPieces(Array.from({length:30},(_,i)=>({
      x: 30 + Math.random()*40, y: 20+Math.random()*20,
      c: COLORS[i%COLORS.length], r: Math.random()*360,
      d: 0.5+Math.random()*1.5
    })))
    const t = setTimeout(()=>setPieces([]),1500)
    return ()=>clearTimeout(t)
  },[trigger])
  if (!pieces.length) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {pieces.map((p,i)=>(
        <div key={i} className="absolute w-2 h-2 rounded-sm animate-[confettiFall_1.5s_ease_forwards]"
          style={{left:`${p.x}%`,top:`${p.y}%`,background:p.c,transform:`rotate(${p.r}deg)`,animationDelay:`${i*0.03}s`,animationDuration:`${p.d}s`}}/>
      ))}
    </div>
  )
}
