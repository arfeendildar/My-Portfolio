import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import arfeen from "@/assets/arfeen.jpg";

const STEPS = [
  "Initializing AI Infrastructure",
  "Loading Automation Systems",
  "Connecting Lead Database",
  "Starting Outreach Engine",
  "Mounting /experience filesystem",
  "Compiling neural workflows",
  "Deploying agent runtime",
  "Synchronizing systems clock",
];

const GLITCH_CHARS = "01<>/\\|=+*#$%&アカサタナハマヤラワABCDEF";

function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (frame > 6) { setDisplay(text); clearInterval(id); return; }
      setDisplay(
        text.split("").map((c, i) =>
          c === " " ? " " : i < frame * 3 ? c : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join("")
      );
    }, 35);
    return () => clearInterval(id);
  }, [text]);
  return <span className={className}>{display}</span>;
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 767px), (hover: none)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = (isMobile ? 14 : 16) * dpr;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(0).map(() => Math.random() * -50);
    const chars = "アカサタナハマヤラワ0123456789ABCDEF<>/=+*";

    let raf = 0;
    let last = 0;
    const interval = isMobile ? 80 : 50;

    const draw = (t: number) => {
      if (t - last > interval) {
        last = t;
        ctx.fillStyle = "rgba(8, 10, 15, 0.18)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < cols; i++) {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          ctx.fillStyle = Math.random() > 0.97 ? "#94f1ff" : "rgba(45, 212, 191, 0.85)";
          ctx.fillText(ch, x, y);
          if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-40" style={{ width: "100%", height: "100%" }} />;
}

export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [granted, setGranted] = useState(false);
  const [exit, setExit] = useState(false);

  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px), (hover: none)").matches;

  useEffect(() => {
    if (step >= STEPS.length) {
      const t1 = setTimeout(() => setGranted(true), isMobile ? 120 : 350);
      const t2 = setTimeout(() => setExit(true), isMobile ? 700 : 1500);
      const t3 = setTimeout(() => onComplete(), isMobile ? 950 : 2100);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    const delay = isMobile ? 35 + Math.random() * 50 : 110 + Math.random() * 220;
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [step, onComplete, isMobile]);

  const progress = Math.min(100, Math.round((step / STEPS.length) * 100));

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020617] font-mono"
        >
          {/* Matrix rain */}
          <MatrixRain />

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.92)_85%)]" />

          {/* Scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Moving scan beam */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "100vh" }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-[#2dd4bf]/15 to-transparent blur-md"
          />

          {/* Corner brackets */}
          <CornerBrackets />

          <div className="relative z-10 w-full max-w-2xl px-6 text-[12.5px] sm:text-sm">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-[#2dd4bf]/25 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11">
                  <div className="absolute inset-0 overflow-hidden rounded-full border border-[#94f1ff]/60 shadow-[0_0_18px_rgba(148,241,255,0.55)]">
                    <img src={arfeen} alt="Arfeen" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="text-base font-semibold tracking-[0.18em] text-[#2dd4bf] [text-shadow:0_0_10px_rgba(45,212,191,0.55)]">
                    arfeenOS<span className="ml-2 text-[10px] text-[#94f1ff]">v3.14</span>
                  </div>
                  <div className="text-[10px] tracking-widest text-[#2dd4bf]/60">SECURE_SHELL // AI_SYSTEMS_LAB</div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end text-[10px] text-[#2dd4bf]/70">
                <span>NODE: ARF-01</span>
                <span className="text-[#94f1ff]">● ENCRYPTED</span>
              </div>
            </div>

            {/* Boot lines */}
            <div className="space-y-1.5">
              {STEPS.slice(0, step).map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-[#2dd4bf]/90"
                >
                  <span className="text-[#2dd4bf] [text-shadow:0_0_8px_rgba(45,212,191,0.7)]">[ OK ]</span>
                  <span className="flex-1 truncate">{s}</span>
                  <span className="text-[10px] text-[#2dd4bf]/50">{(Math.random() * 0.9 + 0.1).toFixed(3)}s</span>
                </motion.div>
              ))}
              {step < STEPS.length && (
                <div className="flex items-center gap-3 text-[#94f1ff]">
                  <span className="text-[#ffb547] [text-shadow:0_0_8px_rgba(255,181,71,0.7)]">[ .. ]</span>
                  <GlitchText text={STEPS[step]} className="flex-1" />
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#ffb547] shadow-[0_0_10px_rgba(255,181,71,0.9)]" />
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="mb-1.5 flex justify-between text-[10px] tracking-widest text-[#2dd4bf]/70">
                <span>SYS_LOAD</span>
                <span>{progress}%</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-sm border border-[#2dd4bf]/30 bg-[#2dd4bf]/5">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0d9488] via-[#94f1ff] to-[#0d9488] shadow-[0_0_12px_rgba(45,212,191,0.7)]"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent 0 6px, rgba(0,0,0,0.4) 6px 7px)",
                  }}
                />
              </div>
            </div>

            <AnimatePresence>
              {granted && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-8 flex flex-col items-center gap-2"
                >
                  <div className="relative inline-flex items-center gap-3 border border-[#2dd4bf] bg-[#2dd4bf]/10 px-6 py-2.5 tracking-[0.4em] text-[#2dd4bf] [text-shadow:0_0_12px_rgba(45,212,191,0.9)]">
                    <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 bg-[#2dd4bf]" />
                    <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 bg-[#2dd4bf]" />
                    ◉ ACCESS_GRANTED
                  </div>
                  <div className="text-[10px] tracking-[0.3em] text-[#94f1ff]/80">&gt; LAUNCHING_WORKSPACE...</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CornerBrackets() {
  const c = "absolute h-6 w-6 border-[#2dd4bf]/70";
  return (
    <>
      <div className={`${c} left-4 top-4 border-l-2 border-t-2`} />
      <div className={`${c} right-4 top-4 border-r-2 border-t-2`} />
      <div className={`${c} bottom-4 left-4 border-b-2 border-l-2`} />
      <div className={`${c} bottom-4 right-4 border-b-2 border-r-2`} />
    </>
  );
}
