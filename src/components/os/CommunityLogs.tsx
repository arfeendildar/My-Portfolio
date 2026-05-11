import { motion } from "framer-motion";
import { Youtube, Users, Mic } from "lucide-react";

const LOGS = [
  { file: "youtube_reach.log", icon: Youtube, value: "28,000+", label: "subscribers", color: "rose" },
  { file: "community_size.log", icon: Users, value: "10,000+", label: "members", color: "cyan" },
  { file: "speaking_events.log", icon: Mic, value: "20+", label: "AI talks & sessions", color: "purple" },
] as const;

export function CommunityLogs() {
  return (
    <div className="p-4">
      <pre className="mb-3 font-mono text-[12px] text-muted-foreground">
        <span className="text-neon-green">$</span> tail -f /var/log/community/*.log
      </pre>
      <div className="grid gap-3 md:grid-cols-3">
        {LOGS.map((l, i) => {
          const I = l.icon;
          const color = `var(--neon-${l.color})`;
          return (
            <motion.div
              key={l.file}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--surface-2)]/50 p-4"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-50" />
              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>{l.file}</span>
                <span style={{ color }}>● live</span>
              </div>
              <div className="mt-3 flex items-end gap-3">
                <I className="h-7 w-7" style={{ color }} />
                <div>
                  <div className="font-mono text-2xl tabular-nums text-foreground">{l.value}</div>
                  <div className="text-[12px] text-muted-foreground">{l.label}</div>
                </div>
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-3)]">
                <div className="sweep h-full w-full" />
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-3 font-mono text-[11px] text-muted-foreground">
        + educational content on AI automation, agent architectures, and SaaS engineering.
      </div>
    </div>
  );
}
