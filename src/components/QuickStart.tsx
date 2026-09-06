import React, { useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, RefreshCw, ShieldCheck, Sparkles, Upload, X } from 'lucide-react';

interface Finding { id: string; clauseTitle: string; originalText: string; riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'; issueDescription: string; suggestedFix: string; citationStatus: 'VERIFIED_SOURCE' | 'NEEDS_SOURCE_VERIFICATION' | 'NOT_APPLICABLE'; }
interface AuditResponse { result: { summary: string; overallRiskTier: Finding['riskLevel']; clauses: Finding[] }; disclaimer: string; }
type UploadItem = { name: string; type: string; size: number; text?: string; data?: string };

const MAX_FILE_BYTES = 1_200_000;
const TEXT_TYPES = new Set(['text/plain', 'text/markdown', 'text/csv', 'application/json', 'text/html']);
const riskClass = (risk: Finding['riskLevel']) => risk === 'CRITICAL' ? 'border-rose-200 bg-rose-50 text-rose-800' : risk === 'HIGH' ? 'border-amber-200 bg-amber-50 text-amber-800' : risk === 'MODERATE' ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800';

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
      if (file.size > MAX_FILE_BYTES) { setError(`${file.name} is larger than 1.2 MB. Upload a smaller copy or PDF export.`); continue; }
      const lower = file.name.toLowerCase();
      const isPdf = file.type === 'application/pdf' || lower.endsWith('.pdf');
      const isText = TEXT_TYPES.has(file.type) || /\.(txt|md|csv|json|html)$/i.test(lower);
      if (!isPdf && !isText) { setError(`${file.name}: upload PDF, TXT, MD, CSV, JSON or HTML for the instant review.`); continue; }
      if (isText) selected.push({ name: file.name, type: file.type || 'text/plain', size: file.size, text: await file.text() });
      else {
        const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1] || ''); reader.onerror = () => reject(new Error(`Could not read ${file.name}`)); reader.readAsDataURL(file); });
        selected.push({ name: file.name, type: 'application/pdf', size: file.size, data });
      }
    }
    if (selected.length) setFiles(selected);
  };

  const runReview = async () => {
    if (!files.length) return;
    setRunning(true); setError(''); setResult(null);
    try {
      const documents = files.map(file => ({ name: file.name, mimeType: file.type, text: file.text, data: file.data }));
      const response = await fetch('/api/audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ policyTitle: fileLabel, jurisdiction: 'India - National', documents }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || `Review failed (${response.status})`);
      if (!data?.result || !Array.isArray(data.result.clauses)) throw new Error('The review returned an incomplete result.');
      setResult(data as AuditResponse);
    } catch (err) { setError(err instanceof Error ? err.message : 'Review failed. Please try again.'); }
    finally { setRunning(false); }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm" onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); void readFiles(Array.from(e.dataTransfer.files)); }}>
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">1</span> Add documents</div>
            <span className="hidden text-xs font-semibold text-slate-400 sm:block">No account setup required for this first pass</span>
          </div>
          <h3 className="mt-4 text-xl font-black text-slate-950 sm:text-2xl">What would you like Nova to review?</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Start with one or a few existing HR documents. We will keep missing evidence visible rather than guessing.</p>
        </div>

        <div className="p-5 sm:p-7">
          <input ref={inputRef} type="file" multiple accept=".pdf,.txt,.md,.csv,.json,.html,application/pdf,text/plain,text/markdown,text/csv,application/json,text/html" className="hidden" onChange={e => { void readFiles(Array.from(e.target.files || [])); e.currentTarget.value = ''; }} />
          <div className={`rounded-2xl border-2 border-dashed px-5 py-8 text-center transition sm:px-8 sm:py-10 ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50/80 hover:border-indigo-300 hover:bg-indigo-50/30'}`}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><Upload className="h-5 w-5 text-indigo-600" /></div>
            <h4 className="mt-4 text-base font-extrabold text-slate-900">Drop files here</h4>
            <p className="mt-1 text-xs leading-5 text-slate-500">PDF, TXT, MD, CSV, JSON or HTML · up to 5 files · 1.2 MB each</p>
            <button onClick={() => inputRef.current?.click()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"><Upload className="h-4 w-4" /> Choose from device</button>
          </div>

          {files.length > 0 && <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3"><div><div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Step 2 · Ready</div><div className="mt-1 text-sm font-extrabold text-slate-900">{files.length === 1 ? '1 document selected' : `${files.length} documents selected`}</div></div><button onClick={() => { setFiles([]); setResult(null); }} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Clear all</button></div>
            <div className="mt-3 space-y-2">{files.map(file => <div key={file.name} className="flex items-center gap-3 rounded-xl border border-white bg-white p-3"><FileText className="h-4 w-4 shrink-0 text-indigo-600" /><span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800">{file.name}</span><span className="text-[10px] text-slate-400">{Math.ceil(file.size / 1024)} KB</span><button aria-label={`Remove ${file.name}`} onClick={() => setFiles(prev => prev.filter(item => item.name !== file.name))} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><X className="h-4 w-4" /></button></div>)}</div>
            <button disabled={!canRun} onClick={() => void runReview()} className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{running ? <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Nova is reviewing…</span> : <span className="inline-flex items-center justify-center gap-2"><Sparkles className="h-4 w-4" /> Run first-pass review <ArrowRight className="h-4 w-4" /></span>}</button>
          </div>}

          {error && <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-800"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><p className="text-[11px] leading-5 text-slate-600"><strong className="text-slate-800">Prefer to ask first?</strong> Talk to Nova before uploading anything.</p></div><button onClick={onChat} className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">Chat with Nova</button></div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-5 text-white shadow-xl sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">What you get</div><h3 className="mt-1 text-xl font-black sm:text-2xl">A review queue, not a scary score.</h3></div><span className="w-fit rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-400">ILLUSTRATIVE</span></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[['Evidence', 'What your documents actually support'], ['Review items', 'Where evidence or source verification is needed'], ['Next action', 'A clear place to start instead of a long report']].map(([title, text]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-2 text-xs font-extrabold text-white"><CheckCircle2 className="h-4 w-4 text-indigo-300" /> {title}</div><p className="mt-2 text-[11px] leading-5 text-slate-400">{text}</p></div>)}
        </div>
        <p className="mt-4 text-[10px] leading-4 text-slate-500">Illustrative product preview only. It is not a compliance assessment and contains no real customer data.</p>
      </section>

      {result && <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Step 3 · Review</div><h2 className="mt-1 text-2xl font-black text-slate-950">Here is what needs attention</h2></div><span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${riskClass(result.result.overallRiskTier)}`}>{result.result.overallRiskTier} review tier</span></div><p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">{result.result.summary}</p><div className="mt-5 grid gap-3">{result.result.clauses.map(item => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-slate-900">{item.clauseTitle}</h3><span className={`rounded-md border px-2 py-1 text-[10px] font-black ${riskClass(item.riskLevel)}`}>{item.riskLevel}</span></div><p className="mt-2 text-xs leading-5 text-slate-600">{item.issueDescription}</p><div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900"><strong>Suggested action:</strong> {item.suggestedFix}</div></article>)}</div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-950"><strong>Evidence-first:</strong> {result.disclaimer}</div></section>}
    </div>
  );
};
