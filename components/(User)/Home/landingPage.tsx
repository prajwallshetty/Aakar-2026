"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";

export default function HeroLanding() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number | null>(null);
  const [mounted,  setMounted]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Scroll parallax ───────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const bgScrollY   = useTransform(scrollYProgress, [0, 1], ["0%",  "30%"]);
  // char scrolls UP more slowly than page → feels pinned deep in scene
  const charScrollY = useTransform(scrollYProgress, [0, 1], ["0%",  "10%"]);
  // char drifts slightly RIGHT as we scroll → parallax separation
  const charScrollX = useTransform(scrollYProgress, [0, 1], ["0px", "50px"]);
  // char fades as it exits viewport
  const charOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.9, 0]);
  const charScale   = useTransform(scrollYProgress, [0, 1], [1, 0.90]);
  const logoY       = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textY       = useTransform(scrollYProgress, [0, 1], ["0%",  "24%"]);
  const overlayOp   = useTransform(scrollYProgress, [0, 0.6], [0.52, 0.80]);

  // ── Mouse motion values ───────────────────────────────────────────────────
  // Background — very sluggish, wide lazy arc
  const bgMX = useSpring(useMotionValue(0), { stiffness: 10, damping: 26, mass: 1.6 });
  const bgMY = useSpring(useMotionValue(0), { stiffness: 10, damping: 26, mass: 1.6 });

  // Character translate — medium momentum, MORE travel than BG (depth illusion)
  const chTX = useSpring(useMotionValue(0), { stiffness: 24, damping: 18, mass: 1.1 });
  const chTY = useSpring(useMotionValue(0), { stiffness: 24, damping: 18, mass: 1.1 });

  // Character 3-D tilt — snappier so it feels physical
  const chRX = useSpring(useMotionValue(0), { stiffness: 60, damping: 16, mass: 0.6 });
  const chRY = useSpring(useMotionValue(0), { stiffness: 60, damping: 16, mass: 0.6 });

  // Text subtle follow — opposite to char (stereoscopic push)
  const textMX = useSpring(useMotionValue(0), { stiffness: 36, damping: 22, mass: 0.9 });

  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / cx;  // -1 … +1
      const ny = (e.clientY - cy) / cy;

      bgMX.set(nx * -20);
      bgMY.set(ny * -11);

      // Character moves in SAME direction as mouse but more — looks like it's on a closer layer
      chTX.set(nx * -36);
      chTY.set(ny * -20);

      // Tilt toward mouse: rotateY leans left/right, rotateX leans up/down
      chRY.set(nx *  9);
      chRX.set(ny * -5);

      // Text moves slightly opposite to char → stereo depth
      textMX.set(nx * 12);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [isMobile, bgMX, bgMY, chTX, chTY, chRX, chRY, textMX]);

  // ── Ember canvas ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type E = { x:number;y:number;vx:number;vy:number;r:number;op:number;life:number;max:number;hue:number };
    const spawn = (w:number,h:number):E => ({
      x: Math.random()*w, y: h+Math.random()*60,
      vx: (Math.random()-0.5)*0.9, vy: -(Math.random()*1.8+0.5),
      r: Math.random()*2.2+0.4, op: Math.random()*0.65+0.2,
      life:0, max:140+Math.random()*120, hue:10+Math.random()*40,
    });
    const em:E[] = Array.from({length:120},()=>spawn(canvas.width,canvas.height));

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      em.forEach((e,i)=>{
        e.x+=e.vx+Math.sin(e.life*0.04)*0.35; e.y+=e.vy; e.life++;
        if(e.life>e.max||e.y<-10){em[i]=spawn(canvas.width,canvas.height);return;}
        const fade=Math.sin((e.life/e.max)*Math.PI);
        ctx.save(); ctx.globalAlpha=e.op*fade;
        const g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*3);
        g.addColorStop(0,`hsla(${e.hue},100%,82%,1)`);
        g.addColorStop(0.4,`hsla(${e.hue},100%,55%,0.7)`);
        g.addColorStop(1,`hsla(${e.hue},100%,40%,0)`);
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(e.x,e.y,e.r*3,0,Math.PI*2); ctx.fill(); ctx.restore();
      });
      rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ window.removeEventListener("resize",resize); if(rafRef.current)cancelAnimationFrame(rafRef.current); };
  }, []);

  const chars = "A NEW ERA BEGINS".split("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;700&family=Noto+Serif+JP:wght@200;300&display=swap');
        .hl * { box-sizing:border-box; }

        .hl-scan { background-image:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px); }
        .hl-grain { background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E"); background-repeat:repeat; background-size:180px 180px; mix-blend-mode:overlay; }

        /* ── Smooth vertical float ── */
        @keyframes hl-float {
          0%,100%{ transform:translateY(0px);   }
          35%    { transform:translateY(-11px);  }
          70%    { transform:translateY(-5px);   }
        }
        .hl-float { animation:hl-float 7s ease-in-out infinite; }

        /* ── Secondary sway on char body — slightly faster, offset phase ── */
        @keyframes hl-sway {
          0%,100%{ transform:rotate(0deg) skewX(0deg);    }
          25%    { transform:rotate(0.45deg) skewX(0.3deg);  }
          75%    { transform:rotate(-0.35deg) skewX(-0.2deg); }
        }
        .hl-sway { animation:hl-sway 4.8s ease-in-out infinite; transform-origin:bottom center; }

        /* ── Ground shadow stretches with tilt ── */
        @keyframes hl-glow-breathe {
          0%,100%{ opacity:0.5; transform:scaleX(1);    }
          50%    { opacity:0.7; transform:scaleX(1.10); }
        }
        .hl-glow-breathe { animation:hl-glow-breathe 6s ease-in-out infinite; }

        @keyframes hl-logo-glow {
          0%,100%{ filter:drop-shadow(0 0 20px rgba(255,120,30,.45)) drop-shadow(0 0 55px rgba(255,60,10,.20)); }
          50%    { filter:drop-shadow(0 0 40px rgba(255,160,50,.75)) drop-shadow(0 0 90px rgba(255,80,10,.38)); }
        }
        .hl-logo-glow { animation:hl-logo-glow 3.5s ease-in-out infinite; }

        @keyframes hl-badge { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .hl-badge { background:linear-gradient(105deg,rgba(255,255,255,.03) 0%,rgba(255,200,100,.18) 40%,rgba(255,255,255,.03) 60%,rgba(255,255,255,.01) 100%); background-size:200% auto; animation:hl-badge 4s linear infinite; }

        .hl-tc { display:inline-block; opacity:0; transform:translateY(22px) rotate(2deg); animation:hl-cu .7s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes hl-cu { to{ opacity:1; transform:translateY(0) rotate(0deg); } }

        @keyframes hl-vp { 0%,100%{opacity:1} 50%{opacity:.88} }
        .hl-vp { animation:hl-vp 8s ease-in-out infinite; }

        @keyframes hl-flicker { 0%,100%{opacity:.55} 30%{opacity:.50} 60%{opacity:.58} 80%{opacity:.52} }
        .hl-flicker { animation:hl-flicker 5s ease-in-out infinite; }

        @keyframes hl-bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(7px);opacity:.9} }
        .hl-bounce { animation:hl-bounce 2s ease-in-out infinite; }

        .hl-side { writing-mode:vertical-rl; font-family:'Cinzel',serif; font-size:9px; letter-spacing:.55em; text-transform:uppercase; color:rgba(255,200,120,.22); }

        /* perspective for 3-D tilt */
        .hl-persp { perspective:1000px; perspective-origin:50% 40%; }
      `}</style>

      <section ref={sectionRef} className="hl relative w-full h-screen min-h-[640px] overflow-hidden bg-black" style={{fontFamily:"'Cinzel',serif"}}>

        {/* BG */}
        <motion.div className="absolute z-0" style={{inset:!isMobile?"-90px":"-30px", y:bgScrollY, x:bgMX}}>
          <motion.div className="absolute inset-0" style={{y:bgMY}}>
            <Image src="/landingbg.jpg" alt="" fill priority quality={95} sizes="130vw" style={{objectFit:"cover",objectPosition:"center 40%"}}/>
          </motion.div>
        </motion.div>

        <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" style={{mixBlendMode:"screen",opacity:.75}}/>
        <div className="hl-scan absolute inset-0 z-10 pointer-events-none"/>
        <div className="hl-grain absolute inset-0 z-10 pointer-events-none"/>

        <motion.div className="hl-vp absolute inset-0 z-10 pointer-events-none" style={{opacity:overlayOp}}>
          <div style={{position:"absolute",inset:0,background:["radial-gradient(ellipse 120% 80% at 50% 115%, #0a0000 0%, transparent 55%)","linear-gradient(to top, rgba(5,0,0,.97) 0%, rgba(8,2,0,.65) 30%, rgba(10,2,0,.15) 60%, transparent 100%)","linear-gradient(to bottom, rgba(4,0,0,.60) 0%, transparent 30%)","linear-gradient(to right, rgba(3,0,0,.60) 0%, transparent 45%)"].join(", ")}}/>
        </motion.div>

        <div className="hl-flicker absolute top-0 left-0 z-20 pointer-events-none" style={{width:"35vw",height:"35vw",maxWidth:320,maxHeight:320,background:"radial-gradient(ellipse at 0% 0%, rgba(180,30,0,.28) 0%, transparent 65%)"}}/>

        {/* ════════════════ CHARACTER — 5-layer parallax system ══ */}
        {/*
          Depth order back → front
          ① bgScrollY+bgMX/Y   — world BG (~0 depth)
          ② charScrollY/X      — scroll: char rises slower than camera, drifts right
          ③ chTX / chTY        — mouse translate: most travel = closest layer
          ④ chRX / chRY        — 3-D tilt toward cursor
          ⑤ hl-float           — sinusoidal float, phase-staggered
          ⑥ hl-sway            — secondary micro-sway (faster, different phase)
        */}
        <motion.div
          className="hl-persp absolute"
          style={!isMobile ? {
            right: "10vw", bottom: "-8vh", zIndex: 25,
            y: charScrollY,
            x: charScrollX,
            opacity: charOpacity,
            scale: charScale,
          } : {
            right: "-3vw", bottom: "-3vh", zIndex: 25, opacity: .32,
          }}
        >
          {/* ③ mouse translate */}
          <motion.div style={!isMobile ? {x:chTX, y:chTY} : undefined}>
            {/* ④ 3-D tilt */}
            <motion.div style={!isMobile ? {rotateX:chRX, rotateY:chRY, transformStyle:"preserve-3d"} : undefined}>
              {/* ⑤ float */}
              <div className={!isMobile ? "hl-float" : ""}>

                {/* Ambient glow behind char — moves with tilt */}
                <div style={{
                  position:"absolute", inset:"-15% -20%",
                  background:"radial-gradient(ellipse 55% 70% at 55% 75%, rgba(220,75,10,.48) 0%, rgba(160,30,0,.20) 40%, transparent 70%)",
                  filter:"blur(28px)", zIndex:-1, pointerEvents:"none",
                  borderRadius:"50%",
                }}/>

                {/* Ground shadow ellipse */}
                <div className="hl-glow-breathe" style={{
                  position:"absolute", bottom:"1%", left:"10%", right:"10%", height:"6%",
                  background:"radial-gradient(ellipse 100% 100% at 50% 100%, rgba(190,45,0,.60) 0%, transparent 70%)",
                  filter:"blur(16px)", zIndex:-1,
                }}/>

                {/* ⑥ secondary sway on the image */}
                <div className={!isMobile ? "hl-sway" : ""}>
                  <motion.div
                    initial={{opacity:0, x:100, filter:"blur(20px)", scale:.96}}
                    animate={{opacity:1, x:0,   filter:"blur(0px)",  scale:1  }}
                    transition={{duration:1.6, delay:.5, ease:[.22,1,.36,1]}}
                  >
                    <img src="/kuko.png" alt="AAKAR character" style={{
                      display:"block", objectFit:"contain",
                      height:"clamp(440px, 92vh, 870px)", width:"auto",
                      filter:"drop-shadow(-8px 0 40px rgba(235,95,10,.65)) drop-shadow(0 24px 55px rgba(180,40,0,.38)) drop-shadow(0 0 90px rgba(140,25,0,.22))",
                    }}/>
                  </motion.div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Content ───────────────────────────────────────────────── */}
        <motion.div className="absolute inset-0 z-30 flex flex-col items-start justify-center"
          style={!isMobile ? {paddingLeft:"clamp(28px,7vw,100px)", y:textY, x:textMX} : {paddingLeft:"24px"}}>

          <motion.div style={!isMobile?{y:logoY,marginLeft:"-7vw"}:{marginLeft:"-15px"}}
            initial={{opacity:0,scale:.88,filter:"blur(22px)"}} animate={{opacity:1,scale:1,filter:"blur(0px)"}}
            transition={{duration:1.5,delay:.45,ease:[.22,1,.36,1]}}>
            <Image src="/aklogo.png" alt="AAKAR 2026" width={620} height={240} priority className="hl-logo-glow"
              style={{objectFit:"contain",width:"clamp(240px,52vw,620px)",height:"auto",filter:"invert(1) drop-shadow(0 0 30px rgba(255,120,30,.5))"}}/>
          </motion.div>

          <div className="overflow-hidden -mt-4 md:-mt-10">
            <p style={{fontFamily:"'Cinzel',serif",fontWeight:300,fontSize:"clamp(.75rem,2.6vw,1.5rem)",letterSpacing:"clamp(.2em,1.2vw,.38em)",color:"#fff",whiteSpace:"nowrap"}}>
              {chars.map((ch,i)=>(
                <span key={i} className="hl-tc" style={{animationDelay:`${1.0+i*.04}s`,whiteSpace:ch===" "?"pre":undefined}}>{ch}</span>
              ))}
            </p>
          </div>

          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2,duration:1.2}}
            style={{fontFamily:"'Noto Serif JP',serif",fontWeight:200,fontSize:"clamp(9px,1.2vw,13px)",letterSpacing:".48em",color:"rgba(255,180,100,.38)",marginTop:"10px"}}>
            新たな時代の幕開け
          </motion.p>

          <div className="mt-6 md:mt-8" style={{width:"clamp(140px,30vw,280px)",height:1,background:"linear-gradient(to right, rgba(255,100,30,.7), rgba(255,200,100,.4), transparent)"}}/>

          <motion.div className="flex items-center gap-4 md:gap-6 mt-6 md:mt-7"
            initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:1.6,duration:.9,ease:[.22,1,.36,1]}}>
            <span className="hl-badge border border-white/15 uppercase" style={{backdropFilter:"blur(8px)",borderRadius:"2px",padding:"6px 14px",fontFamily:"'Cinzel',serif",fontSize:"clamp(7px,1vw,9.5px)",letterSpacing:".40em",color:"rgba(255,200,120,.72)",whiteSpace:"nowrap"}}>
              Techno-Cultural Fest
            </span>
            <motion.button whileHover={{scale:1.05,boxShadow:"0 0 28px rgba(255,80,10,.55)"}} whileTap={{scale:.97}}
              style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(7px,1vw,9.5px)",letterSpacing:".40em",textTransform:"uppercase",color:"#fff",background:"linear-gradient(135deg,rgba(200,50,0,.88) 0%,rgba(255,90,10,.78) 100%)",border:"1px solid rgba(255,120,40,.48)",borderRadius:"2px",padding:"6px 18px",cursor:"pointer",backdropFilter:"blur(8px)",transition:"box-shadow .3s"}}>
              Explore ›
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Side labels */}
        <motion.div className="absolute left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:1.8,duration:.9}}>
          <div className="h-14 w-px" style={{background:"rgba(255,160,80,.12)"}}/>
          <span className="hl-side">Aakar 2026</span>
          <div className="h-14 w-px" style={{background:"rgba(255,160,80,.12)"}}/>
        </motion.div>
        <motion.div className="absolute right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
          initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} transition={{delay:1.8,duration:.9}}>
          <div className="h-14 w-px" style={{background:"rgba(255,160,80,.12)"}}/>
          <span className="hl-side" style={{transform:"rotate(180deg)"}}>AJIET · Mangaluru</span>
          <div className="h-14 w-px" style={{background:"rgba(255,160,80,.12)"}}/>
        </motion.div>

        {/* Bottom bar */}
        <motion.div className="absolute bottom-0 left-0 right-0 z-40 flex items-end justify-between px-6 md:px-12 pb-5 md:pb-7"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4,duration:1}}>
          <span className="hidden md:block" style={{fontFamily:"'Cinzel',serif",fontSize:"9px",letterSpacing:".35em",textTransform:"uppercase",color:"rgba(255,255,255,.14)"}}>
            Where Technology Meets Culture
          </span>
          <div className="flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2 bottom-5">
            <span style={{fontFamily:"'Cinzel',serif",fontSize:"8px",letterSpacing:".4em",color:"rgba(255,255,255,.18)",textTransform:"uppercase"}}>Scroll</span>
            <svg className="hl-bounce" width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v12M1 9l4 4 4-4" stroke="rgba(255,160,80,.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>

      </section>
    </>
  );
}