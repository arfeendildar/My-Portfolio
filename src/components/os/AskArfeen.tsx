import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const SUGGESTIONS = [
  "What does Arfeen do?",
  "Show me his projects",
  "How can I hire him?",
];

export function AskArfeen() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm **Ask Arfeen** — ask me anything about Arfeen's work, projects, or how to hire him 🚀",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(textArg?: string) {
    const text = (textArg ?? input).trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    let assistantSoFar = "";
    let assistantAdded = false;
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        if (!assistantAdded) {
          assistantAdded = true;
          return [...prev, { role: "assistant", content: assistantSoFar }];
        }
        return prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
        );
      });
    };

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({ error: "Network error" }));
        if (resp.status === 429) toast.error("Rate limit hit — thori der baad try karein.");
        else if (resp.status === 402) toast.error("AI credits khatam — contact form use karein.");
        else toast.error(errBody.error || "Kuch ghalat ho gaya.");
        setMessages((prev) => prev.slice(0, -1));
        setLoading(false);
        return;
      }

      if (!resp.body) throw new Error("no body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) upsertAssistant(c);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error(e);
        toast.error("Connection issue — try again.");
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      {/* Trigger button — desktop bottom-right, mobile bottom-right ABOVE the menu button (which sits at bottom-5 right-5 mobile-only) */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Ask Arfeen" : "Ask Arfeen AI"}
        className={`fixed right-5 z-[60] flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-gradient-to-r from-[var(--neon-cyan)]/90 to-[var(--neon-purple)]/90 px-4 py-2.5 text-[12px] font-mono text-background shadow-lg shadow-[oklch(0.72_0.21_305/0.35)] backdrop-blur-xl transition active:scale-95 ${open ? "bottom-6 md:bottom-5" : "bottom-20 md:bottom-5"}`}
      >
        {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        <span>{open ? "Close" : "Ask Arfeen"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 flex h-[85vh] max-h-[640px] w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[oklch(0.13_0.012_270/98%)] shadow-2xl backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--surface-2)]/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)]">
                    <Sparkles className="h-4 w-4 text-background" />
                  </div>
                  <div>
                    <div className="font-mono text-[13px] text-foreground">Ask Arfeen</div>
                    <div className="font-mono text-[10px] text-neon-green">● online · AI assistant</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-[var(--surface-3)] hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-cyan)]/30 text-foreground"
                          : "border border-[var(--glass-border)] bg-[var(--surface-2)]/60 text-foreground/90"
                      }`}
                    >
                      <SimpleMarkdown text={m.content} />
                    </div>
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--surface-2)]/60 px-3 py-2">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan [animation-delay:240ms]" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={loading}
                      className="rounded-full border border-[var(--glass-border)] bg-[var(--surface-3)]/50 px-2.5 py-1 font-mono text-[10px] text-muted-foreground transition hover:border-[var(--neon-cyan)]/40 hover:text-foreground disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2 border-t border-[var(--glass-border)] bg-[var(--surface-2)]/60 p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  disabled={loading}
                  maxLength={500}
                  className="flex-1 rounded-lg border border-[var(--glass-border)] bg-[var(--surface-3)]/60 px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-muted-foreground focus:border-[var(--neon-cyan)]/50 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] text-background transition active:scale-95 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Tiny markdown: **bold**, line breaks, simple bullets
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const isBullet = /^[-*]\s+/.test(line);
        const content = line.replace(/^[-*]\s+/, "");
        const parts = content.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="text-neon-cyan">{p.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{p}</span>
          ),
        );
        return (
          <div key={i} className={isBullet ? "flex gap-2 pl-1" : ""}>
            {isBullet && <span className="text-neon-green">•</span>}
            <span>{rendered}</span>
          </div>
        );
      })}
    </div>
  );
}
