import React from 'react';
import { ShieldCheck, Cpu, Scale, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Activity, FileText, Zap, Building2, Users, Layers, Award, BarChart3, Lock, RefreshCw } from 'lucide-react';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onOpenAudit: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab, onOpenAudit }) => {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Powered by Globalion Nova™ Agentic AI Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Autonomous AI HR Compliance Intelligence for <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">Enterprise CHROs</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
              Automate multi-jurisdiction labor law compliance, statutory return filings (PF/ESI/LWF), POSH governance, and policy audits across 40+ legal frameworks with zero zero-day legal exposure.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab('ai-audit')}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Instant AI Contract Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('agentic-workflows')}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Explore Agentic Workflows</span>
              </button>
            </div>

            {/* Key Trust Metrics */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-indigo-600 font-mono">40+</div>
                <div className="text-xs text-slate-600 font-medium">Labor Laws Mapped</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-emerald-600 font-mono">100%</div>
                <div className="text-xs text-slate-600 font-medium">Statutory Accuracy</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-blue-600 font-mono">125+</div>
                <div className="text-xs text-slate-600 font-medium">Jurisdictions Covered</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-600 font-mono">0 Day</div>
                <div className="text-xs text-slate-600 font-medium">Regulatory SLA</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Interactive Compliance Widget Preview Banner */}
      <section className="py-12 bg-slate-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 md:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <Activity className="w-3.5 h-3.5" /> Real-Time Regulatory Radar Active
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Stop Relying on Manual Statutory Spreadsheets & Legal Retainers
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  CmpliHR.ai continuously scans labor gazette updates, state minimum wage revisions, and judicial decisions, automatically flagging non-compliant employee contracts and policy gaps in real-time.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Maharashtra Shops & Est.</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> POSH Act 2013</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> CA Overtime AB5</span>
                </div>
              </div>

              {/* Simulated Live Audit Card */}
              <div className="w-full lg:w-96 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">LIVE AUDIT DEMO</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold">Risk Tier: High-Risk</span>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="text-slate-600 font-semibold">Flagged Clause (Non-Compete):</div>
                  <div className="text-rose-900 font-mono bg-rose-50 p-2 rounded border border-rose-200">
                    "Employee shall not work for any competitor for 2 years post termination..."
                  </div>
                  <div className="text-slate-500 pt-1 flex items-center justify-between">
                    <span>Violation: Sec 27 Contract Act</span>
                    <span className="text-rose-600 font-bold">Void by Law</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('ai-audit')}
                  className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Audit Your Own HR Document</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Globalion Nova 3-Layer Agentic Platform Architecture */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="text-indigo-600 text-xs font-mono font-bold uppercase tracking-widest">
              Built on Globalion Nova™ Platform Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              The 3-Layer Organic Agentic Engine
            </h2>
            <p className="text-slate-600 text-base">
              Unlike static HR software with hard-coded logic, CmpliHR.ai forms organic workflows by connecting Events, Autonomous Agents, and Statutory Skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Layer 1: Events */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 hover:border-indigo-300 transition shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono">Layer 1: Real-Time Events</div>
              <h3 className="text-xl font-bold text-slate-900">Statutory Triggers & Gazette Feeds</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ingests payroll runs, statutory remittance due dates (15th of month), contractor onboardings, and live government labor gazette updates.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> ECR File Generation Events</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Overtime Hours &gt; 9 hrs/day</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> State Minimum Wage Revision Notifications</li>
              </ul>
            </div>

            {/* Layer 2: Autonomous Agents */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 hover:border-indigo-300 transition relative shadow-xs">
              <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                Core Nova Intelligence
              </span>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">Layer 2: Autonomous Agents</div>
              <h3 className="text-xl font-bold text-slate-900">Self-Orchestrating AI Workers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated Nova Agents for Statutory Filing, POSH Committee Governance, Multi-State Payroll Auditing, and Contract Labor verification.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Statutory Filing Agent</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Multi-State Payroll Auditor</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Regulatory Change Watchdog</li>
              </ul>
            </div>

            {/* Layer 3: Statutory Skills */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 hover:border-indigo-300 transition shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Layers className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">Layer 3: Statutory Skills</div>
              <h3 className="text-xl font-bold text-slate-900">Jurisdictional Rule Library</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pre-compiled compliance logic for 40+ labor statutes, statutory form outputs (Form L, Form V, ECR Returns), and citation algorithms.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ECR Wage Cap Rules (₹15k)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> POSH IC External NGO Mandate</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> California Daily Overtime Math</li>
              </ul>
            </div>

          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActiveTab('agentic-workflows')}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              <span>View live agent execution logs and triggers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. Enterprise Case Study Spotlight: Mahindra Holidays */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-md relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                  <Award className="w-4 h-4 text-indigo-600" /> Enterprise Case Study
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900">
                  How Mahindra Holidays Automated Multi-State Payroll & Statutory Compliance
                </h2>

                <p className="text-slate-600 text-sm leading-relaxed">
                  Managing thousands of employees across resorts in multiple Indian states presented complex statutory challenges—varying state shop acts, minimum wage notifications, and LWF deductions. By implementing CmpliHR.ai, Mahindra Holidays achieved total audit readiness.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <div className="text-2xl font-black text-emerald-600">99.8%</div>
                    <div className="text-[11px] text-slate-600 font-medium">Payroll Accuracy</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <div className="text-2xl font-black text-indigo-600">85%</div>
                    <div className="text-[11px] text-slate-600 font-medium">Reduced Audit Time</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <div className="text-2xl font-black text-amber-600">₹0</div>
                    <div className="text-[11px] text-slate-600 font-medium">Statutory Penalties</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 italic pt-2">
                  "CmpliHR.ai transformed our statutory operations. The Nova Agent automatically reconciles ECR registers and alerts us to zero-day labor law amendments."
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Mahindra Holidays Implementation Stack
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Multi-State Minimum Wage Engine</div>
                      <div className="text-slate-500 text-[11px]">Real-time VDA & basic wage calculations across 14 states.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Automated ECR Filing</div>
                      <div className="text-slate-500 text-[11px]">Direct generation of Provident Fund & ESIC returns by the 15th.</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">POSH Committee Verification</div>
                      <div className="text-slate-500 text-[11px]">Automated tracking of external NGO members & annual return submission.</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('workspace')}
                  className="w-full py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition shadow-xs"
                >
                  View CHRO Workspace Dashboard
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Platform Features Grid */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">
              End-to-End HR Compliance Suite
            </h2>
            <p className="text-slate-600 text-sm">
              Designed specifically for CHROs, General Counsel, and Statutory Compliance Heads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">40+ Labor Code Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive mapping of Shops & Establishments Acts, POSH, PF, ESI, Contract Labor, and US FLSA/California AB5 labor laws.
              </p>
              <button onClick={() => setActiveTab('labor-laws')} className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1">
                Explore Laws <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Contract & Policy Auditor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload or paste employment agreements to instantly flag unlawful non-compete terms, missing break rules, or wage capping issues.
              </p>
              <button onClick={() => setActiveTab('ai-audit')} className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">
                Start Audit <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Statutory Policy Generator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate compliant HR policies customized to your company size, state jurisdiction, and remote work setup in seconds.
              </p>
              <button onClick={() => setActiveTab('policy-generator')} className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                Generate Policy <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">CHRO Executive Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralized real-time compliance score, upcoming statutory return calendars, risk maps, and automated audit logs.
              </p>
              <button onClick={() => setActiveTab('workspace')} className="text-xs font-bold text-amber-600 hover:underline inline-flex items-center gap-1">
                View Dashboard <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nova Autonomous Agents</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set and forget autonomous agents that execute routine statutory validations, ECR reconciliations, and POSH audits backgroundly.
              </p>
              <button onClick={() => setActiveTab('agentic-workflows')} className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1">
                Manage Agents <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Zero-Knowledge Legal Security</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SOC 2 Type II & ISO 27001 certified data pipelines ensure your proprietary employment contracts never train public models.
              </p>
              <span className="text-xs font-semibold text-slate-500">Enterprise Ready</span>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Ready CTA Banner */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-50/50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Ready to Protect Your Organization from Labor Compliance Risks?
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Test your contracts against 40+ statutory labor laws instantly using CmpliHR.ai's Gemini-powered audit engine.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('ai-audit')}
              className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition cursor-pointer"
            >
              Run Free Document Audit
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className="px-6 py-3 text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 cursor-pointer shadow-xs"
            >
              View Enterprise Plans
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
