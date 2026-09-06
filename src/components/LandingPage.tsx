import React from 'react';
import { ArrowRight, CheckCircle2, FileCheck2, MessageCircle, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import { QuickStart } from './QuickStart';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onOpenAudit: () => void;
  onOpenChat: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab, onOpenAudit, onOpenChat }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50 via-white to-white px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,.14),transparent_45%)]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5" /> HR compliance, without the setup headache
        </div>
        <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Know what your HR documents <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">need next.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Upload the policies, contracts and HR documents you already have. ComplyOS helps turn them into an evidence-first review queue — without making you complete a long setup wizard first.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => document.getElementById('document-review')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200">
            <Upload className="h-4 w-4" /> Upload your documents <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={onOpenChat} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800">
            <MessageCircle className="h-4 w-4 text-indigo-600" /> Chat with Nova
          </button>
        </div>
        <p className="mt-4 text-[11px] text-slate-500">Start simple. Add jurisdiction, establishment context and workflows when you need them.</p>
      </div>
    </section>

    <section id="document-review" className="scroll-mt-8 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Start here</div>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Upload once. Review clearly.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">Your documents are the starting point. The deeper compliance workspace remains available below when you need it.</p>
        </div>
        <QuickStart onChat={onOpenChat} />
      </div>
    </section>

    <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-3">
          {[['1', 'Upload what you already have', 'Policies, contracts and HR documents. No data-entry marathon.', Upload], ['2', 'Nova reviews the documents', 'AI looks for gaps and explains what deserves attention. Missing evidence stays a review item.', Sparkles], ['3', 'Act on a short list', 'See the document, the issue and the suggested next action — then verify material legal conclusions.', CheckCircle2]].map(([number, title, text, Icon]) => <div key={String(number)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">{number}</span><Icon className="h-5 w-5 text-indigo-600" /></div><h2 className="mt-5 text-base font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
        </div>
      </div>
    </section>

    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:flex-row sm:p-9">
        <div><div className="text-xs font-bold uppercase tracking-widest text-indigo-600">For HR & compliance teams</div><h2 className="mt-2 text-2xl font-black">Go deeper when you are ready.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Use the Control Center for establishment-level evidence, workflows, audit trails and the wider statutory toolkit.</p></div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button onClick={() => setActiveTab('workspace')} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Open Control Center <ArrowRight className="h-4 w-4" /></button>
          <button onClick={onOpenAudit} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800"><FileCheck2 className="h-4 w-4 text-indigo-600" /> Advanced review</button>
        </div>
      </div>
    </section>
  </div>
);
