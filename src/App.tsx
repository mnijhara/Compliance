import React, { lazy, Suspense, useState } from 'react';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';

const LaborLawEngine = lazy(() => import('./components/LaborLawEngine').then(m => ({ default: m.LaborLawEngine })));
const StatutoryCalculator = lazy(() => import('./components/StatutoryCalculator').then(m => ({ default: m.StatutoryCalculator })));
const LabourCodesMatrix = lazy(() => import('./components/LabourCodesMatrix').then(m => ({ default: m.LabourCodesMatrix })));
const StatutoryFormVault = lazy(() => import('./components/StatutoryFormVault').then(m => ({ default: m.StatutoryFormVault })));
const AiAuditStudio = lazy(() => import('./components/AiAuditStudio').then(m => ({ default: m.AiAuditStudio })));
const AgenticWorkflows = lazy(() => import('./components/AgenticWorkflows').then(m => ({ default: m.AgenticWorkflows })));
const PolicyGenerator = lazy(() => import('./components/PolicyGenerator').then(m => ({ default: m.PolicyGenerator })));
const ComplianceControlCenter = lazy(() => import('./components/ComplianceControlCenter').then(m => ({ default: m.ComplianceControlCenter })));
const PricingPage = lazy(() => import('./components/PricingPage').then(m => ({ default: m.PricingPage })));

type BoundaryProps = { children?: React.ReactNode };

class AppErrorBoundary extends React.Component<BoundaryProps, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: unknown) { console.error('ComplyOS UI error:', error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <div className="min-h-[70vh] flex items-center justify-center bg-white px-6"><div className="max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center"><AlertTriangle className="mx-auto h-8 w-8 text-rose-600" /><h1 className="mt-3 text-lg font-black text-slate-900">ComplyOS could not render this screen</h1><p className="mt-2 text-sm text-slate-600">Your documents are not lost. Refresh the page or return to the home screen.</p><button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white">Refresh ComplyOS</button></div></div>;
  }
}

function AdvancedFallback() {
  return <div className="flex min-h-[60vh] items-center justify-center"><div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" /> Loading ComplyOS…</div></div>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const openChat = () => window.dispatchEvent(new CustomEvent('complyos:open-chat'));

  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1">
          {activeTab === 'home' && <LandingPage setActiveTab={setActiveTab} onOpenAudit={() => setActiveTab('ai-audit')} onOpenChat={openChat} />}
          <Suspense fallback={<AdvancedFallback />}>
            {activeTab === 'labor-laws' && <LaborLawEngine />}
            {activeTab === 'statutory-calculators' && <StatutoryCalculator />}
            {activeTab === 'labour-codes' && <LabourCodesMatrix />}
            {activeTab === 'form-vault' && <StatutoryFormVault />}
            {activeTab === 'ai-audit' && <AiAuditStudio />}
            {activeTab === 'agentic-workflows' && <AgenticWorkflows />}
            {activeTab === 'policy-generator' && <PolicyGenerator />}
            {activeTab === 'workspace' && <ComplianceControlCenter />}
            {activeTab === 'pricing' && <PricingPage />}
          </Suspense>
        </main>
        <FloatingAiAssistant />
        <Footer setActiveTab={setActiveTab} />
      </div>
    </AppErrorBoundary>
  );
}
