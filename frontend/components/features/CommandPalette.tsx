"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, Clock, TrendingUp, ChevronRight,
  ShieldOff, PiggyBank, Download, Banknote,
  Book, MapPin, Zap, Send, Wallet,
  Shield, Target, AlertTriangle, QrCode,
  X
} from "lucide-react";
import { commandItems } from "@/lib/data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "shield-off": ShieldOff,
  "trending-up": TrendingUp,
  "piggy-bank": PiggyBank,
  download: Download,
  banknote: Banknote,
  book: Book,
  "map-pin": MapPin,
  zap: Zap,
  send: Send,
  wallet: Wallet,
  shield: Shield,
  target: Target,
  "alert-triangle": AlertTriangle,
  "qr-code": QrCode,
};

const recentSearches = ["Block Debit Card", "Download Statement", "Pay Electricity"];

interface Props {
  onClose: () => void;
}

export default function CommandPalette({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query
    ? commandItems.filter(
        (c) =>
          c.feature.toLowerCase().includes(query.toLowerCase()) ||
          c.module.toLowerCase().includes(query.toLowerCase())
      )
    : commandItems.slice(0, 8);

  // Map certain command IDs to sessionStorage actions so the target page
  // can auto-open the relevant modal (same mechanism the Voice Assistant uses)
  const ACTION_MAP: Record<string, string> = {
    c2:  "scroll-to-limit",   // Increase UPI Limit
    c9:  "open-pay",          // Transfer Money
    c15: "open-pay",          // Scan & Pay QR
  };

  const executeCommand = (item: typeof commandItems[0]) => {
    if (ACTION_MAP[item.id]) {
      sessionStorage.setItem("va-action", ACTION_MAP[item.id]);
    }
    router.push(item.path);
    onClose();
  };

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && filtered[selected]) {
        executeCommand(filtered[selected]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [filtered, selected, onClose, router]);

  useEffect(() => { setSelected(0); }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 command-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[var(--border-light)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)" }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-light)]">
          <Search size={17} className="text-[var(--sbi-blue)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What would you like to do today?"
            className="flex-1 text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
              <X size={14} />
            </button>
          )}
          <kbd className="text-[10px] bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded px-1.5 py-0.5 text-[var(--text-tertiary)] font-mono">ESC</kbd>
        </div>

        {/* Recent Searches (when no query) */}
        {!query && (
          <div className="px-4 py-2 border-b border-[var(--border-light)]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Recent</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-lg px-2.5 py-1.5 hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] transition-colors"
                >
                  <Clock size={11} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="py-2 max-h-80 overflow-y-auto">
          {!query && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-4 mb-1">Quick Actions</p>
          )}

          {filtered.length === 0 ? (
            <div className="py-10 text-center text-[var(--text-tertiary)]">
              <Search size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((item, i) => {
                const Icon = iconMap[item.icon] || Search;
                const isSelected = i === selected;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => { executeCommand(item); }}
                    onMouseEnter={() => setSelected(i)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 transition-all duration-100 group",
                      isSelected ? "bg-[rgba(0,51,153,0.06)]" : "hover:bg-[var(--bg-tertiary)]"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      isSelected
                        ? "bg-[var(--sbi-blue)] text-white"
                        : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] group-hover:bg-[var(--sbi-cyan-light)] group-hover:text-[var(--sbi-blue)]"
                    )}>
                      <Icon size={15} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <p className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-[var(--sbi-blue)]" : "text-[var(--text-primary)]"
                      )}>
                        {item.feature}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.module}</p>
                    </div>

                    {/* Time & Shortcut */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={9} />
                        {item.time}
                      </span>
                      {item.shortcut && (
                        <kbd className="text-[10px] bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded px-1.5 py-0.5 text-[var(--text-tertiary)] font-mono">
                          {item.shortcut}
                        </kbd>
                      )}
                      <ChevronRight size={13} className={cn(
                        "transition-transform",
                        isSelected ? "translate-x-0.5 text-[var(--sbi-blue)]" : "text-[var(--text-muted)]"
                      )} />
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border-light)] bg-[var(--bg-tertiary)]">
          <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
            <span className="flex items-center gap-1"><kbd className="font-mono bg-white border border-[var(--border-medium)] rounded px-1">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="font-mono bg-white border border-[var(--border-medium)] rounded px-1">↵</kbd> open</span>
            <span className="flex items-center gap-1"><kbd className="font-mono bg-white border border-[var(--border-medium)] rounded px-1">ESC</kbd> close</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">{filtered.length} results</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
