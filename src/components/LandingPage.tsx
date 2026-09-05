import React from 'react';
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, Scale, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onOpenAudit: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab, onOpenAudit }) => {
  const cards = [
    ['Evidence-first controls', 'Every assessment separates what is known, what needs evidence and what needs legal/source verification.', FileCheck2],
    ['AI-assisted, not AI-certified', 'AI helps review documents and explain findings, but cannot manufacture citations or declare legal compliance.', Sparkles],
    ['Regulatory source traceability', 'Official government sources are recorded with verification dates so stale mappings can be identified.', Scale],
    ['Agentic workflows', 'Agents orchestrate evidence collection, assessments and review queues while preserving human approval points.', Workflow]
  ] as const;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50/50 via-white to-white px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700"><ShieldCheck className="h-3.5 w-3.5" /> AI-native HR compliance intelligence</div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Compliance you can <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">trace</span>, not just trust.</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">CmpliHR.ai combines deterministic compliance controls, authoritative source mapping, evidence management and AI-assisted review for CHRO and HR compliance teams.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => setActiveTab('workspace')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-md"><ShieldCheck className="h-4 w-4" /> Open Control Center <ArrowRight className="h-4 w-4" /></button>
              <button onClick={onOpenAudit} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-7 py-3.5 text-sm font-bold text-slate-700"><Sparkles className="h-4 w-4 text-indigo-600" /> Review a document</button>
            </div>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-xs text-amber-950"><strong>Design principle:</strong> missing evidence produces REVIEW, not PASS. AI-generated legal propositions remain unverified until mapped to an authoritative source.</div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {cards.map(([title, text, Icon]) => <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700"><Icon className="h-5 w-5" /></div><h2 className="mt-5 text-base font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">How the platform works</div><h2 className="mt-3 text-3xl font-extrabold">Source → Rule → Evidence → Decision</h2><p className="mt-4 text-sm leading-relaxed text-slate-600">The compliance record is built from an auditable chain instead of an opaque model response.</p></div>
            <div className="space-y-3">{['Authoritative source is registered and versioned','Applicability controls determine what must be checked','Evidence is requested, attached and evaluated','AI explains gaps and prepares actions for human review'].map((item, i) => <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-black text-indigo-700">{i + 1}</span><span className="text-sm font-semibold">{item}</span><CheckCircle2 className="ml-auto h-4 w-4 text-emerald-600" /></div>)}</div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"><LockKeyhole className="mx-auto h-9 w-9 text-indigo-600" /><h2 className="mt-4 text-2xl font-extrabold">Built for defensible HR decisions</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">Use the Control Center for evidence-first assessments, Agentic Workflows for execution, and AI Audit Studio for document review. Material legal decisions should still be validated against current primary law and qualified counsel.</p><button onClick={() => setActiveTab('workspace')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white">Launch Control Center <ArrowRight className="h-4 w-4" /></button></div>
      </section>
    </div>
  );
};
