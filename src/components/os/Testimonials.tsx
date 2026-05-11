import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  tag: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Shadz Yousaf",
    role: "Head of Growth",
    company: "NorthPeak Digital",
    quote:
      "Arfeen rebuilt our entire outbound engine from scratch. Reply rates jumped 3.4×, and our SDRs finally stopped chasing dead leads. He just gets B2B.",
    rating: 5,
    tag: "lead-gen",
  },
  {
    name: "Shoaib Malik",
    role: "CEO",
    company: "E-comdeals",
    quote:
      "We needed TikTok Shop, eBay, and Shopify all managed inside one ERP. Arfeen shipped a fully functional portal in two weeks and our team productivity doubled overnight.",
    rating: 5,
    tag: "erp / saas",
  },
  {
    name: "Irtiqa Haider",
    role: "Operations Lead",
    company: "MedVexa",
    quote:
      "From design to deploy, end-to-end ownership. Our medical billing site loads fast, ranks well, and converts — exactly what we needed.",
    rating: 5,
    tag: "web dev",
  },
  {
    name: "Waleed Shouqat",
    role: "Owner",
    company: "StockWise Mobiles",
    quote:
      "Managing my mobile shop inventory used to be a nightmare. Arfeen built a clean stock system that tracks every IMEI, sale, and return — I finally know my numbers in real time.",
    rating: 5,
    tag: "inventory",
  },
];

export function Testimonials() {
  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>client.feedback · stream</span>
        <span className="text-neon-green">● 4 verified</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className="group relative flex flex-col gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-2)]/50 p-4 transition hover:border-[var(--neon-cyan)]/40 hover:shadow-[0_0_24px_-12px_var(--neon-cyan)]"
          >
            <Quote className="absolute right-3 top-3 h-5 w-5 text-[var(--neon-purple)]/30 transition group-hover:text-[var(--neon-purple)]/60" />

            <div className="flex items-center gap-1">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-3 w-3 fill-neon-amber text-neon-amber" />
              ))}
              <span className="ml-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface-3)]/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {t.tag}
              </span>
            </div>

            <p className="text-[12.5px] leading-relaxed text-foreground/90">
              "{t.quote}"
            </p>

            <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--glass-border)] pt-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-cyan)]/30 to-[var(--neon-purple)]/30 font-mono text-[11px] text-foreground">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="truncate font-mono text-[12px] text-foreground">{t.name}</div>
                <div className="truncate font-mono text-[10px] text-neon-cyan">
                  {t.role} · {t.company}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
