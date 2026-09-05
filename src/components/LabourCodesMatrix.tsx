import React, { useState } from 'react';
import { Landmark, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Scale, FileText, Info } from 'lucide-react';

interface CodeComparison {
  id: string;
  codeName: string;
  subsumedActs: string[];
  keyChangePoints: {
    area: string;
    legacyRule: string;
    newCodeMandate: string;
    chroImpact: string;
  }[];
  readinessChecklist: string[];
}

const LABOUR_CODES_DATA: CodeComparison[] = [
  {
    id: 'code-wages',
    codeName: 'Code on Wages, 2019',
    subsumedActs: [
      'Payment of Wages Act, 1936',
      'Minimum Wages Act, 1948',
      'Payment of Bonus Act, 1965',
      'Equal Remuneration Act, 1976'
    ],
    keyChangePoints: [
      {
        area: 'Definition of "Wages" & 50% Cap',
        legacyRule: 'Different wage definitions across acts leading to high allowances (e.g., Basic at 30%, HRA + Allowances at 70%).',
        newCodeMandate: 'Allowances cannot exceed 50% of total salary package. Basic + DA must be ≥ 50%.',
        chroImpact: 'Requires restructuring employee CTCs to avoid excess PF and Gratuity liabilities.'
      },
      {
        area: 'Timely Wage Payment SLA',
        legacyRule: 'Different deadlines (7th or 10th of following month depending on headcount).',
        newCodeMandate: 'Universal mandate to disburse wages before 7th of following month across all sectors.',
        chroImpact: 'Payroll processing SLA must close by 3rd of every month.'
      },
      {
        area: 'Overtime Rate Statutory Calculation',
        legacyRule: 'Overtime rates varied across state Shops Acts and Factories Act.',
        newCodeMandate: 'Uniform statutory double rate (2.0x) for any work exceeding 8/9 hours a day or 48 hours a week.',
        chroImpact: 'Standardized OT calculation engine across all Indian branches.'
      }
    ],
    readinessChecklist: [
      'Audit CTC structures for all employees to ensure Basic + DA ≥ 50% of Total CTC.',
      'Re-align payroll disburser timelines to credit salaries by 7th of every month.',
      'Verify overtime rate calculation formulas in HRMS match 2.0x regular rate.'
    ]
  },
  {
    id: 'code-social-security',
    codeName: 'Code on Social Security, 2020',
    subsumedActs: [
      'Employees Provident Funds Act, 1952',
      'Employees State Insurance Act, 1948',
      'Maternity Benefit Act, 1961',
      'Payment of Gratuity Act, 1972',
      'Building & Construction Workers Welfare Act'
    ],
    keyChangePoints: [
      {
        area: 'Fixed-Term Contract Gratuity',
        legacyRule: 'Gratuity required minimum 5 years continuous service.',
        newCodeMandate: 'Fixed-term contract workers eligible for pro-rata gratuity without 5-year threshold.',
        chroImpact: 'Must calculate and accrue gratuity provisions for fixed-term employees annually.'
      },
      {
        area: 'Gig & Platform Worker Coverage',
        legacyRule: 'Zero statutory social security coverage for gig or aggregator workers.',
        newCodeMandate: 'Platform aggregators must contribute 1-2% of annual turnover to Social Security Fund.',
        chroImpact: 'Aggregator companies must register platform workers on Central Portal.'
      },
      {
        area: 'Crèche Facilities & Maternity',
        legacyRule: 'Maternity Benefit 26 weeks; Crèche required for 50+ workers under 2017 Amendment.',
        newCodeMandate: 'Crèche facilities integrated into national social security frame; mandatory 4 daily nursing visits.',
        chroImpact: 'Facilities management must audit crèche compliance across all sites with 50+ staff.'
      }
    ],
    readinessChecklist: [
      'Accrue annual gratuity liability for all fixed-term contract staff.',
      'Ensure UAN seeding and Aadhaar KYC verification for 100% of staff.',
      'Inspect physical crèche facilities or tied-up centers within 500 meters of offices.'
    ]
  },
  {
    id: 'code-ir',
    codeName: 'Industrial Relations Code, 2020',
    subsumedActs: [
      'Trade Unions Act, 1926',
      'Industrial Employment (Standing Orders) Act, 1946',
      'Industrial Disputes Act, 1947'
    ],
    keyChangePoints: [
      {
        area: 'Standing Orders Threshold',
        legacyRule: 'Standing orders mandatory for establishments with 100+ workers (50 in some states).',
        newCodeMandate: 'Threshold raised to establishments with 300 or more workers.',
        chroImpact: 'Provides operational flexibility for medium-sized enterprises.'
      },
      {
        area: 'Worker Re-skilling Fund',
        legacyRule: 'No mandatory re-skilling fund contribution.',
        newCodeMandate: 'Employer must contribute 15 days wages per retrenched worker to Worker Re-skilling Fund within 45 days.',
        chroImpact: 'Budgeting statutory re-skilling levy for any corporate restructuring.'
      },
      {
        area: 'Notice of Strike / Lockout',
        legacyRule: '14 days notice required only in public utility services.',
        newCodeMandate: '14 days advance written notice mandatory prior to strikes/lockouts across ALL industrial units.',
        chroImpact: 'Prevents sudden flash strikes across manufacturing and operational facilities.'
      }
    ],
    readinessChecklist: [
      'Review certification status of Standing Orders if headcount > 300.',
      'Establish Negotiating Union/Council framework for formal labor discussions.',
      'Set up retrenchment SLA protocol including Worker Re-skilling Fund deposit.'
    ]
  },
  {
    id: 'code-osh',
    codeName: 'Occupational Safety, Health & Working Conditions Code, 2020',
    subsumedActs: [
      'Factories Act, 1948',
      'Contract Labour Act, 1970',
      'Inter-State Migrant Workmen Act, 1979',
      '10 other sector-specific safety statutes'
    ],
    keyChangePoints: [
      {
        area: 'Women Night Shift Operations',
        legacyRule: 'Restricted female employment after 7 PM without special exemptions.',
        newCodeMandate: 'Women permitted to work night shifts (7 PM to 6 AM) across all sectors subject to consent, security, & transport.',
        chroImpact: 'Mandatory free security transport and CCTV tracking for female night staff.'
      },
      {
        area: 'Mandatory Free Annual Health Checkup',
        legacyRule: 'Health checks required only for hazardous factory operations.',
        newCodeMandate: 'Employer must provide free annual health checkups for all workers aged 40 years and above.',
        chroImpact: 'Corporate wellness programs must incorporate statutory 40+ annual medical checkups.'
      },
      {
        area: 'Single Universal License',
        legacyRule: 'Multiple separate licenses required for factory, contract labor, and hazardous work across states.',
        newCodeMandate: 'Single electronic license valid for 5 years across all branches.',
        chroImpact: 'Drastically simplifies multi-state regulatory licensing burdens.'
      }
    ],
    readinessChecklist: [
      'Verify night shift security transport SLAs and GPS tracking for female employees.',
      'Schedule mandatory annual health examinations for employees aged 40+.',
      'Audit contractor licenses to ensure alignment with single universal license rules.'
    ]
  }
];

export const LabourCodesMatrix: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<CodeComparison>(LABOUR_CODES_DATA[0]);

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Landmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>4 Labour Codes Transition Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The 4 New Indian Labour Codes: CHRO Transition Matrix
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Detailed breakdown of legacy Indian Central Acts vs. the 4 New Labour Codes (Code on Wages, Code on Social Security, IR Code, OSH Code). Strategic guidance for updating salary structures, standing orders, and contractor SLAs.
          </p>
        </div>

        {/* Code Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LABOUR_CODES_DATA.map((code) => {
            const isSelected = selectedCode.id === code.id;
            return (
              <div
                key={code.id}
                onClick={() => setSelectedCode(code)}
                className={`p-5 rounded-2xl border cursor-pointer transition space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-400 ring-1 ring-indigo-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase block">STATUTORY CODE</span>
                <h3 className="text-base font-bold text-slate-900">{code.codeName}</h3>
                <p className="text-xs text-slate-600">{code.subsumedActs.length} Legacy Acts Subsumed</p>
              </div>
            );
          })}
        </div>

        {/* Main Detailed Inspection Card */}
        <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
          
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">{selectedCode.codeName}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 font-mono">Subsumes Central Acts:</span>
              {selectedCode.subsumedActs.map((act, idx) => (
                <span key={idx} className="px-2.5 py-0.5 bg-white text-slate-700 border border-slate-300 rounded text-xs font-mono shadow-xs">
                  {act}
                </span>
              ))}
            </div>
          </div>

          {/* Strategic Shift Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 font-mono flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" /> Key Statutory Shift Comparison
            </h3>

            <div className="space-y-4">
              {selectedCode.keyChangePoints.map((point, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {point.area}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">LEGACY RULE</span>
                      <p className="text-slate-700 leading-relaxed">{point.legacyRule}</p>
                    </div>

                    <div className="space-y-1 bg-indigo-50/60 p-3 rounded-lg border border-indigo-200">
                      <span className="text-[10px] text-indigo-800 font-mono font-bold uppercase block">NEW CODE MANDATE</span>
                      <p className="text-indigo-950 font-medium leading-relaxed">{point.newCodeMandate}</p>
                    </div>

                    <div className="space-y-1 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase block">CHRO ACTION IMPACT</span>
                      <p className="text-emerald-950 leading-relaxed">{point.chroImpact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHRO Readiness Checklist */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Executive CHRO Readiness Checklist
            </h3>

            <div className="space-y-2">
              {selectedCode.readinessChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
