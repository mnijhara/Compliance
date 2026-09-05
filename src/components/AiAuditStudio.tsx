import React, { useState } from 'react';
import { SAMPLE_POLICIES } from '../data/samplePolicies';
import { AuditResult, AuditClause } from '../types';
import { Sparkles, AlertTriangle, CheckCircle2, Copy, Check, RefreshCw, FileText, Scale } from 'lucide-react';

export const AiAuditStudio: React.FC = () => {
  const [documentText, setDocumentText] = useState<string>(SAMPLE_POLICIES[0].sampleText);
  const [policyTitle, setPolicyTitle] = useState<string>('Employment Agreement Contract (India)');
  const [jurisdiction, setJurisdiction] = useState<string>('India - Maharashtra');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [copiedRewrite, setCopiedRewrite] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load sample contract
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_POLICIES.find(s => s.id === sampleId);
    if (sample) {
      setDocumentText(sample.sampleText);
      setPolicyTitle(sample.title);
      setJurisdiction(sample.recommendedJurisdictions[0] || 'India - Maharashtra');
      setAuditResult(null);
    }
  };

  // Run AI Audit API Request
  const handleRunAudit = async () => {
    if (!documentText.trim()) {
      alert('Please enter or paste document text to audit.');
      return;
    }

    setIsAuditing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          policyTitle,
          jurisdiction
        })
      });

      if (!response.ok) {
        throw new Error(`Audit server response error: ${response.statusText}`);
      }

      const data: AuditResult = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error('Audit failed:', err);
      setErrorMsg(err.message || 'Audit execution encountered an issue.');
    } finally {
      setIsAuditing(false);
    }
  };

  const copyRewriteToClipboard = () => {
    if (auditResult?.compliantRewrite) {
      navigator.clipboard.writeText(auditResult.compliantRewrite);
      setCopiedRewrite(true);
      setTimeout(() => setCopiedRewrite(false), 2500);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gemini 3.7 Powered Real-Time Contract Auditor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Indian Statutory AI Contract & Policy Audit Studio
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Upload or paste any HR offer letter, employment contract, or company policy. CmpliHR.ai instantly flags statutory breaches against Section 27 Contract Act, Shops & Establishments overtime rates, POSH IC member gaps, and Payment of Wages Act limits.
          </p>
        </div>

        {/* Audit Inputs & Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  1. Select Statutory Jurisdiction & Contract Title
                </label>
                <span className="text-[10px] text-slate-500 font-mono">SOC 2 Encrypted</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Statutory Jurisdiction</label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full bg-white text-indigo-700 font-semibold text-xs p-3 rounded-xl border border-indigo-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  >
                    <option value="India - Maharashtra">🇮🇳 Maharashtra (Shops & Est. Act 2017)</option>
                    <option value="India - National">🇮🇳 India - Statutory National (Central Acts & Codes)</option>
                    <option value="India - Karnataka">🇮🇳 Karnataka (IT & Shops Act 1961)</option>
                    <option value="India - Delhi">🇮🇳 Delhi NCT (Shops & Est. Act 1954)</option>
                    <option value="India - Telangana">🇮🇳 Telangana & AP (Form XXIV)</option>
                    <option value="India - Tamil Nadu">🇮🇳 Tamil Nadu (Shops & Right to Sit)</option>
                    <option value="India - Gujarat">🇮🇳 Gujarat (Shops Act 2019)</option>
                    <option value="US - California">🇺🇸 US - California (AB5 / Overtime)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Document Title</label>
                  <input
                    type="text"
                    value={policyTitle}
                    onChange={(e) => setPolicyTitle(e.target.value)}
                    placeholder="e.g., Senior Operations Associate Offer Letter"
                    className="w-full bg-white text-slate-900 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Sample Document Loader */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Or load high-risk sample contract templates:
                </label>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_POLICIES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleLoadSample(sample.id)}
                      className="px-2.5 py-1.5 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-indigo-600" />
                      <span>{sample.title.split(' ')[0]} {sample.title.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contract Input Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>2. Paste Contract or Policy Text</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">
                    {documentText.length} characters
                  </span>
                </label>
                <textarea
                  rows={10}
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste contract clauses, offer letter terms, or employee handbook sections here..."
                  className="w-full bg-white text-slate-800 text-xs p-4 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed shadow-xs"
                />
              </div>

              {/* Audit Execution Button */}
              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  isAuditing
                    ? 'bg-indigo-700 cursor-not-allowed opacity-80'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500'
                }`}
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Statutory Clauses against Indian Labor Laws...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Statutory Compliance Audit</span>
                  </>
                )}
              </button>

              {errorMsg && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Audit Results & Compliant Rewrite (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {auditResult ? (
              <div className="space-y-5">
                
                {/* Score & Risk Summary Header Card */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">AUDIT COMPLETED</span>
                      <h3 className="text-lg font-bold text-slate-900">{auditResult.policyTitle}</h3>
                      <p className="text-xs text-slate-600">Jurisdiction: <strong className="text-indigo-700">{auditResult.jurisdiction}</strong></p>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-black text-indigo-700 font-mono">
                        {auditResult.complianceScore}<span className="text-sm font-normal text-slate-500">/100</span>
                      </div>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border mt-1 ${
                        auditResult.overallRiskTier === 'High-Risk' || auditResult.overallRiskTier === 'Prohibited'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : auditResult.overallRiskTier === 'Limited-Risk'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        Tier: {auditResult.overallRiskTier}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    {auditResult.summary}
                  </p>

                  {/* Issues Counter Badges */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-rose-50 p-2 rounded-lg border border-rose-200">
                      <div className="font-bold text-rose-700 font-mono">{auditResult.totalIssuesCount.critical}</div>
                      <div className="text-[10px] text-slate-600">Critical</div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <div className="font-bold text-amber-700 font-mono">{auditResult.totalIssuesCount.high}</div>
                      <div className="text-[10px] text-slate-600">High</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                      <div className="font-bold text-blue-700 font-mono">{auditResult.totalIssuesCount.moderate}</div>
                      <div className="text-[10px] text-slate-600">Moderate</div>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <div className="font-bold text-emerald-700 font-mono">{auditResult.totalIssuesCount.compliant}</div>
                      <div className="text-[10px] text-slate-600">Compliant</div>
                    </div>
                  </div>
                </div>

                {/* Flagged Clause Analysis */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center justify-between">
                    <span>Flagged Clause Analysis ({auditResult.clauses.length})</span>
                    <span className="text-[10px] text-slate-500 font-normal">Click items for details</span>
                  </h4>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                    {auditResult.clauses.map((clause: AuditClause) => (
                      <div key={clause.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{clause.clauseTitle}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            clause.riskLevel === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : clause.riskLevel === 'HIGH'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {clause.riskLevel}
                          </span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
                          "{clause.originalText}"
                        </div>

                        <div className="text-[11px] text-indigo-700 flex items-center gap-1 font-mono">
                          <Scale className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>Citation: {clause.citation}</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{clause.issueDescription}</p>

                        <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                          <strong>Suggested Fix:</strong> {clause.suggestedFix}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generated Compliant Rewrite Box */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-emerald-300 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                        Statutorily Compliant Contract Rewrite
                      </span>
                    </div>

                    <button
                      onClick={copyRewriteToClipboard}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copiedRewrite ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Compliant Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  <textarea
                    readOnly
                    rows={8}
                    value={auditResult.compliantRewrite}
                    className="w-full bg-white text-emerald-800 text-xs p-4 rounded-xl border border-slate-200 font-mono leading-relaxed shadow-xs"
                  />
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center space-y-4 h-full flex flex-col justify-center items-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Ready to Perform Audit</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Select an Indian sample contract or paste custom text on the left, then click "Run AI Statutory Compliance Audit" to analyze legal risks.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
