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
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 via-white to-white px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-sm"><ShieldCheck className="h-4 w-4" /> HR compliance, without the setup headache</div>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">Upload your HR documents.<br /><span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Get the gaps.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Start with the policies, contracts and HR documents you already have. Nova turns them into a focused review queue — without a long setup or questionnaire.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => document.getElementById('document-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"><Upload className="h-4 w-4" /> Upload documents <ArrowRight className="h-4 w-4" /></button>
          <button onClick={onOpenChat} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"><MessageCircle className="h-4 w-4 text-indigo-600" /> Chat with Nova</button>
        </div>
        <p className="mt-4 text-xs text-slate-500">India-wide review to start · Add state or business context when you need it</p>
      </div>
    </section>

    <section id="document-review" className="scroll-mt-20 border-b border-slate-200 bg-slate-50/70 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600"><Sparkles className="h-4 w-4" /> Start your review</div><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Bring the documents. Nova does the first pass.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Upload what already exists. Evidence gaps stay visible instead of becoming invented compliance answers.</p></div>
          <button onClick={onOpenAudit} className="hidden shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 sm:inline-flex"><FileCheck2 className="h-4 w-4 text-indigo-600" /> Advanced AI review</button>
        </div>
        <QuickStart onChat={onOpenChat} />
      </div>
    </section>

    <section className="border-b border-slate-200 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 max-w-2xl"><div className="text-xs font-bold uppercase tracking-widest text-indigo-600">How it works</div><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">From documents to evidence-backed action.</h2></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[['1', 'Upload what you already have', 'Policies, contracts and HR documents. No data-entry marathon.', Upload], ['2', 'Nova maps the review areas', 'AI reviews the supplied material and keeps missing evidence as a review item.', Sparkles], ['3', 'Act on a short list', 'See the document, issue and next action. Material legal conclusions still require source verification.', CheckCircle2]].map(([number, title, text, Icon]) => <div key={String(number)} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">{number}</span><Icon className="h-5 w-5 text-indigo-600" /></div><h3 className="mt-5 text-base font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
        </div>
      </div>
    </section>

    <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div><div className="text-xs font-bold uppercase tracking-widest text-indigo-600">For HR & compliance teams</div><h2 className="mt-2 text-xl font-black sm:text-2xl">Start simple. Configure deeper controls later.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Labour Codes, state applicability, statutory workflows, evidence trails and the CHRO workspace remain available when you need them.</p></div>
        <button onClick={() => setActiveTab('workspace')} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Open Control Center <ArrowRight className="h-4 w-4" /></button>
      </div>
    </section>
  </div>
);
