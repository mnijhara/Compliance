import React, { useState } from 'react';
import { DollarSign, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Zap, Building2, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [employeeCount, setEmployeeCount] = useState<number>(500);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);

  // Simple ROI estimation math
  const estimatedManualAuditHours = Math.round(employeeCount * 0.4);
  const estimatedLegalRetainerSavings = Math.round(employeeCount * 12 * 8); // USD approx savings

  return (
    <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
            <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
            <span>Transparent Enterprise Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Predictable Plans for Every Organization Size
          </h1>
          <p className="text-slate-600 text-base">
            No per-seat penalties. Pay strictly based on statutory compliance scope, active Nova agent execution tiers, and enterprise security needs.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Starter / Growth */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6 flex flex-col justify-between hover:border-slate-300 transition shadow-xs">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase font-mono text-slate-500">Growth Tier</span>
                <h3 className="text-2xl font-bold text-slate-900">HR Statutory Starter</h3>
                <p className="text-xs text-slate-600 mt-1">Ideal for growing companies with up to 150 employees in a single state.</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl font-black text-slate-900 font-mono">$299</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Single Jurisdiction Labor Law Mapping</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>50 AI Contract Audits / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Statutory Form L & V Downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Standard POSH IC Audit Checklist</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full py-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition cursor-pointer shadow-xs"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Card 2: Enterprise CHRO (Popular) */}
          <div className="bg-indigo-50/50 p-8 rounded-3xl border-2 border-indigo-500 space-y-6 flex flex-col justify-between shadow-xl relative">
            <span className="absolute -top-3.5 right-8 px-3 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
              Most Popular for CHROs
            </span>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase font-mono text-indigo-700">Enterprise CHRO</span>
                <h3 className="text-2xl font-bold text-slate-900">Multi-State Compliance Suite</h3>
                <p className="text-xs text-slate-600 mt-1">Full statutory automation across all 28 Indian States, US, and UK.</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl font-black text-slate-900 font-mono">$899</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Multi-Jurisdiction Labor Laws</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Gemini 3.7 AI Contract Audits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>5 Autonomous Nova Agents Active</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>EPF & ESI Monthly ECR Pre-Filing Validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>POSH Committee NGO Credential Verifier</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request CHRO Demo</span>
            </button>
          </div>

          {/* Card 3: Globalion Custom Nova Suite */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6 flex flex-col justify-between hover:border-slate-300 transition shadow-xs">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase font-mono text-slate-500">Custom Globalion Suite</span>
                <h3 className="text-2xl font-bold text-slate-900">Enterprise Custom Nova</h3>
                <p className="text-xs text-slate-600 mt-1">For global conglomerates requiring private cloud deployment & custom legal rules.</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-3xl font-black text-slate-900 font-mono">Custom Quote</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Private LLM Environment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom ERP / HRMS System Connectors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Legal Compliance SLA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Statutory Form Engine</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full py-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition cursor-pointer shadow-xs"
            >
              Contact Globalion Legal Team
            </button>
          </div>

        </div>

        {/* Interactive ROI Calculator Section */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Interactive Compliance ROI Calculator</h2>
            <p className="text-xs text-slate-600">Estimate how much time and statutory penalty risk CmpliHR.ai saves your organization.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-700 font-semibold mb-2">
                  <span>Number of Employees:</span>
                  <span className="font-mono text-indigo-700 text-sm font-bold">{employeeCount}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 bg-slate-200 cursor-pointer"
                />
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
                <div className="text-2xl font-black text-emerald-600 font-mono">~{estimatedManualAuditHours} hrs</div>
                <div className="text-[11px] text-slate-600 font-medium">Monthly Legal Hours Saved</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
                <div className="text-2xl font-black text-indigo-600 font-mono">${estimatedLegalRetainerSavings.toLocaleString()}</div>
                <div className="text-[11px] text-slate-600 font-medium">Est. Annual Retainer Savings</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Demo Booking Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 text-slate-900 shadow-2xl">
            {demoSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Demo Request Received!</h3>
                <p className="text-xs text-slate-600">A Globalion HR Compliance Specialist will contact your team within 4 business hours.</p>
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    setDemoSubmitted(false);
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Book a CmpliHR.ai CHRO Demo</h3>
                  <button onClick={() => setShowDemoModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">Work Email</label>
                    <input type="email" placeholder="chro@company.com" className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Company Name</label>
                    <input type="text" placeholder="Acme Enterprises" className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <button
                  onClick={() => setDemoSubmitted(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Confirm Request
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
