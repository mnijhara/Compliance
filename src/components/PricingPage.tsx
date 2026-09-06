import React from 'react';
import { CheckCircle2, ShieldCheck, Building2, Lock, ArrowRight } from 'lucide-react';

export const PricingPage: React.FC = () => (
  <div className="bg-white text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
    <div className="max-w-6xl mx-auto space-y-10">
      <header className="text-center max-w-3xl mx-auto space-y-4"><div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"><ShieldCheck className="w-3.5 h-3.5" /> Enterprise commercial readiness</div><h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">ComplyOS Enterprise</h1><p className="text-slate-600 text-base">Pricing is intentionally not fabricated while the production tenancy, evidence storage, identity and filing integrations are being finalised. Commercial terms should follow the actual deployment scope.</p></header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><Building2 className="w-6 h-6 text-indigo-600" /><h2 className="mt-4 font-bold">Site-based compliance</h2><p className="mt-2 text-sm text-slate-600">Scope by establishments, states, worker populations and evidence volume rather than inventing a headcount-only price.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><Lock className="w-6 h-6 text-indigo-600" /><h2 className="mt-4 font-bold">Enterprise controls</h2><p className="mt-2 text-sm text-slate-600">Identity, tenant isolation, durable evidence, retention, audit logs and approval workflows are part of production scope.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><CheckCircle2 className="w-6 h-6 text-emerald-600" /><h2 className="mt-4 font-bold">Governed AI</h2><p className="mt-2 text-sm text-slate-600">AI is assistive. Source verification, evidence acceptance and human approval remain explicit product controls.</p></div>
      </div>
      <section className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-8 sm:p-12 text-center"><h2 className="text-2xl font-extrabold">Pilot-ready, not sales-theatre-ready</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">Once identity, durable persistence, evidence storage and filing integrations are connected, pricing can be based on the actual number of establishments, jurisdictions and workflow volume. No fake trial, demo submission or savings claim is presented here.</p><div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"><span>Use the Control Center for the production pilot</span><ArrowRight className="w-4 h-4" /></div></section>
    </div>
  </div>
);
