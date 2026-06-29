"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, Plane, Hotel, Smartphone,
  Tag, Gift, Star, ChevronRight, Search,
  Percent, Clock, ArrowRight
} from "lucide-react";
import { marketplaceItems } from "@/lib/data";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Deals", icon: ShoppingBag },
  { id: "Travel", label: "Travel", icon: Plane },
  { id: "Hotels", label: "Hotels", icon: Hotel },
  { id: "Electronics", label: "Electronics", icon: Smartphone },
  { id: "Shopping", label: "Shopping", icon: Tag },
];

const featured = [
  { title: "SBI ELITE Exclusive", desc: "10% cashback on all electronics this weekend", badge: "Limited Time", color: "#003399" },
  { title: "Travel Season", desc: "Up to 30% off on flights + hotel combos", badge: "New", color: "#0099cc" },
  { title: "EMI Fest", desc: "0% EMI on all purchases above ₹10,000", badge: "Hot", color: "#8b5cf6" },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = marketplaceItems.filter((m) => {
    const matchCat = activeCategory === "all" || m.category === activeCategory;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Exclusive deals for SBI customers</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[var(--border-light)] w-64">
          <Search size={14} className="text-[var(--text-tertiary)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals..." className="flex-1 text-sm outline-none bg-transparent" />
        </div>
      </div>

      {/* Featured Banners */}
      <div className="grid grid-cols-3 gap-4">
        {featured.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="relative rounded-2xl p-5 text-white cursor-pointer overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${f.color} 0%, ${f.color}99 100%)` }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">{f.badge}</span>
            <p className="font-bold mt-2">{f.title}</p>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">{f.desc}</p>
            <button className="flex items-center gap-1 text-xs font-semibold mt-3 hover:gap-2 transition-all">
              Explore <ArrowRight size={12} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                activeCategory === cat.id
                  ? "gradient-sbi text-white shadow-sm"
                  : "bg-white border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              )}>
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
            className="card overflow-hidden cursor-pointer group"
          >
            {/* Image placeholder */}
            <div className="h-36 gradient-sbi relative flex items-center justify-center">
              <div className="text-white opacity-20">
                <ShoppingBag size={48} />
              </div>
              {item.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  -{item.discount}%
                </span>
              )}
              <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                {item.tag}
              </span>
            </div>

            <div className="p-4">
              <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{item.category}</p>
              <p className="text-sm font-semibold mt-0.5 line-clamp-2">{item.name}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-base font-bold text-[var(--sbi-blue)]">₹{item.price.toLocaleString("en-IN")}</p>
                {item.originalPrice > item.price && (
                  <p className="text-xs text-[var(--text-tertiary)] line-through">₹{item.originalPrice.toLocaleString("en-IN")}</p>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-medium">
                <Percent size={10} />
                Save ₹{(item.originalPrice - item.price).toLocaleString("en-IN")}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 rounded-xl bg-[var(--bg-tertiary)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] transition-colors">
                  View
                </button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2 rounded-xl gradient-sbi text-white text-xs font-semibold">
                  Buy Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rewards Section */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Gift size={18} className="text-[var(--sbi-blue)]" />
          <h3 className="text-sm font-semibold">Redeem Reward Points</h3>
          <span className="ml-auto text-sm font-bold text-[var(--sbi-blue)]">12,840 pts available</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "Amazon Voucher", pts: 1000, value: "₹100" },
            { name: "Flipkart Gift Card", pts: 2500, value: "₹250" },
            { name: "Movie Tickets", pts: 500, value: "2 tickets" },
            { name: "Flight Discount", pts: 5000, value: "₹500 off" },
          ].map((r) => (
            <motion.button key={r.name} whileHover={{ y: -2 }}
              className="p-3 rounded-2xl border border-[var(--border-light)] text-left hover:border-[var(--sbi-blue)] hover:shadow-sm transition-all">
              <p className="text-xs font-semibold">{r.name}</p>
              <p className="text-lg font-bold text-[var(--sbi-blue)] mt-1">{r.value}</p>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{r.pts.toLocaleString()} pts</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
