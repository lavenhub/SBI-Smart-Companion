"use client";

import { motion } from "framer-motion";
import {
  Shield, Heart, Car, Plus,
  Calendar, CheckCircle2, AlertTriangle, ArrowRight
} from "lucide-react";
import { insurance } from "@/lib/data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "Life Insurance": Shield,
  "Health Insurance": Heart,
  "Vehicle Insurance": Car,
};

const colorMap: Record<string, string> = {
  "Life Insurance": "#003399",
  "Health Insurance": "#10b981",
  "Vehicle Insurance": "#f59e0b",
};

export default function InsurancePage() {
  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Insurance</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Your protection portfolio</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 gradient-sbi text-white text-sm font-medium rounded-xl shadow-sm">
          <Plus size={14} /> Buy Insurance
        </motion.button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Coverage", value: "₹1.15Cr", icon: Shield, color: "#003399" },
          { label: "Annual Premium", value: "₹59,000", icon: Calendar, color: "#f59e0b" },
          { label: "Active Policies", value: "3", icon: CheckCircle2, color: "#10b981" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: s.color + "15" }}>
                <Icon size={22} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Policy Cards */}
      <div className="grid grid-cols-3 gap-4">
        {insurance.map((policy, i) => {
          const Icon = iconMap[policy.type] || Shield;
          const color = colorMap[policy.type] || "#003399";
          const daysToRenewal = Math.ceil((new Date(policy.nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <motion.div key={policy.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}12, ${color}05)` }}>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: color + "20" }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full",
                    policy.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500")}>
                    {policy.status}
                  </span>
                </div>
                <h3 className="font-bold mt-3">{policy.type}</h3>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{policy.company}</p>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">Policy No.</span>
                  <span className="font-mono font-medium text-xs">{policy.policyNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">Sum Assured</span>
                  <span className="font-bold">{formatCurrency(policy.sumAssured)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">Annual Premium</span>
                  <span className="font-semibold">{formatCurrency(policy.premium)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">Coverage</span>
                  <span className="text-xs font-medium text-right max-w-[140px]">{policy.coverageDetails}</span>
                </div>

                {/* Renewal banner */}
                <div className={cn("flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium",
                  daysToRenewal <= 30 ? "bg-amber-50 text-amber-600" : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]")}>
                  {daysToRenewal <= 30 ? <AlertTriangle size={12} /> : <Calendar size={12} />}
                  Renewal: {formatDate(policy.nextDueDate)}
                  {daysToRenewal <= 30 && <span className="ml-auto font-bold">{daysToRenewal}d left</span>}
                </div>

                <div className="flex gap-2 pt-1">
                  <button className="flex-1 py-2 rounded-xl bg-[var(--bg-tertiary)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] transition-colors">
                    View Policy
                  </button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 py-2 rounded-xl gradient-sbi text-white text-xs font-semibold flex items-center justify-center gap-1">
                    Pay Premium <ArrowRight size={11} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Explore More */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Explore More Policies</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "Term Life", company: "LIC / SBI Life", premium: "From ₹12,000/yr", cover: "₹1Cr" },
            { name: "Critical Illness", company: "SBI General", premium: "From ₹8,000/yr", cover: "₹25L" },
            { name: "Home Insurance", company: "SBI General", premium: "From ₹5,000/yr", cover: "₹50L" },
            { name: "Travel Insurance", company: "SBI General", premium: "From ₹500/trip", cover: "$50,000" },
          ].map((p) => (
            <motion.button key={p.name} whileHover={{ y: -2 }}
              className="p-4 rounded-2xl border border-[var(--border-light)] text-left hover:border-[var(--sbi-blue)] hover:shadow-md transition-all">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{p.company}</p>
              <p className="text-xs font-bold text-[var(--sbi-blue)] mt-2">{p.cover} cover</p>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">{p.premium}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
