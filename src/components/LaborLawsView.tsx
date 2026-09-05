import React, { useState } from 'react';
import { LABOR_LAWS_DATA } from '../data/laborLaws';
import { LaborLawItem } from '../types';
import { Scale, Search, CheckCircle2, AlertOctagon, Calculator, ArrowRight, X, Building2, ShieldCheck, Landmark } from 'lucide-react';

interface LaborLawsViewProps {
  setActiveTab: (tab: string) => void;
}

export const LaborLawsView: React.FC<LaborLawsViewProps> = ({ setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('India');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalLaw, setActiveModalLaw] = useState<LaborLawItem | null>(null);

  // Calculator State
  const [calcEmployees, setCalcEmployees] = useState<number>(120);
  const [calcMissedBreaks, setCalcMissedBreaks] = useState<number>(10);
  const [calcHourlyRate, setCalcHourlyRate] = useState<number>(250); // In Indian Rupees ₹

  const filteredLaws = LABOR_LAWS_DATA.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.shortSummary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === 'All' || law.country === selectedCountry;
    const matchesState = selectedState === 'All' || law.jurisdiction === selectedState;
    const matchesCategory = selectedCategory === 'All' || law.category === selectedCategory;

    return matchesSearch && matchesCountry && matchesState && matchesCategory;
  });

  // Calculate potential fine risk based on inputs in Indian Rupees ₹
  const estimatedFineRiskInInr = Math.round(calcEmployees * calcMissedBreaks * calcHourlyRate * 2.0 * 12);

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pan-India Statutory Labor Law Intelligence Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Indian Statutory Labor Law Repository
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Full compliance coverage across Central Indian Labour Codes (Wages, Social Security, IR, OSH), legacy statutes (POSH, EPF, ESIC, Gratuity, Bonus), and State Shops & Establishments Acts across Maharashtra, Karnataka, Delhi, Telangana, Tamil Nadu, Gujarat, and West Bengal.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by act name, state, or statutory form (e.g. POSH, ECR, Maharashtra)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            {/* Country Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  if (e.target.value !== 'India') setSelectedState('All');
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="All">All Regions</option>
                <option value="India">🇮🇳 India</option>
                <option value="US">🇺🇸 United States</option>
                <option value="UK">🇬🇧 United Kingdom</option>
              </select>
            </div>

            {/* Indian State Filter */}
            {selectedCountry === 'India' && (
              <div className="md:col-span-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-white border border-indigo-300 text-indigo-700 font-semibold rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 shadow-xs"
                >
                  <option value="All">All Indian States</option>
                  <option value="India - National">Central Acts & 4 Codes</option>
                  <option value="India - Maharashtra">Maharashtra</option>
                  <option value="India - Karnataka">Karnataka</option>
                  <option value="India - Delhi">Delhi NCT</option>
                  <option value="India - Telangana">Telangana & AP</option>
                  <option value="India - Tamil Nadu">Tamil Nadu</option>
                  <option value="India - Gujarat">Gujarat</option>
                  <option value="India - West Bengal">West Bengal</option>
                </select>
              </div>
            )}

            {/* Category Filter */}
            <div className={selectedCountry === 'India' ? "md:col-span-3" : "md:col-span-5"}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="All">All Categories</option>
                <option value="Wages & Hours">Wages & Overtime Hours</option>
                <option value="Social Security & PF">Social Security & PF / ESI / Gratuity</option>
                <option value="Workplace Safety & POSH">Workplace Safety & POSH</option>
                <option value="Contract Labor">Contract Labor & Licensing</option>
                <option value="Leave & Holidays">Leave & Statutory Holidays</option>
              </select>
            </div>

          </div>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono flex items-center gap-1.5 font-semibold">
            <Landmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>4 New Labour Codes Covered</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>POSH / EPF / ESIC / Gratuity / Bonus Mandates Verified</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono flex items-center gap-1.5 font-semibold">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>7 Key Indian Industrial States Mapped</span>
          </span>
        </div>

        {/* Laws Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLaws.map((law) => (
            <div
              key={law.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 hover:border-indigo-300 transition flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono">
                    {law.jurisdiction}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {law.lastUpdated}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {law.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {law.shortSummary}
                </p>

                {/* Key Mandates snippet */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block font-mono">Key Statutory Mandates:</span>
                  {law.keyMandates.slice(0, 2).map((mandate, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{mandate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-amber-800 font-medium flex items-center gap-1 max-w-[220px] truncate">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span className="truncate">{law.penaltyDetails}</span>
                </div>
                <button
                  onClick={() => setActiveModalLaw(law)}
                  className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
                >
                  Full Mandate Details
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* STATUTORY PENALTY RISK CALCULATOR FOR INDIA */}
        <div className="bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 rounded-2xl border border-indigo-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Indian Statutory Non-Compliance Risk Estimator</h2>
              <p className="text-xs text-slate-600">Estimate potential penalty exposure from unmonitored overtime or missing statutory registers across your Indian offices.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Covered Employees in India</label>
              <input
                type="number"
                value={calcEmployees}
                onChange={(e) => setCalcEmployees(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 shadow-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Unrecorded OT Hours / Month</label>
              <input
                type="number"
                value={calcMissedBreaks}
                onChange={(e) => setCalcMissedBreaks(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 shadow-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Average Hourly Wage Rate (₹ INR)</label>
              <input
                type="number"
                value={calcHourlyRate}
                onChange={(e) => setCalcHourlyRate(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 font-mono shadow-xs"
              />
            </div>

          </div>

          <div className="p-4 rounded-xl bg-white border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Estimated Annualized Statutory Overtime Fine Risk</span>
              <span className="text-2xl font-extrabold text-amber-700 font-mono">
                ₹{estimatedFineRiskInInr.toLocaleString()} INR
              </span>
            </div>
            <button
              onClick={() => setActiveTab('ai-audit')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Audit Employment Contracts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Modal for Law Details */}
        {activeModalLaw && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl w-full space-y-5 relative max-h-[90vh] overflow-y-auto shadow-xl">
              <button
                onClick={() => setActiveModalLaw(null)}
                className="absolute top-4 right-4 p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono">
                  {activeModalLaw.jurisdiction}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{activeModalLaw.title}</h3>
                <p className="text-xs text-slate-600">{activeModalLaw.shortSummary}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono">Statutory Key Mandates</h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {activeModalLaw.keyMandates.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block uppercase tracking-wider font-mono text-amber-800">Statutory Non-Compliance Penalty Details:</span>
                <p>{activeModalLaw.penaltyDetails}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block font-medium">Establishment Applicability:</span>
                  <span className="text-slate-800 font-semibold">{activeModalLaw.applicability}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Statutory Return / Register:</span>
                  <span className="text-indigo-700 font-mono font-semibold">{activeModalLaw.statutoryForm}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveModalLaw(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Close Specification
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
