import React, { useState } from 'react';
import { Calculator, ShieldCheck, DollarSign, Award, ArrowRight, Info, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const StatutoryCalculator: React.FC = () => {
  const [activeCalcTab, setActiveCalcTab] = useState<'wage-code' | 'epf-esi' | 'gratuity' | 'pt-lwf'>('wage-code');

  // --- 1. Code on Wages 50% Basic Salary Simulator State ---
  const [monthlyCtc, setMonthlyCtc] = useState<number>(80000);
  const [currentBasic, setCurrentBasic] = useState<number>(30000); // 37.5% of 80k
  const [currentHra, setCurrentHra] = useState<number>(20000);
  const [currentSpecialAllow, setCurrentSpecialAllow] = useState<number>(30000);

  // --- 2. EPF & ESIC State ---
  const [empGrossSalary, setEmpGrossSalary] = useState<number>(18000);
  const [actualBasicForPf, setActualBasicForPf] = useState<number>(14000);
  const [restrictPfCeiling, setRestrictPfCeiling] = useState<boolean>(true); // Cap at 15,000 ceiling

  // --- 3. Payment of Gratuity State ---
  const [gratuityBasic, setGratuityBasic] = useState<number>(45000);
  const [tenureYears, setTenureYears] = useState<number>(6);
  const [employmentType, setEmploymentType] = useState<'regular' | 'fixed-term'>('regular');

  // --- 4. State PT & LWF State ---
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [ptGrossWage, setPtGrossWage] = useState<number>(25000);

  // --- Math Logic 1: Code on Wages 50% Rule ---
  const totalAllowances = currentHra + currentSpecialAllow;
  const currentBasicPercent = ((currentBasic / monthlyCtc) * 100).toFixed(1);
  const isCompliant50 = currentBasic >= monthlyCtc * 0.5;

  const requiredBasic = monthlyCtc * 0.5;
  const basicDifference = Math.max(0, requiredBasic - currentBasic);

  // Incremental EPF liability per month (12% of basic up to 15k ceiling or actual)
  const oldPfBase = restrictPfCeiling ? Math.min(15000, currentBasic) : currentBasic;
  const newPfBase = restrictPfCeiling ? Math.min(15000, requiredBasic) : requiredBasic;
  const incrementalEmployerPf = (newPfBase - oldPfBase) * 0.12;

  // Incremental Gratuity annual provision change: (15/26) * Basic
  const oldAnnualGratuity = (15 / 26) * currentBasic;
  const newAnnualGratuity = (15 / 26) * requiredBasic;
  const incrementalGratuityPerYear = newAnnualGratuity - oldAnnualGratuity;

  // --- Math Logic 2: EPF & ESIC ECR ---
  const pfWageBase = restrictPfCeiling ? Math.min(15000, actualBasicForPf) : actualBasicForPf;
  const epfEmployee = pfWageBase * 0.12;
  const epsEmployer = Math.min(1250, pfWageBase * 0.0833);
  const epfEmployerDiff = epfEmployee - epsEmployer;
  const edliEmployer = pfWageBase * 0.005;
  const adminEmployer = pfWageBase * 0.005;
  const totalEmployerPfRemittance = epfEmployerDiff + epsEmployer + edliEmployer + adminEmployer;

  const isEsicCovered = empGrossSalary <= 21000;
  const esicEmployee = isEsicCovered ? empGrossSalary * 0.0075 : 0;
  const esicEmployer = isEsicCovered ? empGrossSalary * 0.0325 : 0;

  // --- Math Logic 3: Statutory Gratuity ---
  const eligibleGratuity = employmentType === 'regular' && tenureYears < 5;
  const gratuityAmount = eligibleGratuity ? 0 : Math.round((15 / 26) * gratuityBasic * tenureYears);
  const isTaxExemptGratuity = gratuityAmount <= 2000000;

  // --- Math Logic 4: PT Slabs ---
  const getPtAmount = (state: string, gross: number) => {
    if (state === 'Maharashtra') {
      if (gross <= 7500) return 0;
      if (gross <= 10000) return 175; // male
      return 200; // 300 in Feb
    } else if (state === 'Karnataka') {
      if (gross < 15000) return 0;
      return 200;
    } else if (state === 'Tamil Nadu') {
      if (gross <= 21000) return 0;
      return 208; // avg per month
    } else if (state === 'Telangana') {
      if (gross <= 15000) return 0;
      if (gross <= 20000) return 150;
      return 200;
    } else if (state === 'Gujarat') {
      if (gross <= 12000) return 0;
      return 200;
    } else if (state === 'West Bengal') {
      if (gross <= 10000) return 0;
      if (gross <= 15000) return 110;
      if (gross <= 25000) return 130;
      if (gross <= 40000) return 150;
      return 200;
    }
    return 0; // Delhi has no PT
  };
  const calculatedPt = getPtAmount(selectedState, ptGrossWage);

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            <span>Statutory Algorithmic Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Indian Statutory Labor Calculators & Salary Structuring Suite
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Architected for enterprise CHROs and payroll practitioners. Instantly compute statutory liabilities under the Code on Wages (50% Basic Salary Capping), EPF & ESIC ECR Remittance, Payment of Gratuity Act, and State PT/LWF slabs.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveCalcTab('wage-code')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeCalcTab === 'wage-code'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Code on Wages 50% Basic Restructuring</span>
          </button>

          <button
            onClick={() => setActiveCalcTab('epf-esi')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeCalcTab === 'epf-esi'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>EPF & ESIC ECR Monthly Remittance</span>
          </button>

          <button
            onClick={() => setActiveCalcTab('gratuity')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeCalcTab === 'gratuity'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Payment of Gratuity Calculator</span>
          </button>

          <button
            onClick={() => setActiveCalcTab('pt-lwf')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeCalcTab === 'pt-lwf'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>State PT & LWF Slabs</span>
          </button>
        </div>

        {/* TAB 1: CODE ON WAGES 50% BASIC RESTRUCTURING */}
        {activeCalcTab === 'wage-code' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form (6 cols) */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">CTC & Salary Component Inputs</h3>
                <p className="text-xs text-slate-600">Enter current employee package to test Code on Wages compliance</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Monthly Total CTC (Gross + Employer Retirals)</span>
                    <span className="font-mono text-indigo-700 font-bold">₹{monthlyCtc.toLocaleString('en-IN')}</span>
                  </label>
                  <input
                    type="range"
                    min="20000"
                    max="500000"
                    step="5000"
                    value={monthlyCtc}
                    onChange={(e) => {
                      const ctc = Number(e.target.value);
                      setMonthlyCtc(ctc);
                      // Auto adjust basic to 40%
                      setCurrentBasic(Math.round(ctc * 0.4));
                      setCurrentHra(Math.round(ctc * 0.3));
                      setCurrentSpecialAllow(Math.round(ctc * 0.3));
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Basic + DA (Monthly)</label>
                    <input
                      type="number"
                      value={currentBasic}
                      onChange={(e) => setCurrentBasic(Number(e.target.value))}
                      className="w-full bg-white text-slate-900 font-mono text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">HRA (Monthly)</label>
                    <input
                      type="number"
                      value={currentHra}
                      onChange={(e) => setCurrentHra(Number(e.target.value))}
                      className="w-full bg-white text-slate-900 font-mono text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Special Allowances</label>
                    <input
                      type="number"
                      value={currentSpecialAllow}
                      onChange={(e) => setCurrentSpecialAllow(Number(e.target.value))}
                      className="w-full bg-white text-slate-900 font-mono text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="restrictPfCeilingCheck"
                    checked={restrictPfCeiling}
                    onChange={(e) => setRestrictPfCeiling(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="restrictPfCeilingCheck" className="text-xs text-slate-700 cursor-pointer">
                    Apply Statutory EPF Wage Ceiling Cap (₹15,000/month)
                  </label>
                </div>
              </div>
            </div>

            {/* Statutory Result Card (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">CODE ON WAGES IMPACT ANALYSIS</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono ${
                    isCompliant50
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {isCompliant50 ? 'Compliant (Basic ≥ 50%)' : 'Restructuring Required'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                    <span className="text-[11px] text-slate-500 block">Current Basic % of CTC</span>
                    <span className="text-2xl font-black font-mono text-slate-900">{currentBasicPercent}%</span>
                    <span className="text-[10px] text-slate-500 block">Current: ₹{currentBasic.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                    <span className="text-[11px] text-slate-500 block">Mandatory 50% Floor</span>
                    <span className="text-2xl font-black font-mono text-indigo-700">₹{requiredBasic.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-500 block">50.0% of Total CTC</span>
                  </div>
                </div>

                {!isCompliant50 && (
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Statutory Deficit: ₹{basicDifference.toLocaleString('en-IN')}/month
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Allowances exceed 50% of CTC. Under Section 2(y) of Code on Wages 2019, the excess allowance amount must be added back to Basic Salary for calculating Provident Fund (EPF) and Gratuity.
                    </p>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                    Financial & Liability Impact Projections
                  </h4>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                    <span className="text-slate-700">Incremental Employer EPF Liability:</span>
                    <span className="font-mono font-bold text-indigo-700">+₹{incrementalEmployerPf.toFixed(0)} / mo</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                    <span className="text-slate-700">Incremental Statutory Gratuity Provision:</span>
                    <span className="font-mono font-bold text-indigo-700">+₹{incrementalGratuityPerYear.toFixed(0)} / year</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EPF & ESIC ECR REMITTANCE */}
        {activeCalcTab === 'epf-esi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">Monthly ECR Payroll Inputs</h3>
                <p className="text-xs text-slate-600">Enter employee monthly salary parameters for ECR return breakdown</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Monthly Basic + DA Salary</label>
                  <input
                    type="number"
                    value={actualBasicForPf}
                    onChange={(e) => setActualBasicForPf(Number(e.target.value))}
                    className="w-full bg-white text-slate-900 font-mono text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Monthly Gross Salary (for ESI Eligibility)</label>
                  <input
                    type="number"
                    value={empGrossSalary}
                    onChange={(e) => setEmpGrossSalary(Number(e.target.value))}
                    className="w-full bg-white text-slate-900 font-mono text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="restrictPfCeiling"
                    checked={restrictPfCeiling}
                    onChange={(e) => setRestrictPfCeiling(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="restrictPfCeiling" className="text-xs text-slate-700 cursor-pointer">
                    Cap PF Wage at Statutory ₹15,000 Ceiling
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">Statutory ECR Breakdown</h3>
                <span className="text-xs font-mono text-indigo-700 font-bold">Base: ₹{pfWageBase.toLocaleString('en-IN')}</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* EPF Employee */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="font-bold text-slate-900">EPF Employee Contribution (12%)</span>
                    <span className="text-[11px] text-slate-500 block">Deducted from employee pay</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">₹{epfEmployee.toFixed(0)}</span>
                </div>

                {/* EPF Employer Breakdown */}
                <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">Total Employer PF Remittance</span>
                    <span className="font-mono font-bold text-indigo-900 text-sm">₹{totalEmployerPfRemittance.toFixed(0)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-indigo-800 font-mono pt-1 border-t border-indigo-200">
                    <div>• EPS Pension (8.33%): ₹{epsEmployer.toFixed(0)}</div>
                    <div>• EPF Difference: ₹{epfEmployerDiff.toFixed(0)}</div>
                    <div>• EDLI Life Ins (0.5%): ₹{edliEmployer.toFixed(0)}</div>
                    <div>• Admin Charges (0.5%): ₹{adminEmployer.toFixed(0)}</div>
                  </div>
                </div>

                {/* ESIC */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">ESIC Remittance Status</span>
                      <span className="text-[11px] text-slate-500 block">Threshold: Gross ≤ ₹21,000</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isEsicCovered ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isEsicCovered ? 'Covered' : 'Exempt (> ₹21k)'}
                    </span>
                  </div>

                  {isEsicCovered && (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-slate-200">
                      <div>Employee (0.75%): <strong className="text-slate-900">₹{esicEmployee.toFixed(0)}</strong></div>
                      <div>Employer (3.25%): <strong className="text-slate-900">₹{esicEmployer.toFixed(0)}</strong></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT OF GRATUITY */}
        {activeCalcTab === 'gratuity' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">Gratuity Parameters</h3>
                <p className="text-xs text-slate-600">Calculates statutory lump-sum payout under Payment of Gratuity Act 1972</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Last Drawn Basic + DA (Monthly)</label>
                  <input
                    type="number"
                    value={gratuityBasic}
                    onChange={(e) => setGratuityBasic(Number(e.target.value))}
                    className="w-full bg-white text-slate-900 font-mono text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Completed Years of Continuous Service</span>
                    <span className="font-mono text-indigo-700 font-bold">{tenureYears} Years</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Employment Contract Type</label>
                  <select
                    value={employmentType}
                    onChange={(e: any) => setEmploymentType(e.target.value)}
                    className="w-full bg-white text-slate-800 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs font-semibold"
                  >
                    <option value="regular">Regular Permanent Employee (5-Year Minimum Threshold)</option>
                    <option value="fixed-term">Fixed-Term Contract Employee (Code on Social Security Pro-Rata - No 5-Yr Limit)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">Statutory Gratuity Payout</h3>
                <span className="text-xs font-mono text-emerald-700 font-bold">Tax Exempt Limit: ₹20 Lakhs</span>
              </div>

              {eligibleGratuity ? (
                <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
                  <div className="text-sm font-bold text-rose-900">Ineligible for Gratuity</div>
                  <p className="text-xs text-rose-800">
                    Regular employees require at least 5 continuous years of service under the Payment of Gratuity Act 1972. (Current tenure: {tenureYears} years).
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-mono block">STATUTORY GRATUITY AMOUNT</span>
                    <div className="text-4xl font-black text-emerald-700 font-mono">
                      ₹{gratuityAmount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs text-slate-600 block">
                      Formula: (15 / 26) × ₹{gratuityBasic.toLocaleString('en-IN')} × {tenureYears} Years
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Statutory Tax Exemption Status
                    </div>
                    <p>
                      {isTaxExemptGratuity
                        ? '100% Tax-Exempt under Section 10(10) of the Income Tax Act (Payout within ₹20,00,000 ceiling).'
                        : 'Taxable on amount exceeding ₹20,00,000 maximum tax-free ceiling.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STATE PT & LWF */}
        {activeCalcTab === 'pt-lwf' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">State Statutory Tax Inputs</h3>
                <p className="text-xs text-slate-600">Select state jurisdiction and employee gross wage slab</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">State Jurisdiction</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-white text-indigo-700 font-bold text-xs p-3 rounded-xl border border-indigo-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  >
                    <option value="Maharashtra">Maharashtra (PT Act 1975 & LWF Act)</option>
                    <option value="Karnataka">Karnataka (PT Act & LWF Rules)</option>
                    <option value="Tamil Nadu">Tamil Nadu (Professional Tax Slabs)</option>
                    <option value="Telangana">Telangana (Professional Tax Slabs)</option>
                    <option value="Gujarat">Gujarat (Professional Tax Slabs)</option>
                    <option value="West Bengal">West Bengal (Professional Tax Slabs)</option>
                    <option value="Delhi">Delhi NCT (No Professional Tax)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Monthly Gross Salary</label>
                  <input
                    type="number"
                    value={ptGrossWage}
                    onChange={(e) => setPtGrossWage(Number(e.target.value))}
                    className="w-full bg-white text-slate-900 font-mono text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">{selectedState} Tax & LWF Slabs</h3>
                <span className="text-xs font-mono text-indigo-700 font-bold">2026 Active Rate</span>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                  <span className="text-xs text-slate-500 font-mono uppercase block">MONTHLY PROFESSIONAL TAX DEDUCTION</span>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    ₹{calculatedPt} <span className="text-xs font-normal text-slate-500">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {selectedState === 'Maharashtra' && 'Note: Maharashtra PT is ₹200/month for March-Jan and ₹300 for February for gross salary > ₹10,000.'}
                    {selectedState === 'Karnataka' && 'Note: Karnataka PT is ₹200/month for gross salary ₹15,000 or higher.'}
                    {selectedState === 'Delhi' && 'Delhi NCT does not levy Professional Tax.'}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                  <span className="text-xs text-slate-500 font-mono uppercase block">STATUTORY LABOUR WELFARE FUND (LWF) CONTRIBUTION</span>
                  <div className="text-xs font-mono text-indigo-900 font-bold">
                    Bi-Annual Remittance (June & December)
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {selectedState === 'Maharashtra' ? 'MH LWF Rate: Employee ₹25 + Employer ₹75 (Half-Yearly)' : 'Standard State LWF Board rules apply.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
