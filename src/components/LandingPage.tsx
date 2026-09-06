import React, { useState } from 'react';
import { ArrowRight, Bot, CheckCircle2, FileCheck2, FileText, LockKeyhole, MessageCircle, ShieldCheck, Sparkles, Upload } from 'lucide-react';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onOpenAudit: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab, onOpenAudit }) => {
  const [demoStep, setDemoStep] = useState(0);
  const demoSteps = [
    { label: 'Upload', detail: 'Drop an existing HR document. No compliance questionnaire first.', icon: Upload },
    { label: 'Read', detail: 'ComplyOS extracts the document context and identifies clauses worth reviewing.', icon: FileText },
    { label: 'Explain', detail: 'Nova explains what was found, what source supports it, and what still needs verification.', icon: Sparkles },
    { label: 'Act', detail: 'Get a short review queue instead of a giant compliance form.', icon: CheckCircle2 }
  ] as const;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50 via-white to-white px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700"><ShieldCheck className="h-3.5 w-3.5" /> ComplyOS · HR compliance, made simple</div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Give us your documents.<br /><span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Get a clear compliance review.</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">Stop filling out endless compliance questionnaires. Upload an existing HR document or ask Nova a question. ComplyOS turns the work into a simple review flow, with evidence and source verification kept visible.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={onOpenAudit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"><Upload className="h-4 w-4" /> Upload & Review</button>
                <button onClick={() => setActiveTab('chat')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm"><MessageCircle className="h-4 w-4 text-indigo-600" /> Chat with Nova</button>
              </div>
              <p className="mt-4 text-xs text-slate-500">No sample compliance result. No legal certification. Just your document, the sources, and a review.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white"><Bot className="h-5 w-5" /></div><div><div className="text-sm font-bold">Nova Compliance Review</div><div className="text-[11px] text-emerald-600">Evidence-first assistant</div></div></div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">DEMO</span>
              </div>
              <div className="mt-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-8 text-center">
                <Upload className="mx-auto h-9 w-9 text-indigo-600" />
                <div className="mt-3 text-sm font-bold">Drop an HR document here</div>
                <div className="mt-1 text-xs text-slate-500">Offer letter · employment contract · HR policy · contractor agreement</div>
                <button onClick={onOpenAudit} className="mt-5 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-indigo-700 shadow-sm ring-1 ring-indigo-200">Try it with your document →</button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-slate-500"><div className="rounded-lg bg-slate-50 p-2">Document</div><div className="rounded-lg bg-slate-50 p-2">Sources</div><div className="rounded-lg bg-slate-50 p-2">Actions</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">Magic demo</div><h2 className="mt-2 text-3xl font-extrabold">One simple journey.</h2><p className="mt-2 max-w-2xl text-sm text-slate-600">This is how the product should feel for an HR leader: give ComplyOS what you already have, then let it organize the work.</p></div><div className="text-xs font-semibold text-slate-500">Step {demoStep + 1} of {demoSteps.length}</div></div>
          <div className="mt-7 grid gap-3 md:grid-cols-4">
            {demoSteps.map(([label, detail, Icon], index) => <button key={label} onClick={() => setDemoStep(index)} className={`rounded-2xl border p-5 text-left transition ${index === demoStep ? 'border-indigo-300 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><Icon className="h-4 w-4" /></span><span className="text-[10px] font-black text-slate-400">0{index + 1}</span></div><div className="mt-4 text-sm font-bold">{label}</div><p className="mt-1 text-xs leading-relaxed text-slate-600">{detail}</p></button>)}
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">What the user sees</div><div className="mt-1 text-lg font-bold">{demoSteps[demoStep].label}: {demoSteps[demoStep].detail}</div></div><button onClick={onOpenAudit} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-900">Start with a document <ArrowRight className="h-3.5 w-3.5" /></button></div></div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><FileCheck2 className="h-6 w-6 text-indigo-600" /><h3 className="mt-4 text-base font-bold">Your evidence first</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">The product asks for evidence when it matters instead of pretending profile questions prove compliance.</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><Bot className="h-6 w-6 text-indigo-600" /><h3 className="mt-4 text-base font-bold">Chat when you just need an answer</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Ask Nova things like “What should I check in our employment contracts?” without opening a control center.</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><LockKeyhole className="h-6 w-6 text-indigo-600" /><h3 className="mt-4 text-base font-bold">No fake certainty</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Findings remain clearly separated from verified sources and legal conclusions.</p></div>
        </div>
      </section>
    </div>
  );
};
