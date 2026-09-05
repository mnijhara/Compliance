import React, { useState } from 'react';
import { SAMPLE_POLICIES } from '../data/samplePolicies';
import { AuditResult, AuditClause } from '../types';
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, Scale, Copy, Download, RefreshCw, FileText, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const AuditStudioView: React.FC = () => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-1');
  const [documentTitle, setDocumentTitle] = useState<string>('Employment Offer Letter');
  const [jurisdiction, setJurisdiction] = useState<string>('US - California');
  const [documentText, setDocumentText] = useState<string>(SAMPLE_POLICIES[0].sampleText);
  
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'clauses' | 'rewrite'>('clauses');

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_POLICIES.find(s => s.id === sampleId);
    if (sample) {
      setSelectedSampleId(sampleId);
      setDocumentTitle(sample.title);
      setJurisdiction(sample.recommendedJurisdictions[0] || 'India - National');
      setDocumentText(sample.sampleText);
      setAuditResult(null);
    }
  };

  const handleRunAudit = async () => {
    if (!documentText.trim()) return;

    setIsAuditing(true);
    setAuditResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          policyTitle: documentTitle,
          jurisdiction
        })
      });

      if (!response.ok) {
        throw new Error('Audit request failed');
      }

      const data: AuditResult = await response.json();
      setAuditResult(data);
    } catch (err) {
      console.error('Audit execution error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyRewrite = () => {
    if (auditResult?.compliantRewrite) {
      navigator.clipboard.writeText(auditResult.compliantRewrite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Autonomous Gemini AI Policy Auditor
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            AI Policy & Contract Audit Studio
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Upload or paste any employment contract, offer letter, or internal policy. CmpliHR.ai scans for illegal clauses, missing statutory mandates, non-compete violations, and generates a compliant rewrite.
          </p>
        </div>

        {/* Input & Config Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Document Editor & Sample Selector */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Sample Selector Buttons */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
                Load Preset Test Document:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_POLICIES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    className={`p-2.5 rounded-xl text-left border transition text-xs cursor-pointer ${
                      selectedSampleId === sample.id
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
                    }`}
                  >
                    <span className="line-clamp-1 font-bold">{sample.title}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{sample.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Details Input */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Document Title</label>
                  <input
                    type="text"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Jurisdiction</label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 shadow-xs"
                  >
                    <option value="US - California">US - California (AB5 & FLSA)</option>
                    <option value="US - New York">US - New York (Pay Transparency)</option>
                    <option value="India - Maharashtra">India - Maharashtra (Shops & Est Act)</option>
                    <option value="India - National">India - National (POSH & PF/ESI)</option>
                    <option value="UK / EU">UK & European Union Employment Law</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Contract / Policy Text
                </label>
                <textarea
                  rows={10}
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste HR policy or employment contract text here..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 shadow-xs"
                />
              </div>

              <button
                onClick={handleRunAudit}
                disabled={isAuditing || !documentText.trim()}
                className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI Analyzing Document Gaps...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Autonomous AI Audit</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right: Audit Results Panel */}
          <div className="lg:col-span-5 space-y-5">
            
            {isAuditing && (
              <div className="bg-slate-50 rounded-2xl border border-indigo-200 p-8 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Gemini AI Audit in Progress</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Cross-referencing document against statutory codes for {jurisdiction}...
                </p>
              </div>
            )}

            {!isAuditing && !auditResult && (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">Ready for Audit</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click "Run Autonomous AI Audit" to get instant legal risk scoring, clause citations, and compliant rewrites.
                </p>
              </div>
            )}

            {!isAuditing && auditResult && (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
                
                {/* Score Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Compliance Score</span>
                    <span className={`text-3xl font-extrabold font-mono ${
                      auditResult.complianceScore >= 80 ? 'text-emerald-700' :
                      auditResult.complianceScore >= 60 ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      {auditResult.complianceScore} / 100
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block font-medium">Overall Risk Tier</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider font-mono ${
                      auditResult.overallRiskTier === 'High-Risk' || auditResult.overallRiskTier === 'Prohibited'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {auditResult.overallRiskTier}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  {auditResult.summary}
                </p>

                {/* Issues Breakdown Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
                  <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-800">
                    <span className="block text-sm font-bold font-mono">{auditResult.totalIssuesCount.critical}</span> Critical
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                    <span className="block text-sm font-bold font-mono">{auditResult.totalIssuesCount.high}</span> High Risk
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <span className="block text-sm font-bold font-mono">{auditResult.totalIssuesCount.compliant}</span> Compliant
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex rounded-xl bg-white p-1 border border-slate-200 shadow-xs">
                  <button
                    onClick={() => setActiveTab('clauses')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activeTab === 'clauses' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Flagged Clauses ({auditResult.clauses.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('rewrite')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activeTab === 'rewrite' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    AI Compliant Rewrite
                  </button>
                </div>

                {/* Tab Content 1: Clauses List */}
                {activeTab === 'clauses' && (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {auditResult.clauses.map((clause) => (
                      <div
                        key={clause.id}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{clause.clauseTitle}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            clause.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                            clause.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}>
                            {clause.riskLevel}
                          </span>
                        </div>

                        <p className="text-slate-600 text-[11px]">
                          <strong className="text-slate-800">Citation:</strong> {clause.citation}
                        </p>

                        <p className="text-slate-700 leading-relaxed">{clause.issueDescription}</p>

                        <div className="p-2 rounded bg-indigo-50 border border-indigo-100 text-indigo-900 text-[11px]">
                          <strong>Suggested Fix:</strong> {clause.suggestedFix}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab Content 2: Compliant Rewrite */}
                {activeTab === 'rewrite' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
                        Statutorily Corrected Version
                      </span>
                      <button
                        onClick={handleCopyRewrite}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer border border-slate-200"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Text'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto shadow-xs">
                      {auditResult.compliantRewrite}
                    </pre>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
