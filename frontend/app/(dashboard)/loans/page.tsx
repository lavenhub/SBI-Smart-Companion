"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home, Car, GraduationCap, Banknote,
  Calendar, TrendingDown, ChevronRight, Download,
  ArrowRight, Plus, Clock
} from "lucide-react";
import { loans } from "@/lib/data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { api, Application } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const loanIcons: Record<string, React.ElementType> = {
  "Home Loan": Home,
  "Car Loan": Car,
  "Personal Loan": Banknote,
  "Education Loan": GraduationCap,
};

const emiData = Array.from({ length: 6 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
  principal: [8000, 8200, 8400, 8600, 8800, 9000][i],
  interest: [36250, 36050, 35850, 35650, 35450, 35250][i],
}));

export default function LoansPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Application[]>([]);

  useEffect(() => {
    async function loadApps() {
      try {
        const localDraft = localStorage.getItem("loan-application-draft");
        if (localDraft) {
          const parsed = JSON.parse(localDraft);
          const mockDraft: Application = {
            id: "app-1",
            applicationType: "LOAN",
            status: "DRAFT",
            title: "Home Loan Application",
            currentStep: parsed.step ?? 0,
            totalSteps: 4,
            completionPercent: Math.round(((parsed.step ?? 0) / 4) * 100),
            formData: JSON.stringify(parsed.data || {}),
            completedFields: "",
            steps: "",
            updatedAt: parsed.savedAt || new Date().toISOString(),
          };
          setDrafts([mockDraft]);
        } else {
          setDrafts([]);
        }
      } catch (err) {
        console.error("Failed to load applications", err);
      }
    }
    loadApps();
  }, []);

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Loans</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Track and manage your loan accounts</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/loans/apply')}
          className="flex items-center gap-2 px-4 py-2 gradient-sbi text-white text-sm font-medium rounded-xl shadow-sm"
        >
          <Plus size={14} /> Apply New Loan
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Outstanding", value: "₹47.5L", sub: "across 2 loans", color: "#f59e0b" },
          { label: "Monthly EMI", value: "₹60,050", sub: "Next: Jun 15, 2024", color: "#003399" },
          { label: "Paid This Year", value: "₹3.6L", sub: "Jan–Jun 2024", color: "#10b981" },
          { label: "Savings on Prepay", value: "₹2.8L", sub: "If prepaid today", color: "#8b5cf6" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Resume Application Section */}
      {drafts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-[var(--sbi-blue)]">
            <Clock size={16} /> Continue where you left off
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {drafts.map(draft => (
              <motion.button 
                key={draft.id}
                whileHover={{ y: -2 }}
                onClick={() => router.push('/loans/apply')}
                className="card p-5 text-left border border-[var(--sbi-blue)] shadow-md hover:shadow-lg transition-all"
                style={{ background: 'linear-gradient(to right, white, #f8faff)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[var(--sbi-blue)]">
                      <Home size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{draft.title}</h3>
                      <p className="text-xs text-gray-500">Last edited: {new Date(draft.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[var(--sbi-blue)]" />
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[var(--sbi-blue)]">{draft.completionPercent}% Completed</span>
                    <span className="text-gray-500">Step {draft.currentStep + 1} of {draft.totalSteps}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${draft.completionPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[var(--sbi-blue)]"
                    />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Loan Cards */}
      {loans.map((loan, i) => {
        const Icon = loanIcons[loan.type] || Banknote;
        const paidPct = Math.round(((loan.principal - loan.outstanding) / loan.principal) * 100);

        return (
          <motion.div key={loan.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl gradient-sbi flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{loan.type}</h3>
                      <p className="text-xs text-[var(--text-tertiary)]">{loan.accountNumber} · {loan.bank}</p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-600 font-semibold px-2.5 py-1 rounded-full">
                      {loan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {[
                      { label: "Principal", value: formatCurrency(loan.principal) },
                      { label: "Outstanding", value: formatCurrency(loan.outstanding) },
                      { label: "Monthly EMI", value: formatCurrency(loan.emi) },
                      { label: "Interest Rate", value: `${loan.interestRate}% p.a.` },
                    ].map((d) => (
                      <div key={d.label} className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                        <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{d.label}</p>
                        <p className="text-sm font-bold mt-0.5">{d.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Repayment progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-tertiary)]">Repayment Progress</span>
                      <span className="font-semibold text-emerald-600">{paidPct}% Paid</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${paidPct}%` }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="h-full rounded-full bg-emerald-400"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mt-1">
                      <span>Paid: {formatCurrency(loan.principal - loan.outstanding)}</span>
                      <span>{loan.tenureRemaining} months remaining</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--border-light)]">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                      <Calendar size={12} />
                      Next EMI: {formatDate(loan.nextEmiDate)} — {formatCurrency(loan.emi)}
                    </div>
                    <div className="ml-auto flex gap-2">
                      {["Pay EMI", "Statements", "Prepay"].map((a) => (
                        <motion.button key={a} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className={cn("px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                            a === "Pay EMI"
                              ? "gradient-sbi text-white border-transparent shadow-sm"
                              : "border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                          )}>
                          {a}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* EMI Breakdown Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-4">EMI Breakdown (Home Loan)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={emiData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="interest" name="Interest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="principal" name="Principal" fill="#003399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New Loan Products */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Explore Loan Products</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "Personal Loan", rate: "10.9%", limit: "₹20L", time: "2 min" },
            { name: "Gold Loan", rate: "7.5%", limit: "₹50L", time: "30 min" },
            { name: "Education Loan", rate: "8.2%", limit: "₹1.5Cr", time: "3 days" },
            { name: "Business Loan", rate: "9.7%", limit: "₹2Cr", time: "1 day" },
          ].map((p) => (
            <motion.button key={p.name} whileHover={{ y: -2 }}
              className="p-4 rounded-2xl border border-[var(--border-light)] text-left hover:border-[var(--sbi-blue)] hover:shadow-md transition-all">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-lg font-bold text-[var(--sbi-blue)] mt-1">{p.rate}</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">Up to {p.limit}</p>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-medium">
                <ArrowRight size={10} /> {p.time} approval
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
