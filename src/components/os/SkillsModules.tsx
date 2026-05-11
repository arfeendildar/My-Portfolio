import { motion } from "framer-motion";
import { Package } from "lucide-react";

const MODULES: { name: string; version: string; tag: string }[] = [
  { name: "ai_automation", version: "make · n8n · zapier", tag: "automation" },
  { name: "python_automation", version: "3.12", tag: "automation" },
  { name: "ai_agents", version: "prompt + agent dev", tag: "ai" },
  { name: "lead_gen", version: "clay · apollo", tag: "leadgen" },
  { name: "crm", version: "hubspot · monday", tag: "crm" },
  { name: "email_outreach", version: "brevo · instantly", tag: "email" },
  { name: "laravel_php", version: "11.x", tag: "backend" },
  { name: "mern_stack", version: "n22", tag: "fullstack" },
  { name: "flutter", version: "3.x", tag: "mobile" },
  { name: "figma_ui_ux", version: "design", tag: "design" },
  { name: "paid_ads", version: "meta · tiktok · google", tag: "ads" },
  { name: "shopify", version: "2.x", tag: "ecom" },
  { name: "rest_api_dev", version: "1.1", tag: "infra" },
  { name: "git", version: "2.45", tag: "devops" },
];

export function SkillsModules() {
  return (
    <div className="p-4">
      <div className="mb-3 font-mono text-[12px] text-muted-foreground">
        <span className="text-neon-green">$</span> npm ls --installed
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            whileHover={{ y: -2 }}
            className="group flex items-center gap-3 rounded-lg border border-[var(--glass-border)] bg-[var(--surface-2)]/50 p-3 transition hover:border-[var(--neon-cyan)]/40"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-cyan)]/20 text-neon-cyan transition group-hover:from-[var(--neon-purple)]/40 group-hover:to-[var(--neon-cyan)]/40">
              <Package className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 font-mono text-[12px]">
              <div className="truncate text-foreground">{m.name}</div>
              <div className="text-muted-foreground text-[10px]">v{m.version} · {m.tag}</div>
            </div>
            <span className="font-mono text-[10px] text-neon-green">●</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
