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
    <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50/60 via-white to-white px-4 pb-10 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700"><ShieldCheck className="h-3.5 w-3.5" /> HR compliance, without the setup headache</div>
          <div className="flex gap-2">
            <button onClick={onOpenChat} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"><MessageCircle className="h-3.5 w-3.5 text-indigo-600" /> Chat with Nova</button>
            <button onClick={onOpenAudit} className="hidden items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white sm:inline-flex"><FileCheck2 className="h-3.5 w-3.5" /> Advanced review</button>
          </div>
        </div>
        <QuickStart onChat={onOpenChat} />
      </div>
    </section>

    <section className="border-b border-slate-200 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-3">
          {[['1', 'Upload what you already have', 'Policies, contracts and HR documents. No data-entry marathon.', Upload], ['2', 'Nova reviews the documents', 'AI looks for gaps and explains what deserves attention. Missing evidence stays a review item.', Sparkles], ['3', 'Act on a short list', 'See the document, the issue and the suggested next action — then verify material legal conclusions.', CheckCircle2]].map(([number, title, text, Icon]) => <div key={String(number)} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">{number}</span><Icon className="h-5 w-5 text-indigo-600" /></div><h2 className="mt-5 text-base font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
        </div>
      </div>
    </section>

    <section className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:flex-row sm:p-9">
        <div><div className="text-xs font-bold uppercase tracking-widest text-indigo-600">For HR & compliance teams</div><h2 className="mt-2 text-2xl font-black">Start with your documents. Configure later.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">The detailed Control Center is still available when you need establishment-level evidence, workflows and audit trails. It is no longer the first thing a new user has to fill in.</p></div>
        <button onClick={() => setActiveTab('workspace')} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Open Control Center <ArrowRight className="h-4 w-4" /></button>
      </div>
    </section>
  </div>
);
