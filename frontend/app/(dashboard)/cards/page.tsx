"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Eye, EyeOff, Lock, Unlock,
  ShieldOff, Settings, Gift, Globe,
  ArrowUpRight, Wifi, CheckCircle2
} from "lucide-react";
import { cards } from "@/lib/data";
import { formatCurrency, cn } from "@/lib/utils";

function CardVisual({ card, flipped }: { card: typeof cards[0]; flipped: boolean }) {
  return (
    <div className="relative w-full" style={{ perspective: 1000 }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full"
      >
        {/* Front */}
        <div className="w-full aspect-[1.6/1] rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}cc 60%, #0099cc 100%)`, backfaceVisibility: "hidden" }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute bottom-0 right-16 w-24 h-24 rounded-full bg-white/10" />
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">State Bank of India</p>
              <p className="text-xs font-semibold mt-0.5">{card.name}</p>
            </div>
            <Wifi size={20} className="text-white/60 rotate-90" />
          </div>
          <p className="text-lg font-mono tracking-[0.2em] font-bold">{card.number}</p>
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-[9px] text-white/60 uppercase tracking-wide">Card Holder</p>
              <p className="text-sm font-bold tracking-wide mt-0.5">{card.holder}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/60 uppercase tracking-wide">Expires</p>
              <p className="text-sm font-bold mt-0.5">{card.expiry}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/60 uppercase tracking-wide">Network</p>
              <p className="text-sm font-bold mt-0.5">{card.network}</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full aspect-[1.6/1] rounded-2xl overflow-hidden text-white"
          style={{ background: `linear-gradient(135deg, ${card.color} 0%, #0d1b3e 100%)`, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="mt-8 h-10 bg-black/40 w-full" />
          <div className="px-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-8 bg-white/10 rounded" />
              <div className="w-16 h-8 bg-white rounded flex items-center justify-center">
                <p className="text-[var(--text-primary)] font-mono font-bold text-sm">{card.cvv}</p>
              </div>
            </div>
            <p className="text-[9px] text-white/60 mt-2 text-right">CVV</p>
          </div>
          <p className="px-6 mt-4 text-[10px] text-white/50 leading-relaxed">
            This card is property of State Bank of India. If found, please call 1800-11-2211.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function CardsPage() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [blocked, setBlocked] = useState<Record<string, boolean>>({});
  const [activeCard, setActiveCard] = useState(cards[0].id);

  const card = cards.find(c => c.id === activeCard)!;

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cards</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Manage your debit and credit cards</p>
      </div>

      {/* Card selector */}
      <div className="flex gap-3 mb-6">
        {cards.map((c) => (
          <button key={c.id} onClick={() => setActiveCard(c.id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
              activeCard === c.id
                ? "border-[var(--sbi-blue)] bg-[rgba(0,51,153,0.06)] text-[var(--sbi-blue)]"
                : "border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            )}>
            <CreditCard size={14} />
            {c.type === "debit" ? "Debit Card" : "ELITE Credit Card"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Card visual + controls */}
        <div className="col-span-2 space-y-4">
          <div className="relative">
            <CardVisual card={card} flipped={!!flipped[card.id]} />
            {blocked[card.id] && (
              <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center text-white">
                  <Lock size={28} className="mx-auto mb-2" />
                  <p className="font-semibold">Card Blocked</p>
                </div>
              </div>
            )}
          </div>

          {/* Card controls */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: flipped[card.id] ? "Hide CVV" : "Show CVV", icon: flipped[card.id] ? EyeOff : Eye, action: () => setFlipped(f => ({...f, [card.id]: !f[card.id]})) },
              { label: blocked[card.id] ? "Unblock" : "Block Card", icon: blocked[card.id] ? Unlock : ShieldOff, action: () => setBlocked(b => ({...b, [card.id]: !b[card.id]})), danger: !blocked[card.id] },
              { label: "Manage Limits", icon: Settings, action: () => {} },
              { label: "International", icon: Globe, action: () => {} },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <motion.button key={btn.label} onClick={btn.action}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all",
                    btn.danger
                      ? "border-red-100 text-red-500 bg-red-50 hover:bg-red-100"
                      : "border-[var(--border-light)] text-[var(--text-secondary)] bg-white hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] hover:border-[var(--sbi-cyan)]"
                  )}>
                  <Icon size={13} /> {btn.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Details + Offers */}
        <div className="col-span-3 space-y-4">
          {/* Stats */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-4">Card Overview</h3>
            {card.type === "credit" ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">Credit Limit</span>
                  <span className="font-semibold">{formatCurrency(card.limit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">Amount Used</span>
                  <span className="font-semibold text-amber-500">{formatCurrency(card.used)}</span>
                </div>
                <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(card.used / card.limit) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-amber-400"
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
                  <span>{Math.round((card.used / card.limit) * 100)}% used</span>
                  <span>Available: {formatCurrency(card.limit - card.used)}</span>
                </div>
                <div className="pt-2 border-t border-[var(--border-light)] flex justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">Cashback Earned</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(card.cashbackEarned)}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Daily ATM Limit", value: "₹40,000" },
                  { label: "Daily POS Limit", value: "₹1,00,000" },
                  { label: "Online Limit", value: "₹1,00,000" },
                  { label: "International", value: "Disabled" },
                ].map((s) => (
                  <div key={s.label} className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                    <p className="text-[10px] text-[var(--text-tertiary)]">{s.label}</p>
                    <p className="text-sm font-bold mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offers */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Gift size={16} className="text-[var(--sbi-blue)]" />
              <h3 className="text-sm font-semibold">Active Offers</h3>
            </div>
            <div className="space-y-2.5">
              {card.offers.map((offer, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-[var(--sbi-cyan-light)] rounded-xl">
                  <CheckCircle2 size={14} className="text-[var(--sbi-blue)] shrink-0" />
                  <p className="text-xs font-medium text-[var(--sbi-blue)]">{offer}</p>
                  <button className="ml-auto text-xs text-[var(--sbi-blue)] font-semibold flex items-center gap-0.5">
                    Use <ArrowUpRight size={11} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
