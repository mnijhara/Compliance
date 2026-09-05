import React, { useState } from 'react';
import { DollarSign, Check, ShieldCheck, Sparkles, ArrowRight, Zap, HelpCircle } from 'lucide-react';

interface PricingViewProps {
  setActiveTab: (tab: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ setActiveTab }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-indigo-600" /> Transparent Enterprise Licensing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Plans Engineered for Enterprise CHROs
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Eliminate labor law non-compliance fines, automate statutory returns, and deploy Nova Autonomous AI Agents.
          </p>

          {/* Billing Switcher */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full bg-slate-200 border border-slate-300 p-1 transition cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full bg-indigo-600 transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-xs font-semibold ${isAnnual ? 'text-slate-900' : 'text-slate-500'} flex items-center gap-1.5`}>
              Annual Billing
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                Save 20%
              </span>
            </span>
          </div>

        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tier 1: Starter */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-6 flex flex-col justify-between hover:border-slate-300 transition shadow-xs">
            <div className="space-y-4">
              <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 font-mono">
                Starter HR Suite
              </span>
              <h3 className="text-xl font-bold text-slate-900">Labor Law Core</h3>
              <p className="text-xs text-slate-600">For mid-market companies needing single-jurisdiction compliance & policy audits.</p>

              <div className="pt-2 font-mono">
                <span className="text-4xl font-extrabold text-slate-900">
                  ${isAnnual ? '159' : '199'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Single Jurisdiction Mapping</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Up to 25 AI Policy Audits/mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Basic AI Policy Generator</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Standard Email Support</li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('ai-audit')}
              className="w-full py-3 text-xs font-bold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-xl transition cursor-pointer"
            >
              Start Free Trial
            </button>
          </div>

          {/* Tier 2: Professional (Featured) */}
          <div className="bg-gradient-to-b from-indigo-50/50 via-white to-indigo-50/30 rounded-2xl border-2 border-indigo-400 p-8 space-y-6 flex flex-col justify-between shadow-xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Most Popular CHRO Choice
            </div>

            <div className="space-y-4">
              <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono">
                Nova Agentic Hub
              </span>
              <h3 className="text-xl font-bold text-slate-900">Professional CHRO</h3>
              <p className="text-xs text-slate-600">Full 3-Layer Nova Agentic architecture with multi-state labor law matrix & automated ECR.</p>

              <div className="pt-2 font-mono">
                <span className="text-4xl font-extrabold text-indigo-950">
                  ${isAnnual ? '399' : '499'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Multi-State & Global Jurisdictions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 100 AI Policy Audits/mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 5 Autonomous Nova AI Agents</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> ECR & Statutory Filing Reconciler</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> POSH IC Governance Auditor</li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('workspace')}
              className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl shadow-md transition cursor-pointer"
            >
              Launch Platform Now
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-6 flex flex-col justify-between hover:border-slate-300 transition shadow-xs">
            <div className="space-y-4">
              <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 font-mono">
                Custom Enterprise
              </span>
              <h3 className="text-xl font-bold text-slate-900">Sovereign Enterprise</h3>
              <p className="text-xs text-slate-600">Dedicated legal mapping, custom HRMS connectors, and sovereign cloud deployment.</p>

              <div className="pt-2 font-mono">
                <span className="text-3xl font-extrabold text-slate-900">Custom / Quote</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Unlimited AI Policy Audits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom Nova Agent Skill Building</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Dedicated Legal Counsel Integration</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 24/7 Priority CHRO Support & SLA</li>
              </ul>
            </div>

            <button
              onClick={() => alert('Contacting Globalion Enterprise Sales Team...')}
              className="w-full py-3 text-xs font-bold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-xl transition cursor-pointer"
            >
              Schedule Enterprise Review
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
