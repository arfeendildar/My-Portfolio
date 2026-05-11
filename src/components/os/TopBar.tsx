import { useEffect, useState } from "react";
import { Wifi, BatteryFull, Cpu, Activity } from "lucide-react";

export function TopBar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const tabs = ["workspace", "projects", "systems", "experience", "contact"];

  return (
    <div className="sticky top-0 z-40 flex h-9 items-center gap-2 border-b border-[var(--glass-border)] bg-[oklch(0.18_0.02_275/85%)] px-3 font-mono text-xs backdrop-blur-xl">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>

      <div className="ml-3 flex items-center gap-1 text-muted-foreground">
        <span className="text-foreground font-semibold">arfeenOS</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">~/workspace</span>
      </div>

      <nav className="ml-4 hidden gap-1 md:flex">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded px-2 py-0.5 transition ${
              active === t
                ? "bg-[var(--surface-3)] text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3 text-muted-foreground">
        <span className="hidden items-center gap-1 lg:inline-flex">
          <Activity className="h-3 w-3 text-neon-green" />
          <span>agents <span className="text-foreground">12/12</span></span>
        </span>
        <span className="hidden items-center gap-1 sm:inline-flex">
          <Cpu className="h-3 w-3 text-neon-cyan" /> 38%
        </span>
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-3.5 w-3.5 text-neon-green" />
        <span className="text-foreground tabular-nums min-w-[68px] text-right">
          {time
            ? time.toLocaleString("en-GB", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "—"}
        </span>
      </div>
    </div>
  );
}
