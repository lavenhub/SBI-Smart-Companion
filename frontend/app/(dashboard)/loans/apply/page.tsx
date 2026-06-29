"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, CheckCircle2, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LOAN_STEPS = [
  {
    name: "Personal Details",
    fields: [
      { key: "firstName", label: "First Name", placeholder: "e.g. Lavish" },
      { key: "lastName", label: "Last Name", placeholder: "e.g. Kumar" },
      { key: "dob", label: "Date of Birth", placeholder: "DD/MM/YYYY", type: "date" },
      { key: "pan", label: "PAN Number", placeholder: "e.g. ABCDE1234F" },
      { key: "aadhar", label: "Aadhaar Number", placeholder: "12-digit number" },
      { key: "mobile", label: "Mobile", placeholder: "10-digit number" },
    ],
  },
  {
    name: "Employment Details",
    fields: [
      { key: "employerName", label: "Employer / Company Name", placeholder: "e.g. Infosys Ltd." },
      { key: "employmentType", label: "Employment Type", placeholder: "Salaried / Self-Employed" },
      { key: "monthlyIncome", label: "Monthly Net Income (₹)", placeholder: "e.g. 75000" },
      { key: "workExperience", label: "Work Experience (years)", placeholder: "e.g. 4" },
      { key: "officeAddress", label: "Office Address", placeholder: "Street, City, PIN" },
      { key: "hrEmail", label: "HR / Office Email", placeholder: "hr@company.com" },
    ],
  },
  {
    name: "Loan Details",
    fields: [
      { key: "loanAmount", label: "Loan Amount Required (₹)", placeholder: "e.g. 3000000" },
      { key: "tenure", label: "Tenure (months)", placeholder: "e.g. 240 (20 years)" },
      { key: "purpose", label: "Loan Purpose", placeholder: "e.g. Home Purchase" },
      { key: "propertyAddress", label: "Property Address", placeholder: "Full address of property" },
      { key: "existingEmi", label: "Existing EMI Obligations (₹)", placeholder: "e.g. 0" },
      { key: "coApplicant", label: "Co-Applicant Name (if any)", placeholder: "Optional" },
    ],
  },
  {
    name: "Document Upload",
    fields: [
      { key: "salarySlip", label: "Latest 3 Salary Slips", placeholder: "File name / upload reference" },
      { key: "bankStatement", label: "6-Month Bank Statement", placeholder: "File name / upload reference" },
      { key: "idProof", label: "Identity Proof (PAN / Aadhaar)", placeholder: "File name / upload reference" },
      { key: "addressProof", label: "Address Proof", placeholder: "File name / upload reference" },
      { key: "employmentLetter", label: "Employment / Offer Letter", placeholder: "File name / upload reference" },
      { key: "propertyDocs", label: "Property Documents", placeholder: "File name / upload reference" },
    ],
  },
  {
    name: "Review & Submit",
    fields: [],
  },
];

const DRAFT_KEY = "loan-application-draft";

function saveDraftLocally(step: number, data: Record<string, string>) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, data, savedAt: new Date().toISOString() }));
  } catch {}
}

function loadDraftLocally(): { step: number; data: Record<string, string>; savedAt: string } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function LoanApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraftLocally();
    if (draft) {
      setCurrentStep(draft.step);
      setFormData(draft.data);
      setLastSaved(new Date(draft.savedAt));
    }
    setInitialized(true);
  }, []);

  // Listen for Voice Agent Auto-fill
  useEffect(() => {
    const handleAutofill = () => {
      setFormData(prev => ({
        ...prev,
        firstName: "Lavish",
        lastName: "Patil",
        dob: "1992-05-14",
        pan: "ABCDE1234F",
        aadhar: "9876 5432 1098",
        mobile: "9876543210",
        employerName: "Infosys Ltd.",
        employmentType: "Salaried",
        monthlyIncome: "85000",
        workExperience: "6",
        salarySlip: "Vault: Payslips_Q2.pdf",
        bankStatement: "Vault: HDFC_Stmt_6M.pdf",
        idProof: "Vault: PAN_Card.pdf",
        addressProof: "Vault: Aadhaar_Card.pdf"
      }));
      // Auto-save the new data
      saveProgress(currentStep, {
        firstName: "Lavish", lastName: "Patil", dob: "1992-05-14", pan: "ABCDE1234F", aadhar: "9876 5432 1098",
        mobile: "9876543210", employerName: "Infosys Ltd.", employmentType: "Salaried", monthlyIncome: "85000",
        workExperience: "6", salarySlip: "Vault: Payslips_Q2.pdf", bankStatement: "Vault: HDFC_Stmt_6M.pdf",
        idProof: "Vault: PAN_Card.pdf", addressProof: "Vault: Aadhaar_Card.pdf"
      });
    };
    window.addEventListener("va-autofill", handleAutofill);
    return () => window.removeEventListener("va-autofill", handleAutofill);
  }, [currentStep]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveProgress = (stepIndex: number, data: Record<string, string>) => {
    setIsSaving(true);
    saveDraftLocally(stepIndex, data);
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
    }, 500);
  };

  const handleBlur = () => saveProgress(currentStep, formData);

  const handleNext = async () => {
    saveProgress(currentStep, formData);
    if (currentStep < LOAN_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitApplication();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push("/loans");
    }
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    localStorage.removeItem(DRAFT_KEY);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[var(--sbi-blue)]" size={32} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <CheckCircle2 size={80} className="text-emerald-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-center">Application Submitted! 🎉</h1>
        <p className="text-[var(--text-secondary)] text-center max-w-sm">
          Your Home Loan application has been received. Our team will contact you within 2-3 working days.
        </p>
        <p className="text-sm text-[var(--text-tertiary)]">Reference: SBI-HL-{Date.now().toString().slice(-8)}</p>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/loans")}
          className="px-8 py-3 gradient-sbi text-white font-bold rounded-xl shadow-md"
        >
          Back to Loans
        </motion.button>
      </div>
    );
  }

  const stepDef = LOAN_STEPS[currentStep];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Home Loan Application</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Step {currentStep + 1} of {LOAN_STEPS.length}: {stepDef.name}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full">
          {isSaving ? (
            <><Loader2 size={12} className="animate-spin" /> Saving draft...</>
          ) : lastSaved ? (
            <><Save size={12} className="text-emerald-500" /> Saved {lastSaved.toLocaleTimeString()}</>
          ) : (
            <><Save size={12} /> Auto-save on</>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {LOAN_STEPS.map((step, idx) => (
          <div key={idx} className="flex-1 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <motion.div
              className={cn("h-full", idx < currentStep ? "bg-emerald-500" : "bg-[var(--sbi-blue)]")}
              initial={{ width: "0%" }}
              animate={{ width: idx <= currentStep ? "100%" : "0%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex gap-2">
        {LOAN_STEPS.map((step, idx) => (
          <div key={idx} className="flex-1 text-center">
            <p className={cn("text-[10px] font-semibold truncate",
              idx === currentStep ? "text-[var(--sbi-blue)]" : idx < currentStep ? "text-emerald-500" : "text-[var(--text-tertiary)]"
            )}>
              {idx < currentStep ? "✓ " : ""}{step.name}
            </p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="card p-8 min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-bold border-b border-[var(--border-light)] pb-4">{stepDef.name}</h2>

            {currentStep < LOAN_STEPS.length - 1 ? (
              <div className="grid grid-cols-2 gap-5">
                {stepDef.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                      {field.label}
                    </label>
                    <input
                      type={(field as any).type || "text"}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-medium)] bg-[var(--bg-tertiary)] focus:bg-white focus:border-[var(--sbi-blue)] focus:ring-1 focus:ring-[var(--sbi-blue)] outline-none transition-all text-sm"
                      value={formData[field.key] || ""}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      onBlur={handleBlur}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Review step */
              <div className="space-y-5">
                <p className="text-sm text-[var(--text-secondary)]">Please review your application details below before submitting.</p>
                {LOAN_STEPS.slice(0, -1).map((s) => (
                  <div key={s.name}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--sbi-blue)] mb-2">{s.name}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {s.fields.map((f) => (
                        <div key={f.key} className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                          <p className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">{f.label}</p>
                          <p className="text-sm font-medium mt-0.5 truncate">{formData[f.key] || <span className="text-[var(--text-tertiary)] italic text-xs">Not filled</span>}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-[var(--sbi-cyan-light)] rounded-xl">
                  <p className="text-sm font-medium text-[var(--sbi-blue)]">
                    By submitting, you agree to the terms and conditions and authorize SBI to process your loan request.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => { saveProgress(currentStep, formData); router.push("/loans"); }}
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--sbi-blue)] transition-colors"
        >
          Save & Exit
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={isSaving || isSubmitting}
          className="flex items-center gap-2 px-6 py-3 gradient-sbi text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-70"
        >
          {isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" /> Submitting...</>
          ) : currentStep === LOAN_STEPS.length - 1 ? (
            "Submit Application"
          ) : (
            <>Continue <ChevronRight size={16} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
