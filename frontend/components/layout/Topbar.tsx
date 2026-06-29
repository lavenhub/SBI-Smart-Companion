"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Send,
  ScanLine,
  AlertCircle,
  Wallet,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { user, accounts } from "@/lib/data";
import CommandPalette from "@/components/features/CommandPalette";

const notifications = [
  { id: 1, title: "EMI Due in 3 Days", desc: "Home Loan EMI ₹44,250 due on 15 Jun", time: "Just now", type: "warning", read: false },
  { id: 2, title: "Salary Credited", desc: "₹85,000 from Infosys Ltd", time: "2h ago", type: "success", read: false },
  { id: 3, title: "SIP Executed", desc: "₹5,000 deducted for SBI Blue Chip Fund", time: "Yesterday", type: "info", read: true },
  { id: 4, title: "Security Alert", desc: "New device login detected", time: "2 days ago", type: "danger", read: true },
];

export default function Topbar() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const primaryAccount = accounts[0];

  const handleSignOut = () => {
    setShowProfile(false);
    router.push("/login");
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[var(--border-light)] flex items-center px-6 gap-4 shrink-0 relative z-10">
        {/* Search Bar */}
        <motion.button
          onClick={() => setShowCommandPalette(true)}
          className="flex-1 max-w-md flex items-center gap-3 px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-[var(--text-tertiary)] hover:border-[var(--sbi-blue)] hover:bg-[var(--sbi-cyan-light)] transition-all duration-200 group"
          whileHover={{ scale: 1.005 }}
        >
          <Search size={15} className="text-[var(--text-tertiary)] group-hover:text-[var(--sbi-blue)]" />
          <span className="text-sm flex-1 text-left">What would you like to do today?</span>
          <span className="text-[11px] bg-white border border-[var(--border-light)] rounded-md px-1.5 py-0.5 text-[var(--text-tertiary)] font-mono shadow-sm">⌘K</span>
        </motion.button>

        <div className="flex items-center gap-2 ml-auto">
          {/* Account Balance Card */}
          <motion.div
            className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-light)]"
            whileHover={{ backgroundColor: "var(--sbi-cyan-light)" }}
          >
            <div className="w-7 h-7 rounded-lg gradient-sbi flex items-center justify-center">
              <Wallet size={13} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-tertiary)] leading-none">Available Balance</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-sm font-bold text-[var(--text-primary)] leading-none">
                  {showBalance ? formatNumber(primaryAccount.availableBalance) : "••••••"}
                </p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-[var(--text-tertiary)] hover:text-[var(--sbi-blue)]"
                >
                  {showBalance ? <EyeOff size={11} /> : <Eye size={11} />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Pay */}
          <motion.button
            onClick={() => { sessionStorage.setItem("va-action", "open-pay"); router.push("/upi"); }}
            className="flex items-center gap-2 px-3 py-2 gradient-sbi text-white rounded-xl text-sm font-medium shadow-sm"
            whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(0,51,153,0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <Send size={13} />
            <span className="hidden xl:inline">Quick Pay</span>
          </motion.button>

          {/* Scan QR */}
          <motion.button
            onClick={() => { sessionStorage.setItem("va-action", "open-pay"); router.push("/upi"); }}
            className="flex items-center justify-center w-9 h-9 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--sbi-blue)] hover:border-[var(--sbi-blue)] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Scan QR"
          >
            <ScanLine size={15} />
          </motion.button>

          {/* Emergency */}
          <motion.button
            className="flex items-center justify-center w-9 h-9 bg-red-50 border border-red-100 rounded-xl text-red-500 hover:bg-red-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Emergency Services"
          >
            <AlertCircle size={15} />
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center w-9 h-9 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--sbi-blue)] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="flex items-center justify-center w-9 h-9 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--sbi-blue)] transition-colors relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--danger)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-[var(--border-light)] shadow-xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)]">
                    <p className="text-sm font-semibold">Notifications</p>
                    <button className="text-xs text-[var(--sbi-blue)] font-medium">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors border-b border-[var(--border-light)] last:border-0",
                          !n.read && "bg-[var(--sbi-cyan-light)]"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          n.type === "success" && "bg-emerald-100 text-emerald-600",
                          n.type === "warning" && "bg-amber-100 text-amber-600",
                          n.type === "danger" && "bg-red-100 text-red-600",
                          n.type === "info" && "bg-blue-100 text-blue-600",
                        )}>
                          {n.type === "success" && <Check size={13} />}
                          {n.type === "warning" && <AlertCircle size={13} />}
                          {n.type === "danger" && <X size={13} />}
                          {n.type === "info" && <Bell size={13} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">{n.title}</p>
                          <p className="text-xs text-[var(--text-tertiary)] mt-0.5 leading-snug">{n.desc}</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-1">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--sbi-blue)] mt-1.5 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="w-8 h-8 rounded-xl gradient-sbi flex items-center justify-center text-white text-sm font-bold">
                {user.firstName[0]}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-[var(--text-primary)] leading-none">{user.firstName}</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Premium Member</p>
              </div>
              <ChevronDown size={13} className="text-[var(--text-tertiary)] hidden xl:block" />
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-[var(--border-light)] shadow-xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-[var(--border-light)] bg-gradient-to-br from-blue-50 to-white">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{user.accountNumber}</p>
                  </div>
                  {["My Profile", "Account Settings", "Security", "Linked Devices", "Help & Support"].map((item) => (
                    <button key={item} className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                      {item}
                    </button>
                  ))}
                  <div className="border-t border-[var(--border-light)]">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <CommandPalette onClose={() => setShowCommandPalette(false)} />
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotifications(false); setShowProfile(false); }}
        />
      )}
    </>
  );
}
