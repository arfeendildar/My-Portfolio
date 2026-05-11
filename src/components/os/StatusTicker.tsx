import { motion } from "framer-motion";

const ITEMS = [
  "▸ shipping InsightBound v0.1 · live with 5 design partners",
  "▸ wiring multi-agent orchestration on top of LLM routers",
  "▸ obsessing over outbound that doesn't sound like outbound",
  "▸ writing about lead-gen infra, agent runtimes, founder ops",
  "▸ building in Islamabad · timezone agnostic · ships at 3am",
  "▸ open to: founding-team conversations, design partners, deep tech collabs",
];

/**
 * Continuously scrolling status ticker — gives "this guy is always shipping" vibe.
 */
export function StatusTicker() {
  // Duplicate items for seamless loop
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[oklch(0.13_0.012_270/80%)] py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[oklch(0.13_0.012_270)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[oklch(0.13_0.012_270)] to-transparent" />

      <div className="flex items-center gap-2 px-3">
        <span className="shrink-0 rounded-md border border-[var(--neon-green)]/40 bg-[var(--neon-green)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neon-green">
          ● now building
        </span>

        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex gap-10 whitespace-nowrap font-mono text-[12px] text-foreground/85"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 38, ease: "linear", repeat: Infinity }}
          >
            {loop.map((t, i) => (
              <span key={i} className="shrink-0">
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
