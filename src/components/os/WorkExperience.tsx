import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Calendar, ChevronRight } from "lucide-react";

type Role = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  period: string;
  current?: boolean;
  summary: string;
  bullets: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
};

const ROLES: Role[] = [
  {
    id: "insightbound",
    title: "Founder & Builder",
    company: "InsightBound",
    location: "Islamabad, PK",
    type: "Full-time",
    period: "2025 — Present",
    current: true,
    summary:
      "Building InsightBound — an AI-native B2B intelligence layer that turns scattered company signals into ready-to-action lead lists and outbound playbooks.",
    bullets: [
      "Designed the end-to-end product: signal ingestion (firmographic, hiring, tech-stack, intent), enrichment graph, and an AI scoring layer that ranks accounts by buy-readiness.",
      "Shipped the first outbound workflow engine — Clay-style waterfalls + LLM agents that draft hyper-personalized sequences from each account's live context.",
      "Owning everything: product, design, engineering, GTM, and first-design partner conversations.",
    ],
    stack: ["Next.js", "TanStack", "Supabase", "OpenAI", "Clay", "n8n", "TypeScript"],
    metrics: [
      { label: "design partners", value: "5" },
      { label: "signals tracked", value: "20+" },
      { label: "stage", value: "v0.1" },
    ],
  },
  {
    id: "protoit",
    title: "Lead Generation Expert",
    company: "ProtoIT Consultant",
    location: "Remote",
    type: "Part-time",
    period: "Mar 2025 — Nov 2025",
    summary:
      "Owned end-to-end B2B lead generation — from sourcing and enrichment to AI-driven outreach and SQL handoff.",
    bullets: [
      "Designed and shipped end-to-end lead-gen pipelines using Clay + Apollo.io to source, enrich and qualify high-intent B2B prospects.",
      "Engineered AI-powered outreach prompts and multi-step cold email sequences — personalized at scale, lifting reply rates and conversion.",
      "Partnered with BD to tighten ICP scoring, cutting sales cycle time and routing only sales-ready leads to AEs.",
    ],
    stack: ["Clay", "Apollo.io", "Instantly", "OpenAI", "n8n", "HubSpot"],
    metrics: [
      { label: "reply rate", value: "+3.4×" },
      { label: "leads enriched / wk", value: "12k+" },
      { label: "cycle time", value: "−38%" },
    ],
  },
  {
    id: "retailigence",
    title: "Associate Business Analyst",
    company: "Retailigence",
    location: "NIC — National Incubation Center",
    type: "Internship",
    period: "Jun 2023 — Aug 2023",
    summary:
      "Turned messy retail data into product and ops decisions, working directly with founders and clients.",
    bullets: [
      "Analyzed retail business data and surfaced actionable insights that informed product and operations roadmaps.",
      "Joined client meetings and stakeholder discussions to capture requirements and identify process-improvement opportunities.",
    ],
    stack: ["Excel", "SQL", "Power BI", "Notion"],
    metrics: [
      { label: "client workshops", value: "10+" },
      { label: "dashboards shipped", value: "4" },
    ],
  },
];

export function WorkExperience() {
  const [activeId, setActiveId] = useState<string>(ROLES[0].id);
  const active = ROLES.find((r) => r.id === activeId)!;

  return (
    <div className="grid items-stretch gap-3 p-4 lg:grid-cols-12">
      {/* Timeline / picker */}
      <div className="flex flex-col gap-2 lg:col-span-5">
        <div className="px-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          career.timeline
        </div>

        <div className="relative">
          {/* vertical rail — ends at last node */}
          <span className="pointer-events-none absolute left-[15px] top-4 h-[calc(100%-5rem)] w-px bg-gradient-to-b from-[var(--neon-cyan)]/40 via-[var(--glass-border)] to-transparent" />

          <div className="flex flex-col gap-2">
            {ROLES.map((r) => {
              const isActive = r.id === activeId;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveId(r.id)}
                  className={`group relative w-full rounded-xl border p-3 pl-10 text-left transition-all ${
                    isActive
                      ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/[0.06] shadow-[0_0_24px_-12px_var(--neon-cyan)]"
                      : "border-[var(--glass-border)] bg-[var(--surface-2)]/50 hover:border-[var(--neon-purple)]/40 hover:bg-[var(--surface-2)]/80"
                  }`}
                >
                  {/* node */}
                  <span
                    className={`absolute left-[9px] top-4 grid h-3.5 w-3.5 place-items-center rounded-full border-2 transition ${
                      isActive
                        ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/30"
                        : "border-[var(--glass-border)] bg-[var(--surface-3)]"
                    }`}
                  >
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan pulse-dot" />}
                  </span>

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-mono text-[13px] text-foreground">{r.title}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-neon-cyan">
                        <Briefcase className="h-3 w-3" />
                        <span className="truncate">{r.company}</span>
                      </div>
                    </div>
                    {r.current && (
                      <span className="shrink-0 rounded-full border border-[var(--neon-green)]/40 bg-[var(--neon-green)]/[0.1] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neon-green">
                        ● now
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{r.period}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{r.location}</span>
                    <span>· {r.type}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Education card */}
        <div className="mt-1 flex-1 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-2)]/40 p-3 font-mono text-[11px]">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>education</span>
            <span className="text-neon-amber">● degree</span>
          </div>

          <div className="space-y-2">
            {/* University */}
            <div className="rounded-lg border border-[var(--glass-border)] bg-[var(--surface-3)]/40 p-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[12px] text-foreground">BS Software Engineering</div>
                <span className="rounded-full border border-[var(--neon-green)]/40 bg-[var(--neon-green)]/[0.1] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-neon-green">● now</span>
              </div>
              <div className="mt-0.5 text-[11px] text-neon-cyan">NU-FAST</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">2022 — 2026 · Islamabad, PK</div>
            </div>

          </div>


          <div className="mt-3 border-t border-[var(--glass-border)] pt-2 text-[10px] text-muted-foreground">
            click any role to inspect responsibilities, stack and impact.
          </div>
        </div>
      </div>

      {/* Detail console */}
      <div className="lg:col-span-7 rounded-xl border border-[var(--glass-border)] bg-[oklch(0.13_0.012_270/95%)] font-mono text-[12px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {/* Header */}
            <div className="border-b border-[var(--glass-border)] px-4 py-3">
              <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>role · {active.company.toLowerCase().replace(/\s+/g, "_")}</span>
                <span className={active.current ? "text-neon-green" : "text-muted-foreground"}>
                  ● {active.current ? "active" : "completed"}
                </span>
              </div>
              <h4 className="text-base font-semibold text-foreground">{active.title}</h4>
              <div className="text-[12px] text-neon-cyan">{active.company}</div>
              <div className="text-[11px] text-muted-foreground">
                {active.period} · {active.location} · {active.type}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-[12.5px] leading-relaxed text-foreground/85">
                {active.summary}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="border-b border-[var(--glass-border)] px-4 py-3">
              <div className="mb-1.5 text-[10px] uppercase tracking-wider text-neon-purple">
                ## responsibilities
              </div>
              <ul className="space-y-1.5">
                {active.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-foreground/85">
                    <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-neon-green" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics */}
            <div className="border-b border-[var(--glass-border)] px-4 py-3">
              <div className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                ## impact
              </div>
              <div className="grid grid-cols-3 gap-2">
                {active.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-[var(--glass-border)] bg-[var(--surface-2)]/60 p-2 text-center"
                  >
                    <div className="font-mono text-[15px] text-neon-cyan">{m.value}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack */}
            <div className="px-4 py-3">
              <div className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                ## stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {active.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-[var(--glass-border)] bg-[var(--surface-3)]/60 px-2 py-0.5 text-[10.5px] text-foreground/85"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
