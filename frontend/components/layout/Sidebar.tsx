"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Landmark,
  CreditCard,
  Send,
  Smartphone,
  TrendingUp,
  Shield,
  ShoppingBag,
  Bot,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Landmark },
  { href: "/payments", label: "Payments", icon: Send },
  { href: "/upi", label: "UPI", icon: Smartphone },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/loans", label: "Loans", icon: Banknote },
  { href: "/investments", label: "Investments", icon: TrendingUp },
  { href: "/insurance", label: "Insurance", icon: Shield },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  {
    href: "/smart-companion",
    label: "Smart Companion",
    icon: Bot,
    isNew: true,
    glow: true,
  },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/resume", label: "Continue Apps", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full bg-white border-r border-[var(--border-light)] shrink-0 overflow-hidden z-20"
      style={{ boxShadow: "1px 0 0 0 var(--border-light)" }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[var(--border-light)] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg gradient-sbi flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-bold text-[var(--sbi-blue)] leading-none">YONO</p>
                <p className="text-[10px] text-[var(--text-tertiary)] leading-none mt-0.5 whitespace-nowrap">Smart Companion</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  "relative flex items-center mx-2 my-0.5 rounded-xl cursor-pointer group transition-all duration-150",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-[rgba(0,51,153,0.07)] text-[var(--sbi-blue)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                )}
                whileHover={{ x: collapsed ? 0 : 2 }}
                transition={{ duration: 0.1 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--sbi-blue)] rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                {/* Icon with glow for Smart Companion */}
                <div className="relative shrink-0">
                  <Icon
                    size={18}
                    className={cn(
                      item.glow && !isActive ? "text-[var(--sbi-cyan)]" : "",
                      isActive ? "text-[var(--sbi-blue)]" : ""
                    )}
                  />
                  {item.glow && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--sbi-cyan)] glow-pulse" />
                  )}
                </div>

                {/* Label */}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* New badge */}
                {item.isNew && !collapsed && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[9px] font-bold bg-[var(--sbi-cyan)] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                  >
                    New
                  </motion.span>
                )}

                {/* Tooltip on collapse */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[var(--text-primary)] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-[var(--text-primary)]" />
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-[var(--border-light)]">
        <motion.button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center rounded-xl text-[var(--text-tertiary)] hover:text-[var(--danger)] hover:bg-red-50 transition-colors duration-150",
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
          )}
          whileHover={{ x: collapsed ? 0 : 2 }}
        >
          <LogOut size={18} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[var(--border-medium)] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-30 text-[var(--text-secondary)] hover:text-[var(--sbi-blue)]"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
