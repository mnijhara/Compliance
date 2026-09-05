import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, Download, RefreshCw, Scale, Building2, Users } from 'lucide-react';

export const PolicyGeneratorView: React.FC = () => {
  const [policyType, setPolicyType] = useState<string>('POSH Policy');
  const [jurisdiction, setJurisdiction] = useState<string>('India - National');
  const [companyName, setCompanyName] = useState<string>('Mahindra Holidays & Resorts');
  const [employeeCount, setEmployeeCount] = useState<number>(250);
  const [specialProvisions, setSpecialProvisions] = useState<string>('Include mandatory external NGO member in IC committee and 90-day inquiry completion SLA.');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPolicy, setGeneratedPolicy] = useState<{ title: string; content: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGeneratePolicy = async () => {
    if (!companyName.trim()) return;

    setIsGenerating(true);
    setGeneratedPolicy(null);

    try {
      const response = await fetch('/api/policy-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyType,
          jurisdiction,
          companyName,
          employeeCount,
          specialProvisions
        })
      });

      if (!response.ok) {
        throw new Error('Policy generation failed');
      }

      const data = await response.json();
      setGeneratedPolicy({
        title: data.policyTitle,
        content: data.content
      });
    } catch (err) {
      console.error('Policy generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedPolicy) {
      navigator.clipboard.writeText(generatedPolicy.content);
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
            <FileText className="w-3.5 h-3.5 text-indigo-600" /> AI Statutory Policy Architect
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            AI Policy & Employee Handbook Generator
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Craft customized, statutorily sound enterprise policies tailored specifically to your company, employee headcount, and state labor codes.
          </p>
        </div>

        {/* Form & Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                Policy Parameters:
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Policy Category</label>
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 shadow-xs"
                >
                  <option value="POSH Policy">Prevention of Sexual Harassment (POSH) Policy</option>
                  <option value="Employee Handbook">Comprehensive Employee Handbook</option>
                  <option value="Remote & Hybrid Work Policy">Remote & Hybrid Work Policy</option>
                  <option value="Overtime & Statutory Leave Policy">Overtime & Statutory Leave Policy</option>
                  <option value="Data Privacy & Employee Monitoring Policy">Data Privacy & Employee Monitoring Policy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Jurisdiction</label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 shadow-xs"
                >
                  <option value="India - National">India - National (POSH 2013 / PF / ESI)</option>
                  <option value="India - Maharashtra">India - Maharashtra (Shops & Est. Act)</option>
                  <option value="India - Karnataka">India - Karnataka (IT Standing Orders)</option>
                  <option value="US - California">US - California (AB5 & FLSA)</option>
                  <option value="US - New York">US - New York (Pay Transparency)</option>
                  <option value="UK / EU">UK & EU Labor Regulations</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Total Employee Headcount</label>
                <input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Custom Provisions / Clauses</label>
                <textarea
                  rows={4}
                  value={specialProvisions}
                  onChange={(e) => setSpecialProvisions(e.target.value)}
                  placeholder="Add specific provisions or internal guidelines..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 shadow-xs"
                />
              </div>

              <button
                onClick={handleGeneratePolicy}
                disabled={isGenerating || !companyName.trim()}
                className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI Drafting Policy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-100" />
                    <span>Generate Statutorily Compliant Policy</span>
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Right Preview Output */}
          <div className="lg:col-span-7 space-y-5">
            
            {isGenerating && (
              <div className="bg-slate-50 rounded-2xl border border-indigo-200 p-12 text-center space-y-4 shadow-xs">
                <Sparkles className="w-10 h-10 text-indigo-600 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-slate-900">Drafting Legally Defensible Policy</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Engaging Gemini AI with statutory citations for {jurisdiction}...
                </p>
              </div>
            )}

            {!isGenerating && !generatedPolicy && (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">Policy Generator Ready</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Configure company details and click generate to create a complete, ready-to-adopt corporate policy.
                </p>
              </div>
            )}

            {!isGenerating && generatedPolicy && (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {generatedPolicy.title}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
                    <span>{copied ? 'Copied' : 'Copy Policy'}</span>
                  </button>
                </div>

                <pre className="p-5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto shadow-xs">
                  {generatedPolicy.content}
                </pre>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
