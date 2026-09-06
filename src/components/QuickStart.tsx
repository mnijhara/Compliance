import React, { useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, MessageCircle, RefreshCw, ShieldCheck, Sparkles, Upload, X } from 'lucide-react';

interface Finding {
  id: string;
  clauseTitle: string;
  originalText: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  issueDescription: string;
  suggestedFix: string;
  citationStatus: 'VERIFIED_SOURCE' | 'NEEDS_SOURCE_VERIFICATION' | 'NOT_APPLICABLE';
}

interface AuditResponse {
  result: {
    summary: string;
    overallRiskTier: Finding['riskLevel'];
    clauses: Finding[];
  };
  disclaimer: string;
}

type UploadItem = { name: string; type: string; size: number; text?: string; data?: string };

const MAX_FILE_BYTES = 1_200_000;
const TEXT_TYPES = new Set(['text/plain', 'text/markdown', 'text/csv', 'application/json', 'text/html']);

const riskClass = (risk: Finding['riskLevel']) => {
  if (risk === 'CRITICAL') return 'border-rose-200 bg-rose-50 text-rose-800';
  if (risk === 'HIGH') return 'border-amber-200 bg-amber-50 text-amber-800';
  if (risk === 'MODERATE') return 'border-blue-200 bg-blue-50 text-blue-800';
  return 'border-emerald-200 bg-emerald-50 text-emerald-800';
};

export const QuickStart: React.FC<{ onChat: () => void }> = ({ onChat }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState('');

  const canRun = files.length > 0 && !running;
  const fileLabel = useMemo(() => files.length === 1 ? files[0].name : `${files.length} documents`, [files]);

  const readFiles = async (incoming: File[]) => {
    setError('');
    setResult(null);
    const selected: UploadItem[] = [];
    for (const file of incoming.slice(0, 5)) {
      if (file.size > MAX_FILE_BYTES) {
        setError(`${file.name} is larger than 1.2 MB. Upload a smaller copy or PDF export.`);
        continue;
      }
      const lower = file.name.toLowerCase();
      const isPdf = file.type === 'application/pdf' || lower.endsWith('.pdf');
      const isText = TEXT_TYPES.has(file.type) || /\.(txt|md|csv|json|html)$/i.test(lower);
      if (!isPdf && !isText) {
        setError(`${file.name}: upload PDF, TXT, MD, CSV, JSON or HTML for the instant review.`);
        continue;
      }
      if (isText) {
        selected.push({ name: file.name, type: file.type || 'text/plain', size: file.size, text: await file.text() });
      } else {
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
          reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
          reader.readAsDataURL(file);
        });
        selected.push({ name: file.name, type: 'application/pdf', size: file.size, data });
      }
    }
    if (selected.length) setFiles(selected);
  };

  const runReview = async () => {
    if (!files.length) return;
    setRunning(true);
    setError('');
    setResult(null);
    try {
      const documents = files.map(file => ({ name: file.name, mimeType: file.type, text: file.text, data: file.data }));
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policyTitle: fileLabel, jurisdiction: 'India - National', documents })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || `Review failed (${response.status})`);
      if (!data?.result || !Array.isArray(data.result.clauses)) throw new Error('The review returned an incomplete result.');
      setResult(data as AuditResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Review failed. Please try again.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700"><Sparkles className="h-3.5 w-3.5" /> ComplyOS Magic Demo</div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Upload your HR documents.<br /><span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Get the gaps.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">No long setup. No 20-question onboarding. Drop in the policies, contracts or HR documents you already have and let Nova turn them into a simple review queue.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200"><Upload className="h-4 w-4" /> Upload documents</button>
            <button onClick={onChat} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800"><MessageCircle className="h-4 w-4 text-indigo-600" /> Chat with Nova</button>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Start with India-wide review. Add a state or business context later only if needed.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-2 text-sm font-bold"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500"><ShieldCheck className="h-4 w-4" /></div> Nova Compliance Review</div><span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-300">LIVE DEMO</span></div>
          <div className="mt-5 space-y-3">
            {['Employee Handbook.pdf', 'Leave & Attendance Policy.pdf', 'Employment Agreement.pdf'].map((name, i) => <div key={name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"><FileText className="h-4 w-4 text-indigo-300" /><span className="flex-1 text-xs text-slate-200">{name}</span><CheckCircle2 className="h-4 w-4 text-emerald-400" /></div>)}
            <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-4"><div className="flex items-center gap-2 text-xs font-bold text-indigo-200"><Sparkles className="h-3.5 w-3.5" /> Nova is mapping documents to review areas…</div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-4/5 rounded-full bg-indigo-400" /></div><div className="mt-3 grid grid-cols-3 gap-2 text-center"><div><div className="text-lg font-black">12</div><div className="text-[9px] text-slate-400">items reviewed</div></div><div><div className="text-lg font-black text-amber-300">3</div><div className="text-[9px] text-slate-400">needs review</div></div><div><div className="text-lg font-black text-emerald-300">9</div><div className="text-[9px] text-slate-400">no issue found</div></div></div></div>
          </div>
          <p className="mt-4 text-[10px] text-slate-500">Illustrative product preview — not a real compliance result.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); void readFiles(Array.from(e.dataTransfer.files)); }}>
        <div className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50'}`}>
          <input ref={inputRef} type="file" multiple accept=".pdf,.txt,.md,.csv,.json,.html,application/pdf,text/plain,text/markdown,text/csv,application/json,text/html" className="hidden" onChange={e => { void readFiles(Array.from(e.target.files || [])); e.currentTarget.value = ''; }} />
          <Upload className="mx-auto h-8 w-8 text-indigo-600" />
          <h2 className="mt-3 text-lg font-extrabold text-slate-900">Drop your existing HR documents here</h2>
          <p className="mt-1 text-sm text-slate-500">PDF, TXT, MD, CSV, JSON or HTML · up to 5 files · no setup wizard</p>
          <button onClick={() => inputRef.current?.click()} className="mt-5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800">Choose files</button>
        </div>

        {files.length > 0 && <div className="mt-5 space-y-3"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Ready to review</span><button onClick={() => setFiles([])} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Clear</button></div>{files.map(file => <div key={file.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><FileText className="h-4 w-4 text-indigo-600" /><span className="flex-1 truncate text-sm font-semibold text-slate-800">{file.name}</span><span className="text-[10px] text-slate-400">{Math.ceil(file.size / 1024)} KB</span><button onClick={() => setFiles(prev => prev.filter(item => item.name !== file.name))} className="text-slate-400 hover:text-slate-800"><X className="h-4 w-4" /></button></div>)}<button disabled={!canRun} onClick={() => void runReview()} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{running ? <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Nova is reviewing your documents…</span> : <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Review my documents <ArrowRight className="h-4 w-4" /></span>}</button></div>}
        {error && <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}
      </section>

      {result && <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Your document review</div><h2 className="mt-1 text-2xl font-black text-slate-950">Here is what needs attention</h2></div><span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${riskClass(result.result.overallRiskTier)}`}>{result.result.overallRiskTier} review tier</span></div><p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">{result.result.summary}</p><div className="mt-5 grid gap-3">{result.result.clauses.map(item => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-slate-900">{item.clauseTitle}</h3><span className={`rounded-md border px-2 py-1 text-[10px] font-black ${riskClass(item.riskLevel)}`}>{item.riskLevel}</span></div><p className="mt-2 text-xs leading-5 text-slate-600">{item.issueDescription}</p><div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900"><strong>Suggested action:</strong> {item.suggestedFix}</div></article>)}</div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-950"><strong>Evidence-first:</strong> {result.disclaimer}</div></section>}
    </div>
  );
};
