import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, FileCheck2, Info, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { assessCompliance, ComplianceAssessment, ComplianceProfile } from '../complianceEngine';
import { COMPLIANCE_SOURCES } from '../data/complianceSources';

type ProfileForm = {
  jurisdiction: string;
  employeeCount: string;
  establishmentType: ComplianceProfile['establishmentType'] | '';
  industry: string;
  hasContractWorkers: boolean | null;
  hasNightShift: boolean | null;
};

const EMPTY_PROFILE: ProfileForm = {
  jurisdiction: 'India - National',
  employeeCount: '',
  establishmentType: '',
  industry: '',
  hasContractWorkers: null,
  hasNightShift: null
};

export const ComplianceControlCenter: React.FC = () => {
  const [form, setForm] = useState<ProfileForm>(EMPTY_PROFILE);
  const [assessment, setAssessment] = useState<ComplianceAssessment | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setAssessment(null);
    setError(null);
  };

  const runAssessment = () => {
    const employeeCount = Number(form.employeeCount);
    if (!form.employeeCount || !Number.isFinite(employeeCount) || employeeCount < 0) {
      setError('Enter the actual current employee count before assessing.');
      return;
    }
    if (!form.establishmentType) {
      setError('Select the actual establishment type before assessing.');
      return;
    }
    if (form.hasContractWorkers === null || form.hasNightShift === null) {
      setError('Answer both workforce questions before assessing.');
      return;
    }

    setRunning(true);
    setError(null);
    window.setTimeout(() => {
      const profile: ComplianceProfile = {
        jurisdiction: form.jurisdiction,
        employeeCount,
        establishmentType: form.establishmentType as ComplianceProfile['establishmentType'],
        industry: form.industry.trim() || undefined,
        hasContractWorkers: form.hasContractWorkers as boolean,
        hasNightShift: form.hasNightShift as boolean
      };
      setAssessment(assessCompliance(profile));
      setRunning(false);
    }, 250);
  };

  const counts = assessment?.controls.reduce((acc, control) => {
    acc[control.status] += 1;
    return acc;
  }, { PASS: 0, REVIEW: 0, FAIL: 0, NOT_ASSESSED: 0 } as Record<string, number>) ?? { PASS: 0, REVIEW: 0, FAIL: 0, NOT_ASSESSED: 0 };

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"><ShieldCheck className="h-3.5 w-3.5" /> Evidence-first Compliance Engine</div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Compliance Control Center</h1>
          <p className="max-w-4xl text-sm leading-relaxed text-slate-600">Enter your real company profile to generate an evidence-first assessment. ComplyOS does not pre-fill employee counts, workforce conditions or compliance scores.</p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Evidence coverage</div><div className="mt-2 text-4xl font-black text-slate-900">{assessment?.score == null ? '—' : `${assessment.score}%`}</div><div className="mt-1 text-xs text-slate-500">{assessment ? `Confidence: ${assessment.confidence}` : 'Not assessed'}</div></div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Pass</div><div className="mt-2 text-4xl font-black text-emerald-800">{counts.PASS}</div><div className="mt-1 text-xs text-emerald-700">Evidence-backed controls</div></div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="text-xs font-semibold uppercase tracking-wide text-amber-700">Needs review</div><div className="mt-2 text-4xl font-black text-amber-800">{counts.REVIEW}</div><div className="mt-1 text-xs text-amber-700">Evidence or local rules required</div></div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Not assessed</div><div className="mt-2 text-4xl font-black text-slate-700">{counts.NOT_ASSESSED}</div><div className="mt-1 text-xs text-slate-500">{assessment ? 'No defensible conclusion yet' : 'Complete the profile first'}</div></div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-bold uppercase tracking-wide">Company profile</h2><button onClick={runAssessment} disabled={running} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${running ? 'animate-spin' : ''}`} /> {running ? 'Assessing' : 'Assess'}</button></div>
              <div className="space-y-4 text-xs">
                <label className="block"><span className="mb-1 block font-semibold text-slate-600">Jurisdiction</span><select value={form.jurisdiction} onChange={e => update('jurisdiction', e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white p-2.5"><option>India - National</option><option>India - Maharashtra</option><option>India - Karnataka</option><option>India - Delhi</option></select></label>
                <label className="block"><span className="mb-1 block font-semibold text-slate-600">Employees</span><input type="number" min={0} value={form.employeeCount} onChange={e => update('employeeCount', e.target.value)} placeholder="Enter actual headcount" className="w-full rounded-xl border border-slate-300 bg-white p-2.5" /></label>
                <label className="block"><span className="mb-1 block font-semibold text-slate-600">Establishment type</span><select value={form.establishmentType} onChange={e => update('establishmentType', e.target.value as ProfileForm['establishmentType'])} className="w-full rounded-xl border border-slate-300 bg-white p-2.5"><option value="">Select actual type</option><option value="office">Office</option><option value="shop">Shop / establishment</option><option value="factory">Factory</option><option value="mixed">Mixed</option><option value="other">Other</option></select></label>
                <label className="block"><span className="mb-1 block font-semibold text-slate-600">Industry (optional)</span><input value={form.industry} onChange={e => update('industry', e.target.value)} placeholder="Enter actual industry" className="w-full rounded-xl border border-slate-300 bg-white p-2.5" /></label>
                <fieldset><legend className="mb-2 font-semibold text-slate-600">Contract workers engaged?</legend><div className="flex gap-2"><button onClick={() => update('hasContractWorkers', true)} className={`flex-1 rounded-lg border p-2 ${form.hasContractWorkers === true ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'bg-white'}`}>Yes</button><button onClick={() => update('hasContractWorkers', false)} className={`flex-1 rounded-lg border p-2 ${form.hasContractWorkers === false ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'bg-white'}`}>No</button></div></fieldset>
                <fieldset><legend className="mb-2 font-semibold text-slate-600">Night shifts / operations?</legend><div className="flex gap-2"><button onClick={() => update('hasNightShift', true)} className={`flex-1 rounded-lg border p-2 ${form.hasNightShift === true ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'bg-white'}`}>Yes</button><button onClick={() => update('hasNightShift', false)} className={`flex-1 rounded-lg border p-2 ${form.hasNightShift === false ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'bg-white'}`}>No</button></div></fieldset>
              </div>
              {error && <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-xs text-blue-950"><div className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /><div><strong>Evidence-first:</strong> a review is not a finding of non-compliance. Missing evidence or uncertain local applicability remains REVIEW until verified.</div></div></div>
          </div>

          <div className="space-y-4 lg:col-span-8">
            {!assessment && !running && !error && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center shadow-sm"><ShieldCheck className="mx-auto h-10 w-10 text-slate-400" /><h2 className="mt-3 text-sm font-bold">No assessment yet</h2><p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-600">Complete the company profile using your actual data, then select Assess. No dummy company profile or score is generated.</p></div>}
            {running && <div className="rounded-2xl border border-indigo-200 bg-slate-50 p-10 text-center shadow-sm"><RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-600" /><h2 className="mt-3 text-sm font-bold">Running evidence-first assessment</h2><p className="mt-2 text-xs text-slate-600">The assessment is based only on the company information you entered.</p></div>}
            {assessment && assessment.controls.map(control => <article key={control.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-slate-900">{control.name}</h3><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${control.status === 'PASS' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : control.status === 'FAIL' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>{control.status}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{control.risk}</span></div><div className="mt-1 text-[11px] font-medium text-indigo-700">{control.framework}</div></div>{control.status === 'PASS' ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />}</div><p className="mt-3 text-xs leading-relaxed text-slate-600">{control.rationale}</p><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3"><div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">Evidence required</div><ul className="space-y-1 text-xs text-slate-700">{control.evidence.map(item => <li key={item} className="flex gap-2"><FileCheck2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />{item}</li>)}</ul></div><div className="rounded-xl bg-indigo-50/60 p-3"><div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-indigo-700">Next action</div><p className="text-xs leading-relaxed text-indigo-950">{control.nextAction}</p></div></div>{control.sourceIds.length > 0 && <div className="mt-4 border-t border-slate-100 pt-3"><div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">Authoritative sources</div><div className="flex flex-wrap gap-2">{control.sourceIds.map(id => { const source = COMPLIANCE_SOURCES.find(s => s.id === id); return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-indigo-700"><ExternalLink className="h-3 w-3" />{source.authority}</a> : null; })}</div></div>}</article>)}
          </div>
        </section>

        {assessment && <footer className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs text-amber-950"><div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><div><strong>Important:</strong> {assessment.caveats.join(' ')}</div></div></footer>}
      </div>
    </div>
  );
};
