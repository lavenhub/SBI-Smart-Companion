"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, ArrowRight, Smartphone, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Small delay to simulate auth
    await new Promise((r) => setTimeout(r, 800));

    // Accept demo credentials or any non-empty input
    if (identifier && password) {
      router.push("/dashboard");
    } else {
      setError("Please enter your credentials.");
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setIdentifier("lavish.sharma@email.com");
    setPassword("SBI@12345");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a5e] via-[#003399] to-[#0047cc] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white/3" />
      </div>

      <div className="w-full max-w-[420px] relative">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
            <span className="text-white font-black text-3xl">Y</span>
          </div>
          <h1 className="text-white text-2xl font-bold">YONO Smart Companion</h1>
          <p className="text-blue-200 text-sm mt-1">State Bank of India · YONO 3.0</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}
        >
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to your SBI account</p>

            {/* Demo credentials banner */}
            <button
              type="button"
              onClick={fillDemo}
              className="w-full mb-5 p-3 rounded-xl bg-blue-50 border border-blue-100 text-left flex items-center gap-3 hover:bg-blue-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#003399] flex items-center justify-center shrink-0">
                <Shield size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#003399]">Use Demo Account</p>
                <p className="text-[10px] text-gray-500">lavish.sharma@email.com · SBI@12345</p>
              </div>
              <ArrowRight size={14} className="text-[#003399] shrink-0" />
            </button>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Identifier */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or 10-digit mobile"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  Password / MPIN
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Remember this device
                </label>
                <button type="button" className="text-xs text-[#003399] font-semibold hover:underline">
                  Forgot Password?
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #003399, #0047cc)" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Secure Sign In
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Biometric / OTP */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Smartphone size={14} />
                OTP Login
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Shield size={14} />
                Biometric
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">New to YONO?</p>
            <button
              onClick={() => router.push("/register")}
              className="text-xs text-[#003399] font-semibold hover:underline"
            >
              Create Account →
            </button>
          </div>
        </motion.div>

        {/* Security note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-blue-200/60 text-[11px] mt-5"
        >
          🔒 256-bit SSL encrypted · RBI regulated · Your data is safe
        </motion.p>
      </div>
    </div>
  );
}
