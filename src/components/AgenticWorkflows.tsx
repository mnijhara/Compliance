import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Cpu, Play, RefreshCw, ShieldCheck } from 'lucide-react';

const AGENTS = [
  { id: 'regulatory-watchdog', name: 'Regulatory Change Watchdog', description: 'Tracks source freshness and prepares changes for review. It does not declare legal impact without verification.' },
  { id: 'compliance-assessment-agent', name: 'Compliance Assessment Agent', description: 'Runs deterministic applicability controls and identifies evidence gaps.' },
  { id: 'document-audit-agent', name: 'Document Audit Agent', description: 'Uses AI to identify clauses for review; citations must be source-verified before being treated as findings.' },
  { id: 'evidence-agent', name: 'Evidence Readiness Agent', description: 'Builds evidence requests and flags controls where documentation is missing or stale.' },
  { id: 'policy-impact-agent', name: 'Policy Impact Agent', description: 'Maps verified regulatory changes to policies requiring human/legal review.' }
];

export const AgenticWorkflows: React.FC = () => {
  const [selected, setSelected] = useState(AGENTS[0]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runAgent = async () => {
    setRunning(true);
    try {
      const response = await fetch('/api/agent-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selected.id,
          profile: {
            jurisdiction: 'India - National',
            employeeCount: 250,
            establishmentType: 'office',
            hasContractWorkers: true,
            hasNightShift: false,
            industry: 'Services'
          }
        })
      });
      setResult(await response.json());
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"><Cpu className="h-3.5 w-3.5" /> Evidence-first Agentic Workflows</div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Autonomous Compliance Agents</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">Agents can collect, classify and assess compliance work. They cannot manufacture evidence or silently turn an uncertain legal proposition into a compliance certification.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            {AGENTS.map(agent => (
              <button key={agent.id} onClick={() => setSelected(agent)} className={`w-full rounded-2xl border p-5 text-left transition ${selected.id === agent.id ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-200' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-indigo-600" /><span className="text-sm font-bold">{agent.name}</span></div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{agent.description}</p>
              </button>
            ))}
          </div>

          <div className="space-y-5 lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div><div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Selected agent</div><h2 className="mt-1 text-xl font-bold">{selected.name}</h2></div>
                <button onClick={runAgent} disabled={running} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{running ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run now</button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4"><Activity className="h-4 w-4 text-indigo-600" /><div className="mt-2 text-xs text-slate-500">Engine</div><div className="text-sm font-bold">Deterministic</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><div className="mt-2 text-xs text-slate-500">Pass</div><div className="text-sm font-bold">Evidence-backed</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><AlertTriangle className="h-4 w-4 text-amber-600" /><div className="mt-2 text-xs text-slate-500">Review</div><div className="text-sm font-bold">Evidence required</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><Cpu className="h-4 w-4 text-slate-600" /><div className="mt-2 text-xs text-slate-500">AI</div><div className="text-sm font-bold">Assistive</div></div>
              </div>
            </div>

            {result && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold uppercase tracking-wide">Latest execution</h3><span className="text-[10px] font-mono text-slate-500">{result.timestamp}</span></div>
              <div className="space-y-2 font-mono text-xs">
                {(result.logs || []).map((log: any, index: number) => <div key={index} className="rounded-lg bg-slate-50 p-3"><span className="mr-2 text-slate-400">{log.level}</span>{log.message}</div>)}
              </div>
              {result.assessment && <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-xs"><strong>Assessment score:</strong> {result.assessment.score ?? 'Not assessed'} · <strong>Controls:</strong> {result.assessment.controls.length} · <strong>Review:</strong> {result.assessment.controls.filter((c: any) => c.status === 'REVIEW').length}</div>}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};
