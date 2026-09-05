import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { LaborLawEngine } from './components/LaborLawEngine';
import { StatutoryCalculator } from './components/StatutoryCalculator';
import { LabourCodesMatrix } from './components/LabourCodesMatrix';
import { StatutoryFormVault } from './components/StatutoryFormVault';
import { AiAuditStudio } from './components/AiAuditStudio';
import { AgenticWorkflows } from './components/AgenticWorkflows';
import { PolicyGenerator } from './components/PolicyGenerator';
import { ComplianceControlCenter } from './components/ComplianceControlCenter';
import { PricingPage } from './components/PricingPage';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'home' && <LandingPage setActiveTab={setActiveTab} onOpenAudit={() => setActiveTab('ai-audit')} />}
        {activeTab === 'labor-laws' && <LaborLawEngine />}
        {activeTab === 'statutory-calculators' && <StatutoryCalculator />}
        {activeTab === 'labour-codes' && <LabourCodesMatrix />}
        {activeTab === 'form-vault' && <StatutoryFormVault />}
        {activeTab === 'ai-audit' && <AiAuditStudio />}
        {activeTab === 'agentic-workflows' && <AgenticWorkflows />}
        {activeTab === 'policy-generator' && <PolicyGenerator />}
        {activeTab === 'workspace' && <ComplianceControlCenter />}
        {activeTab === 'pricing' && <PricingPage />}
      </main>
      <FloatingAiAssistant />
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
