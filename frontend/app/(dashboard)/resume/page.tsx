"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, PiggyBank, UserCheck, CreditCard,
  Clock, ChevronRight, CheckCircle2, Circle,
  Play, ArrowRight
} from "lucide-react";
import { resumeApplications } from "@/lib/data";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  "piggy-bank": PiggyBank,
  "user-check": UserCheck,
  "credit-card": CreditCard,
};

function ProgressRing({ progress, size = 72 }: { progress: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;
  const color = progress >= 80 ? "#10b981" : progress >= 50 ? "#0099cc" : "#f59e0b";

  return (
    <svg width={size} height={size} className="progress-ring shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="14" fontWeight="700" style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>
      </text>
    </svg>
  );
}

function StepperModal({ app, onClose }: { app: typeof resumeApplications[0]; onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(app.currentStep);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center command-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-[var(--border-light)] w-[560px] overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-[var(--border-light)] gradient-sbi text-white">
          <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">Resuming Application</p>
          <h2 className="text-xl font-bold mt-1">{app.type}</h2>
          <p className="text-sm text-blue-200 mt-1">Step {activeStep + 1} of {app.steps.length} · ~{app.estimatedRemaining} remaining</p>
        </div>

        <div className="p-6">
          {/* Stepper */}
          <div className="flex items-center gap-0 mb-8">
            {app.steps.map((step, i) => {
              const done = i < activeStep;
              const active = i === activeStep;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <motion.button
                    onClick={() => setActiveStep(i)}
                    className="flex flex-col items-center gap-1.5 relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                      done ? "bg-[var(--sbi-blue)] border-[var(--sbi-blue)] text-white" :
                      active ? "bg-white border-[var(--sbi-blue)] text-[var(--sbi-blue)]" :
                      "bg-white border-[var(--border-medium)] text-[var(--text-tertiary)]"
                    )}>
                      {done ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    <span className={cn("text-[10px] text-center font-medium whitespace-nowrap",
                      active ? "text-[var(--sbi-blue)]" : done ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
                    )}>
                      {step}
                    </span>
                  </motion.button>
                  {i < app.steps.length - 1 && (
                    <div className={cn("h-0.5 flex-1 mx-1 mb-5 transition-colors",
                      i < activeStep ? "bg-[var(--sbi-blue)]" : "bg-[var(--border-light)]")} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form placeholder */}
          <div className="bg-[var(--bg-tertiary)] rounded-xl p-5 mb-6 min-h-[120px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                <Circle size={20} className="text-[var(--sbi-blue)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{app.steps[activeStep]}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Fill in the details to proceed</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--border-medium)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
              Save & Exit
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => activeStep < app.steps.length - 1 && setActiveStep(activeStep + 1)}
              className="flex-1 py-2.5 rounded-xl gradient-sbi text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              {activeStep === app.steps.length - 1 ? "Submit Application" : "Continue"}
              <ArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ResumePage() {
  const [resuming, setResuming] = useState<typeof resumeApplications[0] | null>(null);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Continue Applications</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Pick up right where you left off — your progress is saved automatically.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-5">
        {resumeApplications.map((app, i) => {
          const Icon = iconMap[app.icon] || Home;
          const color = app.progress >= 80 ? "#10b981" : app.progress >= 50 ? "#0099cc" : "#f59e0b";

          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-6 flex gap-5"
            >
              {/* Progress Ring */}
              <div className="relative shrink-0">
                <ProgressRing progress={app.progress} size={80} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold" style={{ color }}>{app.progress}%</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--bg-tertiary)]">
                      <Icon size={16} className="text-[var(--sbi-blue)]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{app.type}</h3>
                      <div className="flex items-center gap-1 mt-0.5 text-[var(--text-tertiary)]">
                        <Clock size={10} />
                        <span className="text-[10px]">
                          Edited {formatRelativeTime(app.lastEdited)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] px-2 py-1 rounded-full whitespace-nowrap">
                    ~{app.estimatedRemaining} left
                  </span>
                </div>

                {/* Mini Step Bar */}
                <div className="mt-4 mb-4">
                  <div className="flex gap-1">
                    {app.steps.map((_, si) => (
                      <div key={si} className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        si < app.currentStep ? "bg-[var(--sbi-blue)]" :
                        si === app.currentStep ? "bg-[var(--sbi-cyan)]" : "bg-[var(--border-light)]"
                      )} />
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-1.5">
                    Step {app.currentStep + 1} of {app.steps.length} — {app.steps[app.currentStep]}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setResuming(app)}
                  className="flex items-center gap-2 px-4 py-2 gradient-sbi text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  <Play size={12} />
                  Resume Application
                  <ChevronRight size={13} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-6 p-4 rounded-2xl border border-[var(--sbi-cyan-light)] bg-[var(--sbi-cyan-light)] flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-xl bg-[var(--sbi-blue)] flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--sbi-blue)]">Auto-Save is Active</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            All your progress is saved in real-time. You can safely close the browser and resume later.
          </p>
        </div>
      </motion.div>

      {/* Stepper Modal */}
      <AnimatePresence>
        {resuming && <StepperModal app={resuming} onClose={() => setResuming(null)} />}
      </AnimatePresence>
    </div>
  );
}
