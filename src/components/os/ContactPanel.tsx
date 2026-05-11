import { useEffect, useRef, useState } from "react";

type Line = { kind: "sys" | "prompt" | "in" | "out" | "err" | "ok" | "link"; text: string };

const HOSTNAME = "arfeen@os";
const FORMSPREE_URL = "https://formspree.io/f/xjgljprq";

type Field = { key: string; label: string; validate?: (v: string) => string | null };

const FIELDS: Field[] = [
  { key: "first_name", label: "first_name", validate: (v) => (v.trim().length < 2 ? "name too short" : null) },
  { key: "last_name", label: "last_name", validate: (v) => (v.trim().length < 1 ? "required" : null) },
  { key: "email", label: "email", validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "invalid email") },
  { key: "company", label: "company (optional)" },
  { key: "message", label: "message", validate: (v) => (v.trim().length < 5 ? "message too short" : null) },
];

export function ContactPanel() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0); // 0..FIELDS.length => fields, then confirm
  const [data, setData] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"collecting" | "confirm" | "submitting" | "done">("collecting");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLines([
      { kind: "sys", text: "secure_channel v1.0 — encrypted relay via formspree" },
      { kind: "sys", text: "" },
      { kind: "out", text: "╭─ direct channels ──────────────────────────────" },
      { kind: "link", text: "│ ▸ email     hello@insightbound.io|mailto:hello@insightbound.io" },
      { kind: "link", text: "│ ▸ github    github.com/arfeendildar|https://github.com/arfeendildar" },
      { kind: "link", text: "│ ▸ linkedin  /in/arfeen-dildar|https://linkedin.com/in/arfeen-dildar" },
      { kind: "link", text: "│ ▸ twitter   @arfeendildar|https://x.com/arfeendildar" },
      { kind: "link", text: "│ ▸ web       insightbound.io|https://insightbound.io" },
      { kind: "out", text: "╰────────────────────────────────────────────────" },
      { kind: "sys", text: "" },
      { kind: "sys", text: "or fill the form below · `reset` to restart · `cancel` to abort" },
      { kind: "prompt", text: `enter ${FIELDS[0].label}:` },
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, input]);

  function push(...l: Line[]) { setLines((p) => [...p, ...l]); }

  function reset() {
    setData({});
    setStep(0);
    setPhase("collecting");
    setLines([
      { kind: "sys", text: "↻ form reset" },
      { kind: "prompt", text: `enter ${FIELDS[0].label}:` },
    ]);
  }

  async function submit() {
    setPhase("submitting");
    push({ kind: "sys", text: "» transmitting payload..." });
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      push(
        { kind: "ok", text: "✓ message delivered. arfeen will reach out soon." },
        { kind: "sys", text: "type `reset` to send another." },
      );
      setPhase("done");
    } catch (e) {
      push({ kind: "err", text: `✗ transmission failed: ${(e as Error).message}` });
      setPhase("confirm");
    }
  }

  function handleEnter() {
    const value = input;
    setInput("");
    const cmd = value.trim().toLowerCase();

    if (cmd === "cancel") {
      push({ kind: "in", text: value }, { kind: "err", text: "✗ aborted." });
      setPhase("done");
      return;
    }
    if (cmd === "reset") {
      push({ kind: "in", text: value });
      reset();
      return;
    }

    if (phase === "collecting") {
      const field = FIELDS[step];
      const isOptional = field.label.includes("optional");
      if (!value.trim() && !isOptional) {
        push({ kind: "in", text: value }, { kind: "err", text: "✗ required field" }, { kind: "prompt", text: `enter ${field.label}:` });
        return;
      }
      const err = field.validate?.(value);
      if (err && (value.trim() || !isOptional)) {
        push({ kind: "in", text: value }, { kind: "err", text: `✗ ${err}` }, { kind: "prompt", text: `enter ${field.label}:` });
        return;
      }
      const newData = { ...data, [field.key]: value };
      setData(newData);
      push({ kind: "in", text: value });

      const next = step + 1;
      if (next < FIELDS.length) {
        setStep(next);
        push({ kind: "prompt", text: `enter ${FIELDS[next].label}:` });
      } else {
        setPhase("confirm");
        push(
          { kind: "sys", text: "" },
          { kind: "sys", text: "─── review ───" },
          ...FIELDS.map((f) => ({ kind: "out" as const, text: `  ${f.key.padEnd(12)} : ${newData[f.key] || "—"}` })),
          { kind: "sys", text: "" },
          { kind: "prompt", text: "type `submit` to send · `reset` to start over · `cancel` to abort" },
        );
      }
      return;
    }

    if (phase === "confirm") {
      push({ kind: "in", text: value });
      if (cmd === "submit") submit();
      else push({ kind: "err", text: "✗ unknown — type `submit`, `reset`, or `cancel`" });
      return;
    }

    if (phase === "done") {
      push({ kind: "in", text: value }, { kind: "err", text: "session closed. type `reset` to start again." });
    }
  }

  const currentPrompt =
    phase === "collecting"
      ? `${FIELDS[step].key} »`
      : phase === "confirm"
      ? "action »"
      : phase === "submitting"
      ? "..."
      : "closed »";

  return (
    <div
      className="relative flex h-[420px] sm:h-[520px] max-h-[calc(100vh-170px)] min-h-[300px] cursor-text flex-col overflow-hidden bg-[oklch(0.13_0.012_270/95%)] font-mono text-[11.5px] sm:text-[12.5px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-3 sm:px-4 py-3">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {l.kind === "in" && (
              <div>
                <span className="text-neon-green">{HOSTNAME} ~ %</span>{" "}
                <span className="text-foreground">{l.text}</span>
              </div>
            )}
            {l.kind === "out" && <div className="text-foreground/85">{l.text}</div>}
            {l.kind === "err" && <div className="text-neon-rose/90">{l.text}</div>}
            {l.kind === "ok" && <div className="text-neon-green">{l.text}</div>}
            {l.kind === "sys" && <div className="text-muted-foreground">{l.text}</div>}
            {l.kind === "prompt" && <div className="text-neon-cyan">› {l.text}</div>}
            {l.kind === "link" && (() => {
              const m = l.text.match(/^(.*?)([\w@./-]+)\|(\S+)(.*)$/);
              if (!m) return <div className="text-foreground/85">{l.text}</div>;
              return (
                <div className="text-foreground/85">
                  {m[1]}
                  <a href={m[3]} target="_blank" rel="noopener noreferrer" className="text-neon-cyan underline-offset-2 hover:underline">
                    {m[2]}
                  </a>
                  {m[4]}
                </div>
              );
            })()}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-neon-green">{currentPrompt}</span>
          <span className="ml-2 text-foreground">{input}</span>
          <span className="ml-0.5 inline-block h-3.5 w-1.5 bg-[var(--neon-cyan)] cursor-blink" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (phase !== "submitting") handleEnter();
              }
            }}
            disabled={phase === "submitting"}
            className="absolute -left-[9999px] opacity-0"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
