import React from 'react';
import { ArrowRight, BadgeCheck, CheckCircle2, CircleDot, FileCheck2, FileText, Landmark, MessageCircle, Radar, Scale, ShieldCheck, Sparkles, Upload, Workflow } from 'lucide-react';
import { QuickStart } from './QuickStart';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onOpenAudit: () => void;
  onOpenChat: () => void;
}

const capabilities = [
  { icon: Scale, title: 'Labour-law engine', text: 'Organize source-backed controls by law, jurisdiction and applicability.' },
  { icon: Landmark, title: '4 Labour Codes', text: 'Keep code-level coverage visible without hiding applicability or source gaps.' },
  { icon: Radar, title: 'Regulatory watch', text: 'Track source freshness and surface items that need verification.' },
  { icon: FileCheck2, title: 'AI audit studio', text: 'Review supplied documents while keeping evidence and verification status explicit.' },
  { icon: Workflow, title: 'Compliance workflows', text: 'Turn review items into owners, actions and an auditable trail.' },
  { icon: BadgeCheck, title: 'CHRO control center', text: 'Bring evidence, controls, reviews and actions into one operating view.' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab, onOpenAudit, onOpenChat }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_75%_20%,rgba(99,102,241,.16),transparent_30%),linear-gradient(180deg,#eef2ff_0%,#fff_68%)] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-80 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-sm"><Sparkles className="h-4 w-4" /> AI-native HR compliance operations</div>
            <h1 className="mt-6 max-w-3xl text-[2.65rem] font-black leading-[1.03] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[4.55rem]">Turn compliance into an <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">operating system.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">ComplyOS connects your HR documents, evidence, controls, audits and actions so your team can see what needs attention and why.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => document.getElementById('document-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700"><Upload className="h-4 w-4" /> Review my documents <ArrowRight className="h-4 w-4" /></button>
              <button onClick={onOpenChat} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"><MessageCircle className="h-4 w-4 text-indigo-600" /> Talk to Nova</button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Evidence-first</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> India-focused</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Source-aware AI</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute -inset-4 rounded-[2.25rem] bg-indigo-200/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 shadow-2xl shadow-indigo-200/60">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-white"><ShieldCheck className="h-5 w-5" /></span><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-indigo-300">ComplyOS Command Center</div><div className="mt-0.5 text-sm font-extrabold text-white">Compliance operating view</div></div></div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400">Illustrative</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {[['Evidence', '32', 'mapped'], ['Reviews', '07', 'open'], ['Actions', '12', 'tracked']].map(([label, value, caption]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.06] p-3"><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</div><div className="mt-1.5 text-xl font-black text-white sm:text-2xl">{value}</div><div className="text-[9px] text-slate-500">{caption}</div></div>)}
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.045] p-4">
                  <div className="flex items-center justify-between"><span className="text-xs font-extrabold text-white">Evidence & review flow</span><span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Illustrative</span></div>
                  <div className="mt-4 space-y-3">
                    {[['01', 'HR documents', 'Supplied evidence', 'text-indigo-300'], ['02', 'Control mapping', 'Source + applicability', 'text-sky-300'], ['03', 'Review queue', 'Evidence gaps visible', 'text-amber-300'], ['04', 'Action trail', 'Owner + next step', 'text-emerald-300']].map(([n, title, text, tone], index) => <div key={n} className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[9px] font-black text-slate-300">{n}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-xs font-bold text-white">{title}</span>{index < 3 && <CircleDot className="h-2.5 w-2.5 text-slate-600" />}</div><div className={`mt-0.5 text-[9px] font-semibold ${tone}`}>{text}</div></div><div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${index === 2 ? 'w-2/3 bg-amber-400' : 'w-full bg-indigo-400'}`} /></div></div>)}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3"><div className="flex items-center gap-2 text-[10px] font-bold text-emerald-300"><BadgeCheck className="h-3.5 w-3.5" /> Source verified</div><p className="mt-1 text-[9px] leading-4 text-slate-400">Only where the registered source supports verification.</p></div>
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3"><div className="flex items-center gap-2 text-[10px] font-bold text-amber-300"><FileText className="h-3.5 w-3.5" /> Needs review</div><p className="mt-1 text-[9px] leading-4 text-slate-400">Missing evidence or applicability stays visible.</p></div>
                </div>
              </div>
              <div className="border-t border-white/10 bg-white/[.03] px-5 py-3 text-[9px] leading-4 text-slate-500">Illustrative product preview only — not a compliance assessment and not customer data.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="document-review" className="scroll-mt-20 border-b border-slate-200 bg-slate-50/80 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-3xl"><div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600"><Upload className="h-4 w-4" /> Start with evidence</div><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Bring the documents you already have.</h2><p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">No setup marathon. Upload a few HR documents and get a focused first-pass review while evidence and source-verification gaps stay explicit.</p></div><button onClick={onOpenChat} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-700"><MessageCircle className="h-4 w-4 text-indigo-600" /> Ask Nova first</button></div>
        <QuickStart onChat={onOpenChat} />
      </div>
    </section>

    <section className="border-b border-slate-200 px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl"><div className="text-xs font-bold uppercase tracking-widest text-indigo-600">How it works</div><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">From document to defensible action.</h2><p className="mt-2 text-sm leading-6 text-slate-600">The product separates what your evidence says from what still needs source verification, then turns review into workflow.</p></div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[['01', 'Ingest evidence', 'Bring policies, contracts and other HR material.', Upload], ['02', 'Map controls', 'Connect review areas to registered sources and applicability.', Scale], ['03', 'Surface gaps', 'Keep missing evidence and verification needs visible.', Radar], ['04', 'Drive action', 'Assign owners, track decisions and preserve an audit trail.', Workflow]].map(([number, title, text, Icon]) => <div key={String(number)} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-black text-indigo-600">{number}</span><Icon className="h-5 w-5 text-indigo-500" /></div><h3 className="mt-5 text-base font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
        </div>
      </div>
    </section>

    <section className="border-b border-slate-200 bg-slate-950 px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><div className="text-xs font-bold uppercase tracking-widest text-indigo-300">Built for serious HR teams</div><h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">One operating layer for the work behind compliance.</h2><p className="mt-2 text-sm leading-6 text-slate-400">Go beyond a checklist: controls, evidence, source verification, regulatory freshness, AI-assisted review and action workflows.</p></div><button onClick={() => setActiveTab('workspace')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">Open Control Center <ArrowRight className="h-4 w-4" /></button></div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, text }) => <button key={title} onClick={() => setActiveTab(title === 'AI audit studio' ? 'ai-audit' : title === 'Labour-law engine' ? 'labor-laws' : title === '4 Labour Codes' ? 'labour-codes' : title === 'CHRO control center' ? 'workspace' : title === 'Compliance workflows' ? 'agentic-workflows' : 'home')} className="group rounded-2xl border border-white/10 bg-white/[.045] p-5 text-left transition hover:border-indigo-400/40 hover:bg-white/[.07]"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300"><Icon className="h-4 w-4" /></span><ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-indigo-300" /></div><h3 className="mt-4 text-sm font-extrabold text-white">{title}</h3><p className="mt-1.5 text-xs leading-5 text-slate-400">{text}</p></button>)}
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 shadow-sm sm:flex-row sm:items-center sm:p-8"><div><div className="text-xs font-bold uppercase tracking-widest text-indigo-600">Start simple</div><h2 className="mt-2 text-xl font-black sm:text-2xl">Your evidence first. Your operating system next.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">AI can accelerate review, but current applicability and legal conclusions remain subject to authoritative-source verification and human review.</p></div><div className="flex shrink-0 flex-col gap-2 sm:flex-row"><button onClick={onOpenAudit} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700"><FileCheck2 className="h-4 w-4 text-indigo-600" /> Advanced AI review</button><button onClick={() => document.getElementById('document-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Review documents <ArrowRight className="h-4 w-4" /></button></div></div></section>
  </div>
);