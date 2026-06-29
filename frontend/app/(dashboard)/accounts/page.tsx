"use client";

import { motion } from "framer-motion";
import {
  Landmark, Eye, EyeOff, Download, CreditCard,
  ArrowUpRight, ArrowDownLeft, Copy, CheckCircle2,
  TrendingUp, Clock
} from "lucide-react";
import { useState } from "react";
import { accounts, transactions } from "@/lib/data";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const miniChart = [
  { d: "1", v: 220000 }, { d: "5", v: 245000 }, { d: "10", v: 235000 },
  { d: "15", v: 260000 }, { d: "20", v: 275000 }, { d: "25", v: 268000 },
  { d: "30", v: 284350 },
];

export default function AccountsPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copy = (val: string, field: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Accounts</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Manage all your bank accounts</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border-medium)] rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors bg-white">
            <Download size={14} /> Statement
          </button>
        </div>
      </div>

      {accounts.map((acc, i) => (
        <motion.div key={acc.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="card overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 gradient-sbi text-white relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute bottom-0 right-16 w-20 h-20 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">{acc.type}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-3xl font-bold tabular-nums">
                      {showBalance ? formatCurrency(acc.balance) : "₹ ••••••"}
                    </p>
                    <button onClick={() => setShowBalance(!showBalance)} className="text-blue-200 hover:text-white transition-colors">
                      {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-blue-200 text-sm mt-1">Available: {showBalance ? formatCurrency(acc.availableBalance) : "••••••"}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold",
                    acc.status === "Active" ? "bg-emerald-400/20 text-emerald-200" : "bg-red-400/20 text-red-200")}>
                    {acc.status}
                  </span>
                  <span className="text-xs text-blue-200">{acc.interestRate > 0 ? `${acc.interestRate}% p.a.` : "Current Account"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Account Number", value: acc.number, copy: "account" },
                { label: "IFSC Code", value: acc.ifsc, copy: "ifsc" },
                { label: "Branch", value: acc.branch, copy: null },
              ].map((d) => (
                <div key={d.label} className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                  <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{d.label}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{d.value}</p>
                    {d.copy && (
                      <button onClick={() => copy(d.value, d.copy!)}
                        className="text-[var(--text-tertiary)] hover:text-[var(--sbi-blue)] transition-colors shrink-0">
                        {copiedField === d.copy ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Mini chart */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-tertiary)] mb-2">Balance Trend (June)</p>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={miniChart} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad${acc.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#003399" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#003399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 100000}L`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="v" stroke="#003399" strokeWidth={2} fill={`url(#grad${acc.id})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Recent txns */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-tertiary)] mb-2">Recent Transactions</p>
                <div className="space-y-1.5">
                  {transactions.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                        t.type === "credit" ? "bg-emerald-400" : "bg-[var(--border-medium)]")} />
                      <p className="text-xs text-[var(--text-secondary)] flex-1 truncate">{t.description}</p>
                      <span className={cn("text-xs font-medium tabular-nums",
                        t.type === "credit" ? "text-emerald-600" : "")}>
                        {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border-light)]">
              {[
                { label: "Transfer", icon: ArrowUpRight },
                { label: "Receive", icon: ArrowDownLeft },
                { label: "Statement", icon: Download },
                { label: "Cheque Book", icon: CreditCard },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <motion.button key={a.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-light)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] hover:border-[var(--sbi-cyan)] transition-all">
                    <Icon size={13} /> {a.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
