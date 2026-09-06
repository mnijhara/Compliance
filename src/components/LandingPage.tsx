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
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/80 via-white to-white px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
      <div className="pointer-events-none absolute -right-32 -top-28 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-72 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-sm"><ShieldCheck className="h-4 w-4" /> Your HR compliance copilot</div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-[4.25rem] lg:leading-[1.03]">Know what needs attention.<br /><span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Act with evidence.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">ComplyOS brings your HR policies, labour-law controls and compliance workflows into one place. Start with what you already have — no setup marathon.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => document.getElementById('document-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"><Upload className="h-4 w-4" /> Review my documents <ArrowRight className="h-4 w-4" /></button>
              <button onClick={onOpenChat} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"><MessageCircle className="h-4 w-4 text-indigo-600" /> Talk to Nova</button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Evidence-first reviews</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> India-focused controls</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No long questionnaire</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute -inset-3 rounded-[2rem] bg-indigo-100/60 blur-xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div><div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">ComplyOS workspace</div><div className="mt-1 text-sm font-extrabold text-slate-900">Your compliance picture</div></div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Evidence-led</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-3 gap-3">
                  {[['Policies', '18', 'reviewed'], ['Controls', '32', 'mapped'], ['Actions', '7', 'to review']].map(([label, value, caption]) => <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] font-bold text-slate-500">{label}</div><div className="mt-2 text-xl font-black text-slate-950">{value}</div><div className="mt-0.5 text-[9px] text-slate-400">{caption}</div></div>)}
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between"><span className="text-xs font-extrabold text-slate-800">Review queue</span><span className="text-[10px] font-semibold text-slate-400">Illustrative</span></div>
                  <div className="mt-3 space-y-2.5">
                    {[['Leave policy', 'Evidence to verify', 'amber'], ['Employment terms', 'Source-backed review', 'indigo'], ['POSH policy', 'Document present', 'emerald']].map(([name, status, tone]) => <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"><span className={`h-2 w-2 rounded-full ${tone === 'amber' ? 'bg-amber-400' : tone === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'}`} /><span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{name}</span><span className="text-[9px] font-bold text-slate-400">{status}</span></div>)}
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" /><p className="text-[10px] leading-4 text-indigo-900">Nova helps organize supplied evidence. Legal conclusions and current applicability remain subject to source verification.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="document-review" className="scroll-mt-20 border-b border-slate-200 bg-slate-50/80 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl text-center"><div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600"><Upload className="h-4 w-4" /> Start here</div><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Bring the documents you already have.</h2><p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">No questionnaire first. Upload a few HR documents and get a focused first-pass review. Add jurisdiction or business context later when it matters.</p></div>
        <QuickStart onChat={onOpenChat} />
      </div>
    </section>

    <section className="border-b border-slate-200 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl"><div className="text-xs font-bold uppercase tracking-widest text-indigo-600">How it works</div><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">A simple path from documents to action.</h2><p className="mt-2 text-sm leading-6 text-slate-600">The product gets out of your way first. Deeper controls are there when you need them.</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[['1', 'Bring your existing HR docs', 'Policies, contracts and other evidence. Start with what is already available.', Upload], ['2', 'See the review queue', 'Nova organizes supplied material into review areas and keeps evidence gaps visible.', Sparkles], ['3', 'Move into controls', 'Use source-backed labour-law tools, workflows and the control center for deeper work.', FileCheck2]].map(([number, title, text, Icon]) => <div key={String(number)} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">{number}</span><Icon className="h-5 w-5 text-indigo-600" /></div><h3 className="mt-5 text-base font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
        </div>
      </div>
    </section>

    <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div><div className="text-xs font-bold uppercase tracking-widest text-indigo-600">For HR & compliance teams</div><h2 className="mt-2 text-xl font-black sm:text-2xl">Start simple. Go deeper when you are ready.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Labour Codes, state applicability, statutory workflows, evidence trails, AI audit and the CHRO workspace remain available without crowding the first step.</p></div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row"><button onClick={onOpenAudit} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700"><FileCheck2 className="h-4 w-4 text-indigo-600" /> Advanced AI review</button><button onClick={() => setActiveTab('workspace')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Open Control Center <ArrowRight className="h-4 w-4" /></button></div>
      </div>
    </section>
  </div>
);
