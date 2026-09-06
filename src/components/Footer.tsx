import React from 'react';
import { ArrowUpRight, Globe, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          <div className="lg:col-span-2 space-y-4">
            <img src="/branding/logo.svg" alt="ComplyOS" className="h-12 w-auto" />
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              AI-native HR compliance operations built around a defensible workflow: source, applicability, evidence, review and decision.
            </p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              ComplyOS provides compliance workflow and research assistance. It does not replace qualified legal, HR or statutory advice, and an assessment is not a certification of compliance.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setActiveTab('labor-laws')} className="hover:text-indigo-600 transition text-left">Labor Law Engine</button></li>
              <li><button onClick={() => setActiveTab('statutory-calculators')} className="hover:text-indigo-600 transition text-left">Statutory Calculators</button></li>
              <li><button onClick={() => setActiveTab('labour-codes')} className="hover:text-indigo-600 transition text-left">4 Labour Codes</button></li>
              <li><button onClick={() => setActiveTab('form-vault')} className="hover:text-indigo-600 transition text-left">Evidence Template Vault</button></li>
              <li><button onClick={() => setActiveTab('ai-audit')} className="hover:text-indigo-600 transition text-left flex items-center gap-1">AI Audit Studio <Sparkles className="w-3 h-3 text-indigo-600" /></button></li>
              <li><button onClick={() => setActiveTab('workspace')} className="hover:text-indigo-600 transition text-left">CHRO Dashboard</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://globalion.in" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition flex items-center gap-1">Globalion Technology Solutions <ArrowUpRight className="w-3.5 h-3.5" /></a></li>
              <li><button onClick={() => setActiveTab('pricing')} className="hover:text-indigo-600 transition text-left">Commercial Readiness</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>© 2026 Globalion Technology Solutions Pvt Ltd. All rights reserved.</span>
          </div>
          <span className="text-indigo-600 font-semibold">ComplyOS</span>
        </div>
      </div>
    </footer>
  );
};
