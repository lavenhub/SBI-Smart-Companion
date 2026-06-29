"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import {
  Zap, TrendingUp, Download, Smartphone,
  PiggyBank, CreditCard, Shield, RefreshCcw,
  LayoutGrid, Sparkles, Clock, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

type Shortcut = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  usageCount: number;
  lastUsed: string;
};

const allShortcuts: Shortcut[] = [
  { id: "s1", label: "Pay Electricity", icon: Zap, color: "#f59e0b", usageCount: 12, lastUsed: "Today" },
  { id: "s2", label: "UPI Transfer", icon: Smartphone, color: "#0099cc", usageCount: 28, lastUsed: "2 hrs ago" },
  { id: "s3", label: "Download Statement", icon: Download, color: "#8b5cf6", usageCount: 8, lastUsed: "Yesterday" },
  { id: "s4", label: "Recharge Mobile", icon: RefreshCcw, color: "#10b981", usageCount: 15, lastUsed: "Today" },
  { id: "s5", label: "Mutual Funds", icon: TrendingUp, color: "#003399", usageCount: 6, lastUsed: "3 days ago" },
  { id: "s6", label: "Open FD", icon: PiggyBank, color: "#ec4899", usageCount: 3, lastUsed: "1 week ago" },
  { id: "s7", label: "Insurance", icon: Shield, color: "#0891b2", usageCount: 2, lastUsed: "2 weeks ago" },
  { id: "s8", label: "Credit Card Bill", icon: CreditCard, color: "#ef4444", usageCount: 5, lastUsed: "5 days ago" },
];

const recentlyUsed = allShortcuts.slice(0, 4).sort((a, b) => b.usageCount - a.usageCount);

export default function AdaptiveDashboardPage() {
  const [shortcuts, setShortcuts] = useState(allShortcuts.slice(0, 6));

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-[var(--sbi-blue)]" />
          <h1 className="text-2xl font-bold">Adaptive Dashboard</h1>
        </div>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Your shortcuts rearrange automatically based on your usage patterns.
        </p>
      </div>

      {/* AI Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-[var(--sbi-cyan-light)] flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl gradient-sbi flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--sbi-blue)]">AI Detected Your Patterns</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Based on your usage, &ldquo;UPI Transfer&rdquo; and &ldquo;Pay Electricity&rdquo; are your top actions. Shortcuts have been reordered.
          </p>
        </div>
        <span className="text-[10px] bg-[var(--sbi-blue)] text-white font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
          Auto-Updated
        </span>
      </motion.div>

      {/* Recently Used */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-[var(--text-tertiary)]" />
          <h3 className="text-sm font-semibold">Recently Used</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {recentlyUsed.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="card p-4 flex flex-col items-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform"
                  style={{ background: s.color + "15" }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">{s.label}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{s.lastUsed}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                  <RefreshCcw size={9} />
                  {s.usageCount}x this month
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* My Shortcuts (Draggable) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LayoutGrid size={14} className="text-[var(--text-tertiary)]" />
            <h3 className="text-sm font-semibold">My Shortcuts</h3>
            <span className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] px-2 py-0.5 rounded-full">Drag to reorder</span>
          </div>
          <button className="text-xs text-[var(--sbi-blue)] font-medium hover:underline">Customize</button>
        </div>

        <Reorder.Group as="div" axis="x" values={shortcuts} onReorder={setShortcuts}
          className="grid grid-cols-6 gap-3">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Reorder.Item key={s.id} value={s} as="div">
                <motion.div
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="card p-4 flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing select-none"
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: s.color + "15" }}>
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                  <p className="text-[10px] font-semibold text-center text-[var(--text-primary)] leading-tight">{s.label}</p>
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>

      {/* Usage Stats */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Usage Analytics</h3>
        <div className="space-y-3">
          {allShortcuts.sort((a, b) => b.usageCount - a.usageCount).map((s, i) => {
            const Icon = s.icon;
            const maxUsage = Math.max(...allShortcuts.map((x) => x.usageCount));
            return (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-[var(--text-muted)] w-4">{i + 1}</span>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + "15" }}>
                  <Icon size={13} style={{ color: s.color }} />
                </div>
                <span className="text-xs font-medium w-36">{s.label}</span>
                <div className="flex-1 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.usageCount / maxUsage) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
                <span className="text-xs text-[var(--text-tertiary)] w-16 text-right">{s.usageCount}x used</span>
                <span className="text-[10px] text-[var(--text-muted)] w-20 text-right">{s.lastUsed}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
