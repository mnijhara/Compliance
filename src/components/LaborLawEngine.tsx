import React, { useState } from 'react';
import { LABOR_LAWS_DATA } from '../data/laborLaws';
import { LaborLawItem } from '../types';
import { Scale, Search, Filter, ShieldCheck, FileCheck, AlertTriangle, BookOpen, ArrowRight, CheckCircle2, Download, Building2, Landmark } from 'lucide-react';

interface LaborLawEngineProps {
  onSelectLawForAudit?: (lawTitle: string) => void;
}

export const LaborLawEngine: React.FC<LaborLawEngineProps> = ({ onSelectLawForAudit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('India');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLaw, setSelectedLaw] = useState<LaborLawItem | null>(LABOR_LAWS_DATA[0]);

  // Filter logic
  const filteredLaws = LABOR_LAWS_DATA.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.shortSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.keyMandates.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCountry = selectedCountry === 'All' || law.country === selectedCountry;
    const matchesState = selectedState === 'All' || law.jurisdiction === selectedState;
    const matchesCategory = selectedCategory === 'All' || law.category === selectedCategory;

    return matchesSearch && matchesCountry && matchesState && matchesCategory;
  });

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Comprehensive Indian Statutory Labor Code Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Indian Labor Laws & Statutory Compliance Engine
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Complete statutory coverage across Central Indian Acts, the 4 New Labour Codes (Wages, Social Security, IR, OSH), and major State Shops & Establishments Acts (Maharashtra, Karnataka, Delhi, Telangana, Tamil Nadu, Gujarat, West Bengal).
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xs">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search labor act, state, or mandate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 transition shadow-xs"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Filter:</span>
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                if (e.target.value !== 'India') setSelectedState('All');
              }}
              className="bg-white text-slate-700 text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="All">All Regions</option>
              <option value="India">🇮🇳 India (Central & States)</option>
              <option value="US">🇺🇸 United States</option>
              <option value="UK">🇬🇧 United Kingdom</option>
            </select>

            {selectedCountry === 'India' && (
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-white text-indigo-700 text-xs px-3 py-2.5 rounded-xl border border-indigo-300 focus:outline-none focus:border-indigo-500 font-semibold shadow-xs"
              >
                <option value="All">All Indian Jurisdictions</option>
                <option value="India - National">India - National (Central Acts & 4 Codes)</option>
                <option value="India - Maharashtra">Maharashtra (Shops Act & PT)</option>
                <option value="India - Karnataka">Karnataka (Shops Act & Holiday Rules)</option>
                <option value="India - Delhi">Delhi NCT (Shops & Est. Act)</option>
                <option value="India - Telangana">Telangana & AP (Form XXIV)</option>
                <option value="India - Tamil Nadu">Tamil Nadu (Shops & Right to Sit)</option>
                <option value="India - Gujarat">Gujarat (Shops Act 2019)</option>
                <option value="India - West Bengal">West Bengal (Shops Act)</option>
                <option value="India - Multi-State">Multi-State (LWF Welfare Funds)</option>
              </select>
            )}

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white text-slate-700 text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="All">All Categories</option>
              <option value="Wages & Hours">Wages & Overtime Hours</option>
              <option value="Social Security & PF">Social Security & PF/ESI/Gratuity</option>
              <option value="Workplace Safety & POSH">Workplace Safety & POSH</option>
              <option value="Contract Labor">Contract Labor & Licensing</option>
              <option value="Leave & Holidays">Leave & Statutory Holidays</option>
            </select>
          </div>

        </div>

        {/* Quick Indian Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <Landmark className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px]">NEW LABOUR CODES</span>
              <span className="text-slate-900 font-bold">4 Central Codes Mapped</span>
            </div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px]">INDIAN STATUTES</span>
              <span className="text-slate-900 font-bold">25+ Indian Acts</span>
            </div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px]">STATE SHOPS ACTS</span>
              <span className="text-slate-900 font-bold">7 Key Industrial States</span>
            </div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <FileCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px]">STATUTORY RETURNS</span>
              <span className="text-slate-900 font-bold">ECR, Form 5, POSH, LWF</span>
            </div>
          </div>
        </div>

        {/* Main Content: Split Master-Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Law Cards List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between px-1">
              <span>Mapped Statutes ({filteredLaws.length})</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono">India Live Mapped</span>
            </div>

            {filteredLaws.length === 0 ? (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No matching statutes found</p>
                <p className="text-xs text-slate-500">Try adjusting search term or state filter.</p>
              </div>
            ) : (
              filteredLaws.map((law) => {
                const isSelected = selectedLaw?.id === law.id;
                return (
                  <div
                    key={law.id}
                    onClick={() => setSelectedLaw(law)}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-400 ring-1 ring-indigo-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono font-semibold">
                        {law.jurisdiction}
                      </span>
                      <span className="text-[10px] text-slate-500">{law.lastUpdated}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{law.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{law.shortSummary}</p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-500 font-medium">{law.category}</span>
                      <span className="text-indigo-600 font-semibold flex items-center gap-1">
                        View Mandates <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Statute Inspector (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedLaw ? (
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 sticky top-24 shadow-xs">
                
                {/* Header */}
                <div className="space-y-2 border-b border-slate-200 pb-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-mono font-bold">
                      {selectedLaw.jurisdiction}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-300 text-xs font-medium shadow-xs">
                      {selectedLaw.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedLaw.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedLaw.shortSummary}</p>
                </div>

                {/* Key Mandatory Provisions */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 font-mono flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" /> Key Statutory Mandates & Rules
                  </h3>
                  <div className="space-y-2">
                    {selectedLaw.keyMandates.map((mandate, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-relaxed">{mandate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statutory Penalties & Applicability Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-1">
                    <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Statutory Non-Compliance Fine
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">{selectedLaw.penaltyDetails}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                    <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Enterprise Applicability
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{selectedLaw.applicability}</p>
                  </div>
                </div>

                {/* Statutory Form & Action Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Required Statutory Register / Return: <strong className="text-slate-900 font-mono">{selectedLaw.statutoryForm}</strong></span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => alert(`Downloading statutory return register template for ${selectedLaw.statutoryForm}`)}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download Form Template</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <Scale className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">Select a labor act on the left to inspect statutory mandates</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
