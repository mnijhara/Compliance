import React, { useState } from 'react';
import {
  ArrowRight, CheckCircle2, ChevronDown, ChevronUp, FileCheck2, FileText,
  Landmark, LockKeyhole, MessageCircle, ScanSearch, Scale, ShieldCheck,
  Sparkles, Workflow, Zap
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
}

const features = [
  { icon: FileCheck2, title: 'Evidence-first document review', text: 'Review existing HR documents and keep the result tied to evidence and source verification status.' },
  { icon: Landmark, title: 'Labour Codes & jurisdiction controls', text: 'Explore the four Labour Codes foundation and jurisdiction-specific control coverage without pretending stale rules are current.' },
  { icon: Scale, title: 'Statutory workflows', text: 'Use calculators, filing workflows and control views where the underlying rule and applicability are actually available.' },
  { icon: Sparkles, title: 'AI Audit Studio', text: 'Use AI for structured review while keeping source verification and human judgement visible.' },
];

const faqs = [
  ['Is the dashboard showing a real compliance score?', 'No. The dashboard preview on this page is illustrative product UI. Real findings are produced only through the available evidence-first assessment and are not presented as a legal determination.'],
  ['Can I start without a long questionnaire?', 'Yes. The first action is intentionally simple: review documents or talk to Nova. Additional context can be supplied when a workflow actually needs it.'],
  ['Does AI replace HR or legal review?', 'No. ComplyOS is designed to reduce review effort and make evidence visible. Legal interpretation, applicability decisions and final sign-off remain human responsibilities.'],
  ['What happens when a source cannot be verified?', 'The system should surface that verification gap rather than manufacture a citation or claim that a control is current.'],
];

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab }) => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.14),_transparent_42%),linear-gradient(180deg,#f8fbff_0%,#ffffff_72%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-indigo-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> AI-native HR compliance operations
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Know what needs attention.
              <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">Act with evidence.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              ComplyOS turns HR documents, compliance controls, regulatory sources and follow-up actions into one evidence-first operating layer for HR and compliance teams.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setActiveTab('ai-audit')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700">
                <ScanSearch className="h-4 w-4" /> Review my documents <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => setActiveTab('workspace')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50">
                <MessageCircle className="h-4 w-4 text-indigo-600" /> Talk to Nova
              </button>
            </div>
            <div className="mt-7 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {['Evidence-first reviews', 'India-focused controls', 'No long questionnaire'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2.5 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white"><ShieldCheck className="h-4 w-4 text-cyan-300" /> COMPLYOS CONTROL CENTER</div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-300">ILLUSTRATIVE</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[['Documents', '12'], ['Evidence', '28'], ['Actions', '7']].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
                      <div className="mt-1 text-xl font-black text-white">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Evidence pipeline</span>
                    <span className="text-[10px] font-semibold text-cyan-300">SOURCE STATUS</span>
                  </div>
                  {[
                    ['HR policy', 'Evidence captured', 'emerald'],
                    ['Labour Code control', 'Needs verification', 'amber'],
                    ['Audit finding', 'Human review', 'indigo'],
                  ].map(([label, status, tone]) => (
                    <div key={label} className="flex items-center gap-3 border-t border-white/10 py-3 first:border-t-0 first:pt-0 last:pb-0">
                      <div className={`h-2.5 w-2.5 rounded-full ${tone === 'emerald' ? 'bg-emerald-400' : tone === 'amber' ? 'bg-amber-400' : 'bg-indigo-400'}`} />
                      <div className="min-w-0 flex-1"><div className="text-xs font-semibold text-white">{label}</div><div className="text-[10px] text-slate-400">{status}</div></div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-[11px] text-cyan-100">
                  <LockKeyhole className="h-4 w-4 shrink-0 text-cyan-300" /> No unsupported legal conclusion is implied by this preview.
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] font-medium text-slate-500">Illustrative product preview — not a real compliance result.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['01', 'Upload', 'Start with the HR documents you already have.'],
              ['02', 'Extract evidence', 'Organize document evidence and relevant source context.'],
              ['03', 'Review', 'Surface findings, verification gaps and suggested next actions.'],
              ['04', 'Act', 'Move approved actions into the appropriate workflow or human review.'],
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-[10px] font-black tracking-[0.2em] text-indigo-600">{num}</div>
                <div className="mt-2 text-base font-black text-slate-900">{title}</div>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">One operating layer</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">From document review to compliance action.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">The product is designed around the work HR teams actually need to complete — not a giant questionnaire before they can see anything.</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {features.map(({ icon: Icon, title, text }) => (
              <button key={title} onClick={() => setActiveTab(title.includes('AI Audit') ? 'ai-audit' : title.includes('Labour') ? 'labour-codes' : 'workspace')} className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
                <div className="flex items-start gap-4"><div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><Icon className="h-5 w-5" /></div><div className="flex-1"><h3 className="font-black text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-700">Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span></div></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Trust layer</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight">AI that knows when it should not guess.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">ComplyOS keeps source verification, evidence and human review visible. If a legal source cannot be verified, the product should show that gap instead of manufacturing certainty.</p>
            <div className="mt-6 space-y-3">
              {['Primary-source references are treated as evidence, not decoration.', 'User documents are treated as untrusted input for AI review.', 'Durable system-of-record writes require the production authorization boundary.'].map((item) => <div key={item} className="flex gap-3 text-sm font-semibold text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />{item}</div>)}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 text-sm font-black"><Workflow className="h-5 w-5 text-cyan-300" /> Evidence → finding → action</div>
            <div className="mt-6 space-y-3">
              {[['DOCUMENT', 'HR policy / contract'], ['EVIDENCE', 'Relevant text + source context'], ['FINDING', 'Review item with verification state'], ['ACTION', 'Human-approved next step']].map(([a,b], i) => <div key={a} className="flex items-center gap-3"><div className="w-20 text-[10px] font-black tracking-widest text-slate-500">{a}</div><div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">{b}</div>{i < 3 && <ArrowRight className="h-4 w-4 text-slate-600" />}</div>)}
            </div>
            <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-400"><Zap className="h-4 w-4 text-amber-300" /> Designed for reviewability, not black-box scores.</div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center"><div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">FAQ</div><h2 className="mt-2 text-3xl font-black tracking-tight">Before you start</h2></div>
          <div className="mt-8 space-y-3">
            {faqs.map(([q,a], i) => <div key={q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-black text-slate-900"><span>{q}</span>{openFaq === i ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}</button>{openFaq === i && <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-6 text-slate-600">{a}</div>}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div><div className="flex items-center gap-2 text-sm font-black"><FileText className="h-4 w-4 text-cyan-300" /> Start with what you already have.</div><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Review a document or open Nova. You can add more context only when the workflow needs it.</p></div>
          <button onClick={() => setActiveTab('ai-audit')} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-50">Review documents <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </main>
  );
};
