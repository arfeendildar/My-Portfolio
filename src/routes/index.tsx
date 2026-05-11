import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BootScreen } from "@/components/os/BootScreen";
import { TopBar } from "@/components/os/TopBar";
import { Dock } from "@/components/os/Dock";
import { Window } from "@/components/os/Window";
import { Terminal } from "@/components/os/Terminal";
import { WorkExperience } from "@/components/os/WorkExperience";
import { ProjectsGrid } from "@/components/os/ProjectsGrid";
import { SkillsModules } from "@/components/os/SkillsModules";
import { ExperienceTree } from "@/components/os/ExperienceTree";
import { CommunityLogs } from "@/components/os/CommunityLogs";
import { ContactPanel } from "@/components/os/ContactPanel";
import { HeroProfile } from "@/components/os/HeroProfile";
import { AIInfraPipeline } from "@/components/os/AIInfraPipeline";
import { StatusTicker } from "@/components/os/StatusTicker";
import { MobileNav } from "@/components/os/MobileNav";
import { Testimonials } from "@/components/os/Testimonials";
import { AskArfeen } from "@/components/os/AskArfeen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Arfeen Dildar — AI Engineer · arfeenOS" },
      { name: "description", content: "The personal operating system of Muhammad Arfeen Dildar — AI automation specialist, SaaS founder, and systems engineer. A cinematic developer workspace." },
      { property: "og:title", content: "Muhammad Arfeen Dildar — arfeenOS" },
      { property: "og:description", content: "An AI engineer's personal operating system. Cinematic, terminal-driven portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [booted, setBooted] = useState(false);
  const [active, setActive] = useState("workspace");
  const auroraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices for buttery scrolling
    if (window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    let pending: { x: number; y: number } | null = null;
    const apply = () => {
      raf = 0;
      if (!pending || !auroraRef.current) return;
      auroraRef.current.style.background = `radial-gradient(600px circle at ${pending.x}% ${pending.y}%, oklch(0.72 0.21 305 / 0.10), transparent 50%)`;
    };
    const handler = (e: MouseEvent) => {
      pending = { x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function jump(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      <div className="relative min-h-screen overflow-x-clip">
        {/* Reactive aurora */}
        <div
          ref={auroraRef}
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: `radial-gradient(600px circle at 50% 30%, oklch(0.72 0.21 305 / 0.10), transparent 50%)`,
          }}
        />
        <div className="pointer-events-none fixed inset-0 z-0 bg-grid opacity-[0.18]" />

        <TopBar active={active} setActive={(t) => jump(t === "workspace" ? "about" : t)} />

        <MobileNav onJump={jump} />
        <AskArfeen />

        <div className="relative z-10 flex">
          <Dock onJump={jump} />

          <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: booted ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mx-auto max-w-7xl space-y-5"
            >
              {/* Identity + terminal hero */}
              <div id="about" style={{ scrollMarginTop: "5rem" }} className="grid gap-5 lg:grid-cols-12">
                <Window
                  title="~/identity.profile"
                  subtitle="signed · verified"
                  className="lg:col-span-5"
                  badge={<span className="font-mono text-[10px] text-neon-green">● online</span>}
                >
                  <HeroProfile />
                </Window>

                <Window
                  title="zsh — arfeen@os"
                  subtitle="interactive"
                  className="lg:col-span-7"
                  badge={<span className="font-mono text-[10px] text-muted-foreground">type `help`</span>}
                  delay={0.1}
                >
                  <Terminal />
                </Window>
              </div>

              {/* Status ticker — founder personality */}
              <StatusTicker />

              {/* AI Infrastructure — the USP */}
              <Window
                id="infra"
                title="ai_infrastructure.pipeline"
                subtitle="signals → enrichment → scoring → outreach"
                badge={<span className="font-mono text-[10px] text-neon-cyan">● live</span>}
              >
                <AIInfraPipeline />
              </Window>

              {/* Work Experience */}
              <Window
                id="systems"
                title="work.experience"
                subtitle="roles · responsibilities · impact"
                badge={<span className="font-mono text-[10px] text-neon-green">● currently shipping</span>}
              >
                <WorkExperience />
              </Window>

              {/* Projects */}
              <Window
                id="projects"
                title="/deployments"
                subtitle="5 services"
                badge={<span className="font-mono text-[10px] text-neon-green">all healthy</span>}
              >
                <ProjectsGrid />
              </Window>

              {/* Skills + experience */}
              <div className="grid items-start gap-5 lg:grid-cols-2">
                <Window id="skills" title="installed_modules" subtitle="package registry">
                  <SkillsModules />
                </Window>
                <Window id="experience" title="/experience" subtitle="filesystem timeline">
                  <ExperienceTree />
                </Window>
              </div>

              {/* Testimonials */}
              <Window id="testimonials" title="testimonials.feed" subtitle="what clients say" badge={<span className="font-mono text-[10px] text-neon-amber">★ ★ ★ ★ ★</span>}>
                <Testimonials />
              </Window>

              {/* Community */}
              <Window id="community" title="community.logs" subtitle="live tail">
                <CommunityLogs />
              </Window>

              {/* Contact */}
              <Window id="contact" title="contact.term" subtitle="secure channel">
                <ContactPanel />
              </Window>

              <footer className="pb-8 pt-4 text-center font-mono text-[11px] text-muted-foreground">
                © arfeenOS · session id a7f3c91e · uptime stable
              </footer>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
}
