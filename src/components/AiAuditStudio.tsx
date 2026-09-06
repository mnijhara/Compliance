import React, { useRef, useState } from 'react';
import { AlertTriangle, ExternalLink, FileText, RefreshCw, Scale, Sparkles, Upload } from 'lucide-react';
import { COMPLIANCE_SOURCES } from '../data/complianceSources';

interface AuditClause { id: string; clauseTitle: string; originalText: string; riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'; sourceIds: string[]; citationStatus: 'VERIFIED_SOURCE' | 'NEEDS_SOURCE_VERIFICATION' | 'NOT_APPLICABLE'; issueDescription: string; suggestedFix: string; }
interface AuditResult { policyTitle: string; jurisdiction: string; summary: string; overallRiskTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'; clauses: AuditClause[]; }
interface AuditResponse { policyTitle: string; jurisdiction: string; result: AuditResult; auditedAt: string; mode: string; disclaimer: string; }

export const AiAuditStudio: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [policyTitle, setPolicyTitle] = useState('');
  const [jurisdiction, setJurisdiction] = useState('India - National');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadFile = async (file: File) => {
    setErrorMsg(null);
    const extension = file.name.split('.').pop()?.toLowerCase();
    const textLike = file.type.startsWith('text/') || ['txt', 'md', 'csv', 'json', 'html', 'xml'].includes(extension || '');
    if (!textLike) {
      setErrorMsg('This upload flow reads text documents directly. For PDF or DOCX, paste the document text here for now so ComplyOS never silently analyses unreadable binary content.');
      return;
    }
    const text = await file.text();
    if (!text.trim()) {
      setErrorMsg('That document appears to contain no readable text.');
      return;
    }
    setDocumentText(text);
    setPolicyTitle(file.name.replace(/\.[^.]+$/, ''));
    setAuditResult(null);
  };

  const handleRunAudit = async () => {
    const text = documentText.trim();
    if (!text) { setErrorMsg('Upload a document or paste its text to start.'); return; }
    setIsAuditing(true); setErrorMsg(null); setAuditResult(null);
    try {
      const response = await fetch('/api/audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentText: text, policyTitle: policyTitle.trim() || 'Uploaded HR document', jurisdiction }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || `Audit server returned ${response.status}.`);
      if (!data?.result || !Array.isArray(data.result.clauses)) throw new Error('The audit service returned an incomplete result. No conclusion was displayed.');
      setAuditResult(data as AuditResponse);
    } catch (err) { console.error('Audit failed:', err); setErrorMsg(err instanceof Error ? err.message : 'Audit execution encountered an issue.'); }
    finally { setIsAuditing(false); }
  };

  const result = auditResult?.result;
  const riskClass = (risk: AuditClause['riskLevel']) => risk === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-200' : risk === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-200' : risk === 'MODERATE' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  return (
    <div className="min-h-screen bg-white px-4 py-10 font-sans text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"><Sparkles className="h-3.5 w-3.5" /> AI document review</div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Upload it. We’ll show you what needs attention.</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">Start with the HR documents you already have. No long setup. ComplyOS reviews the supplied text, maps possible issues to its source registry, and keeps anything requiring verification clearly marked.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
              <input ref={fileInput} type="file" className="hidden" accept=".txt,.md,.csv,.json,.html,.xml,text/*" onChange={e => e.target.files?.[0] && void loadFile(e.target.files[0])} />
              <button type="button" onClick={() => fileInput.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-indigo-300 bg-white px-5 py-10 text-center transition hover:border-indigo-500 hover:bg-indigo-50/50"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Upload className="h-6 w-6" /></span><span className="mt-4 block text-sm font-bold">Upload an existing HR document</span><span className="mt-1 block text-xs text-slate-500">Text, Markdown, CSV, JSON or HTML</span><span className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white">Choose document</span></button>

              <div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400"><span className="h-px flex-1 bg-slate-200" />or paste text<span className="h-px flex-1 bg-slate-200" /></div>
              <textarea rows={10} value={documentText} onChange={e => { setDocumentText(e.target.value); setAuditResult(null); }} placeholder="Paste the text from an employment contract, offer letter, policy or contractor agreement…" className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-xs leading-relaxed text-slate-800 focus:border-indigo-500 focus:outline-none" />

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-xs"><label className="mb-1 block font-semibold text-slate-600">Where does this document apply? <span className="font-normal text-slate-400">Optional</span></label><select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"><option>India - National</option><option>India - Maharashtra</option><option>India - Karnataka</option><option>India - Delhi</option></select></div>
              <input value={policyTitle} onChange={e => setPolicyTitle(e.target.value)} placeholder="Document name (optional)" className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none" />
              <button onClick={handleRunAudit} disabled={isAuditing} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-70">{isAuditing ? <><RefreshCw className="h-4 w-4 animate-spin" /> Reviewing…</> : <><Sparkles className="h-4 w-4" /> Review my document</>}</button>
              {errorMsg && <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"><AlertTriangle className="h-4 w-4 shrink-0" />{errorMsg}</div>}
              <p className="mt-4 text-[10px] leading-relaxed text-slate-400">PDF/DOCX binary extraction is intentionally not claimed by this version. Use readable text until a server-side document parser is added and tested.</p>
            </div>
          </section>

          <section className="lg:col-span-3">
            {!result && !isAuditing && !errorMsg && <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><FileText className="h-8 w-8" /></div><h2 className="mt-5 text-lg font-bold">Your review appears here</h2><p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">Upload or paste a real document. You’ll get a concise summary, clauses to inspect, source mapping and suggested next actions.</p><div className="mt-6 flex flex-wrap justify-center gap-2 text-[10px] font-semibold text-slate-500"><span className="rounded-full bg-slate-100 px-3 py-1.5">No questionnaire</span><span className="rounded-full bg-slate-100 px-3 py-1.5">No dummy result</span><span className="rounded-full bg-slate-100 px-3 py-1.5">Evidence-first</span></div></div>}
            {isAuditing && <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-indigo-200 bg-indigo-50/40 p-8 text-center"><RefreshCw className="h-9 w-9 animate-spin text-indigo-600" /><h2 className="mt-4 text-lg font-bold">Reviewing your document</h2><p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-600">The interface stays visible while the server analyses the supplied text.</p></div>}
            {result && <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Review complete</div><h2 className="mt-1 text-lg font-bold">{result.policyTitle}</h2><p className="mt-1 text-xs text-slate-500">{result.jurisdiction}</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${riskClass(result.overallRiskTier)}`}>{result.overallRiskTier}</span></div><p className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-700">{result.summary}</p></div>
              <div className="space-y-3">{result.clauses.map(clause => <article key={clause.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">{clause.clauseTitle}</h3><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${riskClass(clause.riskLevel)}`}>{clause.riskLevel}</span></div><div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">“{clause.originalText}”</div><div className="mt-3 flex items-start gap-1.5 text-[11px] text-indigo-700"><Scale className="mt-0.5 h-3 w-3 shrink-0" /><span>{clause.citationStatus === 'VERIFIED_SOURCE' ? 'Mapped to a registry source; human verification is still required.' : clause.citationStatus === 'NOT_APPLICABLE' ? 'No statutory source asserted.' : 'Source verification required before treating this as a legal conclusion.'}</span></div><p className="mt-3 text-xs leading-relaxed text-slate-600">{clause.issueDescription}</p><div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950"><strong>Suggested next step:</strong> {clause.suggestedFix}</div>{clause.sourceIds.length > 0 && <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">{clause.sourceIds.map(id => { const source = COMPLIANCE_SOURCES.find(s => s.id === id); return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-indigo-700"><ExternalLink className="h-3 w-3" />{source.authority}</a> : null; })}</div>}</article>)}</div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><strong>Verification:</strong> {auditResult.disclaimer}</div>
            </div>}
          </section>
        </div>
      </div>
    </div>
  );
};
