'use client'
import { useEffect, useRef, useState } from 'react'

type Phase = 'show' | 'exit' | 'done'

/* ─── Hyperspace warp-tunnel on canvas ──────────────────────────── */
function runTunnel(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  const W = canvas.width, H = canvas.height
  const CX = W / 2, CY = H / 2, FOV = 600
  const PAL = ['#2669a0','#1a3461','#4a8abb','#82b0d5','#fff','#3d7ab5']

  type S = { x:number; y:number; z:number; pz:number; c:string }
  const stars: S[] = Array.from({length:220},()=>({
    x:(Math.random()-.5)*W*1.8, y:(Math.random()-.5)*H*1.8,
    z:Math.random()*800+50, pz:0, c:PAL[~~(Math.random()*PAL.length)],
  }))

  let alive = true, spd = 2.5
  ;(function draw(){
    if(!alive) return
    ctx.fillStyle='rgba(4,9,20,0.2)'; ctx.fillRect(0,0,W,H)
    spd = Math.min(spd+0.02, 9)
    for(const s of stars){
      s.pz=s.z; s.z-=spd
      if(s.z<=0){ s.x=(Math.random()-.5)*W*1.8; s.y=(Math.random()-.5)*H*1.8; s.z=800; s.pz=800 }
      const sx=(s.x/s.z)*FOV+CX, sy=(s.y/s.z)*FOV+CY
      const px=(s.x/s.pz)*FOV+CX, py=(s.y/s.pz)*FOV+CY
      const sz=Math.max(.3,(1-s.z/800)*3.2), al=Math.min(1,(1-s.z/800)*1.5)
      ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(sx,sy)
      ctx.strokeStyle=s.c; ctx.lineWidth=sz; ctx.globalAlpha=al*.9; ctx.stroke()
    }
    ctx.globalAlpha=1
    requestAnimationFrame(draw)
  })()
  return ()=>{ alive=false }
}

const LETTERS = ['ن','و','ف','ي']

export default function BrandSplash() {
  // 'show' from first render → splash covers page before any JS runs
  const [phase,  setPhase]  = useState<Phase>('show')
  const [logoIn, setLogoIn] = useState(false)
  const [textIn, setTextIn] = useState(false)
  const [prog,   setProg]   = useState(0)

  const cvs     = useRef<HTMLCanvasElement>(null)
  const raf     = useRef<number>()
  const killTun = useRef<()=>void>()

  function exit() {
    cancelAnimationFrame(raf.current!)
    setProg(1)
    setPhase('exit')
    // Remove from DOM after fade completes
    setTimeout(()=>setPhase('done'), 900)
  }

  useEffect(()=>{
    if(cvs.current) killTun.current = runTunnel(cvs.current)
    const t1 = setTimeout(()=>setLogoIn(true), 180)
    const t2 = setTimeout(()=>setTextIn(true),  520)

    const t0=Date.now(), DUR=2900
    const tick=()=>{
      const p=Math.min((Date.now()-t0)/DUR,1)
      setProg(p)
      if(p<1) raf.current=requestAnimationFrame(tick)
    }
    raf.current=requestAnimationFrame(tick)
    const t3=setTimeout(exit, 3800)

    return ()=>{
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      cancelAnimationFrame(raf.current!)
      killTun.current?.()
    }
  },[])

  if(phase==='done') return null

  const leaving = phase==='exit'

  return (<>
    <style>{`
      @keyframes NL{
        0%{transform:perspective(500px) rotateX(-95deg) translateY(-28px);opacity:0}
        62%{transform:perspective(500px) rotateX(10deg) translateY(3px);opacity:1}
        100%{transform:perspective(500px) rotateX(0) translateY(0);opacity:1}}
      @keyframes NLogo{
        0%{transform:perspective(800px) rotateY(-95deg) scale(.72);opacity:0}
        68%{transform:perspective(800px) rotateY(7deg) scale(1.03);opacity:1}
        100%{transform:perspective(800px) rotateY(0) scale(1);opacity:1}}
      @keyframes NRing{
        0%{transform:perspective(650px) rotateX(62deg) scale(.4);opacity:.9}
        100%{transform:perspective(650px) rotateX(62deg) scale(3.8);opacity:0}}
      @keyframes NGlow{0%,100%{opacity:.1;transform:scale(1)}50%{opacity:.26;transform:scale(1.14)}}
      @keyframes NScan{0%{top:-45%}100%{top:145%}}
      @keyframes NBar{0%{background-position:-200% center}100%{background-position:200% center}}
      @keyframes NUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes NLine{from{transform:scaleX(0)}to{transform:scaleX(1)}}
      @keyframes NGhost{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
      @keyframes NOrb{
        0%,100%{transform:translateY(0) scale(1);opacity:.45}
        50%{transform:translateY(-20px) scale(1.25);opacity:.85}}
    `}</style>

    <div
      onClick={()=>{ if(!leaving) exit() }}
      style={{
        position:'fixed', inset:0, zIndex:99999,
        overflow:'hidden', fontFamily:'Cairo,sans-serif',
        cursor:        leaving?'default':'pointer',
        pointerEvents: leaving?'none':'all',
        background:'#040912',
        // Smooth fade-out exit — no curtains, no black, no flash
        opacity:   leaving?0:1,
        transition:leaving?'opacity 0.85s ease':'none',
      }}
    >
      {/* 1 — HYPERSPACE CANVAS */}
      <canvas ref={cvs} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>

      {/* 2 — VIGNETTE */}
      <div style={{
        position:'absolute',inset:0,pointerEvents:'none',
        background:'radial-gradient(ellipse 68% 68% at 50% 50%,transparent 28%,rgba(2,6,16,.9) 100%)',
      }}/>

      {/* 3 — GHOST ARABIC CALLIGRAPHY */}
      {logoIn && <div style={{
        position:'absolute',inset:0,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',
        pointerEvents:'none',userSelect:'none',
        animation:'NGhost 1.6s ease forwards',
      }}>
        <p style={{fontSize:'clamp(78px,21vw,255px)',fontFamily:'Amiri,serif',fontWeight:900,
          color:'white',opacity:.045,lineHeight:.84,whiteSpace:'nowrap',direction:'rtl'}}>نعومة</p>
        <p style={{fontSize:'clamp(52px,14vw,175px)',fontFamily:'Amiri,serif',fontWeight:900,
          color:'white',opacity:.03,lineHeight:.84,whiteSpace:'nowrap',direction:'rtl'}}>وجودة</p>
      </div>}

      {/* 4 — 3D PERSPECTIVE RINGS */}
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',
        justifyContent:'center',pointerEvents:'none'}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{
            position:'absolute',width:110+i*90,height:110+i*90,
            borderRadius:'50%',border:`1.5px solid rgba(38,105,160,${.5-i*.1})`,
            animation:`NRing ${2+i*.65}s ease-out infinite`,
            animationDelay:`${i*.42}s`,
          }}/>
        ))}
      </div>

      {/* 5 — CENTER GLOW */}
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',
        justifyContent:'center',pointerEvents:'none'}}>
        <div style={{width:360,height:360,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(38,105,160,.2) 0%,rgba(26,52,97,.08) 45%,transparent 70%)',
          animation:'NGlow 3.2s ease-in-out infinite'}}/>
      </div>

      {/* 6 — FLOATING LIGHT ORBS */}
      {[
        {x:'12%',y:'20%',s:6,d:3.8,dl:.0},{x:'86%',y:'14%',s:4,d:4.4,dl:.7},
        {x:'78%',y:'78%',s:5,d:3.4,dl:1.2},{x:'16%',y:'80%',s:4,d:4.8,dl:.3},
        {x:'50%',y:'8%', s:7,d:3.6,dl:.9},{x:'92%',y:'52%',s:4,d:5.0,dl:.2},
        {x:'6%', y:'50%',s:5,d:3.3,dl:1.5},{x:'44%',y:'92%',s:4,d:4.2,dl:.5},
        {x:'70%',y:'30%',s:6,d:3.9,dl:1.0},{x:'28%',y:'65%',s:4,d:4.6,dl:.6},
      ].map((o,i)=>(
        <div key={i} style={{
          position:'absolute',left:o.x,top:o.y,
          width:o.s,height:o.s,borderRadius:'50%',
          background:i%3===0?'#2669a0':i%3===1?'#4a8abb':'#82b0d5',
          animation:`NOrb ${o.d}s ease-in-out infinite`,
          animationDelay:`${o.dl}s`,pointerEvents:'none',
        }}/>
      ))}

      {/* 7 — MAIN CONTENT */}
      <div style={{
        position:'absolute',inset:0,zIndex:10,
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      }}>

        {/* LOGO — 3D Y-axis flip */}
        <div style={{
          position:'relative',marginBottom:18,
          animation:logoIn?'NLogo .9s cubic-bezier(.34,1.3,.64,1) forwards':'none',
          opacity:logoIn?1:0,
        }}>
          <div style={{position:'absolute',inset:-28,borderRadius:'50%',pointerEvents:'none',
            background:'radial-gradient(circle,rgba(38,105,160,.38) 0%,transparent 68%)'}}/>
          <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:10,pointerEvents:'none'}}>
            <div style={{position:'absolute',left:0,right:0,height:'42%',
              background:'linear-gradient(to bottom,transparent,rgba(82,176,213,.2),transparent)',
              animation:'NScan 2.4s ease-in-out infinite'}}/>
          </div>
          <img src="/logo-combined.png" alt="NOVI"
            style={{height:82,maxWidth:235,objectFit:'contain',display:'block',position:'relative',zIndex:1}}/>
        </div>

        {/* ARABIC ن و ف ي — 3D ceiling drop */}
        {textIn && (
          <div style={{display:'flex',gap:8,direction:'rtl',marginBottom:12}}>
            {LETTERS.map((ch,i)=>(
              <span key={i} style={{
                fontSize:'clamp(44px,9.5vw,82px)',
                fontFamily:'Amiri,serif',fontWeight:900,color:'#fff',
                textShadow:'0 0 32px rgba(38,105,160,.85),0 4px 18px rgba(0,0,0,.7)',
                display:'inline-block',
                animation:'NL .68s cubic-bezier(.34,1.45,.64,1) forwards',
                animationDelay:`${i*.11}s`,opacity:0,
              }}>{ch}</span>
            ))}
          </div>
        )}

        {textIn && <div style={{textAlign:'center',direction:'rtl'}}>
          <p style={{
            fontSize:'clamp(15px,3.6vw,23px)',fontFamily:'Amiri,serif',
            color:'rgba(130,176,213,.92)',letterSpacing:'.05em',
            animation:'NUp .75s ease .44s forwards',opacity:0,
            textShadow:'0 2px 22px rgba(38,105,160,.45)',
          }}>المناديل الفاخرة الأولى في المملكة العربية السعودية</p>

          <div style={{margin:'13px auto',height:1,width:100,
            background:'linear-gradient(90deg,transparent,rgba(130,176,213,.65),transparent)',
            animation:'NLine .85s ease .7s forwards',
            transform:'scaleX(0)',transformOrigin:'center'}}/>

          <p style={{fontSize:13,letterSpacing:'.19em',
            color:'rgba(130,176,213,.62)',direction:'rtl',
            animation:'NUp .6s ease .85s forwards',opacity:0}}>
            نعومة تلمسها &nbsp;·&nbsp; وجودة تثق بها
          </p>
        </div>}

        {textIn && <div style={{
          marginTop:28,width:128,height:2,
          background:'rgba(255,255,255,.06)',borderRadius:99,overflow:'hidden',
          animation:'NUp .5s ease 1s forwards',opacity:0,
        }}>
          <div style={{
            height:'100%',width:`${prog*100}%`,borderRadius:99,
            background:'linear-gradient(90deg,#1a3461,#2669a0,#82b0d5,#4a8abb)',
            backgroundSize:'200% 100%',
            animation:'NBar 1.5s linear infinite',
            transition:'width .05s linear',
            boxShadow:'0 0 14px rgba(82,176,213,.65)',
          }}/>
        </div>}

        {textIn && <div style={{
          display:'flex',alignItems:'center',gap:10,marginTop:16,
          animation:'NUp .5s ease 1.1s forwards',opacity:0,
        }}>
          <div style={{width:22,height:1,background:'rgba(130,176,213,.4)'}}/>
          <span style={{fontSize:10,letterSpacing:'.28em',textTransform:'uppercase',
            color:'rgba(130,176,213,.72)'}}>Premium · KSA · Est. 2019</span>
          <div style={{width:22,height:1,background:'rgba(130,176,213,.4)'}}/>
        </div>}
      </div>

      {!leaving && textIn && <p style={{
        position:'absolute',bottom:22,left:'50%',transform:'translateX(-50%)',
        color:'rgba(255,255,255,.14)',fontSize:10,letterSpacing:'.22em',
        whiteSpace:'nowrap',
        animation:'NUp .5s ease 1.6s forwards',opacity:0,
      }}>اضغط في أي مكان للتخطي</p>}
    </div>
  </>)
}
