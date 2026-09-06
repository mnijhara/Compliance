import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, FileText, RefreshCw, Scale, Sparkles } from 'lucide-react';
import { COMPLIANCE_SOURCES } from '../data/complianceSources';

interface AuditClause {
  id: string;
  clauseTitle: string;
  originalText: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  sourceIds: string[];
  citationStatus: 'VERIFIED_SOURCE' | 'NEEDS_SOURCE_VERIFICATION' | 'NOT_APPLICABLE';
  issueDescription: string;
  suggestedFix: string;
}

interface AuditResult {
  policyTitle: string;
  jurisdiction: string;
  summary: string;
  overallRiskTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  clauses: AuditClause[];
}

interface AuditResponse {
  policyTitle: string;
  jurisdiction: string;
  result: AuditResult;
  auditedAt: string;
  mode: string;
  disclaimer: string;
}

export const AiAuditStudio: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [policyTitle, setPolicyTitle] = useState('');
  const [jurisdiction, setJurisdiction] = useState('India - Maharashtra');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunAudit = async () => {
    const text = documentText.trim();
    const title = policyTitle.trim();

    if (!text) {
      setErrorMsg('Paste the actual contract or policy text before starting the audit.');
      return;
    }
    if (!title) {
      setErrorMsg('Enter the document title before starting the audit.');
      return;
    }

    setIsAuditing(true);
    setErrorMsg(null);
    setAuditResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: text, policyTitle: title, jurisdiction })
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || `Audit server returned ${response.status}.`);
      }
      if (!data?.result || !Array.isArray(data.result.clauses)) {
        throw new Error('The audit service returned an incomplete result. No conclusion was displayed.');
      }

      setAuditResult(data as AuditResponse);
    } catch (err) {
      console.error('Audit failed:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Audit execution encountered an issue.');
    } finally {
      setIsAuditing(false);
    }
  };

  const result = auditResult?.result;
  const riskClass = (risk: AuditClause['riskLevel']) => {
    if (risk === 'CRITICAL') return 'bg-rose-100 text-rose-800 border-rose-200';
    if (risk === 'HIGH') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (risk === 'MODERATE') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Evidence-first AI Contract & Policy Review</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Indian Statutory AI Contract & Policy Audit Studio</h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Paste the actual HR offer letter, employment contract, or policy you want reviewed. ComplyOS analyses the supplied text against its authoritative source registry and clearly marks findings that still require human source verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">1. Document details</label>
                <span className="text-[10px] text-slate-500">No sample data loaded</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Statutory jurisdiction</label>
                  <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="w-full bg-white text-indigo-700 font-semibold text-xs p-3 rounded-xl border border-indigo-300 focus:outline-none focus:border-indigo-500">
                    <option value="India - Maharashtra">Maharashtra</option>
                    <option value="India - National">India - National</option>
                    <option value="India - Karnataka">Karnataka</option>
                    <option value="India - Delhi">Delhi NCT</option>
                    <option value="India - Telangana">Telangana</option>
                    <option value="India - Tamil Nadu">Tamil Nadu</option>
                    <option value="India - Gujarat">Gujarat</option>
                    <option value="US - California">US - California</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Document title</label>
                  <input value={policyTitle} onChange={e => setPolicyTitle(e.target.value)} placeholder="e.g. Employment Agreement - Operations" className="w-full bg-white text-slate-900 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>2. Paste actual contract or policy text</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">{documentText.length} characters</span>
                </label>
                <textarea rows={14} value={documentText} onChange={e => setDocumentText(e.target.value)} placeholder="Paste the actual document text here. ComplyOS will not pre-fill a contract or policy for you." className="w-full bg-white text-slate-800 text-xs p-4 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed" />
              </div>

              <button onClick={handleRunAudit} disabled={isAuditing} className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center justify-center gap-2 ${isAuditing ? 'bg-indigo-700 cursor-not-allowed opacity-80' : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500'}`}>
                {isAuditing ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Analysing your document…</span></> : <><Sparkles className="w-4 h-4" /><span>Run AI Statutory Compliance Audit</span></>}
              </button>

              {errorMsg && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            {!result && !isAuditing && !errorMsg && (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center shadow-xs">
                <FileText className="w-10 h-10 mx-auto text-slate-400" />
                <h2 className="mt-3 text-sm font-bold text-slate-900">No audit result yet</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">Enter your document details and paste the actual contract or policy text. Results will appear here after the audit completes.</p>
              </div>
            )}

            {isAuditing && (
              <div className="bg-slate-50 p-8 rounded-2xl border border-indigo-200 text-center shadow-xs">
                <RefreshCw className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
                <h2 className="mt-3 text-sm font-bold text-slate-900">Analysing your document</h2>
                <p className="mt-2 text-xs text-slate-600">The page remains visible while the server reviews the supplied text. No dummy result is shown.</p>
              </div>
            )}

            {result && (
              <div className="space-y-5">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between border-b border-slate-200 pb-4 gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Audit completed</span>
                      <h3 className="text-lg font-bold text-slate-900">{result.policyTitle}</h3>
                      <p className="text-xs text-slate-600">Jurisdiction: <strong className="text-indigo-700">{result.jurisdiction}</strong></p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border ${riskClass(result.overallRiskTier)}`}>Tier: {result.overallRiskTier}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{result.summary}</p>
                  <div className="text-[10px] text-slate-500">Reviewed at {new Date(auditResult!.auditedAt).toLocaleString()}</div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Clause analysis ({result.clauses.length})</h4>
                  {result.clauses.length === 0 ? (
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600">No specific clauses were flagged by the review.</div>
                  ) : result.clauses.map(clause => (
                    <article key={clause.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-900">{clause.clauseTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${riskClass(clause.riskLevel)}`}>{clause.riskLevel}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg text-xs font-mono text-slate-700 border border-slate-200 whitespace-pre-wrap">“{clause.originalText}”</div>
                      <div className="text-[11px] flex items-start gap-1 font-mono text-indigo-700">
                        <Scale className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{clause.citationStatus === 'VERIFIED_SOURCE' ? 'Source mapped; human verification still required.' : clause.citationStatus === 'NOT_APPLICABLE' ? 'No statutory source asserted.' : 'Source verification required before treating this as a legal conclusion.'}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{clause.issueDescription}</p>
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900"><strong>Suggested fix:</strong> {clause.suggestedFix}</div>
                      {clause.sourceIds.length > 0 && (
                        <div className="border-t border-slate-200 pt-3">
                          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Source registry</div>
                          <div className="flex flex-wrap gap-2">
                            {clause.sourceIds.map(id => {
                              const source = COMPLIANCE_SOURCES.find(s => s.id === id);
                              return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-indigo-700"><ExternalLink className="w-3 h-3" />{source.authority}</a> : null;
                            })}
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-950">
                  <strong>Verification required:</strong> {auditResult.disclaimer}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
