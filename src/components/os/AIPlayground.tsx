import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Demo = {
  id: string;
  name: string;
  tag: string;
  desc: string;
  input: string;
  steps: { label: string; ms: number }[];
  output: string[];
};

const DEMOS: Demo[] = [
  {
    id: "lead-scorer",
    name: "lead.scorer",
    tag: "agent",
    desc: "Scores inbound leads using firmographic + intent signals",
    input: `{
  "company": "Northwind Logistics",
  "industry": "3PL / Freight",
  "employees": 240,
  "title": "VP of Operations",
  "signals": ["pricing page x3", "downloaded ROI pdf"]
}`,
    steps: [
      { label: "enriching company · clearbit + apollo", ms: 700 },
      { label: "matching ICP vector (cosine 0.82)", ms: 650 },
      { label: "scoring intent signals", ms: 550 },
      { label: "routing to outreach.engine", ms: 500 },
    ],
    output: [
      "score        : 87 / 100  ▰▰▰▰▰▰▰▰▱▱",
      "tier         : A — high intent",
      "fit          : strong (ICP match)",
      "next_action  : queue cold-email sequence v3",
      "owner        : sdr-team / round-robin",
    ],
  },
  {
    id: "email-writer",
    name: "email.writer",
    tag: "llm",
    desc: "Generates personalized cold outreach with research context",
    input: `prospect: Sarah Chen — Head of Growth @ Loomstack
context: just raised Series A · hiring 4 SDRs · uses HubSpot`,
    steps: [
      { label: "pulling linkedin + recent posts", ms: 600 },
      { label: "drafting hook · 3 variants", ms: 800 },
      { label: "personalizing CTA", ms: 500 },
      { label: "guardrails · spam + tone check", ms: 450 },
    ],
    output: [
      "subj: scaling 4 SDRs without the ramp tax",
      "",
      "Hey Sarah — saw the Series A, congrats.",
      "Most growth leads I talk to post-raise hit",
      "the same wall: 4 SDRs, 90-day ramp, pipe stalls.",
      "",
      "We plug into HubSpot and surface 200+ enriched",
      "ICP leads/week — pre-scored, pre-warmed.",
      "",
      "worth 15 min next week?",
    ],
  },
  {
    id: "reply-classifier",
    name: "reply.classifier",
    tag: "agent",
    desc: "Classifies inbound replies and triggers the right downstream action",
    input: `"Thanks but we're locked in with a vendor for the next 6 months. Maybe revisit in Q3?"`,
    steps: [
      { label: "tokenizing + sentiment pass", ms: 500 },
      { label: "intent classification", ms: 600 },
      { label: "extracting follow-up date", ms: 450 },
      { label: "writing CRM + scheduling task", ms: 500 },
    ],
    output: [
      "intent       : not-now / revisit",
      "sentiment    : neutral-positive",
      "objection    : existing vendor lock-in",
      "follow_up_at : 2026-08-01",
      "crm_action   : move stage → nurture · task → SDR @ Q3",
    ],
  },
];

export function AIPlayground() {
  const [active, setActive] = useState<string>(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === active)!;
  const [running, setRunning] = useState(false);
  const [stepIdx, setStepIdx] = useState(-1);
  const [outLines, setOutLines] = useState<string[]>([]);
  const cancelRef = useRef(false);

  useEffect(() => {
    // Auto-run first demo on mount
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run() {
    cancelRef.current = false;
    setRunning(true);
    setStepIdx(-1);
    setOutLines([]);
    for (let i = 0; i < demo.steps.length; i++) {
      if (cancelRef.current) return;
      setStepIdx(i);
      await wait(demo.steps[i].ms);
    }
    if (cancelRef.current) return;
    // Stream output line by line
    for (let i = 0; i < demo.output.length; i++) {
      if (cancelRef.current) return;
      setOutLines((p) => [...p, demo.output[i]]);
      await wait(110);
    }
    setRunning(false);
  }

  function selectDemo(id: string) {
    cancelRef.current = true;
    setActive(id);
    setStepIdx(-1);
    setOutLines([]);
    setRunning(false);
  }

  // re-run when active changes (after state settles)
  useEffect(() => {
    const t = setTimeout(() => run(), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="grid items-stretch gap-3 p-4 lg:grid-cols-12">
      {/* Demo picker */}
      <div className="flex flex-col gap-2 lg:col-span-4">
        <div className="px-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          select workflow
        </div>
        {DEMOS.map((d) => {
          const isActive = d.id === active;
          return (
            <button
              key={d.id}
              onClick={() => selectDemo(d.id)}
              className={`w-full rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/[0.06] shadow-[0_0_24px_-12px_var(--neon-cyan)]"
                  : "border-[var(--glass-border)] bg-[var(--surface-2)]/50 hover:border-[var(--neon-purple)]/40 hover:bg-[var(--surface-2)]/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] text-foreground">{d.name}</span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-wider ${
                    d.tag === "agent" ? "text-neon-purple" : "text-neon-green"
                  }`}
                >
                  ● {d.tag}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{d.desc}</p>
            </button>
          );
        })}

        <button
          onClick={() => !running && run()}
          disabled={running}
          className="w-full rounded-xl border border-[var(--neon-green)]/40 bg-[var(--neon-green)]/[0.08] px-3 py-2 font-mono text-[12px] text-neon-green transition hover:bg-[var(--neon-green)]/[0.16] disabled:opacity-50"
        >
          {running ? "running…" : "▶ run again"}
        </button>

        {/* Stack info — fills the remaining space */}
        <div className="flex-1 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-2)]/40 p-3 font-mono text-[11px]">
          <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            powered by
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-foreground/80">
            <span className="text-neon-cyan">→</span><span>n8n · make</span>
            <span className="text-neon-cyan">→</span><span>openai · claude</span>
            <span className="text-neon-cyan">→</span><span>apollo · clay</span>
            <span className="text-neon-cyan">→</span><span>supabase · pg</span>
            <span className="text-neon-cyan">→</span><span>laravel · node</span>
            <span className="text-neon-cyan">→</span><span>hubspot · crm</span>
          </div>
          <div className="mt-3 border-t border-[var(--glass-border)] pt-2 text-[10px] text-muted-foreground">
            demos run client-side · production systems handle 100k+/day
          </div>
        </div>
      </div>


      {/* Console */}
      <div className="lg:col-span-8 rounded-xl border border-[var(--glass-border)] bg-[oklch(0.13_0.012_270/95%)] font-mono text-[12px]">
        {/* Input */}
        <div className="border-b border-[var(--glass-border)] px-4 py-3">
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>input · {demo.name}</span>
            <span className="text-neon-cyan">● {running ? "executing" : "ready"}</span>
          </div>
          <pre className="whitespace-pre-wrap text-foreground/85">{demo.input}</pre>
        </div>

        {/* Pipeline steps */}
        <div className="border-b border-[var(--glass-border)] px-4 py-3 space-y-1">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">pipeline</div>
          {demo.steps.map((s, i) => {
            const done = i < stepIdx || (!running && stepIdx >= demo.steps.length - 1);
            const active = i === stepIdx && running;
            const pending = i > stepIdx;
            return (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    done
                      ? "bg-neon-green"
                      : active
                        ? "bg-neon-cyan pulse-dot"
                        : "bg-muted-foreground/30"
                  }`}
                />
                <span
                  className={
                    done
                      ? "text-foreground/70"
                      : active
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                  }
                >
                  {active ? "▸ " : done ? "✓ " : "  "}
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Output */}
        <div className="px-4 py-3">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">output</div>
          <div className="min-h-[140px]">
            <AnimatePresence initial={false}>
              {outLines.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-pre-wrap text-neon-green/90"
                >
                  {l || "\u00A0"}
                </motion.div>
              ))}
            </AnimatePresence>
            {running && stepIdx >= demo.steps.length - 1 && outLines.length < demo.output.length && (
              <span className="inline-block h-3.5 w-1.5 bg-[var(--neon-cyan)] cursor-blink" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
