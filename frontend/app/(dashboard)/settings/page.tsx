"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Lock, Bell, Smartphone, Globe,
  Shield, CreditCard, ChevronRight,
  CheckCircle2, Eye, EyeOff
} from "lucide-react";
import { user } from "@/lib/data";
import { cn } from "@/lib/utils";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "devices", label: "Linked Devices", icon: Smartphone },
  { id: "privacy", label: "Privacy", icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState({
    sms: true, email: true, push: true, upi: true, bills: true, offers: false, login: true,
  });
  const [showPAN, setShowPAN] = useState(false);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border-light)] p-4 bg-white space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 mb-3">Settings</p>
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                activeSection === s.id
                  ? "bg-[rgba(0,51,153,0.07)] text-[var(--sbi-blue)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              )}>
              <Icon size={15} />{s.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {activeSection === "profile" && (
          <>
            <h2 className="text-lg font-bold">Profile Settings</h2>
            <div className="card p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-sbi flex items-center justify-center text-white text-2xl font-bold">
                  {user.firstName[0]}
                </div>
                <div>
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-sm text-[var(--text-tertiary)]">{user.customerId} · KYC Verified ✓</p>
                </div>
                <button className="ml-auto text-sm font-medium text-[var(--sbi-blue)] px-4 py-2 rounded-xl border border-[var(--sbi-blue)] hover:bg-[var(--sbi-cyan-light)] transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: user.name },
                  { label: "Email", value: user.email },
                  { label: "Mobile", value: user.phone },
                  { label: "PAN", value: showPAN ? user.pan : "ABCPS****" },
                  { label: "Aadhar", value: user.aadhar },
                  { label: "Branch", value: user.branch },
                ].map((f) => (
                  <div key={f.label} className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{f.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-semibold">{f.value}</p>
                      {f.label === "PAN" && (
                        <button onClick={() => setShowPAN(!showPAN)} className="text-[var(--text-tertiary)]">
                          {showPAN ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === "notifications" && (
          <>
            <h2 className="text-lg font-bold">Notification Preferences</h2>
            <div className="card p-6 space-y-4">
              {Object.entries(notifications).map(([key, val]) => {
                const labels: Record<string, { title: string; desc: string }> = {
                  sms: { title: "SMS Alerts", desc: "Receive transaction alerts via SMS" },
                  email: { title: "Email Notifications", desc: "Get statements and alerts on email" },
                  push: { title: "Push Notifications", desc: "App notifications on your device" },
                  upi: { title: "UPI Alerts", desc: "Alerts for every UPI transaction" },
                  bills: { title: "Bill Reminders", desc: "Reminders 3 days before due date" },
                  offers: { title: "Offers & Promotions", desc: "Exclusive deals and cashback" },
                  login: { title: "Login Alerts", desc: "Alert when your account is accessed" },
                };
                const info = labels[key];
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-[var(--border-light)] last:border-0">
                    <div>
                      <p className="text-sm font-medium">{info.title}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{info.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                      className={cn("relative w-10 h-5.5 h-6 rounded-full transition-colors",
                        val ? "bg-[var(--sbi-blue)]" : "bg-[var(--border-medium)]"
                      )}
                    >
                      <motion.div
                        animate={{ x: val ? 18 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeSection === "security" && (
          <>
            <h2 className="text-lg font-bold">Security Settings</h2>
            <div className="card p-6 space-y-3">
              {[
                { label: "Change Password", desc: "Last changed 3 months ago", action: "Change" },
                { label: "Change MPIN", desc: "4/6 digit PIN for mobile banking", action: "Update" },
                { label: "Two-Factor Authentication", desc: "OTP via SMS/Email", action: "Enabled ✓" },
                { label: "Biometric Login", desc: "Fingerprint / Face ID", action: "Enable" },
                { label: "Login History", desc: "View all recent sessions", action: "View" },
                { label: "Block All Transactions", desc: "Emergency freeze", action: "Block" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{s.desc}</p>
                  </div>
                  <button className={cn("text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors",
                    s.action.includes("✓") ? "border-emerald-200 text-emerald-600 bg-emerald-50" :
                    s.action === "Block" ? "border-red-200 text-red-500 bg-red-50 hover:bg-red-100" :
                    "border-[var(--border-medium)] text-[var(--text-secondary)] hover:bg-white"
                  )}>
                    {s.action}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {(activeSection === "devices" || activeSection === "privacy") && (
          <div className="flex items-center justify-center h-48 text-[var(--text-tertiary)]">
            <div className="text-center">
              <CheckCircle2 size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">This section is coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
