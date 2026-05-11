import { useEffect, useMemo, useRef, useState } from "react";

type Line =
  | { kind: "in" | "out" | "sys" | "err" | "ascii"; text: string }
  | { kind: "fetch"; logo: string; label?: string; value?: string; accent?: "cyan" | "purple" | "amber" | "green" | "rose"; divider?: boolean; bar?: number };

const HOSTNAME = "arfeen@os";

// Virtual filesystem
const FS: Record<string, string[] | string> = {
  "~": ["projects/", "experience/", "skills.json", "now.md", "contact.md", "secrets.txt"],
  "~/projects": ["insightbound/", "lead-engine/", "ai-chatbots/", "social-pipelines/", "fullstack-apps/"],
  "~/projects/insightbound": ["README.md", "architecture.md", "stack.json"],
  "~/projects/insightbound/README.md":
    "InsightBound — AI-native B2B intelligence layer.\nTurns scattered company signals into ready-to-action lead lists\nand outbound playbooks. v0.1 · 5 design partners · live.",
  "~/projects/insightbound/architecture.md":
    "signals → enrichment graph → AI scoring → vector store → outreach engine\nrunning on multi-region edge · supabase · openai · n8n",
  "~/experience": ["insightbound.role", "protoit.role", "retailigence.role", "vyncai.role"],
  "~/skills.json":
    '{ "ai": ["agents", "rag", "openai", "claude"], "automation": ["n8n", "make", "clay", "apollo"], "stack": ["nextjs", "tanstack", "supabase", "laravel", "mern"] }',
  "~/now.md":
    "shipping InsightBound v0.1\nwiring multi-agent orchestration\nobsessing over outbound that sounds human",
  "~/contact.md":
    "linkedin: /in/arfeen-dildar\ngithub:   @arfeendildar\nemail:    hello@insightbound.io",
  "~/secrets.txt":
    "nice try 😏 — but the only secret here is: ship daily.",
};

const ALL_COMMANDS = [
  "help", "whoami", "about", "ls", "cd", "cat", "pwd", "clear", "neofetch",
  "projects", "skills", "experience", "contact", "now", "launch", "sudo",
  "echo", "date", "history", "github", "linkedin", "open",
];

const NEOFETCH_LOGO: { logo: string; label?: string; value?: string; accent?: "cyan" | "purple" | "amber" | "green" | "rose"; divider?: boolean; bar?: number }[] = [
  { logo: "   ╭─────────╮   " },
  { logo: "   │ ▲ ▲ ▲ ▲ │   ", label: "arfeen",   value: "@ arfeenOS",                accent: "green" },
  { logo: "   │ ◆ ◆ ◆ ◆ │   ", divider: true },
  { logo: "   │ ███████ │   ", label: "OS",       value: "arfeenOS v3.14",            accent: "cyan" },
  { logo: "   │ ██▼█▼██ │   ", label: "Host",     value: "Founder Workstation",       accent: "cyan" },
  { logo: "   │ ███████ │   ", label: "Kernel",   value: "intelligent-systems-6.0",   accent: "purple" },
  { logo: "   │ ◆ ◆ ◆ ◆ │   ", label: "Uptime",   value: "shipping since 2022",       accent: "amber" },
  { logo: "   │ ▼ ▼ ▼ ▼ │   ", label: "Shell",    value: "zsh-compat",                accent: "purple" },
  { logo: "   ╰────┬────╯   ", label: "Focus",    value: "AI infra · lead-gen · agents", accent: "cyan" },
  { logo: "      ──┴──      ", label: "Building", value: "InsightBound v0.1",         accent: "green" },
  { logo: "                 ", label: "Colors",    value: "● ● ● ● ●",                 accent: "rose" },
];

export function Terminal({ autotype = true }: { autotype?: boolean }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const intro = useMemo<Line[]>(
    () => [
      { kind: "sys", text: "arfeenOS shell · v3.14 (zsh-compatible)" },
      { kind: "sys", text: "type `help` to begin · `neofetch` for system info · TAB to autocomplete" },
    ],
    [],
  );

  useEffect(() => { setLines(intro); }, [intro]);

  useEffect(() => {
    if (!autotype) return;
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
    if (isMobile) return;
    let cancelled = false;
    const seq = async () => {
      await wait(700);
      await typeCmd("neofetch");
      await wait(500);
      await typeCmd("ls projects");
    };
    seq();
    async function typeCmd(cmd: string) {
      for (let i = 1; i <= cmd.length; i++) {
        if (cancelled) return;
        setInput(cmd.slice(0, i));
        await wait(45 + Math.random() * 35);
      }
      if (cancelled) return;
      await wait(220);
      runCommand(cmd, false);
      setInput("");
    }
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, input]);

  function push(...l: Line[]) { setLines((prev) => [...prev, ...l]); }
  function out(text: string) { return { kind: "out" as const, text }; }
  function err(text: string) { return { kind: "err" as const, text }; }

  function resolvePath(arg: string): string {
    if (!arg || arg === "~" || arg === "/") return "~";
    if (arg.startsWith("~/")) return arg.replace(/\/$/, "");
    if (arg === "..") {
      const parts = cwd.split("/");
      if (parts.length <= 1) return "~";
      parts.pop();
      return parts.join("/") || "~";
    }
    if (arg.startsWith("/")) return "~" + arg;
    return `${cwd}/${arg}`.replace(/\/$/, "");
  }

  function runCommand(raw: string, addHistory = true) {
    const cmd = raw.trim();
    if (!cmd) return;
    if (addHistory) setHistory((h) => [...h, cmd]);
    setHIdx(-1);
    push({ kind: "in", text: `${HOSTNAME} ${cwd} % ${cmd}` });

    const tokens = cmd.split(/\s+/);
    const base = tokens[0].toLowerCase();
    const rest = tokens.slice(1);
    const arg = rest.join(" ");

    switch (base) {
      case "clear":
        return setLines([]);

      case "help":
        return push(
          out("available commands:"),
          out("  ls [path]         list files       cd <dir>     change directory"),
          out("  cat <file>        read file        pwd          print path"),
          out("  neofetch          system info      whoami       identity"),
          out("  projects          list deployed    skills       installed modules"),
          out("  experience        career fs        contact      channels"),
          out("  now               current focus    launch <p>   open project"),
          out("  open <site>       linkedin/github/insightbound"),
          out("  sudo <cmd>        try it 😏       history      command log"),
          out("  echo <text>       echo text        date         current time"),
          out("  clear             wipe terminal    help         this menu"),
        );

      case "pwd":
        return push(out(cwd));

      case "ls": {
        const target = arg ? resolvePath(arg) : cwd;
        const entry = FS[target];
        if (!entry) return push(err(`ls: no such directory: ${arg || target}`));
        if (typeof entry === "string") return push(err(`ls: not a directory: ${arg}`));
        const colored = entry.map((e) => e.endsWith("/") ? `\x1b${e}` : e);
        return push(out(colored.map((c) =>
          c.startsWith("\x1b") ? `📁 ${c.slice(1).replace("/", "")}` : `📄 ${c}`
        ).join("    ")));
      }

      case "cd": {
        if (!arg) { setCwd("~"); return push(out("→ ~")); }
        const target = resolvePath(arg);
        if (!FS[target]) return push(err(`cd: no such directory: ${arg}`));
        if (typeof FS[target] === "string") return push(err(`cd: not a directory: ${arg}`));
        setCwd(target);
        return push(out(`→ ${target}`));
      }

      case "cat": {
        if (!arg) return push(err("usage: cat <file>"));
        const target = resolvePath(arg);
        const entry = FS[target];
        if (entry === undefined) return push(err(`cat: ${arg}: no such file`));
        if (Array.isArray(entry)) return push(err(`cat: ${arg}: is a directory`));
        return push(...entry.split("\n").map(out));
      }

      case "neofetch":
        return push(...NEOFETCH_LOGO.map((t) => ({ kind: "fetch" as const, ...t })));

      case "whoami":
        return push(
          out("Muhammad Arfeen Dildar"),
          out("AI Automation Specialist · SaaS Founder"),
          out("Full-Stack Developer · Systems Engineer"),
        );

      case "about":
      case "now":
        return push(
          out("Building intelligent automation systems, lead generation"),
          out("infrastructure, and AI-powered outreach platforms."),
          out("Focused on agentic workflows, SaaS architecture, and scale."),
        );

      case "projects":
        return push(
          out("→ insightbound      ACTIVE     AI outreach infrastructure"),
          out("→ ai-chatbots       RUNNING    Custom AI support systems"),
          out("→ lead-engine       PROCESSING Lead extraction & enrichment"),
          out("→ social-pipelines  DEPLOYED   Multi-platform automation"),
          out("→ fullstack-apps    ONLINE     Laravel & MERN systems"),
        );

      case "skills":
        return push(
          out("installed_modules/  python_automation, ai_agents, laravel_backend,"),
          out("                    n8n_workflows, make_automation, crm_integration,"),
          out("                    lead_enrichment, apollo_io, clay, firebase, mern_stack"),
        );

      case "experience":
        return push(
          out("/experience"),
          out("  ├─ FAST-NUCES       (BS Software Engineering · 2022—2026)"),
          out("  ├─ Retailigence     (Business Analyst Intern · 2023)"),
          out("  ├─ ProtoIT          (Lead Gen Expert · 2025)"),
          out("  └─ InsightBound     (Founder · current ●)"),
        );

      case "contact":
        return push(
          out("channels online:"),
          out("  linkedin: /in/arfeen-dildar"),
          out("  github:   @arfeendildar"),
          out("  email:    hello@insightbound.io"),
          out("—— let's build intelligent systems."),
        );

      case "history":
        return push(...history.map((h, i) => out(`  ${i + 1}  ${h}`)));

      case "date":
        return push(out(new Date().toString()));

      case "echo":
        return push(out(arg));

      case "sudo":
        return push(
          err("nice try."),
          out("you don't need sudo to ship. you just need to ship."),
        );

      case "open":
      case "launch": {
        if (!arg) return push(err(`usage: ${base} <name>`));
        const name = arg.toLowerCase().replace(/\s+/g, "-");
        const links: Record<string, string> = {
          linkedin: "https://linkedin.com/in/arfeen-dildar",
          github: "https://github.com/arfeendildar",
          insightbound: "https://insightbound.io",
        };
        if (links[name]) {
          push(out(`↪ opening ${name}…`));
          window.open(links[name], "_blank", "noopener");
          return;
        }
        const target = document.getElementById(`project-${name}`);
        if (target) {
          push(out(`↪ launching ${name}…`));
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("ring-2", "ring-[var(--neon-cyan)]");
          setTimeout(() => target.classList.remove("ring-2", "ring-[var(--neon-cyan)]"), 1800);
          return;
        }
        return push(err(`error: "${arg}" not found in /deployments or /links`));
      }

      default:
        return push(err(`zsh: command not found: ${base} — try \`help\``));
    }
  }

  function autocomplete() {
    const tokens = input.split(/\s+/);
    if (tokens.length === 1) {
      const matches = ALL_COMMANDS.filter((c) => c.startsWith(tokens[0].toLowerCase()));
      if (matches.length === 1) setInput(matches[0] + " ");
      else if (matches.length > 1) push({ kind: "out", text: matches.join("    ") });
      return;
    }
    const last = tokens[tokens.length - 1];
    const dirEntry = FS[cwd];
    if (Array.isArray(dirEntry)) {
      const matches = dirEntry.filter((e) => e.toLowerCase().startsWith(last.toLowerCase()));
      if (matches.length === 1) {
        tokens[tokens.length - 1] = matches[0].replace(/\/$/, "");
        setInput(tokens.join(" "));
      } else if (matches.length > 1) {
        push({ kind: "out", text: matches.join("    ") });
      }
    }
  }

  return (
    <div
      className="relative flex h-[260px] sm:h-[460px] max-h-[calc(100vh-170px)] min-h-[220px] sm:min-h-[340px] cursor-text flex-col overflow-hidden bg-[oklch(0.13_0.012_270/95%)] font-mono text-[10.5px] sm:text-[12.5px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overflow-x-auto overscroll-auto px-3 sm:px-4 py-3">
        {lines.map((l, i) => (
          <div key={i} className={l.kind === "ascii" || l.kind === "fetch" ? "whitespace-pre" : "whitespace-pre-wrap break-words"}>
            {l.kind === "in" && (
              <div>
                <span className="text-neon-green">{l.text.split(" % ")[0]} %</span>{" "}
                <span className="text-foreground">{l.text.split(" % ").slice(1).join(" % ")}</span>
              </div>
            )}
            {l.kind === "out" && <div className="text-foreground/85">{l.text}</div>}
            {l.kind === "err" && <div className="text-neon-rose/90">{l.text}</div>}
            {l.kind === "ascii" && <div className="text-neon-cyan">{l.text}</div>}
            {l.kind === "sys" && <div className="text-muted-foreground">{l.text}</div>}
            {l.kind === "fetch" && (
              <div>
                <span className="text-neon-cyan">{l.logo}</span>
                {l.divider ? (
                  <span className="text-foreground/30">────────────────────────────</span>
                ) : l.label ? (
                  <>
                    <span className={
                      l.accent === "purple" ? "text-neon-purple" :
                      l.accent === "amber" ? "text-neon-amber" :
                      l.accent === "green" ? "text-neon-green" :
                      l.accent === "rose" ? "text-neon-rose" :
                      "text-neon-cyan"
                    }>
                      {(l.label + (l.value ? ":" : "")).padEnd(10, " ")}
                    </span>
                    {l.value && <span className="text-foreground/90">{l.value}</span>}
                  </>
                ) : null}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-neon-green">{HOSTNAME} {cwd} %</span>
          <span className="ml-2 text-foreground">{input}</span>
          <span className="ml-0.5 inline-block h-3.5 w-1.5 bg-[var(--neon-cyan)] cursor-blink" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { runCommand(input); setInput(""); }
              else if (e.key === "Tab") { e.preventDefault(); autocomplete(); }
              else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (!history.length) return;
                const next = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
                setHIdx(next); setInput(history[next] ?? "");
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (hIdx === -1) return;
                const next = hIdx + 1;
                if (next >= history.length) { setHIdx(-1); setInput(""); }
                else { setHIdx(next); setInput(history[next]); }
              } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault(); setLines([]);
              }
            }}
            className="absolute -left-[9999px] opacity-0"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
