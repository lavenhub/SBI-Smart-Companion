"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Sparkles, Mic, Paperclip,
  TrendingUp, CreditCard, Banknote, PiggyBank,
  BarChart3, Shield, Zap, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
};

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello Lavish! 👋 I'm your YONO Smart Companion. I can help you with banking queries, financial analysis, and personalized recommendations.\n\nHow can I assist you today?",
    timestamp: new Date(Date.now() - 5000),
    suggestions: [
      "What's my spending this month?",
      "Should I invest in FD or Mutual Funds?",
      "How can I reduce my loan interest?",
      "Show my credit score analysis",
    ],
  },
];

const botResponses: Record<string, string> = {
  "spending": "📊 **June 2024 Spending Analysis:**\n\n• Housing: ₹22,000 (31%)\n• Loan EMIs: ₹18,500 (26%)\n• Shopping: ₹15,499 (22%)\n• Food: ₹3,240 (5%)\n• Travel: ₹2,199 (3%)\n\n💡 **Insight:** Your housing costs are well within the 30% guideline. Consider increasing your SIP by ₹2,000/month.",
  "fd": "📈 **FD vs Mutual Funds — My Recommendation:**\n\nFor your risk profile (Moderate):\n\n**Fixed Deposits** — Best for:\n✓ Emergency fund (3-6 months expenses)\n✓ Short-term goals (< 2 years)\n✓ Capital protection priority\n\n**Mutual Funds** — Best for:\n✓ Long-term wealth building (> 5 years)\n✓ Inflation-beating returns (12-15% p.a.)\n✓ Tax-efficient via ELSS\n\n💡 **Recommendation:** Keep ₹2L in FD (emergency fund) and invest surplus in SBI Blue Chip Fund.",
  "loan": "🏦 **Loan Optimization Analysis:**\n\nYour Home Loan (₹42.3L at 8.5%):\n\n• Prepaying ₹2L today → saves ₹4.8L in interest\n• Balance Transfer to 8.1% rate → saves ₹1.2L/year\n• Part-prepayment of ₹50K/month → reduces tenure by 4 years\n\n⚡ **Quick Win:** Request SBI for interest rate reset — you may qualify for 8.2% based on current rates.",
  "credit": "💳 **Credit Score Analysis:**\n\n**Your Score: 782 / 900 (Very Good)**\n\n✅ Payment History: Excellent (100%)\n✅ Credit Utilization: 17.5% (Ideal < 30%)\n⚠️ Credit Age: 4.2 years (Building)\n✅ Credit Mix: Good (3 types)\n\n💡 **To reach 800+:**\n• Continue timely EMI payments\n• Keep credit utilization below 20%\n• Don't close old accounts\n\nEstimated time to 800: 6-8 months",
  "default": "I understand your query. Let me help you with that.\n\nBased on your account data, I can see you have a healthy financial profile. Would you like me to:\n\n1. **Analyze** your spending patterns\n2. **Recommend** investment opportunities\n3. **Optimize** your loan repayment\n4. **Review** your insurance coverage\n\nJust let me know what you'd like to explore!",
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("spend") || lower.includes("expense")) return botResponses.spending;
  if (lower.includes("fd") || lower.includes("mutual") || lower.includes("invest")) return botResponses.fd;
  if (lower.includes("loan") || lower.includes("emi") || lower.includes("interest")) return botResponses.loan;
  if (lower.includes("credit") || lower.includes("score")) return botResponses.credit;
  return botResponses.default;
}

function MessageBubble({ msg }: { msg: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3 max-w-[80%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}
    >
      {msg.role === "assistant" && (
        <div className="w-8 h-8 rounded-xl gradient-sbi flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className={cn("rounded-2xl px-4 py-3",
        msg.role === "user"
          ? "gradient-sbi text-white rounded-tr-md"
          : "bg-white border border-[var(--border-light)] text-[var(--text-primary)] rounded-tl-md shadow-sm"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
        <p className={cn("text-[10px] mt-1.5",
          msg.role === "user" ? "text-blue-200 text-right" : "text-[var(--text-muted)]")}>
          {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}

export default function SmartCompanionPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getResponse(content),
        timestamp: new Date(),
        suggestions: content.length < 30 ? ["Tell me more", "Show details", "What else can you help with?"] : undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const quickActions = [
    { label: "Spending Analysis", icon: BarChart3 },
    { label: "Investment Advice", icon: TrendingUp },
    { label: "Block Card", icon: CreditCard },
    { label: "Loan EMI", icon: Banknote },
    { label: "Open FD", icon: PiggyBank },
    { label: "Pay Bills", icon: Zap },
    { label: "Credit Score", icon: Shield },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--border-light)] bg-white flex flex-col p-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl gradient-sbi flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--sbi-blue)]">Smart Companion</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">AI-Powered Banking</p>
          </div>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Quick Actions</p>
        <div className="space-y-1">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <button key={a.label} onClick={() => sendMessage(a.label)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--sbi-cyan-light)] hover:text-[var(--sbi-blue)] transition-colors">
                <Icon size={14} />
                {a.label}
                <ChevronRight size={11} className="ml-auto text-[var(--text-muted)]" />
              </button>
            );
          })}
        </div>

        <div className="mt-auto">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-[var(--sbi-cyan-light)]">
            <p className="text-xs font-semibold text-[var(--sbi-blue)] mb-1">AI Insight</p>
            <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
              Based on your spending, you could save ₹8,500 more this month by reducing discretionary expenses.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)]">
        {/* Header */}
        <div className="h-14 bg-white border-b border-[var(--border-light)] flex items-center px-5 gap-3 shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl gradient-sbi flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">YONO AI Assistant</p>
            <p className="text-[10px] text-emerald-600 font-medium">Online · Powered by SBI AI</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              <MessageBubble msg={msg} />
              {msg.suggestions && msg.role === "assistant" && (
                <div className="flex flex-wrap gap-2 mt-2 ml-11">
                  {msg.suggestions.map((s) => (
                    <motion.button key={s}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--sbi-blue)] hover:text-[var(--sbi-blue)] hover:bg-[var(--sbi-cyan-light)] transition-all">
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-xl gradient-sbi flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-[var(--border-light)] rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 0.2, 0.4].map((d) => (
                    <motion.div key={d}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--sbi-blue)] opacity-60"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-[var(--border-light)] shrink-0">
          <div className="flex items-end gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-light)] focus-within:border-[var(--sbi-blue)] transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask me anything about your finances..."
                className="flex-1 text-sm outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
              <button className="text-[var(--text-tertiary)] hover:text-[var(--sbi-blue)] transition-colors">
                <Paperclip size={15} />
              </button>
              <button className="text-[var(--text-tertiary)] hover:text-[var(--sbi-blue)] transition-colors">
                <Mic size={15} />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl gradient-sbi flex items-center justify-center text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
