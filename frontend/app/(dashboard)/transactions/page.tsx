"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownLeft, ArrowUpRight, Filter, Search,
  Download, MapPin, CreditCard, Receipt,
  ChevronDown, Wallet, Landmark, Smartphone, ChevronRight
} from "lucide-react";
import { transactions } from "@/lib/data";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const categoryIcons: Record<string, string> = {
  Income: "💰", Housing: "🏠", Food: "🍔", Shopping: "🛍️",
  "Loan EMI": "🏦", Travel: "🚗", Rewards: "🎁", Investment: "📈",
  Entertainment: "🎬", Utilities: "⚡",
};

const filters = ["All", "Credit", "Debit", "UPI", "NEFT", "Card"];

export default function TransactionsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((t) => {
    const matchFilter = activeFilter === "All" ||
      (activeFilter === "Credit" && t.type === "credit") ||
      (activeFilter === "Debit" && t.type === "debit") ||
      t.paymentMethod.includes(activeFilter);
    const matchSearch = !search || t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.merchant.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">All your financial activity in one timeline</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 gradient-sbi text-white text-sm font-medium rounded-xl">
          <Download size={14} /> Export
        </motion.button>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[var(--border-light)] flex-1 max-w-sm">
          <Search size={14} className="text-[var(--text-tertiary)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..." className="flex-1 text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] bg-transparent" />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                activeFilter === f ? "gradient-sbi text-white" : "bg-white border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              )}>
              {f}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-light)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] bg-white transition-colors">
          <Filter size={13} /> Filter
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-[var(--border-light)]" />

        <div className="space-y-3">
          {filtered.map((txn, i) => (
            <div key={txn.id}>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Timeline dot + card */}
                <div className="flex items-start gap-4">
                  {/* Dot */}
                  <div className={cn(
                    "w-[14px] h-[14px] rounded-full border-2 mt-4 ml-[21px] shrink-0 z-10 relative",
                    txn.type === "credit"
                      ? "border-emerald-400 bg-emerald-400"
                      : "border-[var(--border-medium)] bg-white"
                  )} />

                  {/* Card */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      layout
                      className={cn("bg-white rounded-2xl border cursor-pointer overflow-hidden transition-all",
                        expanded === txn.id ? "border-[var(--sbi-blue)] shadow-md" : "border-[var(--border-light)] hover:border-[var(--border-medium)] hover:shadow-sm"
                      )}
                      onClick={() => setExpanded(expanded === txn.id ? null : txn.id)}
                    >
                      <div className="flex items-center gap-4 p-4">
                        {/* Category emoji */}
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-lg shrink-0">
                          {categoryIcons[txn.category] || "💳"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{txn.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-[var(--text-tertiary)]">{txn.paymentMethod}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--border-medium)]" />
                            <span className="text-[10px] text-[var(--text-tertiary)]">{txn.category}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--border-medium)]" />
                            <span className="text-[10px] text-[var(--text-tertiary)]">{formatDate(txn.date)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn("text-base font-bold tabular-nums",
                            txn.type === "credit" ? "text-emerald-600" : "text-[var(--text-primary)]")}>
                            {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                          </span>
                          <motion.div
                            animate={{ rotate: expanded === txn.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} className="text-[var(--text-tertiary)]" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expanded === txn.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-[var(--border-light)]"
                          >
                            <div className="p-4 bg-[var(--bg-tertiary)]">
                              <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white rounded-xl p-3">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Landmark size={12} className="text-[var(--text-tertiary)]" />
                                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">Merchant</p>
                                  </div>
                                  <p className="text-xs font-semibold">{txn.merchant}</p>
                                </div>
                                <div className="bg-white rounded-xl p-3">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <MapPin size={12} className="text-[var(--text-tertiary)]" />
                                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">Location</p>
                                  </div>
                                  <p className="text-xs font-semibold">{txn.location}</p>
                                </div>
                                <div className="bg-white rounded-xl p-3">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <CreditCard size={12} className="text-[var(--text-tertiary)]" />
                                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">Method</p>
                                  </div>
                                  <p className="text-xs font-semibold">{txn.paymentMethod}</p>
                                </div>
                              </div>
                              <div className="mt-3 bg-white rounded-xl p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Receipt size={12} className="text-[var(--text-tertiary)]" />
                                  <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">Reference</p>
                                </div>
                                <p className="text-xs font-mono text-[var(--text-secondary)]">{txn.ref}</p>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button className="flex-1 py-2 rounded-xl bg-white border border-[var(--border-light)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] transition-colors">
                                  View Receipt
                                </button>
                                <button className="flex-1 py-2 rounded-xl bg-white border border-[var(--border-light)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] transition-colors">
                                  Dispute
                                </button>
                                <button className="flex-1 py-2 rounded-xl gradient-sbi text-white text-xs font-medium">
                                  Download
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
