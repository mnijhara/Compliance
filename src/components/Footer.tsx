import React from 'react';
import { ShieldCheck, ArrowUpRight, Lock, CheckCircle2, Globe, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Column 1: Brand & Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 font-mono">
                cmpli<span className="text-indigo-600">hr</span>.ai
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Autonomous AI Compliance Intelligence Platform built by Globalion Technology Solutions. Engineered for Enterprise CHROs to automate labor law mapping, statutory returns, and audit readiness across 125+ jurisdictions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> SOC 2 Type II Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Lock className="w-3.5 h-3.5" /> ISO 27001 Certified
              </span>
            </div>
          </div>

          {/* Column 2: Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform Modules</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActiveTab('labor-laws')} className="hover:text-indigo-600 transition text-left">
                  Labor Law Engine (40+ Laws)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('statutory-calculators')} className="hover:text-indigo-600 transition text-left">
                  Statutory Calculators (50% Basic / EPF)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('labour-codes')} className="hover:text-indigo-600 transition text-left">
                  4 Labour Codes Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('form-vault')} className="hover:text-indigo-600 transition text-left">
                  Statutory Forms & Registers Vault
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-audit')} className="hover:text-indigo-600 transition text-left flex items-center gap-1">
                  AI Audit & Risk Studio <Sparkles className="w-3 h-3 text-indigo-600" />
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('workspace')} className="hover:text-indigo-600 transition text-left">
                  CHRO Compliance Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Statutory Jurisdictions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Statutory Coverage</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>India State Labor Codes</span>
                <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium">28 States</span>
              </li>
              <li className="flex items-center justify-between">
                <span>POSH Act & IC Governance</span>
                <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium">National</span>
              </li>
              <li className="flex items-center justify-between">
                <span>PF & ESI ECR Automation</span>
                <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium">Statutory</span>
              </li>
              <li className="flex items-center justify-between">
                <span>US California AB5 & FLSA</span>
                <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium">Federal/State</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NY Pay Transparency</span>
                <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium">2026 Code</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Globalion & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Company & Trust</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://globalion.in" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition flex items-center gap-1">
                  Globalion Technology Solutions <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <button onClick={() => setActiveTab('pricing')} className="hover:text-indigo-600 transition text-left">
                  Enterprise Plans & Pricing
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Mahindra Holidays Case Study</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Security & Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Nova Agent Marketplace</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>© 2026 Globalion Technology Solutions Pvt Ltd. All rights reserved. cmplihr.ai™ is a registered mark.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 transition cursor-pointer">Privacy Shield</span>
            <span className="hover:text-slate-700 transition cursor-pointer">Statutory Disclaimer</span>
            <span className="text-indigo-600 font-mono font-semibold">Engine Version 3.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
