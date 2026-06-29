"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, User, Mail, Phone, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", dob: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(2); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a5e] via-[#003399] to-[#0047cc] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5" />
      </div>

      <div className="w-full max-w-[440px] relative">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 border border-white/20 mb-3">
            <span className="text-white font-black text-2xl">Y</span>
          </div>
          <h1 className="text-white text-xl font-bold">Create Your YONO Account</h1>
          <p className="text-blue-200 text-xs mt-1">Join 500 million SBI customers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}
        >
          {/* Step indicator */}
          <div className="flex border-b border-gray-100">
            {[
              { n: 1, label: "Personal Info" },
              { n: 2, label: "Security Setup" },
            ].map((s) => (
              <div key={s.n} className={`flex-1 py-3 text-center text-xs font-semibold transition-colors ${
                step === s.n ? "bg-[#003399] text-white" : step > s.n ? "bg-emerald-50 text-emerald-600" : "text-gray-400"
              }`}>
                {step > s.n ? <span className="inline-flex items-center gap-1"><CheckCircle2 size={12} /> Done</span> : `${s.n}. ${s.label}`}
              </div>
            ))}
          </div>

          <form onSubmit={handleNext} className="p-7 space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">First Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
                        placeholder="Lavish" required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Last Name</label>
                    <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
                      placeholder="Sharma" required
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                      placeholder="lavish@email.com" required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Mobile Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                      placeholder="9876543210" maxLength={10} required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 mb-1">
                  <p className="text-xs font-semibold text-[#003399] mb-0.5">Welcome, {form.firstName}!</p>
                  <p className="text-[11px] text-gray-500">Set up a strong password for your account</p>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Min 8 chars, uppercase, number, special" required minLength={8}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <div className="mt-1.5 flex gap-1">
                    {["8+ chars", "Uppercase", "Number", "Symbol"].map((r, i) => (
                      <span key={r} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        (i===0 && form.password.length>=8) || (i===1 && /[A-Z]/.test(form.password)) ||
                        (i===2 && /\d/.test(form.password)) || (i===3 && /[^A-Za-z0-9]/.test(form.password))
                          ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                      }`}>{r}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
                  By creating an account, you agree to SBI's Terms of Service and Privacy Policy.
                  Your account is protected by RBI guidelines.
                </div>
              </>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #003399, #0047cc)" }}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              ) : step < 2 ? "Continue →" : "Create Account"}
            </motion.button>
          </form>

          <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button onClick={() => step > 1 ? setStep(1) : router.push("/login")}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
              <ArrowLeft size={12} /> {step > 1 ? "Back" : "Already have an account?"}
            </button>
            {step === 1 && (
              <button onClick={() => router.push("/login")} className="text-xs text-[#003399] font-semibold hover:underline">
                Sign In
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
