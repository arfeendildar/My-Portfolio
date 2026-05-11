import { User, FolderGit2, Boxes, Server, GitBranch, Mail, TerminalSquare, Radio, Star } from "lucide-react";

const items = [
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Boxes },
  { id: "systems", label: "Systems", icon: Server },
  { id: "experience", label: "Experience", icon: GitBranch },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "community", label: "Community", icon: Radio },
  { id: "contact", label: "Contact", icon: Mail },
];

export function Dock({ onJump }: { onJump: (id: string) => void }) {
  return (
    <aside className="sticky top-9 z-30 hidden h-[calc(100vh-2.25rem)] w-14 shrink-0 flex-col items-center gap-1 border-r border-[var(--glass-border)] bg-[oklch(0.18_0.02_275/70%)] py-3 backdrop-blur-xl md:flex">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-cyan)] glow-purple">
        <TerminalSquare className="h-4 w-4 text-background" />
      </div>
      <div className="my-1 h-px w-7 bg-[var(--glass-border)]" />
      {items.map((it) => {
        const I = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => onJump(it.id)}
            title={it.label}
            className="group relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-[var(--surface-3)] hover:text-foreground"
          >
            <I className="h-4 w-4 transition group-hover:text-neon-cyan group-hover:drop-shadow-[0_0_8px_var(--neon-cyan)]" />
            <span className="pointer-events-none absolute left-12 z-50 whitespace-nowrap rounded-md border border-[var(--glass-border)] bg-[var(--surface-2)] px-2 py-1 font-mono text-[10px] opacity-0 transition group-hover:opacity-100">
              {it.label}
            </span>
          </button>
        );
      })}
      <div className="mt-auto font-mono text-[9px] text-muted-foreground">v3.14</div>
    </aside>
  );
}
