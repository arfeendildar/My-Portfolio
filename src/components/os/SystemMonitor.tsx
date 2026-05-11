import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function useTicker(initial: number, step: () => number, intervalMs = 1500) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const i = setInterval(() => setV((x) => x + step()), intervalMs);
    return () => clearInterval(i);
  }, [step, intervalMs]);
  return v;
}

function Sparkline({ color = "var(--neon-cyan)" }: { color?: string }) {
  const [pts, setPts] = useState<number[]>(() => Array.from({ length: 28 }, (_, i) => 0.5 + Math.sin(i * 0.6) * 0.25));
  useEffect(() => {
    setPts(Array.from({ length: 28 }, () => Math.random()));
    const i = setInterval(() => setPts((p) => [...p.slice(1), Math.random()]), 900);
    return () => clearInterval(i);
  }, []);
  const w = 100, h = 32;
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${h - p * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-8 w-full">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={`url(#g-${color})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function Bars() {
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 14 }, (_, i) => 0.4 + ((i * 37) % 60) / 100));
  useEffect(() => {
    setBars(Array.from({ length: 14 }, () => 0.25 + Math.random() * 0.75));
    const i = setInterval(() => setBars((b) => b.map(() => 0.25 + Math.random() * 0.75)), 700);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="flex h-16 items-end gap-1">
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-[var(--neon-purple)]/30 to-[var(--neon-cyan)]/90 transition-all duration-500"
          style={{ height: `${b * 100}%` }}
        />
      ))}
    </div>
  );
}

export function SystemMonitor() {
  const emails = useTicker(48213, () => Math.floor(Math.random() * 14) + 2);
  const leads = useTicker(112408, () => Math.floor(Math.random() * 9) + 1);
  const responses = useTicker(8421, () => Math.floor(Math.random() * 6));
  const workflows = 24;
  const uptime = 99.98;

  return (
    <div className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-4">
      <Stat label="Emails Processed" value={emails.toLocaleString()} accent="cyan" trend={<Sparkline color="var(--neon-cyan)" />} />
      <Stat label="Leads Enriched" value={leads.toLocaleString()} accent="purple" trend={<Sparkline color="var(--neon-purple)" />} />
      <Stat label="AI Responses" value={responses.toLocaleString()} accent="green" trend={<Sparkline color="var(--neon-green)" />} />
      <Stat label="API Uptime" value={`${uptime}%`} accent="amber" trend={<Bars />} />

      <div className="col-span-2 lg:col-span-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <ServicePanel name="outreach.engine" status="active" load={64} />
        <ServicePanel name="agents.runtime" status="active" load={38} />
        <ServicePanel name="enrichment.pipeline" status="processing" load={82} />
      </div>

      <div className="col-span-2 lg:col-span-4 mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 px-1 font-mono text-[11px] text-muted-foreground">
        <span><span className="text-neon-green">●</span> {workflows} workflows running</span>
        <span><span className="text-neon-cyan">●</span> 7 regions · us-east, eu-west, ap-south</span>
        <span><span className="text-neon-purple">●</span> agent throughput 1.04k/s</span>
        <span className="ml-auto">last sync · just now</span>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, trend }: { label: string; value: string; accent: "cyan" | "purple" | "green" | "amber"; trend: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface-2)]/60 p-3">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full pulse-dot" style={{ background: `var(--neon-${accent})` }} />
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl tabular-nums text-foreground">{value}</div>
      <div className="mt-1">{trend}</div>
    </motion.div>
  );
}

function ServicePanel({ name, status, load }: { name: string; status: string; load: number }) {
  const colorClass = status === "active" ? "text-neon-green" : "text-neon-amber";
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface-2)]/50 p-3 font-mono text-[12px]">
      <div className="flex items-center justify-between">
        <span className="text-foreground">{name}</span>
        <span className={`text-[10px] uppercase tracking-wider ${colorClass}`}>● {status}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-3)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-cyan)] transition-all duration-700"
          style={{ width: `${load}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>load</span>
        <span>{load}%</span>
      </div>
    </div>
  );
}
