import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Window({
  title,
  subtitle,
  badge,
  children,
  className = "",
  delay = 0,
  id,
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ scrollMarginTop: "5rem" }}
      className={`window scanline relative flex h-full flex-col overflow-hidden ${className}`}
    >
      <header className="window-header flex items-center gap-3 px-3.5 py-2 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-1 flex min-w-0 flex-1 items-baseline gap-2">
          <span className="truncate text-foreground">{title}</span>
          {subtitle && <span className="hidden sm:inline truncate text-muted-foreground text-[11px]">— {subtitle}</span>}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap [&_*]:whitespace-nowrap">{badge}</div>
      </header>
      <div className="relative flex-1 min-h-0">{children}</div>
    </motion.section>
  );
}
