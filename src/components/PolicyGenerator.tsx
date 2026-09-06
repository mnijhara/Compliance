import React, { useState } from 'react';
import { FileText, Sparkles, RefreshCw, Copy, Check, Building, Users, AlertTriangle } from 'lucide-react';

export const PolicyGenerator: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [policyType, setPolicyType] = useState('POSH & Workplace Conduct Policy');
  const [jurisdiction, setJurisdiction] = useState('India - National');
  const [employeeCount, setEmployeeCount] = useState('');
  const [specialProvisions, setSpecialProvisions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState<{ title: string; content: string; generatedAt: string; verificationRequired?: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!companyName.trim()) return setError('Enter the actual company / legal-entity name.');
    if (!employeeCount || !Number.isFinite(Number(employeeCount)) || Number(employeeCount) < 0) return setError('Enter the actual current headcount.');
    if (!specialProvisions.trim()) return setError('Describe the actual business/process requirements the draft must address.');

    setIsGenerating(true);
    setError(null);
    setGeneratedPolicy(null);
    try {
      const response = await fetch('/api/policy-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: companyName.trim(), policyType, jurisdiction, employeeCount: Number(employeeCount), specialProvisions: specialProvisions.trim() })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || `Policy service returned ${response.status}.`);
      if (!data?.content) throw new Error('The policy service returned no draft.');
      setGeneratedPolicy({ title: data.policyTitle, content: data.content, generatedAt: data.generatedAt, verificationRequired: data.verificationRequired });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Policy generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedPolicy) return;
    navigator.clipboard.writeText(generatedPolicy.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"><FileText className="w-3.5 h-3.5" /> AI policy drafting workspace</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">HR Policy Drafting Studio</h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">Generate a working draft from your actual company inputs. ComplyOS does not call an AI draft legally binding or certified compliant; every material proposition must be checked against current primary sources before approval.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider">Draft parameters</h2>
              <label className="block text-xs"><span className="font-semibold text-slate-600">Company / legal entity</span><div className="relative mt-1"><Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Actual legal-entity name" className="w-full bg-white pl-10 pr-3 py-2.5 rounded-xl border border-slate-300" /></div></label>
              <label className="block text-xs"><span className="font-semibold text-slate-600">Policy type</span><select value={policyType} onChange={e => setPolicyType(e.target.value)} className="w-full mt-1 bg-white p-2.5 rounded-xl border border-slate-300"><option>POSH & Workplace Conduct Policy</option><option>Working Hours, Rostering & Overtime Policy</option><option>Maternity, Nursing & Crèche Policy</option><option>Contract Worker Governance Policy</option><option>Employee Benefits & Social Security Policy</option><option>Equal Opportunity & Accessibility Policy</option><option>Grievance & Employee Relations Policy</option><option>Remote / Hybrid Work Policy</option></select></label>
              <label className="block text-xs"><span className="font-semibold text-slate-600">Primary jurisdiction</span><select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="w-full mt-1 bg-white p-2.5 rounded-xl border border-slate-300"><option>India - National</option><option>India - Maharashtra</option><option>India - Karnataka</option><option>India - Delhi</option></select></label>
              <label className="block text-xs"><span className="font-semibold text-slate-600">Current headcount</span><div className="relative mt-1"><Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input type="number" min={0} value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} placeholder="Actual current headcount" className="w-full bg-white pl-10 pr-3 py-2.5 rounded-xl border border-slate-300" /></div></label>
              <label className="block text-xs"><span className="font-semibold text-slate-600">Business-specific requirements</span><textarea rows={5} value={specialProvisions} onChange={e => setSpecialProvisions(e.target.value)} placeholder="Describe the actual process, roles, locations, shifts, approvals or exceptions the policy must cover." className="w-full mt-1 bg-white p-3 rounded-xl border border-slate-300 font-mono" /></label>
              <button type="button" onClick={handleGenerate} disabled={isGenerating} className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-60">{isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Drafting…</> : <><Sparkles className="w-4 h-4" /> Generate working draft</>}</button>
              {error && <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}
            </div>
          </div>

          <div className="lg:col-span-7">
            {!generatedPolicy && <div className="h-full min-h-[420px] bg-slate-50 p-10 rounded-2xl border border-slate-200 flex flex-col justify-center items-center text-center"><FileText className="w-10 h-10 text-slate-400" /><h2 className="mt-3 text-base font-bold">No policy draft yet</h2><p className="mt-2 max-w-md text-xs text-slate-600">Use actual company information. No sample employer, headcount or “compliant” policy is preloaded.</p></div>}
            {generatedPolicy && <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4"><div><span className="text-[10px] font-mono font-bold text-indigo-700 uppercase">WORKING DRAFT — REVIEW REQUIRED</span><h3 className="text-lg font-bold">{generatedPolicy.title}</h3></div><button type="button" onClick={copyToClipboard} className="px-3 py-1.5 text-xs font-semibold bg-white rounded-lg border border-slate-300 flex items-center gap-1.5">{copied ? <><Check className="w-3.5 h-3.5 text-emerald-600" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy draft</>}</button></div>
              <textarea readOnly rows={22} value={generatedPolicy.content} className="w-full bg-white text-slate-900 text-xs p-4 rounded-xl border border-slate-300 font-mono leading-relaxed" />
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /><span><strong>Human verification required.</strong> {generatedPolicy.verificationRequired === false ? 'Review the source basis before use.' : 'Verify every legal proposition, local applicability, approval owner and effective date against current primary sources before issuing this policy.'}</span></div>
              <div className="text-[11px] text-slate-500">Generated: {new Date(generatedPolicy.generatedAt).toLocaleString()}</div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};
