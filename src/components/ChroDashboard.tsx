import React, { useState } from 'react';
import { LayoutDashboard, ShieldCheck, AlertTriangle, CheckCircle2, Calendar, Send, Bot, User, RefreshCw, Activity, Landmark, Building2, Scale } from 'lucide-react';

export const ChroDashboard: React.FC = () => {
  // Chat state with Nova AI Assistant
  const [messages, setMessages] = useState<{ sender: 'user' | 'nova'; text: string; time: string }[]>([
    {
      sender: 'nova',
      text: 'Hello CHRO! I am Nova AI, your autonomous Indian statutory compliance intelligence agent. Ask me anything about EPF wage ceilings, POSH annual return deadlines for District Officers, Gratuity capping, or Maharashtra & Karnataka Shops Act overtime calculations.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: userTime }]);
    setInputMsg('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();
      const novaTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { sender: 'nova', text: data.reply || 'No response', time: novaTime }]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Title & Quick Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
              <span>CHRO Executive Compliance Workspace</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Indian Statutory Operations Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
              Org: <strong className="text-slate-900">Mahindra Holidays & Resorts India</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              98.8% Audit Ready (Pan-India)
            </span>
          </div>
        </div>

        {/* Executive Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Overall Indian Statutory Health</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">98.8<span className="text-sm font-normal text-slate-500">/100</span></div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Zero statutory labor notices in 2026
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Next ECR / ESI Remittance</span>
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-indigo-700 font-mono">15th Monthly</div>
            <div className="text-[11px] text-slate-600">
              EPF & ESIC Electronic Return Synced
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>POSH IC Committees</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">18 / 18</div>
            <div className="text-[11px] text-emerald-700 font-medium">
              100% External NGO members verified
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Flagged Overtime Risks</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-700 font-mono">1 Warning</div>
            <div className="text-[11px] text-amber-800 font-medium">
              Pune Office OT rate double pay check
            </div>
          </div>

        </div>

        {/* Middle Section: Regional State-Wise Compliance Matrix & Filing Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Regional Risk Matrix (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" /> Multi-State Branch Compliance Status
              </h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded font-mono font-semibold">7 Key Indian States Mapped</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Maharashtra (Mumbai / Pune Head Office)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">MH Shops Act 2017</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">POSH IC Active • Form L Overtime Register Logged • PT Form 5 Reconciled</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-[10px]">
                  Score: 99%
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Karnataka (Bengaluru Tech Hub & Resorts)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">KA Shops Act 1961</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">Holiday Act Form V Filed • Night Shift Security Transport Verified • LWF Paid</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-[10px]">
                  Score: 100%
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Tamil Nadu (Chennai & Ooty Resort Division)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">TN Shops Act 1947</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">Right to Sit Mandate Verified • Contract Labour Licensing Renewal Pending</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[10px]">
                  Score: 92% (Notice)
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Telangana (Hyderabad Hub)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">TS Shops Act 1988</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">Form XXIV Appointment Letters Issued • 24/7 Operations Permission Synced</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-[10px]">
                  Score: 98%
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Delhi NCT (Corporate Regional Office)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Delhi Shops Act 1954</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">Privilege Leave Encashment Audited • Employment Exchange ER-1 Return Filed</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-[10px]">
                  Score: 97%
                </span>
              </div>
            </div>
          </div>

          {/* Statutory Filings Calendar (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" /> Statutory Return Deadlines
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Q1 2026 Schedule</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">EPF & ESI Monthly ECR File</div>
                  <div className="text-slate-500 text-[11px]">EPFO & ESIC Electronic Return</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-700 font-mono">15th Monthly</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Pre-Verified</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">POSH Annual Return (Form POSH-1)</div>
                  <div className="text-slate-500 text-[11px]">District Complaints Officer</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-700 font-mono">31st January</div>
                  <span className="text-[10px] text-amber-800 font-semibold">Annual Return Due</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">Labour Welfare Fund (LWF)</div>
                  <div className="text-slate-500 text-[11px]">Maharashtra & Karnataka Boards</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-700 font-mono">15th January</div>
                  <span className="text-[10px] text-emerald-700 font-bold">Filed</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">Payment of Bonus Form D Return</div>
                  <div className="text-slate-500 text-[11px]">Labour Commissioner Office</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-700 font-mono">30th November</div>
                  <span className="text-[10px] text-slate-500">Scheduled</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Embedded Nova AI Chat Assistant */}
        <div className="bg-slate-50 rounded-2xl border border-indigo-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Nova AI CHRO Indian Compliance Assistant</span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded">
                    India Intelligence Engine
                  </span>
                </h3>
                <p className="text-[11px] text-slate-600">Ask real-time questions about Indian Labour Codes, state Shops Acts, POSH, EPF & ESIC</p>
              </div>
            </div>

            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded">
              Gemini 3.7 Online
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 max-h-72 overflow-y-auto custom-scrollbar font-sans shadow-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'nova' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`p-3.5 rounded-2xl max-w-xl space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <span className="text-[9px] opacity-60 block text-right">{m.time}</span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-indigo-700 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Nova AI is evaluating Indian labor statutes...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="e.g. What is the statutory wage ceiling for EPF and maximum overtime under Maharashtra Shops Act?"
              className="flex-1 bg-white text-slate-900 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
