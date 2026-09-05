export type RiskSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'COMPLIANT';

export interface AuditClause {
  id: string;
  clauseTitle: string;
  originalText: string;
  riskLevel: RiskSeverity;
  citation: string;
  issueDescription: string;
  suggestedFix: string;
}

export interface AuditResult {
  policyTitle: string;
  jurisdiction: string;
  complianceScore: number;
  overallRiskTier: 'Prohibited' | 'High-Risk' | 'Limited-Risk' | 'Minimal-Risk' | 'Compliant';
  summary: string;
  totalIssuesCount: {
    critical: number;
    high: number;
    moderate: number;
    compliant: number;
  };
  clauses: AuditClause[];
  compliantRewrite: string;
  auditedAt: string;
}

export interface LaborLawItem {
  id: string;
  title: string;
  jurisdiction: string; // e.g. "India - Maharashtra", "US - California", "Global"
  country: 'India' | 'US' | 'UK' | 'EU' | 'Global';
  category: 'Wages & Hours' | 'Social Security & PF' | 'Workplace Safety & POSH' | 'Contract Labor' | 'Leave & Holidays' | 'Data Privacy';
  shortSummary: string;
  keyMandates: string[];
  penaltyDetails: string;
  applicability: string;
  lastUpdated: string;
  statutoryForm: string;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  agentType: 'Statutory Filing Agent' | 'Payroll Auditor' | 'POSH Guardian' | 'Contract Verifier' | 'Regulatory Change Watchdog';
  status: 'active' | 'idle' | 'running' | 'warning';
  lastRun: string;
  executionsToday: number;
  description: string;
  triggers: string[];
  actionsExecuted: string[];
  recentLogs: {
    timestamp: string;
    level: 'info' | 'warn' | 'success' | 'error';
    message: string;
  }[];
}

export interface PolicyTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  sampleText: string;
  recommendedJurisdictions: string[];
}

export interface ComplianceAuditLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  jurisdiction: string;
  riskScoreAfter: number;
  status: 'Verified' | 'Pending Signoff' | 'Flagged';
  details: string;
}
