import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Activity, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type CaseStudy = {
  problem: string;
  solution: string[];
  architecture: string;
  impact: { k: string; v: string }[];
  role: string;
};

type Project = {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  accent: string;
  uptime?: string;
  region?: string;
  stack: readonly string[];
  metrics?: readonly { k: string; v: string }[];
  image?: string;
  liveUrl?: string;
  caseStudy?: CaseStudy;
};

const PROJECTS: readonly Project[] = [
  {
    slug: "insightbound",
    name: "InsightBound",
    tagline: "AI outreach infrastructure platform",
    status: "ACTIVE",
    accent: "green",
    uptime: "99.98%",
    region: "us-east-1",
    stack: ["Next.js", "Node", "Postgres", "OpenAI", "Clay", "Apollo"],
    metrics: [{ k: "campaigns", v: "1.2k" }, { k: "rps", v: "284" }, { k: "p95", v: "112ms" }],
    liveUrl: "https://insightbound.tech",
    caseStudy: {
      problem:
        "B2B sales teams burning $8-12k/mo on disconnected tools (Apollo + Clay + Lemlist + HubSpot) with no unified ICP scoring or reply intelligence. Manual handoffs killed reply rates.",
      solution: [
        "Built unified ingest layer pulling from Apollo + Clay + LinkedIn into a single Postgres event store",
        "Trained ICP scoring model on 80k labeled leads — cosine match against vector embeddings",
        "GPT-4 powered reply classifier routes inbound to nurture / book / disqualify in <2s",
        "n8n + custom Node workers handle 280+ req/s with circuit breakers per provider",
      ],
      architecture:
        "Next.js dashboard → tRPC API → Postgres (lead store) + Redis (queue) → n8n workflows → OpenAI / Apollo / HubSpot connectors. Edge functions for webhooks.",
      impact: [
        { k: "reply rate lift", v: "+340%" },
        { k: "cost per qualified lead", v: "-62%" },
        { k: "SDR hours saved/week", v: "40+" },
        { k: "active workspaces", v: "1.2k" },
      ],
      role: "founding engineer · architecture, AI pipelines, infra",
    },
  },
  {
    slug: "ai-chatbots",
    name: "AI Chatbots",
    tagline: "Custom AI customer support systems",
    status: "RUNNING",
    accent: "cyan",
    uptime: "99.91%",
    region: "eu-west-2",
    stack: ["LangChain", "RAG", "Pinecone", "FastAPI"],
    metrics: [{ k: "tenants", v: "37" }, { k: "msgs/d", v: "84k" }, { k: "csat", v: "4.7" }],
    caseStudy: {
      problem:
        "SaaS clients drowning in tier-1 support tickets — 70% repetitive, 24h response SLAs slipping, hiring more agents wasn't scaling.",
      solution: [
        "Multi-tenant RAG pipeline with isolated Pinecone namespaces per customer",
        "Hybrid retrieval (BM25 + dense vectors) with reranking for 91% answer accuracy",
        "Fallback to human agent with full conversation context + suggested reply",
        "Continuous fine-tuning loop from CSAT thumbs-up/down feedback",
      ],
      architecture:
        "FastAPI gateway → LangChain orchestrator → Pinecone (per-tenant) + Postgres (chat history) → OpenAI/Claude with model routing by query complexity.",
      impact: [
        { k: "tickets auto-resolved", v: "68%" },
        { k: "avg response time", v: "1.2s" },
        { k: "csat score", v: "4.7 / 5" },
        { k: "cost per ticket", v: "-84%" },
      ],
      role: "lead AI engineer · RAG architecture, tenant isolation, evals",
    },
  },
  {
    slug: "lead-generation-engine",
    name: "Lead Generation Engine",
    tagline: "Large-scale lead extraction & enrichment",
    status: "PROCESSING",
    accent: "amber",
    uptime: "99.84%",
    region: "ap-south-1",
    stack: ["Python", "Apollo", "Clay", "n8n", "Redis"],
    metrics: [{ k: "leads/d", v: "42k" }, { k: "match", v: "94%" }, { k: "queue", v: "1.8k" }],
    caseStudy: {
      problem:
        "Agency clients needed 30k+ enriched leads/week across 12 ICPs but Apollo/Clay credits were burning out by Wednesday — bad enrichment killed deliverability.",
      solution: [
        "Smart waterfall: Apollo → Clay → LinkedIn scrape → Hunter for email discovery (cheapest first)",
        "Redis-backed dedup across all client workspaces — saved 38% of credits monthly",
        "n8n orchestration with retry, backoff, and provider health checks",
        "Auto-validation pipeline (MX + SMTP + bounce prediction) before delivery",
      ],
      architecture:
        "Python ingest workers → Redis queue → n8n waterfall → Postgres enriched store → CSV/HubSpot export. Cron-based ICP refresh.",
      impact: [
        { k: "leads delivered/week", v: "42k+" },
        { k: "valid email rate", v: "94%" },
        { k: "credit spend", v: "-38%" },
        { k: "bounce rate", v: "<2%" },
      ],
      role: "automation architect · pipeline design, cost optimization",
    },
  },
  {
    slug: "social-automation-pipelines",
    name: "Social Automation Pipelines",
    tagline: "Automated multi-platform content systems",
    status: "DEPLOYED",
    accent: "purple",
    uptime: "99.96%",
    region: "global-edge",
    stack: ["n8n", "Make", "Buffer", "OAuth"],
    metrics: [{ k: "posts/wk", v: "318" }, { k: "platforms", v: "6" }, { k: "errors", v: "0" }],
    caseStudy: {
      problem:
        "Personal brand & agency clients spending 15+ hrs/week manually reformatting and scheduling content across LinkedIn, Twitter, IG, TikTok, YT Shorts, Threads.",
      solution: [
        "Single-source CMS (Notion) → AI reformatter that adapts tone + length per platform",
        "Auto-generates hooks, hashtags, and thumbnails per channel",
        "OAuth-based direct publishing (no Buffer middleman) with retry on rate limits",
        "Analytics roll-up dashboard pulling engagement back into CMS for next-cycle learning",
      ],
      architecture:
        "Notion API → n8n orchestrator → OpenAI reformatter → platform APIs (LinkedIn / X / Meta / TikTok / YT) → analytics warehouse.",
      impact: [
        { k: "time saved/week", v: "15 hrs" },
        { k: "posts shipped/week", v: "318" },
        { k: "engagement lift", v: "+210%" },
        { k: "publish errors", v: "0" },
      ],
      role: "solo builder · end-to-end design and delivery",
    },
  },
  {
    slug: "full-stack-applications",
    name: "Full-Stack Applications",
    tagline: "Laravel & MERN production systems",
    status: "ONLINE",
    accent: "cyan",
    uptime: "99.99%",
    region: "multi-az",
    stack: ["Laravel", "MERN", "MySQL", "Mongo", "AWS"],
    metrics: [{ k: "apps", v: "11" }, { k: "users", v: "62k" }, { k: "ci/cd", v: "auto" }],
    caseStudy: {
      problem:
        "Various clients (fintech, edtech, marketplace) needed production-grade web apps — most inherited messy MVPs with no tests, no CI, no observability.",
      solution: [
        "Standardized stack: Laravel for transactional, MERN for realtime — both with Docker + GitHub Actions",
        "Introduced typed contracts (Zod / Laravel form requests) at every API boundary",
        "Centralized logging + Sentry + uptime monitoring across 11 deployments",
        "Migrated 3 apps from shared hosting to AWS multi-AZ with zero-downtime cutover",
      ],
      architecture:
        "Laravel (PHP 8.3) + MySQL OR Node + Express + MongoDB → React frontends → AWS (ECS / RDS / S3 / CloudFront) → GitHub Actions CI/CD.",
      impact: [
        { k: "uptime achieved", v: "99.99%" },
        { k: "users served", v: "62k" },
        { k: "deploy time", v: "4 min" },
        { k: "incidents/quarter", v: "<1" },
      ],
      role: "full-stack engineer · architecture, migration, ops",
    },
  },

  // ── Client websites ──────────────────────────────────────────────
  {
    slug: "ecomdeals-erp",
    name: "Ecomdeals ERP",
    tagline: "ERP for Pakistan's largest e-commerce training center",
    status: "LIVE",
    accent: "green",
    stack: ["Laravel", "MySQL", "React", "Shopify API", "TikTok Shop", "eBay"],
    liveUrl: "https://portal.e-comdeals.com",
  },
  {
    slug: "medvexa",
    name: "Medvexa",
    tagline: "Medical billing services platform",
    status: "LIVE",
    accent: "cyan",
    stack: ["Next.js", "Node", "Postgres"],
    liveUrl: "https://medvexa.com",
  },
  {
    slug: "truckif",
    name: "Truckif",
    tagline: "Truck dispatching SaaS",
    status: "LIVE",
    accent: "amber",
    stack: ["React", "Node", "Postgres", "Maps API"],
    liveUrl: "https://truckif.com",
  },

  // ── Design / Graphics ────────────────────────────────────────────
  {
    slug: "mockups",
    name: "Mockups",
    tagline: "Realistic product & design mockup creation",
    status: "PORTFOLIO",
    accent: "purple",
    stack: ["Figma", "Photoshop", "Illustrator"],
    image: "https://arfeenawan.site/assets/images/projects/mockup.jpg",
  },
  {
    slug: "logo-designer",
    name: "Logo Designer",
    tagline: "Creative brand identity & logo design",
    status: "PORTFOLIO",
    accent: "purple",
    stack: ["Illustrator", "Figma", "Branding"],
    image: "https://arfeenawan.site/assets/images/projects/log.jpg",
  },
  {
    slug: "video-editor",
    name: "Video Editor",
    tagline: "High-quality video editing & motion content",
    status: "PORTFOLIO",
    accent: "purple",
    stack: ["Premiere Pro", "After Effects", "DaVinci"],
    image: "https://arfeenawan.site/assets/images/projects/video.jpg",
    liveUrl: "https://shorter.me/xXyL6",
  },

  // ── App / UI projects ────────────────────────────────────────────
  {
    slug: "fintrack",
    name: "FinTrack",
    tagline: "React Native finance tracking app",
    status: "SHIPPED",
    accent: "green",
    stack: ["React Native", "Expo", "Firebase"],
    image: "https://arfeenawan.site/assets/images/projects/project-thumb-1.png",
    liveUrl: "https://shorter.me/8vTIP",
  },
  {
    slug: "fintrack-rn",
    name: "FinTrack (RN)",
    tagline: "Personal finance manager — expenses, budgets, insights",
    status: "SHIPPED",
    accent: "green",
    stack: ["React Native", "Redux", "Charts"],
    image: "https://arfeenawan.site/assets/images/projects/fintrackproj.png",
  },
  {
    slug: "speakly",
    name: "Speakly",
    tagline: "UI/UX for vocabulary & confidence-building app",
    status: "DESIGN",
    accent: "cyan",
    stack: ["Figma", "Prototype", "UI/UX"],
    image: "https://arfeenawan.site/assets/images/projects/project-thumb-11.png",
    liveUrl: "https://shorter.me/yQnjy",
  },

  // ── Marketing / Automation ───────────────────────────────────────
  {
    slug: "meta-tiktok-ads",
    name: "Meta & TikTok Ads",
    tagline: "Paid social — engagement & conversion campaigns",
    status: "RESULTS",
    accent: "amber",
    stack: ["Meta Ads", "TikTok Ads", "Pixel", "Analytics"],
    image: "https://arfeenawan.site/assets/images/projects/digital.jpg",
  },
  {
    slug: "gmap-leads",
    name: "GMap Leads Generation",
    tagline: "Extract emails, phones & contacts from Google Maps",
    status: "AUTOMATION",
    accent: "amber",
    stack: ["Python", "Scraper", "Maps API"],
    image: "https://arfeenawan.site/assets/images/projects/googlemap.PNG",
  },
  {
    slug: "linkedin-automation",
    name: "LinkedIn Automation",
    tagline: "Strategic networking & lead-gen automation",
    status: "AUTOMATION",
    accent: "cyan",
    stack: ["n8n", "LinkedIn API", "Phantombuster"],
    image: "https://arfeenawan.site/assets/images/projects/linkedin.png",
  },
  {
    slug: "whatsapp-automation",
    name: "WhatsApp Automation",
    tagline: "Customer engagement & messaging automation",
    status: "AUTOMATION",
    accent: "green",
    stack: ["WhatsApp API", "n8n", "Twilio"],
    image: "https://arfeenawan.site/assets/images/projects/whts.PNG",
  },
  {
    slug: "instagram-automation",
    name: "Instagram Automation",
    tagline: "Engagement & growth automation strategies",
    status: "AUTOMATION",
    accent: "purple",
    stack: ["IG Graph API", "n8n", "Make"],
    image: "https://arfeenawan.site/assets/images/projects/insta.jpg",
  },
  {
    slug: "email-marketing",
    name: "Email Marketing Automation",
    tagline: "Personalized campaigns for higher conversions",
    status: "AUTOMATION",
    accent: "amber",
    stack: ["Mailchimp", "Klaviyo", "Lemlist", "HubSpot"],
    image: "https://arfeenawan.site/assets/images/projects/email.PNG",
  },

  // ── Web builds ───────────────────────────────────────────────────
  {
    slug: "cryptobyvw",
    name: "CryptoByVW",
    tagline: "Responsive crypto industry website",
    status: "LIVE",
    accent: "cyan",
    stack: ["HTML", "CSS", "JS"],
    image: "https://arfeenawan.site/assets/images/projects/crypto.PNG",
    liveUrl: "https://shorter.me/7funQ",
  },
  {
    slug: "stockwise",
    name: "StockWise",
    tagline: "Stock management platform with Firebase",
    status: "LIVE",
    accent: "green",
    stack: ["HTML", "CSS", "JS", "Firebase"],
    image: "https://arfeenawan.site/assets/images/projects/project-thumb-5.png",
    liveUrl: "https://shorter.me/ug5QR",
  },
  {
    slug: "bpws",
    name: "BPWS",
    tagline: "Money donation site with realtime Firebase DB",
    status: "LIVE",
    accent: "purple",
    stack: ["HTML", "CSS", "JS", "Firebase"],
    image: "https://arfeenawan.site/assets/images/projects/project-thumb-6.png",
    liveUrl: "https://shorter.me/jZiQC",
  },

  // ── E-commerce stores ───────────────────────────────────────────
  {
    slug: "herbisential",
    name: "Herbisential",
    tagline: "WordPress store — premium curated products",
    status: "STORE",
    accent: "green",
    stack: ["WordPress", "WooCommerce"],
    image: "https://arfeenawan.site/assets/images/projects/innovativecart.png",
  },
  {
    slug: "virtual-assistant",
    name: "Virtual Assistant",
    tagline: "2yrs Shopify VA — sales boost & customer engagement",
    status: "EXPERIENCE",
    accent: "cyan",
    stack: ["Shopify", "Customer Ops", "Sales"],
    image: "https://arfeenawan.site/assets/images/projects/shopifydash.PNG",
  },
  {
    slug: "comfortmart",
    name: "Comfortmart",
    tagline: "Shopify store — curated premium retail",
    status: "STORE",
    accent: "amber",
    stack: ["Shopify", "Liquid", "Apps"],
    image: "https://arfeenawan.site/assets/images/projects/gadgetxpress.png",
  },
  {
    slug: "apkidukan",
    name: "ApkiDukan",
    tagline: "Shopify store — modern online retail",
    status: "STORE",
    accent: "purple",
    stack: ["Shopify", "Liquid", "Apps"],
    image: "https://arfeenawan.site/assets/images/projects/apkidukan.png",
  },
];

const CATEGORY_MAP: Record<string, string> = {
  insightbound: "ai",
  "ai-chatbots": "ai",
  "lead-generation-engine": "automation",
  "social-automation-pipelines": "automation",
  "full-stack-applications": "web",
  "ecomdeals-erp": "web",
  medvexa: "web",
  truckif: "web",
  mockups: "design",
  "logo-designer": "design",
  "video-editor": "design",
  fintrack: "mobile",
  "fintrack-rn": "mobile",
  speakly: "design",
  "meta-tiktok-ads": "marketing",
  "gmap-leads": "automation",
  "linkedin-automation": "automation",
  "whatsapp-automation": "automation",
  "instagram-automation": "automation",
  "email-marketing": "marketing",
  cryptobyvw: "web",
  stockwise: "web",
  bpws: "web",
  herbisential: "ecommerce",
  "virtual-assistant": "ecommerce",
  comfortmart: "ecommerce",
  apkidukan: "ecommerce",
};

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "all" },
  { id: "featured", label: "featured" },
  { id: "ai", label: "ai" },
  { id: "web", label: "web" },
  { id: "mobile", label: "mobile / ui" },
  { id: "design", label: "design" },
  { id: "automation", label: "automation" },
  { id: "marketing", label: "marketing" },
  { id: "ecommerce", label: "e-commerce" },
];

export function ProjectsGrid() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("featured");
  const open = PROJECTS.find((p) => p.slug === openSlug) ?? null;

  const filtered = PROJECTS.filter((p) => {
    if (filter === "all") return true;
    if (filter === "featured") return !!p.caseStudy;
    return CATEGORY_MAP[p.slug] === filter;
  });

  const counts: Record<string, number> = { all: PROJECTS.length, featured: PROJECTS.filter((p) => p.caseStudy).length };
  for (const p of PROJECTS) {
    const c = CATEGORY_MAP[p.slug] ?? "other";
    counts[c] = (counts[c] ?? 0) + 1;
  }

  return (
    <>
      {/* Filter chips */}
      <div className="sticky top-0 z-10 -mx-px flex gap-1.5 overflow-x-auto border-b border-[var(--glass-border)] bg-[var(--surface)]/85 px-3 py-2 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => {
          const active = filter === c.id;
          const count = counts[c.id] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] transition ${
                active
                  ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/10 text-neon-cyan"
                  : "border-[var(--glass-border)] bg-[var(--surface-2)]/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-2">
        {filtered.map((p, i) => (
          <motion.article
            key={p.slug}
            id={`project-${p.slug}`}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.3) }}
            whileHover={{ y: -3 }}
            onClick={() => setOpenSlug(p.slug)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--glass-border)] bg-gradient-to-br from-[var(--surface-2)]/80 to-[var(--surface)]/60 transition hover:border-[var(--neon-cyan)]/40"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_circle_at_var(--mx,50%)_var(--my,0%),oklch(0.72_0.21_305/0.10),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />

            {p.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--glass-border)] bg-[var(--surface)]">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/80 via-transparent to-transparent" />
                <span
                  className="absolute right-2 top-2 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur"
                  style={{
                    borderColor: `color-mix(in oklab, var(--neon-${p.accent}) 40%, transparent)`,
                    color: `var(--neon-${p.accent})`,
                    background: `color-mix(in oklab, var(--neon-${p.accent}) 12%, transparent)`,
                  }}
                >
                  <span
                    className="mr-1 inline-block h-1.5 w-1.5 rounded-full pulse-dot align-middle"
                    style={{ background: `var(--neon-${p.accent})` }}
                  />
                  {p.status}
                </span>
              </div>
            )}

            <div className="p-4">
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                    <span>/projects/{p.slug}</span>
                    {p.region && <><span>·</span><span>{p.region}</span></>}
                  </div>
                  <h3 className="mt-0.5 truncate text-base font-semibold text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                </div>
                {!p.image && (
                  <span
                    className="shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                    style={{
                      borderColor: `color-mix(in oklab, var(--neon-${p.accent}) 40%, transparent)`,
                      color: `var(--neon-${p.accent})`,
                      background: `color-mix(in oklab, var(--neon-${p.accent}) 12%, transparent)`,
                    }}
                  >
                    <span
                      className="mr-1 inline-block h-1.5 w-1.5 rounded-full pulse-dot align-middle"
                      style={{ background: `var(--neon-${p.accent})` }}
                    />
                    {p.status}
                  </span>
                )}
              </header>

              {p.metrics && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {p.metrics.map((m) => (
                    <div key={m.k} className="rounded-lg border border-[var(--glass-border)] bg-[var(--surface)]/50 px-2.5 py-1.5">
                      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{m.k}</div>
                      <div className="font-mono text-sm tabular-nums text-foreground">{m.v}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-md border border-[var(--glass-border)] bg-[var(--surface-3)]/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>

              <footer className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  {p.uptime ? (
                    <>
                      <Activity className="h-3 w-3 text-neon-green" /> uptime <span className="text-foreground">{p.uptime}</span>
                    </>
                  ) : p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-neon-cyan hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> live
                    </a>
                  ) : (
                    <span className="opacity-70">portfolio piece</span>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 text-neon-cyan opacity-0 transition group-hover:opacity-100">
                  view details <ArrowRight className="h-3 w-3" />
                </span>
              </footer>
            </div>
          </motion.article>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpenSlug(null)}>
        <DialogContent className="max-w-3xl border-[var(--glass-border)] bg-[oklch(0.13_0.012_270/98%)] p-0 max-h-[88vh] overflow-y-auto">
          {open && (
            <div className="font-mono text-[13px]">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--glass-border)] bg-[oklch(0.13_0.012_270/98%)] px-5 py-3 backdrop-blur">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOpenSlug(null)}
                    aria-label="close"
                    className="group/close grid h-3 w-3 place-items-center rounded-full bg-[#ff5f57] transition hover:brightness-110"
                  >
                    <span className="text-[8px] font-bold leading-none text-black/70 opacity-0 group-hover/close:opacity-100">×</span>
                  </button>
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <DialogTitle className="text-[12px] font-normal text-foreground">
                  /projects/{open.slug}.md
                </DialogTitle>
                <span
                  className="ml-auto rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider"
                  style={{
                    borderColor: `color-mix(in oklab, var(--neon-${open.accent}) 40%, transparent)`,
                    color: `var(--neon-${open.accent})`,
                  }}
                >
                  ● {open.status}
                </span>
              </div>

              <div className="space-y-5 px-6 py-5">
                {open.image && (
                  <div className="overflow-hidden rounded-lg border border-[var(--glass-border)]">
                    <img src={open.image} alt={open.name} className="w-full object-cover" />
                  </div>
                )}

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground"># project</div>
                  <h2 className="mt-1 font-sans text-2xl font-semibold text-foreground">{open.name}</h2>
                  <p className="font-sans text-sm text-muted-foreground">{open.tagline}</p>
                  {open.caseStudy && <p className="mt-2 text-[11px] text-neon-cyan">{open.caseStudy.role}</p>}
                </div>

                {open.caseStudy && (
                  <>
                    <section>
                      <div className="mb-2 text-[10px] uppercase tracking-wider text-neon-purple">## problem</div>
                      <p className="font-sans text-sm leading-relaxed text-foreground/85">{open.caseStudy.problem}</p>
                    </section>

                    <section>
                      <div className="mb-2 text-[10px] uppercase tracking-wider text-neon-cyan">## solution</div>
                      <ul className="space-y-1.5">
                        {open.caseStudy.solution.map((s, i) => (
                          <li key={i} className="flex gap-2 font-sans text-sm leading-relaxed text-foreground/85">
                            <span className="mt-0.5 text-neon-green">▸</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <div className="mb-2 text-[10px] uppercase tracking-wider text-neon-green">## architecture</div>
                      <pre className="whitespace-pre-wrap rounded-lg border border-[var(--glass-border)] bg-[var(--surface-2)]/50 p-3 text-[12px] leading-relaxed text-foreground/80">
                        {open.caseStudy.architecture}
                      </pre>
                    </section>
                  </>
                )}

                <section>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">## stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {open.stack.map((s) => (
                      <span key={s} className="rounded-md border border-[var(--glass-border)] bg-[var(--surface-3)]/50 px-2 py-0.5 text-[11px] text-foreground/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>

                {open.caseStudy && (
                  <section>
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-neon-amber">## impact</div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {open.caseStudy.impact.map((m) => (
                        <div
                          key={m.k}
                          className="rounded-lg border border-[var(--glass-border)] bg-gradient-to-br from-[var(--surface-2)]/70 to-[var(--surface)]/40 p-3"
                        >
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{m.k}</div>
                          <div className="mt-0.5 text-lg tabular-nums text-foreground">{m.v}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4 text-[11px] text-muted-foreground">
                  <span>
                    {open.uptime && <>uptime <span className="text-foreground">{open.uptime}</span></>}
                    {open.uptime && open.region && " · "}
                    {open.region}
                  </span>
                  <div className="flex items-center gap-2">
                    {open.caseStudy && (
                      <a className="inline-flex items-center gap-1.5 rounded-md border border-[var(--glass-border)] px-2.5 py-1 hover:text-foreground" href="#" aria-label="github">
                        <Github className="h-3.5 w-3.5" /> repo
                      </a>
                    )}
                    {open.liveUrl && (
                      <a
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/[0.06] px-2.5 py-1 text-neon-cyan hover:bg-[var(--neon-cyan)]/[0.12]"
                        href={open.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="live"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
