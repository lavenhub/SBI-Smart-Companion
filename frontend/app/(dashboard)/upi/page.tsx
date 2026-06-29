"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, QrCode, ScanLine, Send,
  TrendingUp, Clock, Lock, RefreshCcw,
  CheckCircle2, AlertCircle, ChevronRight, X,
  Upload, IndianRupee, ArrowRight, Loader2, Tag,
} from "lucide-react";
import { transactions } from "@/lib/data";
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils";

// Vault helpers (inline to avoid cross-module import issues)
const VAULT_KEY = "sbi-vault-receipts";
function saveReceiptToVault(r: { upiId: string; amount: number; note: string; category: string }) {
  try {
    const existing = JSON.parse(localStorage.getItem(VAULT_KEY) || "[]");
    const entry = { ...r, id: crypto.randomUUID(), date: new Date().toISOString() };
    existing.unshift(entry);
    localStorage.setItem(VAULT_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event("vault-updated"));
  } catch {}
}

const CATEGORIES = ["Dining", "Shopping", "Travel", "Bills", "Entertainment", "Other"];

const upiTxns = transactions.filter((t) => t.paymentMethod === "UPI");

// ─── Pay Modal ────────────────────────────────────────────────────────────────
function PayModal({ mode, onClose }: { mode: "pay" | "receive" | "scan"; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const va = sessionStorage.getItem("va-action");
    if (va === "open-pay") sessionStorage.removeItem("va-action");
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    // ✅ Save receipt to Smart Vault
    saveReceiptToVault({ upiId, amount: Number(amount), note, category });
    setLoading(false);
    setStep("success");
  };

  const titles: Record<string, string> = {
    pay: "Send Money",
    receive: "Receive Money",
    scan: "Scan & Pay QR",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10001,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420, borderRadius: 24,
          background: "var(--bg-secondary, #1a1f2e)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          padding: 28, position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary,#888)" }}
        >
          <X size={20} />
        </button>

        {step === "form" && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>{titles[mode]}</h2>

            {mode === "scan" && (
              <div
                style={{
                  border: "2px dashed rgba(29,78,216,0.4)", borderRadius: 16,
                  height: 140, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8,
                  cursor: "pointer", marginBottom: 20, background: "rgba(29,78,216,0.05)",
                }}
              >
                <Upload size={28} style={{ color: "#1d4ed8" }} />
                <p style={{ fontSize: 13, color: "#6b7280" }}>Upload / drag QR image here</p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>PNG, JPG supported</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode !== "receive" && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {mode === "scan" ? "Detected UPI ID" : "To (UPI ID / Phone)"}
                  </label>
                  <input
                    type="text"
                    placeholder={mode === "scan" ? "Auto-detected from QR..." : "e.g. merchant@sbi"}
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{
                      width: "100%", marginTop: 6, padding: "10px 14px", borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)",
                      color: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              )}

              {mode === "receive" && (
                <div style={{
                  textAlign: "center", padding: "20px", borderRadius: 16,
                  background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
                }}>
                  <QrCode size={80} style={{ color: "#fff", margin: "0 auto" }} />
                  <p style={{ color: "#bfdbfe", fontSize: 12, marginTop: 8 }}>Your UPI ID: lavish@sbi</p>
                  <p style={{ color: "#fff", fontSize: 11, marginTop: 4 }}>Share this QR to receive money</p>
                </div>
              )}

              {mode !== "receive" && (
                <>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Amount (₹)</label>
                    <div style={{ position: "relative", marginTop: 6 }}>
                      <IndianRupee size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{
                          width: "100%", padding: "10px 14px 10px 32px", borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)",
                          color: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Note (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dinner split, Rent..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      style={{
                        width: "100%", marginTop: 6, padding: "10px 14px", borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)",
                        color: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{
                        width: "100%", marginTop: 6, padding: "10px 14px", borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)",
                        color: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box",
                        appearance: "none"
                      }}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} style={{ color: "black" }}>{c}</option>)}
                    </select>
                  </div>

                  {/* Quick amounts */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[100, 250, 500, 1000, 2500].map(q => (
                      <button
                        key={q}
                        onClick={() => setAmount(String(q))}
                        style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                          border: "1px solid rgba(29,78,216,0.4)", background: amount === String(q) ? "rgba(29,78,216,0.3)" : "transparent",
                          color: "#60a5fa", cursor: "pointer",
                        }}
                      >
                        ₹{q}
                      </button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    disabled={!upiId || !amount}
                    onClick={() => setStep("confirm")}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 14, border: "none",
                      background: !upiId || !amount ? "#374151" : "linear-gradient(135deg,#1d4ed8,#1e3a8a)",
                      color: "#fff", fontSize: 14, fontWeight: 700, cursor: !upiId || !amount ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4,
                    }}
                  >
                    Review Payment <ArrowRight size={16} />
                  </motion.button>
                </>
              )}
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Confirm Payment</h2>
            <div style={{
              background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 20,
              display: "flex", flexDirection: "column", gap: 12, marginBottom: 24,
            }}>
              {[
                { label: "To", val: upiId },
                { label: "Amount", val: `₹${Number(amount).toLocaleString("en-IN")}` },
                { label: "Note", val: note || "—" },
                { label: "From", val: "SBI Savings — XXXX 4821" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#6b7280" }}>{r.label}</span>
                  <span style={{ fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep("form")} style={{
                flex: 1, padding: "12px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
                Edit
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  flex: 2, padding: "12px", borderRadius: 14, border: "none",
                  background: "linear-gradient(135deg,#1d4ed8,#1e3a8a)", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Pay Now <Send size={14} /></>}
              </motion.button>
            </div>
          </>
        )}

        {step === "success" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 size={72} style={{ color: "#10b981", margin: "0 auto" }} />
            </motion.div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 16 }}>Payment Successful! 🎉</h2>
            <p style={{ color: "#6b7280", marginTop: 8, fontSize: 14 }}>
              ₹{Number(amount).toLocaleString("en-IN")} sent to <strong>{upiId}</strong>
            </p>
            <p style={{ color: "#4b5563", fontSize: 12, marginTop: 4 }}>
              Receipt saved to Smart Vault automatically.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                marginTop: 24, padding: "12px 32px", borderRadius: 14, border: "none",
                background: "linear-gradient(135deg,#1d4ed8,#1e3a8a)", color: "#fff",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >
              Done
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Limit Increase Modal ─────────────────────────────────────────────────────
function LimitModal({ onClose }: { onClose: () => void }) {
  const [limit, setLimit] = useState(100000);
  const [done, setDone] = useState(false);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 420, borderRadius: 24, background: "var(--bg-secondary, #1a1f2e)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", padding: 28, position: "relative" }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary,#888)" }}>
          <X size={20} />
        </button>

        {!done ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Increase UPI Daily Limit</h2>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>Current limit: ₹1,00,000 / day</p>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>New Daily Limit</label>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, marginBottom: 8 }}>
              <input
                type="range" min={100000} max={1000000} step={50000}
                value={limit} onChange={(e) => setLimit(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#1d4ed8" }}
              />
              <span style={{ fontSize: 18, fontWeight: 700, color: "#60a5fa", minWidth: 80, textAlign: "right" }}>
                ₹{(limit / 100000).toFixed(1)}L
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#4b5563", marginBottom: 24 }}>Maximum allowed: ₹10,00,000 / day</p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setDone(true)}
              style={{ width: "100%", padding: "13px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#1d4ed8,#1e3a8a)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Request Limit Increase
            </motion.button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <CheckCircle2 size={64} style={{ color: "#10b981", margin: "0 auto" }} />
            </motion.div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 14 }}>Request Submitted! ✅</h2>
            <p style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>Your new limit of ₹{(limit / 100000).toFixed(1)}L/day will be active within 24 hours.</p>
            <button onClick={onClose} style={{ marginTop: 20, padding: "11px 28px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#1d4ed8,#1e3a8a)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UPIPage() {
  const [modal, setModal] = useState<"pay" | "receive" | "scan" | "limit" | null>(null);

  // Check if voice assistant triggered an action
  useEffect(() => {
    const va = sessionStorage.getItem("va-action");
    if (va === "open-pay") {
      setModal("pay");
      sessionStorage.removeItem("va-action");
    } else if (va === "scroll-to-limit") {
      setModal("limit");
      sessionStorage.removeItem("va-action");
    }
  }, []);

  const actions = [
    { label: "Pay", mode: "pay" as const },
    { label: "Receive", mode: "receive" as const },
    { label: "Scan QR", mode: "scan" as const },
    { label: "UPI PIN", mode: null },
    { label: "Limits", mode: "limit" as const },
  ];

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">UPI</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Unified Payments Interface</p>
      </div>

      {/* UPI ID Card */}
      <div className="card p-6 gradient-sbi text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-wide">Your UPI ID</p>
              <p className="text-3xl font-bold mt-1">lavish@sbi</p>
              <p className="text-blue-200 text-sm mt-1">Linked to SBI Savings — XXXX 4821</p>
            </div>
            <div className="bg-white rounded-2xl p-4">
              <QrCode size={60} className="text-[var(--sbi-blue)]" />
              <p className="text-[9px] text-[var(--text-tertiary)] text-center mt-1">Scan to Pay</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            {actions.map((a) => (
              <motion.button
                key={a.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => a.mode && setModal(a.mode)}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm"
              >
                {a.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Limit */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-3">UPI Daily Limit</h3>
          <div className="space-y-2">
            {[
              { label: "Per Transaction", limit: 100000, used: 15499 },
              { label: "Daily Limit", limit: 100000, used: 25000 },
            ].map((l) => (
              <div key={l.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-tertiary)]">{l.label}</span>
                  <span className="font-medium">{formatCurrency(l.used)} / {formatCurrency(l.limit)}</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(l.used / l.limit) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-[var(--sbi-blue)]" />
                </div>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setModal("limit")}
              className="w-full mt-2 py-2 rounded-xl text-xs font-medium gradient-sbi text-white flex items-center justify-center gap-1.5"
            >
              <TrendingUp size={12} /> Increase Limit
            </motion.button>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-3">Linked Accounts</h3>
          <div className="space-y-2">
            {[
              { name: "SBI Savings", number: "XXXX 4821", primary: true },
              { name: "SBI Current", number: "XXXX 9302", primary: false },
            ].map((acc) => (
              <div key={acc.number} className={cn("flex items-center gap-3 p-2.5 rounded-xl", acc.primary ? "bg-[var(--sbi-cyan-light)]" : "bg-[var(--bg-tertiary)]")}>
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", acc.primary ? "bg-[var(--sbi-blue)] text-white" : "bg-white text-[var(--text-tertiary)]")}>
                  <Smartphone size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">{acc.name}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)]">{acc.number}</p>
                </div>
                {acc.primary && <span className="text-[10px] bg-[var(--sbi-blue)] text-white px-1.5 py-0.5 rounded-full font-bold">Primary</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-3">Security</h3>
          <div className="space-y-2">
            {[
              { label: "UPI PIN", status: "Set", icon: Lock, ok: true },
              { label: "2FA Enabled", status: "Active", icon: CheckCircle2, ok: true },
              { label: "Fraud Detection", status: "Active", icon: AlertCircle, ok: true },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", s.ok ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500")}>
                    <Icon size={13} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{s.label}</p>
                  </div>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", s.ok ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500")}>
                    {s.status}
                  </span>
                </div>
              );
            })}
            <button className="w-full text-xs text-[var(--sbi-blue)] font-medium flex items-center justify-center gap-1 mt-1 hover:underline">
              <RefreshCcw size={11} /> Change UPI PIN
            </button>
          </div>
        </div>
      </div>

      {/* UPI Transactions */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Recent UPI Transactions</h3>
          <button className="text-xs text-[var(--sbi-blue)] font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-2">
          {upiTxns.map((txn) => (
            <motion.div key={txn.id} whileHover={{ x: 2 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-sm",
                txn.type === "credit" ? "bg-emerald-100 text-emerald-600" : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]")}>
                {txn.type === "credit" ? "↓" : "↑"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{txn.description}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{formatRelativeTime(txn.date)} · {txn.ref}</p>
              </div>
              <span className={cn("font-semibold text-sm", txn.type === "credit" ? "text-emerald-600" : "")}>
                {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(modal === "pay" || modal === "receive" || modal === "scan") && (
          <PayModal mode={modal} onClose={() => setModal(null)} />
        )}
        {modal === "limit" && <LimitModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
