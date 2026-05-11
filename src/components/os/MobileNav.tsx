import { useState } from "react";
import { User, FolderGit2, Boxes, Server, GitBranch, Mail, TerminalSquare, Radio, Menu, X, Star } from "lucide-react";

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

export function MobileNav({ onJump }: { onJump: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  function handleJump(id: string) {
    setOpen(false);
    onJump(id);
  }

  return (
    <>
      {/* Floating trigger button — mobile only */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glass-border)] bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-cyan)] text-background shadow-lg shadow-[oklch(0.72_0.21_305/0.35)] backdrop-blur-xl transition active:scale-95 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-[var(--glass-border)] bg-[oklch(0.18_0.02_275/95%)] p-4 backdrop-blur-xl transition-transform duration-300 md:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--glass-border)]" />
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-cyan)]">
              <TerminalSquare className="h-4 w-4 text-background" />
            </div>
            <span className="font-mono text-xs text-foreground">arfeenOS · nav</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-[var(--surface-3)] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 pb-2">
          {items.map((it) => {
            const I = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => handleJump(it.id)}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-2)] p-3 text-muted-foreground transition active:scale-95 hover:text-foreground"
              >
                <I className="h-5 w-5 text-neon-cyan" />
                <span className="font-mono text-[10px]">{it.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
