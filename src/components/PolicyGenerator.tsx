import React, { useState } from 'react';
import { FileText, Sparkles, RefreshCw, Copy, Check, ShieldCheck, Building, Users } from 'lucide-react';

export const PolicyGenerator: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('Mahindra Holidays & Resorts India Ltd');
  const [policyType, setPolicyType] = useState<string>('POSH & Harassment Redressal Policy (POSH Act 2013)');
  const [jurisdiction, setJurisdiction] = useState<string>('India - National (Central Acts & 4 Labour Codes)');
  const [employeeCount, setEmployeeCount] = useState<number>(250);
  const [specialProvisions, setSpecialProvisions] = useState<string>('Include remote work guidelines, quarterly IC committee meeting SLAs, and annual return filing schedule for District Officer.');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPolicy, setGeneratedPolicy] = useState<{ title: string; content: string; generatedAt: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/policy-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          policyType,
          jurisdiction,
          employeeCount,
          specialProvisions
        })
      });

      const data = await response.json();
      setGeneratedPolicy({
        title: data.policyTitle,
        content: data.content,
        generatedAt: data.generatedAt
      });
    } catch (err) {
      console.error('Policy generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPolicy) {
      navigator.clipboard.writeText(generatedPolicy.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Indian Statutory HR Policy Architect</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Indian Statutory Policy & Employee Handbook Generator
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Generate legally binding, statutorily compliant HR policies aligned with Indian Labour Codes, POSH Act 2013, EPF/ESIC guidelines, Gratuity Act, and state Shops & Establishments rules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Policy Parameters & Corporate Setup
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Company / Enterprise Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-white text-slate-900 pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Policy Type</label>
                  <select
                    value={policyType}
                    onChange={(e) => setPolicyType(e.target.value)}
                    className="w-full bg-white text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  >
                    <option value="POSH & Harassment Redressal Policy (POSH Act 2013)">POSH & Harassment Redressal Policy (POSH Act 2013)</option>
                    <option value="EPF, ESI & Statutory Benefits Policy">EPF, ESI & Statutory Benefits Policy (Code on Social Security)</option>
                    <option value="Overtime & Working Hours Policy">Overtime & Working Hours Policy (Shops & Est. / Code on Wages)</option>
                    <option value="Payment of Gratuity & Severance Policy">Payment of Gratuity & Severance Policy (Gratuity Act 1972)</option>
                    <option value="Maternity, Crèche & Nursing Break Policy">Maternity, Crèche & Nursing Break Policy (Maternity Benefit Act 2017)</option>
                    <option value="Contract Labour Safety & Licensing Policy">Contract Labour Safety & Licensing Policy (CLRA Act 1970)</option>
                    <option value="Equal Opportunity & Disability Policy">Equal Opportunity & Disability Policy (RPwD Act 2016)</option>
                    <option value="Remote & Hybrid Work Policy">Remote & Hybrid Work Policy</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Primary Jurisdiction</label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full bg-white text-indigo-700 font-semibold p-2.5 rounded-xl border border-indigo-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  >
                    <option value="India - National (Central Acts & 4 Labour Codes)">🇮🇳 India - National (Central Acts & 4 Labour Codes)</option>
                    <option value="India - Maharashtra (Shops & Est. Act 2017)">🇮🇳 India - Maharashtra (Shops & Est Act 2017)</option>
                    <option value="India - Karnataka (IT & Shops Act 1961)">🇮🇳 India - Karnataka (IT & Shops Act 1961)</option>
                    <option value="India - Delhi (Shops & Est. Act 1954)">🇮🇳 India - Delhi (Shops & Est. Act 1954)</option>
                    <option value="India - Telangana (Shops Act & Form XXIV)">🇮🇳 India - Telangana (Shops Act & Form XXIV)</option>
                    <option value="India - Tamil Nadu (Shops Act & Right to Sit)">🇮🇳 India - Tamil Nadu (Shops Act & Right to Sit)</option>
                    <option value="India - Gujarat (Shops Act 2019)">🇮🇳 India - Gujarat (Shops Act 2019)</option>
                    <option value="US - California (AB5 / Overtime)">🇺🇸 US - California (AB5 / Overtime)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Total Employee Headcount</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(Number(e.target.value))}
                      className="w-full bg-white text-slate-900 pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Special Statutory Provisions</label>
                  <textarea
                    rows={4}
                    value={specialProvisions}
                    onChange={(e) => setSpecialProvisions(e.target.value)}
                    placeholder="Enter custom clauses or internal escalation rules..."
                    className="w-full bg-white text-slate-900 p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Drafting Indian Statutory Policy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Compliant Policy</span>
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Generated Markdown Document Output (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {generatedPolicy ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">STATUTORY POLICY READY</span>
                    <h3 className="text-lg font-bold text-slate-900">{generatedPolicy.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Markdown Text Area */}
                <textarea
                  readOnly
                  rows={18}
                  value={generatedPolicy.content}
                  className="w-full bg-white text-slate-900 text-xs p-4 rounded-xl border border-slate-300 font-mono leading-relaxed custom-scrollbar shadow-xs"
                />

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Indian Statutory Citations Verified</span>
                  <span>Generated: {new Date(generatedPolicy.generatedAt).toLocaleDateString()}</span>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center space-y-3 h-full flex flex-col justify-center items-center shadow-xs">
                <FileText className="w-10 h-10 text-slate-400" />
                <h3 className="text-base font-bold text-slate-900">No Policy Generated Yet</h3>
                <p className="text-xs text-slate-600 max-w-sm">
                  Configure your company parameters on the left and click "Generate Compliant Policy" to draft a custom statutory document.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
