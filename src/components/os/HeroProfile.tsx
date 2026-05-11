import arfeen from "@/assets/arfeen.jpg";
import { Sparkles, Zap, Coffee } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";

export function HeroProfile() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt state
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 18 });

  // Spotlight state (in px, relative to card)
  const sx = useMotionValue(50);
  const sy = useMotionValue(30);
  const spotlight = useTransform(
    [sx, sy],
    ([x, y]) => `radial-gradient(450px circle at ${x}% ${y}%, oklch(0.84 0.16 210 / 0.18), transparent 55%)`,
  );

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px - 0.5);
    my.set(py - 0.5);
    sx.set(px * 100);
    sy.set(py * 100);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 1100 }}
      className="relative flex h-full items-center p-5"
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: spotlight }}
      />

      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative grid w-full items-center gap-6 lg:grid-cols-[180px_1fr]"
      >
        {/* Avatar with depth */}
        <div
          className="relative mx-auto h-[156px] w-[156px] shrink-0"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="absolute inset-0 rounded-full p-[2px] avatar-ring">
            <div className="h-full w-full rounded-full bg-[var(--surface)]" />
          </div>
          <div className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-[var(--neon-purple)]/35 to-[var(--neon-cyan)]/35 blur-2xl" />
          <div className="absolute inset-[6px] overflow-hidden rounded-full border border-[var(--glass-border)]">
            <img src={arfeen} alt="Muhammad Arfeen Dildar" className="h-full w-full object-cover" />
          </div>
          <span className="absolute bottom-1 right-1 inline-flex items-center gap-1 rounded-full border border-[var(--neon-green)]/40 bg-background/85 px-2 py-0.5 font-mono text-[10px] text-neon-green backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-green)] pulse-dot" /> online
          </span>
        </div>

        <div className="min-w-0" style={{ transform: "translateZ(60px)" }}>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            // identity::profile
            <span className="rounded-sm border border-[var(--neon-amber)]/40 bg-[var(--neon-amber)]/10 px-1 py-px text-[9px] tracking-wider text-neon-amber">
              v3.14
            </span>
          </div>

          <h1 className="mt-1 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            Muhammad Arfeen Dildar
          </h1>
          <p className="mt-1.5 text-base aurora-text font-medium">
            I build intelligent systems that don't sleep.
          </p>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Founder of <span className="text-neon-purple">InsightBound</span>. I architect AI-native lead-gen
            infrastructure, agent runtimes, and outbound systems that turn dark
            company signals into revenue. Shipped pipelines processing{" "}
            <span className="text-neon-cyan">12k+ leads/week</span>.
          </p>

          <div className="mt-3.5 flex flex-wrap gap-1.5 font-mono text-[9px] sm:text-[11px]">
            <Pill icon={<Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />} label="Founder · InsightBound" accent="purple" />
            <Pill icon={<Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3" />} label="ex VyncAI · ProtoIT" accent="cyan" />
            <Pill icon={<Coffee className="h-2.5 w-2.5 sm:h-3 sm:w-3" />} label="3am · FAST-NUCES" accent="amber" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Pill({ icon, label, accent }: { icon?: React.ReactNode; label: string; accent: "purple" | "cyan" | "amber" }) {
  const c = `var(--neon-${accent})`;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 sm:gap-1.5 sm:px-2.5 sm:py-1 transition-transform hover:scale-[1.04]"
      style={{
        borderColor: `color-mix(in oklab, ${c} 35%, transparent)`,
        background: `color-mix(in oklab, ${c} 12%, transparent)`,
        color: c,
      }}
    >
      {icon}
      {label}
    </span>
  );
}
