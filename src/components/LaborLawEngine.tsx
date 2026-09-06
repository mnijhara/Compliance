import React, { useState } from 'react';
import { LABOR_LAWS_DATA } from '../data/laborLaws';
import { LaborLawItem } from '../types';
import { Scale, Search, Filter, ShieldCheck, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';
import { COMPLIANCE_SOURCES } from '../data/complianceSources';

export const LaborLawEngine: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLaw, setSelectedLaw] = useState<LaborLawItem | null>(LABOR_LAWS_DATA[0]);

  const filteredLaws = LABOR_LAWS_DATA.filter(law => {
    const haystack = [law.title, law.jurisdiction, law.shortSummary, ...law.keyMandates].join(' ').toLowerCase();
    return haystack.includes(searchTerm.toLowerCase()) && (selectedCategory === 'All' || law.category === selectedCategory);
  });

  const sourceForLaw = (law: LaborLawItem) => {
    const ids = law.id === 'posh-act-2013' ? ['wcd-legislation'] : law.id === 'epfo-current-reference' ? ['mole-social-security-rules-2026'] : law.id === 'esic-current-reference' ? ['mole-social-security-rules-2026'] : law.id === 'code-on-wages-2019' ? ['mole-code-wages-rules-2026'] : law.id === 'code-social-security-2020' ? ['mole-social-security-rules-2026'] : law.id === 'industrial-relations-code-2020' ? ['mole-ir-rules-2026'] : ['mole-osh-rules-2026'];
    return ids.map(id => COMPLIANCE_SOURCES.find(source => source.id === id)).filter(Boolean);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"><Scale className="w-3.5 h-3.5" /> Source-first labour intelligence</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Indian Labour Law Reference Engine</h1>
          <p className="text-slate-600 text-sm max-w-4xl leading-relaxed">A high-confidence reference layer for current central labour frameworks. It deliberately avoids presenting unverified state thresholds, penalties or legacy forms as universal law. Use the Control Center for establishment-specific applicability and evidence.</p>
        </header>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" /><span><strong>Important:</strong> “Reference” is not “compliance”. Current primary legislation, Gazette notifications and applicable state rules must be verified before a material HR decision.</span></div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search code, framework or topic…" className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs" /></div>
          <div className="flex items-center gap-2 text-xs"><Filter className="w-4 h-4 text-indigo-600" /><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-white px-3 py-2.5 rounded-xl border border-slate-300"><option>All</option><option>Wages & Hours</option><option>Social Security & PF</option><option>Workplace Safety & POSH</option><option>Contract Labor</option></select></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto pr-1">
            <div className="text-xs text-slate-500 font-semibold">Current reference entries: {filteredLaws.length}</div>
            {filteredLaws.map(law => <button key={law.id} type="button" onClick={() => setSelectedLaw(law)} className={`w-full p-4 rounded-xl border text-left transition ${selectedLaw?.id === law.id ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}><div className="flex items-center justify-between gap-2"><span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-semibold">{law.jurisdiction}</span><span className="text-[10px] text-slate-500">{law.lastUpdated}</span></div><h3 className="mt-2 text-sm font-bold">{law.title}</h3><p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-3">{law.shortSummary}</p></button>)}
          </div>

          <div className="lg:col-span-7">
            {selectedLaw && <article className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 sticky top-24">
              <div className="border-b border-slate-200 pb-5"><div className="flex items-center justify-between gap-3"><span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold">{selectedLaw.jurisdiction}</span><span className="text-[10px] text-slate-500">{selectedLaw.lastUpdated}</span></div><h2 className="mt-3 text-xl sm:text-2xl font-bold">{selectedLaw.title}</h2><p className="mt-2 text-xs text-slate-600 leading-relaxed">{selectedLaw.shortSummary}</p></div>
              <section className="space-y-3"><h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Reference points</h3>{selectedLaw.keyMandates.map((item, index) => <div key={index} className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">{item}</div>)}</section>
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="bg-white p-4 rounded-xl border border-slate-200"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Applicability</div><p className="mt-2 text-xs text-slate-700 leading-relaxed">{selectedLaw.applicability}</p></div><div className="bg-amber-50 p-4 rounded-xl border border-amber-200"><div className="text-[10px] font-bold uppercase tracking-wide text-amber-800">Penalty handling</div><p className="mt-2 text-xs text-amber-900 leading-relaxed">{selectedLaw.penaltyDetails}</p></div></section>
              <section className="bg-white p-4 rounded-xl border border-slate-200"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Forms / operational reference</div><p className="mt-2 text-xs text-slate-700 leading-relaxed">{selectedLaw.statutoryForm}</p></section>
              <section className="border-t border-slate-200 pt-4"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Primary source</div><div className="flex flex-wrap gap-2">{sourceForLaw(selectedLaw).map(source => source && <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-indigo-700"><ExternalLink className="w-3 h-3" />{source.authority}</a>)}</div></section>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-950 flex gap-2"><BookOpen className="w-4 h-4 shrink-0 text-blue-700" /><span>Use the Control Center to convert this reference into an establishment-specific evidence request. A reference entry alone never creates a PASS.</span></div>
            </article>}
          </div>
        </div>
      </div>
    </div>
  );
};
