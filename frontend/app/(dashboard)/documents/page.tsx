"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder, FileText, Search, Plus,
  Download, Eye, Clock, Shield,
  CheckCircle2, ShoppingBag, Receipt,
  ChevronRight, ArrowLeft, QrCode,
  IndianRupee, Tag, StickyNote, Trash2,
  CreditCard, Home, MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface VaultReceipt {
  id: string;
  upiId: string;
  amount: number;
  note: string;
  category: string;
  date: string; // ISO
}

export const VAULT_KEY = "sbi-vault-receipts";

export function loadReceipts(): VaultReceipt[] {
  try {
    return JSON.parse(localStorage.getItem(VAULT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveReceipt(r: Omit<VaultReceipt, "id" | "date">): VaultReceipt {
  const receipts = loadReceipts();
  const entry: VaultReceipt = { ...r, id: crypto.randomUUID(), date: new Date().toISOString() };
  receipts.unshift(entry);
  localStorage.setItem(VAULT_KEY, JSON.stringify(receipts));
  return entry;
}

// ─── Mock seed folders (static) ───────────────────────────────────────────────
const STATIC_FOLDERS = [
  { id: "receipts", name: "Receipts", icon: Receipt, color: "#1d4ed8", desc: "UPI & payment receipts" },
  { id: "personal", name: "Personal Documents", icon: FileText, color: "#10b981", desc: "KYC & Identity docs" },
  { id: "insurance", name: "Insurance", icon: Shield, color: "#059669", desc: "Policy documents" },
  { id: "purchases", name: "Purchases", icon: ShoppingBag, color: "#d97706", desc: "Shopping receipts & warranties" },
  { id: "loans", name: "Loan Documents", icon: Home, color: "#7c3aed", desc: "Loan application documents" },
  { id: "cards", name: "Card Documents", icon: CreditCard, color: "#db2777", desc: "Card statements" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Dining: "#f59e0b",
  Shopping: "#10b981",
  Travel: "#3b82f6",
  Bills: "#8b5cf6",
  Entertainment: "#ec4899",
  Other: "#6b7280",
};

// ─── Receipt Detail Panel ─────────────────────────────────────────────────────
function ReceiptCard({ r, onDelete }: { r: VaultReceipt; onDelete: () => void }) {
  const catColor = CATEGORY_COLORS[r.category] || "#6b7280";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 flex gap-4 hover:shadow-lg transition-all group"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${catColor}18`, color: catColor }}
      >
        <QrCode size={22} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm truncate">{r.note || "UPI Payment"}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{r.upiId}</p>
          </div>
          <span className="text-base font-bold flex-shrink-0" style={{ color: catColor }}>
            −₹{r.amount.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${catColor}18`, color: catColor }}>
            <Tag size={9} /> {r.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
            <Clock size={9} /> {new Date(r.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </span>
          {r.note && (
            <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
              <StickyNote size={9} /> {r.note}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
          title="Delete receipt"
        >
          <Trash2 size={14} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] transition-colors" title="Download">
          <Download size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SmartVaultPage() {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [receipts, setReceipts] = useState<VaultReceipt[]>([]);
  const [personalDocs, setPersonalDocs] = useState<{name: string, date: string, id: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = import("react").then(React => React.createRef<HTMLInputElement>()).catch(() => null) as any;

  // Reload receipts whenever receipts folder is opened or when page mounts
  useEffect(() => {
    setReceipts(loadReceipts());
    try {
      setPersonalDocs(JSON.parse(localStorage.getItem("sbi-vault-personal") || "[]"));
    } catch {}
    // Auto-open specific folder if requested by navigation
    const openFolder = sessionStorage.getItem("vault-open-folder");
    if (openFolder) {
      setActiveFolder(openFolder);
      sessionStorage.removeItem("vault-open-folder");
    }
  }, [activeFolder]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc = { name: file.name, date: new Date().toISOString(), id: crypto.randomUUID() };
      const updated = [newDoc, ...personalDocs];
      setPersonalDocs(updated);
      localStorage.setItem("sbi-vault-personal", JSON.stringify(updated));
      e.target.value = ""; // reset
    }
  };

  // Also listen for storage events (if UPI payment happens in same tab via sessionStorage signal)
  useEffect(() => {
    const handler = () => setReceipts(loadReceipts());
    window.addEventListener("vault-updated", handler);
    return () => window.removeEventListener("vault-updated", handler);
  }, []);

  const deleteReceipt = (id: string) => {
    const updated = receipts.filter((r) => r.id !== id);
    localStorage.setItem(VAULT_KEY, JSON.stringify(updated));
    setReceipts(updated);
  };

  const filteredReceipts = receipts.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.note?.toLowerCase().includes(q) ||
      r.upiId?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q) ||
      String(r.amount).includes(q)
    );
  });

  const activeFolderMeta = STATIC_FOLDERS.find((f) => f.id === activeFolder);

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeFolder && (
            <button
              onClick={() => { setActiveFolder(null); setSearchQuery(""); }}
              className="p-2 hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {activeFolderMeta ? activeFolderMeta.name : "Smart Vault"}
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Secure
              </span>
            </h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              {activeFolderMeta ? activeFolderMeta.desc : "Your intelligent, auto-organized document storage"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder={activeFolder === "receipts" ? "Search by merchant, amount, note..." : "Search 'Samsung', 'Invoice'..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-[var(--border-medium)] rounded-xl text-sm w-72 focus:outline-none focus:ring-1 focus:ring-[var(--sbi-blue)] focus:border-[var(--sbi-blue)]"
            />
          </div>
          <input 
            type="file" 
            id="vault-upload" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => document.getElementById("vault-upload")?.click()}
            className="flex items-center gap-2 px-4 py-2 gradient-sbi text-white text-sm font-medium rounded-xl shadow-sm"
          >
            <Plus size={16} /> Upload
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeFolder === "receipts" ? (
          /* ── Receipts folder ── */
          <motion.div
            key="receipts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Receipts", value: receipts.length, color: "#1d4ed8" },
                { label: "Total Spent", value: `₹${receipts.reduce((s, r) => s + r.amount, 0).toLocaleString("en-IN")}`, color: "#dc2626" },
                { label: "This Month", value: receipts.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length + " receipts", color: "#059669" },
              ].map((s) => (
                <div key={s.label} className="card p-4">
                  <p className="text-xs text-[var(--text-tertiary)] uppercase font-semibold tracking-wide">{s.label}</p>
                  <p className="text-xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {filteredReceipts.length === 0 ? (
              <div className="card p-16 text-center">
                <QrCode size={48} className="mx-auto text-[var(--text-tertiary)] opacity-40 mb-4" />
                <p className="font-semibold text-[var(--text-secondary)]">No receipts yet</p>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                  Make a UPI payment and the receipt will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReceipts.map((r) => (
                  <ReceiptCard key={r.id} r={r} onDelete={() => deleteReceipt(r.id)} />
                ))}
              </div>
            )}
          </motion.div>
        ) : activeFolder === "personal" ? (
          /* ── Personal Documents folder ── */
          <motion.div
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {personalDocs.length === 0 ? (
              <div className="card p-16 text-center">
                <FileText size={48} className="mx-auto text-[var(--text-tertiary)] opacity-40 mb-4" />
                <p className="font-semibold text-[var(--text-secondary)]">No personal documents yet</p>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                  Upload your KYC or identity documents here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {personalDocs.map((doc) => (
                  <div key={doc.id} className="card p-4 flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-100 text-emerald-600">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{doc.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                        {new Date(doc.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* ── Folders grid ── */
          <motion.div
            key="folders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-4 gap-4"
          >
            {STATIC_FOLDERS.map((folder, i) => {
              const Icon = folder.icon;
              const count = folder.id === "receipts" ? receipts.length : 0;
              return (
                <motion.button
                  key={folder.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveFolder(folder.id)}
                  className="card p-5 text-left hover:shadow-lg hover:border-[var(--sbi-blue)] transition-all border border-transparent group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: `${folder.color}18`, color: folder.color }}
                    >
                      <Icon size={24} />
                    </div>
                    {folder.id === "receipts" && count > 0 && (
                      <span className="bg-blue-100 text-[var(--sbi-blue)] text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {count} new
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm truncate">{folder.name}</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">{folder.desc}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-[var(--text-tertiary)]">
                    <span>{folder.id === "receipts" ? count : "—"} items</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--sbi-blue)] -translate-x-1 group-hover:translate-x-0" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
