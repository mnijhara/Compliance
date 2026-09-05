import React, { useState } from 'react';
import { 
  ShieldCheck, Sparkles, Scale, Cpu, FileText, CheckCircle2, ArrowRight, 
  Building2, Users, AlertTriangle, Play, ChevronDown, ChevronUp, RefreshCw, 
  Award, Lock, Zap, BarChart3, Clock, Check
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [simulatingScenario, setSimulatingScenario] = useState<string>('posh');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  const handleRunSimulation = (scenario: string) => {
    setSimulatingScenario(scenario);
    setIsSimulating(true);
    setSimulationLogs(['Initializing Nova Agentic Engine v3.0...']);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, 'Ingesting multi-jurisdiction labor law parameters...']);
    }, 400);

    setTimeout(() => {
      if (scenario === 'posh') {
        setSimulationLogs(prev => [
          ...prev,
          'Agent: POSH Guardian executing...',
          'Scanning Internal Committee (IC) composition against POSH Act 2013 § 4...',
          '✔ Senior Woman Presiding Officer verified.',
          '❌ Warning: Missing external NGO member credential verification.',
          '✔ Generated compliant appointment clause & drafted District Officer annual return.'
        ]);
      } else if (scenario === 'overtime') {
        setSimulationLogs(prev => [
          ...prev,
          'Agent: Multi-State Payroll Auditor executing...',
          'Scanning California Labor Code § 510 & FLSA 29 U.S.C. § 207...',
          '✔ Standard 8h workday rules verified.',
          '❌ Detected 14 instances of 10+ hour workdays compensated at 1.0x instead of 1.5x/2.0x.',
          '✔ Generated wage recalculation report & updated paystub itemization register.'
        ]);
      } else {
        setSimulationLogs(prev => [
          ...prev,
          'Agent: Statutory Filing Agent executing...',
          'Processing ECR Provident Fund ledger for 1,420 employees...',
          '✔ Verified 12% statutory cap for gross wages exceeding ₹15,000.',
          '✔ UAN Aadhaar KYC seeding matched across 100% active workforce.',
          '✔ Electronic ECR Return pre-validated for submission.'
        ]);
      }
      setIsSimulating(false);
    }, 1500);
  };

  const faqs = [
    {
      q: 'What is cmplihr.ai and how does it automate HR compliance?',
      a: 'cmplihr.ai is an autonomous AI compliance intelligence platform built on Globalion’s Nova agentic architecture. It continuously maps over 40 labor law frameworks, audits HR contracts/policies using server-side Gemini AI, and coordinates autonomous agents to track statutory filings, POSH governance, and payroll rules.'
    },
    {
      q: 'How does cmplihr.ai handle multi-state labor laws in India & US?',
      a: 'The platform maintains a real-time statutory database for all 28 Indian states (Shops & Est Act, PF/ESI, LWF, Minimum Wage VDA) and US jurisdictions (California AB5, NY Pay Transparency, FLSA). It automatically alerts CHROs to state-level amendments and updates policy templates accordingly.'
    },
    {
      q: 'Is our corporate data safe when performing AI policy audits?',
      a: 'Yes. cmplihr.ai operates on an enterprise-grade, SOC 2 Type II and ISO 27001 certified architecture. All AI processing is performed server-side with strict memory isolation. No client policy data is ever used to train public foundation models.'
    },
    {
      q: 'Can cmplihr.ai integrate with existing HRMS platforms like Workday or BambooHR?',
      a: 'Yes. The Nova Agentic platform features pre-built API connectors to major HRMS, payroll engines, and document repositories (Workday, BambooHR, Darwinbox, SAP SuccessFactors, Salesforce, SharePoint).'
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-200 bg-gradient-to-b from-indigo-50/40 via-white to-white">
        
        {/* Glow Background FX */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-200/40 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Announcement Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-800 shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span className="text-slate-900 font-bold">Nova 3.0 Release:</span> Autonomous Agentic Platform for CHROs
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Autonomous AI <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">
                  HR Compliance Intelligence
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Transform 40+ labor laws, multi-jurisdiction payroll rules, POSH committee governance, and contract audits into automated, zero-penalty agentic workflows.
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>40+ Labor Codes Mapped</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Audit Readiness</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>85% Manual Effort Saved</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('ai-audit')}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-100" />
                  <span>Run Instant AI Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('labor-laws')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Scale className="w-4 h-4 text-indigo-600" />
                  <span>Explore 40+ Labor Laws</span>
                </button>
              </div>

            </div>

            {/* Hero Right: Live Interactive Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-2xl border border-indigo-200 p-6 shadow-xl relative overflow-hidden">
                
                {/* Header of Preview */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                      Nova Agentic Core — Live Status
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-semibold">
                    125+ Jurisdictions Active
                  </span>
                </div>

                {/* Score Widget */}
                <div className="py-5 flex items-center justify-between border-b border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Enterprise Compliance Health</span>
                    <span className="text-3xl font-extrabold text-emerald-600 font-mono">96.8 / 100</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">Status: <strong className="text-emerald-700">Statutorily Compliant</strong></span>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-[11px] bg-white px-2.5 py-1 rounded text-slate-700 border border-slate-200 font-mono shadow-xs">
                      Active Agents: <strong className="text-indigo-700">5 Nova AI</strong>
                    </div>
                    <div className="text-[11px] bg-white px-2.5 py-1 rounded text-slate-700 border border-slate-200 font-mono shadow-xs">
                      Audit Readiness: <strong className="text-emerald-700">100% Guaranteed</strong>
                    </div>
                  </div>
                </div>

                {/* Agent Activity Feed */}
                <div className="py-4 space-y-2.5">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">Real-Time Autonomous Feed</span>
                  
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-start gap-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-900 font-semibold block">Statutory Filing Agent</span>
                      <span className="text-slate-600 text-[11px]">Reconciled 1,420 ECR PF records with zero wage capping discrepancy.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-start gap-2.5 shadow-xs">
                    <Cpu className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-900 font-semibold block">Regulatory Watchdog</span>
                      <span className="text-slate-600 text-[11px]">Ingested Maharashtra Gazette VDA wage update. Auto-updated rulebook.</span>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="w-full py-2.5 mt-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Open Executive CHRO Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. ENTERPRISE IMPACT METRICS & CASE HIGHLIGHT */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center pb-12 border-b border-slate-200">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 font-mono">40+</span>
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider mt-2">Labor Laws Mapped</p>
              <p className="text-[11px] text-slate-500 mt-1">PF, ESI, POSH, FLSA, AB5, Standing Orders</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-mono">100%</span>
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider mt-2">Audit Readiness</p>
              <p className="text-[11px] text-slate-500 mt-1">Legally defensible digital audit trail</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-mono">85%</span>
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider mt-2">Manual Effort Saved</p>
              <p className="text-[11px] text-slate-500 mt-1">Zero-delay policy scans & returns</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-mono">125+</span>
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider mt-2">Jurisdictions</p>
              <p className="text-[11px] text-slate-500 mt-1">State & national level labor engines</p>
            </div>
          </div>

          {/* Featured Case Study: Mahindra Holidays */}
          <div className="mt-12 bg-gradient-to-r from-indigo-50/60 via-white to-indigo-50/40 p-8 rounded-2xl border border-indigo-200 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <Building2 className="w-4 h-4" /> Client Success Highlight
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Mahindra Holidays & Resorts — Multi-State Payroll & Statutory Compliance
              </h3>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Automated multi-jurisdiction payroll operations, statutory return verifications, and labor risk mitigation across 28 Indian states, ensuring 100% accuracy and zero statutory penalties.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('labor-laws')}
              className="px-5 py-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition shrink-0 cursor-pointer shadow-xs"
            >
              View Multi-State Matrix
            </button>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. NOVA 3-LAYER AGENTIC ARCHITECTURE */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
              The Nova Engine Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Organic 3-Layer Agentic Compliance Engine
            </h2>
            <p className="text-sm text-slate-600">
              Powered by Globalion's Nova framework: Events, Autonomous Agents, and Action Skills interact organically without hardcoded workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* Layer 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm font-mono border border-indigo-200">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Layer 1: Event Ingestion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures real-time compliance events: government gazette notifications, payroll cycles, policy updates, and employee onboarding triggers.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> State Gazette Notification Streams</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Payroll Register Sync (Workday/SAP)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Contract & Policy Document Uploads</li>
              </ul>
            </div>

            {/* Layer 2 */}
            <div className="p-6 rounded-2xl bg-indigo-50/40 border-2 border-indigo-300 shadow-md space-y-4 relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                Autonomous
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm font-mono shadow-xs">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Layer 2: Autonomous AI Agents</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized Nova AI agents execute legal reasoning, gap analysis, penalty risk scoring, and rule cross-matching.
              </p>
              <ul className="text-xs text-slate-800 space-y-1.5 pt-2 font-medium">
                <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-indigo-600" /> Statutory Filing Agent</li>
                <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-indigo-600" /> Multi-State Payroll Auditor</li>
                <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-indigo-600" /> POSH Committee Guardian</li>
              </ul>
            </div>

            {/* Layer 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm font-mono border border-indigo-200">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Layer 3: Skills & Action Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates statutorily compliant policy rewrites, ECR return files, penalty remediation roadmaps, and CHRO audit trails.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Gemini-Powered Compliant Rewrites</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Pre-Validated ECR & Form Filings</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Immutable Digital Audit Logs</li>
              </ul>
            </div>

          </div>

          <div className="pt-4">
            <button
              onClick={() => setActiveTab('agentic-workflows')}
              className="px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Explore All Agentic Workflows</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. INTERACTIVE WORKFLOW PLAYGROUND */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Interactive Compliance Workflow Simulator
            </h2>
            <p className="text-xs text-slate-600">
              Test how Nova AI Agents detect vulnerabilities and resolve compliance gaps in real-time.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Simulator Options */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
                  Select Scenario to Test
                </span>

                <button
                  onClick={() => handleRunSimulation('posh')}
                  className={`w-full p-4 rounded-xl text-left border transition flex items-start gap-3 cursor-pointer ${
                    simulatingScenario === 'posh'
                      ? 'bg-indigo-50 border-indigo-300 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-bold block">POSH IC Governance Audit</span>
                    <span className="text-xs text-slate-600">Verifies mandatory external NGO member & annual return filing.</span>
                  </div>
                </button>

                <button
                  onClick={() => handleRunSimulation('overtime')}
                  className={`w-full p-4 rounded-xl text-left border transition flex items-start gap-3 cursor-pointer ${
                    simulatingScenario === 'overtime'
                      ? 'bg-indigo-50 border-indigo-300 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Scale className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-bold block">California Daily Overtime Check</span>
                    <span className="text-xs text-slate-600">Scans 8h+ workdays for 1.5x/2.0x wage calculations under CA Labor Code.</span>
                  </div>
                </button>

                <button
                  onClick={() => handleRunSimulation('ecr')}
                  className={`w-full p-4 rounded-xl text-left border transition flex items-start gap-3 cursor-pointer ${
                    simulatingScenario === 'ecr'
                      ? 'bg-indigo-50 border-indigo-300 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-bold block">Provident Fund ECR Remittance</span>
                    <span className="text-xs text-slate-600">Verifies 12% statutory caps and UAN Aadhaar KYC matching.</span>
                  </div>
                </button>
              </div>

              {/* Terminal Execution Log */}
              <div className="lg:col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-5 font-mono text-xs space-y-3 min-h-[300px] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-500 text-[11px] ml-2">Nova Execution Logs</span>
                  </div>
                  {isSimulating && (
                    <span className="flex items-center gap-1 text-indigo-700 animate-pulse font-semibold">
                      <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" /> Running Agent...
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-2 text-slate-800 max-h-[250px] overflow-y-auto">
                  {simulationLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log.startsWith('✔') ? (
                        <span className="text-emerald-700 font-semibold">{log}</span>
                      ) : log.startsWith('❌') ? (
                        <span className="text-amber-700 font-semibold">{log}</span>
                      ) : (
                        <span className="text-slate-700">{log}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. INTERACTIVE FAQ ACCORDION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-600">Everything enterprise leaders need to know about cmplihr.ai</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-indigo-700 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. BOTTOM CTA BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Ready to Automate Enterprise HR Compliance?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Join enterprise CHROs using cmplihr.ai to eliminate statutory fine exposure and achieve 100% audit readiness.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('ai-audit')}
              className="px-8 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Free AI Policy Audit</span>
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className="px-8 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition cursor-pointer shadow-xs"
            >
              View Pricing Tiers
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
