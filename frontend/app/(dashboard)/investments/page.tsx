"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, PiggyBank,
  Plus, ArrowUpRight, BarChart3, Star,
  Calendar, RefreshCcw
} from "lucide-react";
import { investments } from "@/lib/data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, AreaChart, Area
} from "recharts";

const tabs = ["Mutual Funds", "Fixed Deposits", "Recurring Deposit"];

const mfGrowthData = [
  { m: "Jan", v: 240000 }, { m: "Feb", v: 265000 }, { m: "Mar", v: 258000 },
  { m: "Apr", v: 280000 }, { m: "May", v: 302000 }, { m: "Jun", v: 359556 },
];

export default function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState("Mutual Funds");

  const totalMFValue = investments.mutualFunds.reduce((a, m) => a + m.currentValue, 0);
  const totalMFInvested = investments.mutualFunds.reduce((a, m) => a + m.invested, 0);
  const totalFD = investments.fds.reduce((a, f) => a + f.principal, 0);

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Investments</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Grow your wealth with smart investing</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 gradient-sbi text-white text-sm font-medium rounded-xl shadow-sm">
          <Plus size={14} /> Invest Now
        </motion.button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Portfolio", value: formatCurrency(totalMFValue + totalFD), change: "+22.4%", up: true },
          { label: "Mutual Funds", value: formatCurrency(totalMFValue), change: "+24.1%", up: true },
          { label: "Fixed Deposits", value: formatCurrency(totalFD), change: "+7.1%", up: true },
          { label: "Unrealised Gains", value: formatCurrency(totalMFValue - totalMFInvested), change: "on ₹3L invested", up: true },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{s.value}</p>
            <div className={cn("flex items-center gap-1 text-xs font-medium mt-0.5", s.up ? "text-emerald-600" : "text-red-500")}>
              {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Growth Chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Portfolio Growth</h3>
          <div className="flex gap-1">
            {["1M", "3M", "6M", "1Y", "All"].map((p) => (
              <button key={p} className={cn("px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                p === "6M" ? "bg-[var(--sbi-blue)] text-white" : "text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]")}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={mfGrowthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#003399" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#003399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke="#003399" strokeWidth={2.5} fill="url(#portfolioGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-tertiary)] rounded-2xl w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn("px-5 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === t ? "bg-white shadow-sm text-[var(--sbi-blue)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}>
            {t}
          </button>
        ))}
      </div>

      {/* Mutual Funds */}
      {activeTab === "Mutual Funds" && (
        <div className="space-y-3">
          {investments.mutualFunds.map((mf, i) => {
            const gain = mf.currentValue - mf.invested;
            const gainPct = ((gain / mf.invested) * 100).toFixed(1);
            return (
              <motion.div key={mf.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl gradient-sbi flex items-center justify-center shrink-0">
                    <BarChart3 size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{mf.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] bg-[var(--sbi-cyan-light)] text-[var(--sbi-blue)] font-medium px-2 py-0.5 rounded-full">{mf.category}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star key={s} size={10} className={s < mf.rating ? "fill-amber-400 text-amber-400" : "text-[var(--border-medium)]"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-base">{formatCurrency(mf.currentValue)}</p>
                        <div className="flex items-center gap-1 justify-end mt-0.5 text-emerald-600 text-xs font-medium">
                          <TrendingUp size={11} />
                          <span>+{gainPct}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {[
                        { label: "Invested", value: formatCurrency(mf.invested) },
                        { label: "Gain/Loss", value: `+${formatCurrency(gain)}` },
                        { label: "NAV", value: `₹${mf.nav}` },
                        { label: "SIP", value: mf.sipAmount > 0 ? formatCurrency(mf.sipAmount) + "/mo" : "None" },
                      ].map((d) => (
                        <div key={d.label} className="bg-[var(--bg-tertiary)] rounded-lg p-2.5">
                          <p className="text-[10px] text-[var(--text-tertiary)]">{d.label}</p>
                          <p className={cn("text-xs font-bold mt-0.5", d.label === "Gain/Loss" ? "text-emerald-600" : "")}>{d.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border-light)]">
                  {["Invest More", "Redeem", "SIP", "Statement"].map((a) => (
                    <button key={a} className={cn("px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                      a === "Invest More"
                        ? "gradient-sbi text-white border-transparent"
                        : "border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]")}>
                      {a}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* FDs */}
      {activeTab === "Fixed Deposits" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 gradient-sbi text-white text-sm font-medium rounded-xl shadow-sm">
              <Plus size={14} /> Open New FD
            </motion.button>
          </div>
          {investments.fds.map((fd, i) => {
            const interestEarned = fd.maturityAmount - fd.principal;
            return (
              <motion.div key={fd.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="card p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                    <PiggyBank size={20} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{fd.type}</h3>
                        <p className="text-xs text-[var(--text-tertiary)]">{fd.accountNumber}</p>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-600 font-semibold px-2.5 py-1 rounded-full">{fd.status}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {[
                        { label: "Principal", value: formatCurrency(fd.principal) },
                        { label: "Interest Rate", value: `${fd.rate}% p.a.` },
                        { label: "Maturity Amount", value: formatCurrency(fd.maturityAmount) },
                        { label: "Maturity Date", value: formatDate(fd.maturityDate) },
                      ].map((d) => (
                        <div key={d.label} className="bg-[var(--bg-tertiary)] rounded-lg p-2.5">
                          <p className="text-[10px] text-[var(--text-tertiary)]">{d.label}</p>
                          <p className="text-xs font-bold mt-0.5">{d.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* RD */}
      {activeTab === "Recurring Deposit" && (
        <div className="space-y-4">
          {investments.rds.map((rd) => (
            <div key={rd.id} className="card p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
                  <RefreshCcw size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Recurring Deposit</h3>
                  <p className="text-xs text-[var(--text-tertiary)]">{rd.accountNumber}</p>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[
                      { label: "Monthly Installment", value: formatCurrency(rd.monthlyInstallment) },
                      { label: "Completed", value: `${rd.completedMonths}/${rd.tenure} months` },
                      { label: "Interest Rate", value: `${rd.rate}% p.a.` },
                    ].map((d) => (
                      <div key={d.label} className="bg-[var(--bg-tertiary)] rounded-lg p-2.5">
                        <p className="text-[10px] text-[var(--text-tertiary)]">{d.label}</p>
                        <p className="text-xs font-bold mt-0.5">{d.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1 text-[var(--text-tertiary)]">
                      <span>Progress</span>
                      <span>{Math.round((rd.completedMonths / rd.tenure) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(rd.completedMonths / rd.tenure) * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
