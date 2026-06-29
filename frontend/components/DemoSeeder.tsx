"use client";

import { useEffect, useState } from "react";

const VAULT_KEY = "sbi-vault-receipts";
const PERSONAL_KEY = "sbi-vault-personal";
const SEEDED_KEY = "sbi-demo-seeded-v2";

const DEMO_RECEIPTS = [
  {
    id: "demo-1",
    upiId: "electricity@sbi",
    amount: 2150,
    note: "Electricity Bill - June",
    category: "Bills",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-2",
    upiId: "water@mcgm",
    amount: 480,
    note: "Water Bill - June",
    category: "Bills",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-3",
    upiId: "zomato@icici",
    amount: 650,
    note: "Dinner at Cafe 9",
    category: "Dining",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-4",
    upiId: "amazon@apl",
    amount: 3499,
    note: "Headphones - Sony WH",
    category: "Shopping",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-5",
    upiId: "irctc@sbi",
    amount: 1280,
    note: "Train ticket - Mumbai to Pune",
    category: "Travel",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEMO_PERSONAL_DOCS = [
  {
    id: "doc-1",
    name: "Lavish_Patil_KYC_Details.txt",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "doc-2",
    name: "PAN_Card_ABCDE1234F.pdf",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "doc-3",
    name: "Aadhaar_9876_5432_1098.pdf",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function DemoSeeder() {
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);

  useEffect(() => {
    // Seed demo data only once per browser
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(VAULT_KEY, JSON.stringify(DEMO_RECEIPTS));
      localStorage.setItem(PERSONAL_KEY, JSON.stringify(DEMO_PERSONAL_DOCS));
      localStorage.setItem(SEEDED_KEY, "true");
      // Notify vault components
      window.dispatchEvent(new Event("vault-updated"));
    }

    // Warn if not Chrome/Edge (Voice Agent won't work)
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    if (!isChrome && !isEdge) {
      setShowBrowserWarning(true);
    }
  }, []);

  if (!showBrowserWarning) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      background: "linear-gradient(90deg, #f59e0b, #d97706)",
      color: "#fff",
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 13,
      fontWeight: 600,
      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
    }}>
      <span>
        ⚠️ Voice Agent requires <strong>Google Chrome or Edge</strong> for microphone features. Some features may not work in this browser.
      </span>
      <button
        onClick={() => setShowBrowserWarning(false)}
        style={{
          background: "rgba(255,255,255,0.25)",
          border: "none",
          color: "#fff",
          borderRadius: 8,
          padding: "4px 12px",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 12,
        }}
      >
        Got it
      </button>
    </div>
  );
}
