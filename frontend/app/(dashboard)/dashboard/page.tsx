"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Gift, Target, Eye, EyeOff, Bell, Zap, Send, Download,
  PiggyBank, CreditCard, Shield, ShoppingBag, Plus
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  user, accounts, transactions, monthlySpendData,
  categorySpend, upcomingBills, beneficiaries,
  savingsGoals, investments, loans
} from "@/lib/data";
import { cn, formatCurrency, formatNumber, getGreeting, formatRelativeTime } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

function StatCard({ label, value, change, changeType, icon: Icon, color }: {
  label: string; value: string; change: string; changeType: "up" | "down";
  icon: React.ElementType; color: string;
}) {
  return (
    <motion.div variants={fadeUp} className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + "15" }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
        <div className={cn("flex items-center gap-1 mt-1 text-xs font-medium",
          changeType === "up" ? "text-emerald-600" : "text-red-500")}>
          {changeType === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{change}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-2xl gradient-sbi p-6 text-white"
        style={{ boxShadow: "0 8px 32px rgba(0,51,153,0.25)" }}
      >
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium">{getGreeting()}</p>
          <h1 className="text-3xl font-bold mt-1">{user.name} 👋</h1>
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-wide">Current Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold tabular-nums">
                  {showBalance ? formatCurrency(accounts[0].balance) : "₹ ••••••"}
                </p>
                <button onClick={() => setShowBalance(!showBalance)} className="text-blue-200 hover:text-white transition-colors">
                  {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-wide">Monthly Spend</p>
              <p className="text-xl font-bold mt-1">₹71,230</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-wide">Savings</p>
              <p className="text-xl font-bold mt-1">₹13,770</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-wide">Reward Points</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Gift size={16} className="text-yellow-300" />
                <p className="text-xl font-bold">{user.rewardPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-4 right-48 w-32 h-32 rounded-full bg-white/5" />
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={stagger} initial="initial" animate="animate"
        className="grid grid-cols-4 gap-4">
        <StatCard label="Total Assets" value="₹18.4L" change="+12.3% this month" changeType="up" icon={TrendingUp} color="#003399" />
        <StatCard label="Total Investments" value="₹3.60L" change="+22.7% returns" changeType="up" icon={Target} color="#0099cc" />
        <StatCard label="Loan Outstanding" value="₹47.5L" change="-₹60K this month" changeType="up" icon={ArrowDownRight} color="#f59e0b" />
        <StatCard label="Credit Score" value="782" change="+8 pts this month" changeType="up" icon={ArrowUpRight} color="#10b981" />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Spend & Income Chart */}
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Income vs Expenses</h3>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Last 6 months overview</p>
            </div>
            <div className="flex gap-4 text-xs text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--sbi-blue)]" />Income</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--sbi-cyan)]" />Expenses</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />Savings</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlySpendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#003399" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#003399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0099cc" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#0099cc" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="savings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--border-light)", fontSize: 12, boxShadow: "var(--shadow-lg)" }} />
              <Area type="monotone" dataKey="income" stroke="#003399" strokeWidth={2} fill="url(#income)" />
              <Area type="monotone" dataKey="spend" stroke="#0099cc" strokeWidth={2} fill="url(#spend)" />
              <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} fill="url(#savings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Pie */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-1">Spending by Category</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-3">June 2024</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categorySpend} cx="50%" cy="50%" innerRadius={42} outerRadius={65}
                dataKey="value" paddingAngle={2} stroke="none">
                {categorySpend.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 10, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categorySpend.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-medium text-[var(--text-primary)]">{formatNumber(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-8 gap-3">
          {[
            { label: "Send Money", icon: Send, color: "#003399" },
            { label: "Pay Bills", icon: Zap, color: "#0099cc" },
            { label: "Open FD", icon: PiggyBank, color: "#6366f1" },
            { label: "Get Statement", icon: Download, color: "#8b5cf6" },
            { label: "New Card", icon: CreditCard, color: "#06b6d4" },
            { label: "Invest", icon: TrendingUp, color: "#10b981" },
            { label: "Insurance", icon: Shield, color: "#f59e0b" },
            { label: "Shop", icon: ShoppingBag, color: "#ec4899" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <motion.button key={action.label}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[var(--bg-tertiary)] hover:bg-white hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ background: action.color + "15" }}>
                  <Icon size={18} style={{ color: action.color }} />
                </div>
                <span className="text-[10px] font-medium text-[var(--text-secondary)] text-center leading-tight">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <div className="col-span-1 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
            <a href="/transactions" className="text-xs text-[var(--sbi-blue)] font-medium hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn) => (
              <motion.div key={txn.id} className="flex items-center gap-3 group"
                whileHover={{ x: 2 }}>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm",
                  txn.type === "credit" ? "bg-emerald-100 text-emerald-600" : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]")}>
                  {txn.type === "credit" ? "↓" : "↑"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">{txn.description}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)]">{formatRelativeTime(txn.date)}</p>
                </div>
                <span className={cn("text-sm font-semibold tabular-nums shrink-0",
                  txn.type === "credit" ? "text-emerald-600" : "text-[var(--text-primary)]")}>
                  {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Upcoming Bills</h3>
            <span className="text-[10px] bg-amber-100 text-amber-600 font-semibold px-2 py-0.5 rounded-full">{upcomingBills.filter(b => b.status === "Due Soon").length} Due Soon</span>
          </div>
          <div className="space-y-2.5">
            {upcomingBills.slice(0, 5).map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                    bill.status === "Due Soon" ? "bg-amber-400" : "bg-[var(--border-medium)]")} />
                  <div>
                    <p className="text-xs font-medium text-[var(--text-primary)]">{bill.name}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">{new Date(bill.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold">₹{bill.amount.toLocaleString("en-IN")}</p>
                  <p className={cn("text-[10px] font-medium", bill.status === "Due Soon" ? "text-amber-500" : "text-[var(--text-tertiary)]")}>
                    {bill.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Goals */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Savings Goals</h3>
            <button className="w-6 h-6 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--sbi-blue)] hover:bg-[var(--sbi-cyan-light)] transition-colors">
              <Plus size={13} />
            </button>
          </div>
          <div className="space-y-4">
            {savingsGoals.map((goal) => {
              const pct = Math.round((goal.current / goal.target) * 100);
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-[var(--text-primary)]">{goal.name}</span>
                    <span className="text-[var(--text-tertiary)]">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full gradient-sbi"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-[var(--text-tertiary)]">
                    <span>₹{goal.current.toLocaleString("en-IN")}</span>
                    <span>₹{goal.target.toLocaleString("en-IN")} · {goal.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Beneficiaries */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Recent Beneficiaries</h3>
          <button className="text-xs text-[var(--sbi-blue)] font-medium hover:underline">Manage</button>
        </div>
        <div className="flex gap-4">
          {beneficiaries.map((b) => (
            <motion.button key={b.id}
              whileHover={{ y: -2 }}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                style={{ background: b.color }}>
                {b.initials}
              </div>
              <span className="text-xs text-[var(--text-secondary)] font-medium whitespace-nowrap">{b.name.split(" ")[0]}</span>
            </motion.button>
          ))}
          <motion.button whileHover={{ y: -2 }}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="w-11 h-11 rounded-full border-2 border-dashed border-[var(--border-medium)] flex items-center justify-center text-[var(--text-tertiary)]">
              <Plus size={16} />
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">Add New</span>
          </motion.button>
        </div>
      </div>

    </div>
  );
}
