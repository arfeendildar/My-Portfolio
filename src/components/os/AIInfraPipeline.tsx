import { motion } from "framer-motion";
import { Database, Brain, Send, Sparkles, Filter, Globe2 } from "lucide-react";

/**
 * AI Infrastructure Pipeline — the USP showcase.
 * Animated SVG with 5 nodes and data packets flowing between them.
 */

type NodeDef = {
  id: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  x: number; // 0..100 (%)
  y: number;
  color: string; // css var
};

const NODES: NodeDef[] = [
  {
    id: "src",
    label: "Signals",
    sub: "firmographic · intent · hiring",
    icon: <Globe2 className="h-4 w-4" />,
    x: 10,
    y: 82,
    color: "var(--neon-cyan)",
  },
  {
    id: "enr",
    label: "Enrichment",
    sub: "Clay · Apollo · custom waterfalls",
    icon: <Filter className="h-4 w-4" />,
    x: 30,
    y: 26,
    color: "var(--neon-amber)",
  },
  {
    id: "score",
    label: "AI Scoring",
    sub: "LLM ranking · ICP fit",
    icon: <Brain className="h-4 w-4" />,
    x: 50,
    y: 82,
    color: "var(--neon-purple)",
  },
  {
    id: "store",
    label: "Vector DB",
    sub: "embeddings · memory",
    icon: <Database className="h-4 w-4" />,
    x: 70,
    y: 26,
    color: "var(--neon-green)",
  },
  {
    id: "out",
    label: "Outreach",
    sub: "personalized sequences",
    icon: <Send className="h-4 w-4" />,
    x: 90,
    y: 82,
    color: "var(--neon-rose)",
  },
];

const EDGES: Array<[string, string, number]> = [
  ["src", "enr", 0],
  ["enr", "score", 0.4],
  ["score", "store", 0.8],
  ["store", "out", 1.2],
  ["src", "score", 0.6],
  ["score", "out", 1.6],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function AIInfraPipeline() {
  return (
    <div className="relative p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="truncate font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
          // ai_infra::live
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 font-mono text-[9px] sm:text-[10px] text-neon-green">
          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> 12,481 / 24h
        </div>
      </div>

      <div className="relative aspect-[5/4] sm:aspect-[16/5.7] w-full overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[oklch(0.13_0.012_270/85%)]">
        {/* grid bg */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18]" />
        {/* radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,oklch(0.72_0.21_305/0.18),transparent_70%)]" />

        {/* SVG edges + packets */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.84 0.16 210)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="oklch(0.72 0.21 305)" stopOpacity="0.55" />
            </linearGradient>
            <filter id="pkt-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* edges */}
          {EDGES.map(([from, to], i) => {
            const a = nodeById(from);
            const b = nodeById(to);
            // bezier control
            const mx = (a.x + b.x) / 2;
            const cy = (a.y + b.y) / 2 + (i % 2 === 0 ? -8 : 8);
            const path = `M ${a.x} ${a.y} Q ${mx} ${cy} ${b.x} ${b.y}`;
            return (
              <g key={`${from}-${to}`}>
                <path
                  d={path}
                  fill="none"
                  stroke="url(#edge-grad)"
                  strokeWidth="0.25"
                  strokeDasharray="0.8 0.8"
                />
                {/* flowing packet */}
                <circle r="0.6" fill="oklch(0.84 0.16 210)" filter="url(#pkt-glow)">
                  <animateMotion dur={`${2.6 + i * 0.3}s`} repeatCount="indefinite" path={path} />
                </circle>
                <circle r="0.4" fill="oklch(0.86 0.20 150)" filter="url(#pkt-glow)" opacity="0.85">
                  <animateMotion
                    dur={`${3.4 + i * 0.2}s`}
                    begin={`${EDGES[i][2]}s`}
                    repeatCount="indefinite"
                    path={path}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* nodes */}
        {NODES.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div className="group relative flex flex-col items-center">
              {/* halo */}
              <span
                className="absolute -inset-3 -z-10 rounded-full blur-xl opacity-60"
                style={{ background: `radial-gradient(circle, ${n.color} 0%, transparent 70%)` }}
              />
              <div
                className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-xl border backdrop-blur-md"
                style={{
                  borderColor: `color-mix(in oklab, ${n.color} 55%, transparent)`,
                  background: `color-mix(in oklab, ${n.color} 12%, oklch(0.18 0.02 275))`,
                  color: n.color,
                  boxShadow: `0 0 18px -4px ${n.color}`,
                }}
              >
                {n.icon}
              </div>
              <div className="mt-1 whitespace-nowrap text-center">
                <div className="font-mono text-[9px] sm:text-[10.5px] font-medium text-foreground">
                  {n.label}
                </div>
                <div className="hidden text-[9px] text-muted-foreground sm:block">{n.sub}</div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* corner readouts */}
        <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[9px] text-muted-foreground">
          throughput <span className="text-neon-cyan">8.2k req/min</span>
        </div>
        <div className="pointer-events-none absolute bottom-2 right-3 font-mono text-[9px] text-muted-foreground">
          uptime <span className="text-neon-green">99.97%</span>
        </div>
        <div className="pointer-events-none absolute top-2 left-3 hidden sm:block font-mono text-[9px] text-muted-foreground">
          region <span className="text-neon-purple">multi · us-east · eu-west</span>
        </div>
      </div>

      {/* legend strip */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {NODES.map((n) => (
          <div
            key={n.id}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--surface-2)]/40 p-2"
          >
            <div
              className="flex items-center gap-1.5 font-mono text-[10px]"
              style={{ color: n.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: n.color }} />
              {n.label}
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">{n.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
