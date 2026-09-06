import React, { useState } from 'react';
import { ShieldCheck, Cpu, Scale, FileText, LayoutDashboard, DollarSign, Sparkles, Menu, X, ArrowRight, Calculator, Landmark, FileCheck } from 'lucide-react';

interface NavbarProps { activeTab: string; setActiveTab: (tab: string) => void; onOpenAuditModal?: () => void; }

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { id: 'home', label: 'Home', icon: ShieldCheck },
    { id: 'labor-laws', label: 'Labor Law Engine', icon: Scale },
    { id: 'statutory-calculators', label: 'Statutory Calculators', icon: Calculator, badge: 'New' },
    { id: 'labour-codes', label: '4 Labour Codes', icon: Landmark },
    { id: 'form-vault', label: 'Form Vault', icon: FileCheck },
    { id: 'ai-audit', label: 'AI Audit Studio', icon: Sparkles, badge: 'AI' },
    { id: 'agentic-workflows', label: 'Agentic Workflows', icon: Cpu, badge: 'CTO' },
    { id: 'policy-generator', label: 'Policy Generator', icon: FileText },
    { id: 'workspace', label: 'CHRO Dashboard', icon: LayoutDashboard },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900">
      <div className="hidden bg-indigo-50/80 text-xs text-indigo-950 py-1.5 px-4 text-center font-medium border-b border-indigo-100 md:flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] uppercase tracking-wider font-semibold">ComplyOS</span>
        <span>AI-native HR compliance operating system with evidence-first controls</span>
        <button onClick={() => setActiveTab('ai-audit')} className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 underline font-semibold transition ml-2 cursor-pointer">Try AI Audit <ArrowRight className="w-3 h-3" /></button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2">
          <button className="flex items-center gap-3 cursor-pointer text-left" onClick={() => setActiveTab('home')} aria-label="Go to ComplyOS home">
            <img src="/branding/favicon.svg?v=2" alt="" aria-hidden="true" className="h-10 w-10 shrink-0 rounded-xl shadow-sm" />
            <span className="hidden sm:block"><span className="block text-base font-black leading-5 tracking-tight text-slate-950">ComplyOS</span><span className="block text-[10px] font-semibold leading-4 text-slate-500">HR Compliance Operating System</span></span>
          </button>
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => { const Icon = item.icon; const isActive = activeTab === item.id; return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`relative px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}><Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} /><span>{item.label}</span>{item.badge && <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-100 text-indigo-700 rounded border border-indigo-200 uppercase tracking-tighter">{item.badge}</span>}</button>; })}
          </nav>
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={() => setActiveTab('ai-audit')} className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition flex items-center gap-1.5 shadow-sm cursor-pointer"><Sparkles className="w-3.5 h-3.5 text-indigo-600" /><span>AI Audit</span></button>
            <button onClick={() => setActiveTab('workspace')} className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"><LayoutDashboard className="w-3.5 h-3.5" /><span>Launch Platform</span></button>
          </div>
          <div className="flex lg:hidden"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} className="p-2.5 text-slate-700 hover:text-slate-900 rounded-xl bg-slate-100 border border-slate-200">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button></div>
        </div>
      </div>
      {mobileMenuOpen && <div className="lg:hidden bg-white border-t border-slate-100 border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">{navItems.map((item) => { const Icon = item.icon; const isActive = activeTab === item.id; return <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-between ${isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-700 hover:bg-slate-100'}`}><div className="flex items-center gap-3"><Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} /><span>{item.label}</span></div>{item.badge && <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded border border-indigo-200">{item.badge}</span>}</button>; })}<div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-2"><button onClick={() => { setActiveTab('ai-audit'); setMobileMenuOpen(false); }} className="w-full py-2.5 text-xs font-semibold text-center text-slate-700 bg-slate-100 rounded-lg border border-slate-200">AI Audit</button><button onClick={() => { setActiveTab('workspace'); setMobileMenuOpen(false); }} className="w-full py-2.5 text-xs font-bold text-center text-white bg-indigo-600 rounded-lg shadow-sm">Launch Platform</button></div></div>}
    </header>
  );
};