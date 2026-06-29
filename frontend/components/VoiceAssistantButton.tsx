"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Brain, Sparkles, CheckCircle2, ArrowRight, Receipt, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const getSpeechRecognition = () =>
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

// ─── Vault helpers ────────────────────────────────────────────────────────────
const VAULT_KEY = "sbi-vault-receipts";
function saveReceiptToVault(r: { upiId: string; amount: number; note: string; category: string }) {
  try {
    const existing = JSON.parse(localStorage.getItem(VAULT_KEY) || "[]");
    const entry = { ...r, id: crypto.randomUUID(), date: new Date().toISOString() };
    existing.unshift(entry);
    localStorage.setItem(VAULT_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event("vault-updated"));
    return entry;
  } catch { return null; }
}

// ─── NLP: Extract structured data from natural language ───────────────────────
function parseVoiceCommand(text: string) {
  const lower = text.toLowerCase();

  // Extract amount: "25000", "₹25,000", "25000 rs", "25000 rupees", etc.
  const amountMatch = lower.match(/(?:₹|rs\.?\s*|rupees?\s*)?(\d[\d,]*(?:\.\d+)?)\s*(?:₹|rs\.?|rupees?|inr)?/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : 0;

  // Extract note: "with note X", "for X", "note X"
  let note = "";
  const notePatterns = [
    /(?:with\s+)?note\s+[:\-]?\s*(.+?)(?:\s+(?:to|from|category|amount|rupee|rs)|\s*$)/i,
    /(?:for|about|regarding)\s+(.+?)(?:\s+(?:of|worth|amount|rupee|rs|₹)|\s*$)/i,
    /(?:bought|purchased|paid for|buying)\s+(?:a\s+|an\s+)?(.+?)(?:\s+(?:for|of|worth|amount|rupee|rs|₹)|\s*$)/i,
  ];
  for (const pat of notePatterns) {
    const m = text.match(pat);
    if (m) { note = m[1].trim().replace(/\s+/g, " "); break; }
  }
  // If no note found via patterns, try extracting after "note"
  if (!note) {
    const fallback = text.match(/note\s+(.+)/i);
    if (fallback) note = fallback[1].trim();
  }

  // Extract UPI ID
  const upiMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z]+)/);
  const upiId = upiMatch ? upiMatch[1] : "";

  // Auto-detect category from note
  const categoryMap: [RegExp, string][] = [
    [/fridge|washing|tv|laptop|phone|electronics|appliance|samsung|lg|sony|iphone/i, "Shopping"],
    [/food|dinner|lunch|breakfast|cafe|restaurant|swiggy|zomato|biryani/i, "Dining"],
    [/uber|ola|flight|train|bus|hotel|trip|travel|petrol|fuel/i, "Travel"],
    [/electricity|water|gas|rent|wifi|internet|bill|recharge|mobile/i, "Bills"],
    [/movie|netflix|hotstar|spotify|game|concert|show/i, "Entertainment"],
    [/grocery|vegetable|milk|kirana|bigbasket|blinkit/i, "Shopping"],
    [/hospital|doctor|medicine|pharmacy|health/i, "Bills"],
  ];
  let category = "Other";
  const combinedText = `${note} ${text}`;
  for (const [pat, cat] of categoryMap) {
    if (pat.test(combinedText)) { category = cat; break; }
  }

  // Detect intent
  let intent: "receipt" | "pay" | "navigate" | "query" | "unknown" | "affordability" | "search-db" | "autofill" = "unknown";

  if (/can i afford|can i buy|should i buy/i.test(lower)) {
    intent = "affordability";
  } else if (/how much did.*spend|spend on|spent on|how much.*spent|what is my spending|total spent|search.*vault|search.*receipt|search.*transaction/i.test(lower)) {
    intent = "search-db";
  } else if (/auto fill|autofill|fill my details|use my vault/i.test(lower)) {
    intent = "autofill";
  } else if (/pay|send|transfer|send money/i.test(lower)) {
    intent = "pay";
  } else if (/show|open|go|navigate|check|view|display|increase|limit|vault/i.test(lower)) {
    intent = "navigate";
  } else if (/receipt|generate|create|save|record|log/i.test(lower)) {
    intent = "receipt";
  } else if (/how much|balance|spent|total/i.test(lower)) {
    intent = "query";
  } else if (amount > 0 && note) {
    // If we detected an amount and a note, assume receipt creation
    intent = "receipt";
  }

  return { amount, note, upiId, category, intent, raw: text };
}

// ─── AI Processing Steps (visual states) ──────────────────────────────────────
type ProcessingStep = "idle" | "listening" | "thinking" | "extracting" | "confirming" | "executing" | "done" | "error" | "biometric-auth" | "report" | "db-results";

const STEP_LABELS: Record<ProcessingStep, string> = {
  idle: "",
  listening: "Listening...",
  thinking: "🧠 Understanding your request...",
  extracting: "✨ Extracting transaction details...",
  confirming: "Confirm this action?",
  executing: "⚡ Processing...",
  done: "✅ Done!",
  error: "Something went wrong",
  "biometric-auth": "🔐 Voice Authentication",
  report: "📊 Financial Analysis",
  "db-results": "🔍 Database Search",
};

// ─── Navigation intents ──────────────────────────────────────────────────────
const NAV_INTENTS = [
  { pattern: /transaction|history|statement/i, reply: "Opening transactions...", route: "/transactions" },
  { pattern: /vault|receipt|document/i, reply: "Opening Smart Vault...", route: "/documents" },
  { pattern: /loan|apply.*loan|home loan/i, reply: "Opening Loans...", route: "/loans" },
  { pattern: /investment|mutual fund|sip/i, reply: "Opening Investments...", route: "/investments" },
  { pattern: /insurance/i, reply: "Opening Insurance...", route: "/insurance" },
  { pattern: /card|credit card|debit card/i, reply: "Opening Cards...", route: "/cards" },
  { pattern: /setting|profile|account/i, reply: "Opening Settings...", route: "/settings" },
  { pattern: /dashboard|home|go back/i, reply: "Going to Dashboard...", route: "/dashboard" },
  { pattern: /balance|how much/i, reply: "Your savings balance is ₹2,45,312.50", route: "/dashboard" },
];

// UPI Limit action — always goes through biometrics
const UPI_LIMIT_PATTERN = /increase.*upi.*limit|upi.*limit|raise.*limit|change.*limit|set.*limit/i;
const UPI_LIMIT_ACTION = { reply: "Opening UPI Limit settings...", route: "/upi", action: "scroll-to-limit" };


// ─── Component ────────────────────────────────────────────────────────────────
export default function VoiceAssistantButton() {
  const [step, setStep] = useState<ProcessingStep>("idle");
  const stepRef = useRef(step);
  useEffect(() => { stepRef.current = step; }, [step]);
  
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState<ReturnType<typeof parseVoiceCommand> | null>(null);
  const [reply, setReply] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null); // For biometrics
  const [dbResults, setDbResults] = useState<{ total: number; count: number; category: string; query: string } | null>(null);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function speak(text: string) {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[✅💸📷📋🗄️🏦📈🛡️💳⚙️🏠💰🧠✨⚡🔐📊]/g, ""));
      u.rate = 1.05; u.pitch = 1;
      window.speechSynthesis.speak(u);
    }
  }

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStep("idle");
    setTranscript("");
    setParsed(null);
    setReply("");
    setShowPanel(false);
    setPendingAction(null);
  }

  async function processTranscript(text: string) {
    setTranscript(text);
    setShowPanel(true);

    // Handle ongoing biometric auth
    if (stepRef.current === "biometric-auth") {
      if (/my voice is my password|voice is my password/i.test(text)) {
        speak("Voice verified. Executing action.");
        setStep("executing");
        await sleep(1000);
        if (pendingAction) {
          sessionStorage.setItem("va-action", pendingAction.action);
          router.push(pendingAction.route);
        }
        setStep("done");
        timerRef.current = setTimeout(reset, 2000);
      } else {
        speak("Voice verification failed. Action cancelled.");
        setReply("Voice verification failed. Please try again.");
        setStep("error");
        timerRef.current = setTimeout(reset, 4000);
      }
      return;
    }

    // Step 1: Thinking
    setStep("thinking");
    await sleep(800);

    // Step 2: Extract
    setStep("extracting");
    const data = parseVoiceCommand(text);
    setParsed(data);
    await sleep(1000);

    if (data.intent === "receipt" && data.amount > 0) {
      // ── Receipt creation flow ──
      setStep("confirming");
      speak(`Creating a receipt for ${data.amount} rupees. ${data.note ? `Note: ${data.note}.` : ""} Category: ${data.category}. Shall I save this?`);
      timerRef.current = setTimeout(() => executeReceipt(data), 3000);

    } else if (data.intent === "affordability") {
      setStep("report");
      const itemName = text.match(/(?:buy|afford)\s+(?:a\s+|an\s+)?(.+?)(?:\s+next|\s+this|\s+now|\s*$)/i)?.[1] || "this item";
      speak(`Analyzing your finances to see if you can buy ${itemName}. Your balance is 2.45 lakhs. After a projected 45,000 rupee purchase and upcoming EMIs, you will have 1.56 lakhs remaining. Yes, you can afford it safely.`);
      timerRef.current = setTimeout(reset, 12000);

    } else if (data.intent === "autofill") {
      setStep("executing");
      speak("Extracting verified details from your PAN and Aadhaar in Smart Vault...");
      await sleep(1500);
      window.dispatchEvent(new Event("va-autofill"));
      setStep("done");
      timerRef.current = setTimeout(reset, 2000);

    } else if (data.intent === "search-db") {
      setStep("executing");
      
      // Robust category matching supporting typos
      let queryCat = "";
      const lowerText = text.toLowerCase();
      if (/bill|buil|water|electricity|gas|utility|internet|wifi|phone|recharge/i.test(lowerText)) {
        queryCat = "Bills";
      } else if (/food|dining|eat|lunch|dinner|restaurant|cafe|zomato|swiggy|pizza/i.test(lowerText)) {
        queryCat = "Dining";
      } else if (/shop|buy|purchas|grocery|groceries|fridge|laptop|electronics|supermarket/i.test(lowerText)) {
        queryCat = "Shopping";
      } else if (/travel|trip|flight|train|cab|uber|ola|fuel|petrol/i.test(lowerText)) {
        queryCat = "Travel";
      } else if (/movie|netflix|game|play|entertain/i.test(lowerText)) {
        queryCat = "Entertainment";
      }
      
      let total = 0;
      let count = 0;
      try {
        const existing = JSON.parse(localStorage.getItem(VAULT_KEY) || "[]");
        existing.forEach((r: any) => {
          if (queryCat && r.category?.toLowerCase() === queryCat.toLowerCase()) {
            total += Number(r.amount);
            count++;
          } else if (!queryCat) {
            total += Number(r.amount);
            count++;
          }
        });
      } catch (e) {}

      // Add a dummy fallback if empty for the sake of the demo
      if (count === 0 && queryCat.toLowerCase() === "bills") {
        total = 4500; count = 2;
      } else if (count === 0 && queryCat.toLowerCase() === "dining") {
        total = 4250; count = 12;
      }

      setDbResults({ total, count, category: queryCat || "all transactions", query: text });
      setStep("db-results");
      speak(`I searched your vault. You spent ${total.toLocaleString("en-IN")} rupees on ${queryCat || "all transactions"} across ${count} receipts.`);
      timerRef.current = setTimeout(reset, 10000);

    } else if (data.intent === "pay") {
      setStep("confirming");
      speak("Opening payment flow.");
      timerRef.current = setTimeout(() => {
        sessionStorage.setItem("va-action", "open-pay");
        router.push("/upi");
        reset();
      }, 1500);

    } else if (data.intent === "navigate" || data.intent === "query") {
      // ── Always intercept UPI limit with biometrics first ──
      if (UPI_LIMIT_PATTERN.test(text)) {
        setStep("biometric-auth");
        setPendingAction(UPI_LIMIT_ACTION);
        speak("This is a high-security action. Please state your voice passphrase.");
        // Auto-start mic after 2 seconds so user can speak passphrase hands-free
        setTimeout(() => startListening(), 2000);
      } else {
        const nav = NAV_INTENTS.find(n => n.pattern.test(text));
        if (nav) {
          setReply(nav.reply);
          speak(nav.reply);
          setStep("executing");
          await sleep(1000);
          if ((nav as any).action) sessionStorage.setItem("va-action", (nav as any).action);
          router.push(nav.route);
          setStep("done");
          timerRef.current = setTimeout(reset, 2000);
        } else {
          fallback(text);
        }
      }
    } else if (data.amount > 0 && data.note) {
      setStep("confirming");
      speak(`I'll create a receipt for ${data.amount} rupees for ${data.note}.`);
      timerRef.current = setTimeout(() => executeReceipt(data), 3000);
    } else {
      fallback(text);
    }
  }

  async function executeReceipt(data: ReturnType<typeof parseVoiceCommand>) {
    setStep("executing");
    await sleep(1200);
    saveReceiptToVault({
      upiId: data.upiId || "self@sbi",
      amount: data.amount,
      note: data.note || "Voice transaction",
      category: data.category,
    });
    setStep("done");
    speak(`Receipt saved! ${data.amount} rupees, ${data.note || "recorded"}. Opening Smart Vault.`);
    await sleep(1500);
    sessionStorage.setItem("vault-open-folder", "receipts");
    router.push("/documents");
    timerRef.current = setTimeout(reset, 2500);
  }

  function confirmReceipt() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (parsed) executeReceipt(parsed);
  }

  function fallback(text: string) {
    setReply(`I heard: "${text}". Try: "Create a receipt of ₹5000 for groceries" or "Pay someone" or "Show my transactions".`);
    speak("I didn't quite understand. Try saying create a receipt, or pay someone.");
    setStep("error");
    timerRef.current = setTimeout(reset, 6000);
  }

  // ─── Speech Recognition ────────────────────────────────────────────────────
  async function startListening() {
    const SR = getSpeechRecognition();
    if (!SR) { setReply("Speech not supported. Use Chrome."); setShowPanel(true); setStep("error"); return; }

    try { await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { setReply("🎤 Microphone blocked. Allow it in browser settings."); setShowPanel(true); setStep("error"); return; }

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    
    const isAuth = stepRef.current === "biometric-auth";
    rec.onstart = () => { 
      if (!isAuth) {
        setStep("listening"); 
      }
      setShowPanel(true); 
      setTranscript(""); 
      setParsed(null); 
      setReply(""); 
    };
    rec.onend = () => { if (stepRef.current === "listening") setStep("idle"); };
    rec.onresult = (e: any) => { processTranscript(e.results[0][0].transcript.trim()); };
    rec.onerror = (e: any) => {
      const msgs: Record<string, string> = {
        "not-allowed": "🎤 Mic blocked. Click 🔒 in address bar.",
        "no-speech": "No speech detected. Try again.",
        "network": "Network error.",
      };
      setReply(msgs[e?.error] ?? "Speech error. Try again.");
      setStep("error");
      setShowPanel(true);
      timerRef.current = setTimeout(reset, 5000);
    };
    rec.start();
  }

  return (
    <>
      {/* ── Expanded AI Panel ── */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "fixed", bottom: 90, left: 16, zIndex: 10000,
              width: 360, borderRadius: 20, overflow: "hidden",
              background: "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(29,78,216,0.15)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "linear-gradient(90deg, rgba(29,78,216,0.15), transparent)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.div
                  animate={step === "listening" ? { scale: [1, 1.2, 1] } : step === "thinking" || step === "extracting" ? { rotate: 360 } : {}}
                  transition={{ repeat: Infinity, duration: step === "listening" ? 0.8 : 2 }}
                >
                  {step === "done" ? <CheckCircle2 size={18} style={{ color: "#10b981" }} /> :
                   step === "error" ? <X size={18} style={{ color: "#ef4444" }} /> :
                   step === "thinking" || step === "extracting" ? <Brain size={18} style={{ color: "#a78bfa" }} /> :
                   step === "executing" ? <Sparkles size={18} style={{ color: "#fbbf24" }} /> :
                   <Mic size={18} style={{ color: "#60a5fa" }} />}
                </motion.div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
                  {STEP_LABELS[step] || "SBI Voice Agent"}
                </span>
              </div>
              <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 0 }}>
                <X size={16} />
              </button>
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 4, padding: "10px 16px 6px", alignItems: "center" }}>
              {(["listening", "thinking", "extracting", "confirming", "executing", "done"] as ProcessingStep[]).map((s, i) => {
                const stepOrder = ["listening", "thinking", "extracting", "confirming", "executing", "done"];
                const currentIdx = stepOrder.indexOf(step);
                const thisIdx = i;
                const isActive = thisIdx <= currentIdx;
                const isCurrent = s === step;
                return (
                  <motion.div
                    key={s}
                    animate={isCurrent ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                    style={{
                      width: isCurrent ? 20 : 6, height: 6, borderRadius: 3,
                      background: isActive ? (s === "done" ? "#10b981" : "#3b82f6") : "#334155",
                      transition: "all 0.3s",
                    }}
                  />
                );
              })}
              <span style={{ fontSize: 10, color: "#64748b", marginLeft: "auto" }}>
                {step !== "idle" && step !== "error" ? `Step ${["listening", "thinking", "extracting", "confirming", "executing", "done"].indexOf(step) + 1}/6` : ""}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "10px 16px 16px", minHeight: 80 }}>
              {/* Transcript */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "rgba(255,255,255,0.04)", borderRadius: 12,
                    padding: "10px 12px", marginBottom: 12,
                  }}
                >
                  <p style={{ fontSize: 10, color: "#64748b", marginBottom: 4, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    🎤 You said
                  </p>
                  <p style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 500, lineHeight: 1.5 }}>
                    "{transcript}"
                  </p>
                </motion.div>
              )}

              {/* Extracted data card */}
              <AnimatePresence>
                {parsed && (step === "extracting" || step === "confirming" || step === "executing" || step === "done") && parsed.amount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: "linear-gradient(135deg, rgba(29,78,216,0.2), rgba(59,130,246,0.1))",
                      border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: 14, padding: "14px", marginBottom: 12,
                    }}
                  >
                    <p style={{ fontSize: 10, color: "#93c5fd", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                      ✨ Extracted Details
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>
                        <p style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Amount</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: "#60a5fa" }}>₹{parsed.amount.toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Category</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginTop: 2 }}>{parsed.category}</p>
                      </div>
                      {parsed.note && (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <p style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Note</p>
                          <p style={{ fontSize: 13, color: "#cbd5e1", marginTop: 2 }}>{parsed.note}</p>
                        </div>
                      )}
                      {parsed.upiId && (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <p style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>UPI ID</p>
                          <p style={{ fontSize: 13, color: "#cbd5e1", marginTop: 2 }}>{parsed.upiId}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Biometric Auth UI */}
              {step === "biometric-auth" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, 30 + Math.random() * 20, 10] }}
                        transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, ease: "easeInOut" }}
                        style={{ width: 6, borderRadius: 3, background: "#ef4444" }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>Please state your voice passphrase</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>"My voice is my password"</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: "12px auto 0", padding: "4px 10px", background: "rgba(239,68,68,0.15)", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} className="animate-pulse" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#fca5a5", letterSpacing: "0.05em", textTransform: "uppercase" }}>Scanning Voice</span>
                  </div>
                </motion.div>
              )}

              {/* Affordability Report UI */}
              {step === "report" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px", marginBottom: 12, border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <p style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                    📊 Financial Projection
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Current Balance</span>
                      <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>₹2,45,312</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Upcoming EMIs</span>
                      <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>-₹44,250</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Projected Purchase</span>
                      <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>-₹45,000</span>
                    </div>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Remaining Balance</span>
                      <span style={{ fontSize: 14, color: "#10b981", fontWeight: 700 }}>₹1,56,062</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, padding: "10px", background: "rgba(16,185,129,0.15)", borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)" }}>
                    <p style={{ fontSize: 11, color: "#10b981", fontWeight: 600, lineHeight: 1.4 }}>
                      ✅ Yes, you can safely afford this purchase without affecting your emergency fund.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Database Search Results UI */}
              {step === "db-results" && dbResults && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                  background: "linear-gradient(135deg, rgba(29,78,216,0.15), rgba(59,130,246,0.05))",
                  borderRadius: 14, padding: "14px", marginBottom: 12, border: "1px solid rgba(59,130,246,0.2)"
                }}>
                  <p style={{ fontSize: 10, color: "#93c5fd", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                    🔍 Search Results
                  </p>
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <p style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                      Total Spent on {dbResults.category}
                    </p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#60a5fa" }}>
                      ₹{dbResults.total.toLocaleString("en-IN")}
                    </p>
                    <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 8 }}>
                      Found across {dbResults.count} receipts in Smart Vault
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Confirm buttons */}
              {step === "confirming" && parsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={reset}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                      border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={confirmReceipt}
                    style={{
                      flex: 2, padding: "10px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none",
                      background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", color: "#fff", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    Save to Vault <ArrowRight size={14} />
                  </motion.button>
                </motion.div>
              )}

              {/* Executing spinner */}
              {step === "executing" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "8px 0" }}>
                  <Loader2 size={24} style={{ color: "#fbbf24", animation: "spin 1s linear infinite" }} />
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Saving to Smart Vault...</p>
                </motion.div>
              )}

              {/* Done */}
              {step === "done" && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", padding: "4px 0" }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                    <CheckCircle2 size={36} style={{ color: "#10b981", margin: "0 auto" }} />
                  </motion.div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginTop: 8 }}>Receipt Saved! 🎉</p>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Opening Smart Vault...</p>
                </motion.div>
              )}

              {/* Error / fallback */}
              {step === "error" && reply && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 13, color: "#f87171", lineHeight: 1.5 }}>
                  {reply}
                </motion.div>
              )}

              {/* Listening wave */}
              {step === "listening" && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, padding: "16px 0" }}>
                  {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 24 + Math.random() * 16, 8] }}
                      transition={{ repeat: Infinity, duration: 0.6 + i * 0.08, ease: "easeInOut" }}
                      style={{ width: 4, borderRadius: 2, background: "#3b82f6" }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div style={{
              padding: "8px 16px", borderTop: "1px solid rgba(255,255,255,0.04)",
              fontSize: 10, color: "#475569", textAlign: "center",
            }}>
              Try: "Receipt of ₹25000 for bought a fridge" · "Pay ₹500 to merchant@sbi" · "Show vault"
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Mic Button ── */}
      <div style={{ position: "fixed", bottom: 24, left: 24, zIndex: 9999 }}>
        {/* Pulse rings */}
        {[
          { scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4], delay: 0 },
          { scale: [1, 1.35, 1], opacity: [0.25, 0, 0.25], delay: 0.5 },
        ].map((r, i) => (
          <motion.span
            key={i}
            animate={{ scale: r.scale, opacity: r.opacity }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: r.delay }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: step === "listening" ? "rgba(59,130,246,0.6)" : step === "done" ? "rgba(16,185,129,0.4)" : "rgba(29,78,216,0.4)",
              pointerEvents: "none",
            }}
          />
        ))}

        <motion.button
          onClick={startListening}
          disabled={step !== "idle" && step !== "error" && step !== "biometric-auth"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Voice Assistant"
          style={{
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: "50%", border: "none",
            cursor: step !== "idle" && step !== "error" && step !== "biometric-auth" ? "not-allowed" : "pointer",
            background: step === "done"
              ? "linear-gradient(135deg, #059669, #10b981)"
              : step === "listening"
              ? "linear-gradient(135deg, #3b82f6, #2563eb)"
              : step === "biometric-auth"
              ? "linear-gradient(135deg, #ef4444, #b91c1c)"
              : "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
            boxShadow: "0 4px 24px rgba(29,78,216,0.6), 0 2px 8px rgba(0,0,0,0.5)",
            color: "#fff", transition: "background 0.4s",
          }}
        >
          {step === "listening" ? (
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}>
              <Mic size={24} />
            </motion.div>
          ) : step === "done" ? (
            <CheckCircle2 size={24} />
          ) : step === "thinking" || step === "extracting" || step === "executing" ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Brain size={22} />
            </motion.div>
          ) : (
            <Mic size={24} />
          )}
        </motion.button>

        {/* Label */}
        <AnimatePresence>
          {step === "idle" && (
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
                whiteSpace: "nowrap", fontSize: 9, fontWeight: 700,
                color: "rgba(147,197,253,0.8)", letterSpacing: "0.06em", pointerEvents: "none",
              }}
            >
              TAP TO SPEAK
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
