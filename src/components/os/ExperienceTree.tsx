import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Folder, FolderOpen, FileText } from "lucide-react";

const NODES = [
  { id: "fast", name: "FAST-NUCES", path: "/experience/FAST-NUCES", role: "Computer Science", period: "2020 — 2024", details: "Foundations in algorithms, distributed systems, and applied ML. Led student dev community projects.", stack: ["DSA", "OS", "ML", "Networks"], highlights: ["Top 5% cohort in systems track", "Led 200+ member dev community", "Built campus-wide event platform used by 3k+ students"] },
  { id: "proto", name: "ProtoIT", path: "/experience/ProtoIT", role: "Full-Stack Engineer", period: "2022", details: "Shipped Laravel + React internal tools and CRM integrations for SMB clients.", stack: ["Laravel", "React", "MySQL", "Stripe"], highlights: ["Delivered 6 client dashboards in 4 months", "Cut manual ops time by 70% with automation", "Owned end-to-end CRM integrations"] },
  { id: "retail", name: "Retailigence", path: "/experience/Retailigence", role: "Automation Engineer", period: "2023", details: "Built Python ETL pipelines and lead enrichment workflows powering outbound at scale.", stack: ["Python", "Airflow", "Postgres", "Apollo"], highlights: ["Scaled enrichment to 50k leads/day", "Reduced data cost per lead by 44%", "Built 12+ reusable n8n / Airflow workflows"] },
  { id: "vync", name: "VyncAI", path: "/experience/VyncAI", role: "AI Engineer", period: "2024", details: "Designed agentic chat systems, RAG pipelines, and customer-support automations.", stack: ["LangChain", "Pinecone", "OpenAI", "FastAPI"], highlights: ["Shipped multi-tenant RAG with 91% accuracy", "Auto-resolved 68% of support tickets", "Designed eval harness for agent regressions"] },
  { id: "insight", name: "InsightBound", path: "/experience/InsightBound", role: "Founder · CEO", period: "2024 — present", details: "Building the AI outreach infrastructure platform — multi-tenant, agent-driven, multi-region.", stack: ["Next.js", "Postgres", "OpenAI", "n8n"], highlights: ["1.2k active workspaces, 99.98% uptime", "+340% reply rate lift vs legacy stacks", "Sustained 280+ rps with p95 < 120ms"] },
];

export function ExperienceTree() {
  const [open, setOpen] = useState<string | null>("insight");

  return (
    <div className="grid h-full items-start gap-3 p-3 font-mono text-[12.5px] md:grid-cols-[260px_1fr]">
      <ul className="rounded-lg border border-[var(--glass-border)] bg-[var(--surface-2)]/40 p-2">
        <li className="px-2 py-1 text-muted-foreground"><span className="text-neon-cyan">/</span>experience</li>
        {NODES.map((n) => {
          const isOpen = open === n.id;
          return (
            <li key={n.id}>
              <button
                onClick={() => setOpen(isOpen ? null : n.id)}
                className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition ${
                  isOpen ? "bg-[var(--surface-3)] text-foreground" : "text-foreground/85 hover:bg-[var(--surface-3)]/60"
                }`}
              >
                <ChevronRight className={`h-3 w-3 transition ${isOpen ? "rotate-90" : ""}`} />
                {isOpen ? <FolderOpen className="h-3.5 w-3.5 text-neon-amber" /> : <Folder className="h-3.5 w-3.5 text-neon-amber" />}
                <span className="truncate">{n.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="relative h-full min-h-[320px]">
        <AnimatePresence mode="wait">
          {open ? (
            (() => {
              const n = NODES.find((x) => x.id === open)!;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col rounded-lg border border-[var(--glass-border)] bg-[var(--surface)]/40 p-4"
                >
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <FileText className="h-3 w-3" /> {n.path}/README.md
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-foreground">{n.name}</h4>
                  <div className="text-[12px] text-neon-cyan">{n.role}</div>
                  <div className="text-[11px] text-muted-foreground">{n.period}</div>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-foreground/85">{n.details}</p>

                  <div className="mt-4">
                    <div className="mb-1.5 text-[10px] uppercase tracking-wider text-neon-purple">## highlights</div>
                    <ul className="space-y-1">
                      {n.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2 text-[12px] text-foreground/80">
                          <span className="text-neon-green">▸</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">## stack</div>
                    <div className="flex flex-wrap gap-1.5">
                      {n.stack.map((s) => (
                        <span key={s} className="rounded-md border border-[var(--glass-border)] bg-[var(--surface-3)]/50 px-1.5 py-0.5 text-[10px] text-foreground/80">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()
          ) : (
            <div className="text-muted-foreground">// select a folder</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
