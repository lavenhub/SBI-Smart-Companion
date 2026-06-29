"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, ScanLine, Clock, Star, Plus,
  Search, ChevronRight, Smartphone, Landmark,
  CheckCircle2, X, ArrowRight
} from "lucide-react";
import { beneficiaries, transactions } from "@/lib/data";
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils";

const tabs = ["Transfer", "UPI", "Bills", "History"];

function QRScanner({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] command-overlay flex items-center justify-center"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-80 overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-light)]">
          <p className="font-semibold text-sm">Scan QR Code</p>
          <button onClick={onClose}><X size={16} className="text-[var(--text-tertiary)]" /></button>
        </div>
        <div className="p-6">
          <div className="aspect-square rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center relative overflow-hidden mb-4">
            {/* QR Frame corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--sbi-blue)] rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--sbi-blue)] rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--sbi-blue)] rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--sbi-blue)] rounded-br-lg" />
            <motion.div
              animate={{ y: ["-40%", "40%", "-40%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-4 h-0.5 bg-[var(--sbi-blue)] opacity-70"
            />
            <ScanLine size={48} className="text-[var(--border-medium)]" />
          </div>
          <p className="text-xs text-center text-[var(--text-tertiary)]">
            Point your camera at a UPI QR code to pay instantly
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SendMoneyModal({ beneficiary, onClose }: { beneficiary: typeof beneficiaries[0]; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);
  const quickAmounts = [500, 1000, 2000, 5000];

  const handlePay = () => {
    if (!amount) return;
    setSuccess(true);
    setTimeout(onClose, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] command-overlay flex items-center justify-center"
      onClick={onClose}>
      <motion.div
        initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }} onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-[400px] overflow-hidden shadow-2xl"
      >
        {success ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-14 flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"
            >
              <CheckCircle2 size={32} className="text-emerald-600" />
            </motion.div>
            <p className="font-semibold text-lg">Payment Sent!</p>
            <p className="text-sm text-[var(--text-tertiary)]">₹{amount} sent to {beneficiary.name}</p>
          </motion.div>
        ) : (
          <>
            <div className="p-5 border-b border-[var(--border-light)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: beneficiary.color }}>
                {beneficiary.initials}
              </div>
              <div>
                <p className="font-semibold text-sm">{beneficiary.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{beneficiary.upiId}</p>
              </div>
              <button onClick={onClose} className="ml-auto"><X size={16} className="text-[var(--text-tertiary)]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-[var(--text-tertiary)] font-medium">Amount</label>
                <div className="flex items-center gap-2 mt-1.5 px-4 py-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-light)] focus-within:border-[var(--sbi-blue)]">
                  <span className="text-lg font-bold text-[var(--text-primary)]">₹</span>
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number"
                    placeholder="0" className="flex-1 bg-transparent outline-none text-2xl font-bold tabular-nums" />
                </div>
                <div className="flex gap-2 mt-2">
                  {quickAmounts.map((q) => (
                    <button key={q} onClick={() => setAmount(String(q))}
                      className="flex-1 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] transition-colors">
                      ₹{q.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-tertiary)] font-medium">Add a note</label>
                <input value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="What's it for?" className="w-full mt-1.5 px-4 py-2.5 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-light)] text-sm outline-none focus:border-[var(--sbi-blue)] transition-colors" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handlePay}
                className="w-full py-3 gradient-sbi text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Send size={16} /> Pay {amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "Now"}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("Transfer");
  const [showQR, setShowQR] = useState(false);
  const [selectedBen, setSelectedBen] = useState<typeof beneficiaries[0] | null>(null);

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Send money, pay bills, and manage beneficiaries</p>
        </div>
        <motion.button onClick={() => setShowQR(true)}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--border-medium)] rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors bg-white">
          <ScanLine size={15} /> Scan QR
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-tertiary)] rounded-2xl w-fit mb-6">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn("px-5 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === t ? "bg-white shadow-sm text-[var(--sbi-blue)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Transfer" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Contacts */}
          <div className="col-span-2 space-y-5">
            {/* Favorites */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Favorites</h3>
                <button className="w-7 h-7 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--sbi-blue)] transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex gap-3">
                {beneficiaries.map((b) => (
                  <motion.button key={b.id} onClick={() => setSelectedBen(b)}
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center gap-1.5">
                    <div className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: b.color }}>
                      {b.initials}
                      <Star size={10} className="absolute -top-0.5 -right-0.5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <span className="text-[10px] font-medium text-[var(--text-secondary)]">{b.name.split(" ")[0]}</span>
                    <span className="text-[9px] text-[var(--text-tertiary)]">{b.bank.replace(" Bank", "")}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* All Beneficiaries */}
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm font-semibold flex-1">All Beneficiaries</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-xl">
                  <Search size={12} className="text-[var(--text-tertiary)]" />
                  <input placeholder="Search..." className="text-xs bg-transparent outline-none w-24 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]" />
                </div>
              </div>
              <div className="space-y-2">
                {beneficiaries.map((b) => (
                  <motion.button key={b.id} onClick={() => setSelectedBen(b)}
                    whileHover={{ x: 2 }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: b.color }}>
                      {b.initials}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{b.bank} · {b.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-tertiary)]">{b.upiId}</p>
                    </div>
                    <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--sbi-blue)] transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Transfer */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-4">Quick Transfer</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[var(--text-tertiary)]">Pay To (UPI / Account)</label>
                  <input placeholder="Enter UPI ID or Account No." className="w-full mt-1.5 px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm outline-none border border-[var(--border-light)] focus:border-[var(--sbi-blue)] transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)]">Amount</label>
                  <div className="flex items-center mt-1.5 px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-light)] focus-within:border-[var(--sbi-blue)]">
                    <span className="font-bold mr-2">₹</span>
                    <input type="number" placeholder="0.00" className="flex-1 bg-transparent outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-tertiary)]">Remarks</label>
                  <input placeholder="Optional note" className="w-full mt-1.5 px-3 py-2.5 bg-[var(--bg-tertiary)] rounded-xl text-sm outline-none border border-[var(--border-light)] focus:border-[var(--sbi-blue)] transition-colors" />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3 gradient-sbi text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 mt-2">
                  <Send size={15} /> Send Money
                </motion.button>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-3">Transfer Methods</h3>
              <div className="space-y-2">
                {[
                  { label: "UPI", desc: "Instant", icon: Smartphone },
                  { label: "IMPS", desc: "Instant · 24x7", icon: Send },
                  { label: "NEFT", desc: "2-3 Hrs", icon: Landmark },
                  { label: "RTGS", desc: "Same Day · Min ₹2L", icon: Landmark },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button key={m.label} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                        <Icon size={14} className="text-[var(--sbi-blue)]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-semibold">{m.label}</p>
                        <p className="text-[10px] text-[var(--text-tertiary)]">{m.desc}</p>
                      </div>
                      <ChevronRight size={13} className="text-[var(--text-muted)]" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "UPI" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold">UPI Payments</h3>
            <div className="p-4 bg-[var(--sbi-cyan-light)] rounded-2xl">
              <p className="text-xs text-[var(--text-tertiary)]">Your UPI ID</p>
              <p className="text-lg font-bold text-[var(--sbi-blue)] mt-1">lavish@sbi</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Pay Contact", "Pay UPI ID", "Scan QR", "Set PIN", "UPI Limit", "Transaction History"].map((a) => (
                <button key={a} className="p-3 rounded-xl bg-[var(--bg-tertiary)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] transition-colors text-left">
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">UPI Limit</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">Daily Limit</span>
                <span className="font-semibold">₹1,00,000</span>
              </div>
              <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "23%" }} transition={{ duration: 1 }}
                  className="h-full rounded-full gradient-sbi" />
              </div>
              <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
                <span>Used: ₹23,000</span><span>Remaining: ₹77,000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Bills" && (
        <div className="grid grid-cols-4 gap-4">
          {["Electricity", "Water", "Gas", "Internet", "Mobile", "DTH", "Insurance", "Loan EMI",
            "Credit Card", "FASTag", "Municipality", "Education"].map((b) => (
            <motion.button key={b} whileHover={{ y: -2 }}
              className="card p-4 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-sbi flex items-center justify-center">
                <Landmark size={20} className="text-white opacity-70" />
              </div>
              <span className="text-xs font-medium text-[var(--text-primary)] text-center">{b}</span>
            </motion.button>
          ))}
        </div>
      )}

      {activeTab === "History" && (
        <div className="space-y-2">
          {transactions.filter(t => ["UPI", "NEFT"].includes(t.paymentMethod)).map((txn) => (
            <div key={txn.id} className="card p-4 flex items-center gap-4">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-lg",
                txn.type === "credit" ? "bg-emerald-100" : "bg-[var(--bg-tertiary)]")}>
                {txn.type === "credit" ? "↓" : "↑"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{txn.description}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{txn.paymentMethod} · {txn.ref}</p>
              </div>
              <span className={cn("font-semibold", txn.type === "credit" ? "text-emerald-600" : "")}>
                {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showQR && <QRScanner onClose={() => setShowQR(false)} />}
        {selectedBen && <SendMoneyModal beneficiary={selectedBen} onClose={() => setSelectedBen(null)} />}
      </AnimatePresence>
    </div>
  );
}
