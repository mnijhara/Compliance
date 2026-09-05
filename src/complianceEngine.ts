import { COMPLIANCE_SOURCES, COMPLIANCE_SOURCE_VERSION, isSourceFresh } from './data/complianceSources';

export type ControlStatus = 'PASS' | 'REVIEW' | 'FAIL' | 'NOT_ASSESSED';
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface ComplianceProfile {
  jurisdiction: string;
  state?: string;
  employeeCount: number;
  establishmentType: 'office' | 'factory' | 'shop' | 'mixed' | 'other';
  industry?: string;
  hasContractWorkers: boolean;
  hasNightShift: boolean;
}

export interface ComplianceControl {
  id: string;
  name: string;
  framework: string;
  status: ControlStatus;
  risk: RiskLevel;
  rationale: string;
  evidence: string[];
  sourceIds: string[];
  nextAction: string;
}

export interface ComplianceAssessment {
  assessedAt: string;
  engineVersion: string;
  sourceVersion: string;
  profile: ComplianceProfile;
  score: number | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  controls: ComplianceControl[];
  caveats: string[];
}

const INDIA_SOURCES = COMPLIANCE_SOURCES.filter(s => s.jurisdiction === 'India - National');
const sourceIds = (...ids: string[]) => ids.filter(Boolean);

function control(id: string, name: string, framework: string, status: ControlStatus, risk: RiskLevel, rationale: string, evidence: string[], sources: string[], nextAction: string): ComplianceControl {
  return { id, name, framework, status, risk, rationale, evidence, sourceIds: sources, nextAction };
}

export function assessCompliance(profile: ComplianceProfile): ComplianceAssessment {
  const controls: ComplianceControl[] = [];
  const india = profile.jurisdiction.toLowerCase().startsWith('india');

  if (india) {
    controls.push(control('labour-codes-effective', 'Four Labour Codes applicability baseline', 'Four Labour Codes', 'PASS', 'LOW', 'India has implemented the Code on Wages, Industrial Relations Code, Code on Social Security and OSHWC Code from 21 November 2025.', ['Employer jurisdiction and establishment profile'], sourceIds('mole-labour-codes-effective', 'mole-labour-handbook-2026'), 'Maintain a current source snapshot and map applicable central/state rules to the establishment.'));
    controls.push(control('appointment-letters', 'Appointment letter control', 'OSHWC / Labour Codes', profile.employeeCount > 0 ? 'REVIEW' : 'NOT_ASSESSED', 'HIGH', 'The Labour Codes implementation includes appointment-letter requirements; the engine needs evidence to verify coverage rather than assuming compliance.', ['Upload appointment-letter template and a representative sample or HRIS evidence'], sourceIds('mole-labour-codes-effective', 'mole-labour-handbook-2026'), 'Upload the current appointment-letter template and sample issuance evidence for testing.'));
    controls.push(control('wage-definition', 'Wages / compensation structure review', 'Code on Wages, 2019', 'REVIEW', 'HIGH', 'Salary structures should be evaluated against the current statutory definition of wages and the applicable rules. No payroll conclusion is made without payroll evidence and the relevant state/sector rules.', ['Current CTC structure', 'Payroll register', 'Applicable state rules'], sourceIds('mole-labour-handbook-2026', 'mole-labour-codes-effective'), 'Run a payroll sample through the wage-definition control and retain the calculation evidence.'));

    if (profile.employeeCount >= 10) {
      controls.push(control('posh-governance', 'POSH governance evidence', 'POSH Act / applicable rules', 'REVIEW', 'HIGH', 'Organizations meeting the applicable threshold need documented POSH governance, including the constitution and operation of the Internal Committee where applicable.', ['IC constitution/order', 'External member details', 'Policy', 'Training records', 'Annual reporting evidence'], sourceIds('wcd-legislation'), 'Upload the latest IC constitution, policy, training evidence and annual-report evidence for verification.'));
    } else {
      controls.push(control('posh-threshold', 'POSH applicability threshold review', 'POSH Act / applicable rules', 'REVIEW', 'MODERATE', 'The establishment profile is below the common 10-employee threshold used for Internal Committee applicability, but branch/entity structure and current law must be confirmed before concluding non-applicability.', ['Entity/branch headcount breakdown'], sourceIds('wcd-legislation'), 'Confirm headcount at each workplace and preserve the applicability assessment.'));
    }

    if (profile.hasContractWorkers) controls.push(control('contract-labour', 'Contract labour evidence pack', 'OSHWC / contract labour requirements', 'REVIEW', 'HIGH', 'Contract-worker compliance depends on establishment, contractor, headcount and state-specific facts. Licences, registrations and wage evidence should be verified before a PASS is issued.', ['Principal-employer registration', 'Contractor licence', 'Worker roster', 'Wage/payment evidence'], sourceIds('mole-labour-handbook-2026'), 'Create a contractor register with licence expiry dates and monthly wage-payment evidence.'));
    if (profile.hasNightShift) controls.push(control('night-shift-safety', 'Night-shift safeguards', 'OSHWC / applicable state rules', 'REVIEW', 'HIGH', 'Night-shift arrangements can carry consent, safety, transport and state-rule requirements. The engine will not infer compliance from policy text alone.', ['Night-shift roster', 'Consent record where applicable', 'Transport/security SOP', 'State notification/rule'], sourceIds('mole-labour-handbook-2026'), 'Upload the applicable state rule and current night-shift safeguards for verification.'));

    const sourcesFresh = INDIA_SOURCES.length > 0 && INDIA_SOURCES.every(source => isSourceFresh(source));
    controls.push(control('source-freshness', 'Regulatory source freshness', 'Governance', sourcesFresh ? 'PASS' : 'REVIEW', 'MODERATE', 'The product records source verification dates so legal content can be audited and stale mappings can be flagged.', ['Source registry', 'Last-verified timestamp'], INDIA_SOURCES.map(s => s.id), 'Refresh source mappings whenever a government notification, rule or amendment changes applicability.'));
  } else {
    controls.push(control('jurisdiction-support', 'Jurisdiction support boundary', 'Global framework', 'NOT_ASSESSED', 'HIGH', 'The current evidence-first rule set is scoped to India. A non-India jurisdiction requires an authoritative source pack before a compliance conclusion can be made.', ['Authoritative jurisdiction source pack'], [], 'Select India or configure an authoritative source pack for the requested jurisdiction.'));
  }

  const weighted = controls.filter(c => c.status !== 'NOT_ASSESSED');
  const pass = weighted.filter(c => c.status === 'PASS').length;
  const fail = weighted.filter(c => c.status === 'FAIL').length;
  const review = weighted.filter(c => c.status === 'REVIEW').length;
  const score = weighted.length === 0 ? null : Math.round(((pass + review * 0.5) / weighted.length) * 100);

  return {
    assessedAt: new Date().toISOString(),
    engineVersion: '0.2.0-evidence-first',
    sourceVersion: COMPLIANCE_SOURCE_VERSION,
    profile,
    score,
    confidence: fail > 0 ? 'MEDIUM' : review > 0 ? 'MEDIUM' : 'HIGH',
    controls,
    caveats: ['This is a compliance-assessment aid, not a legal opinion or certification.', 'A REVIEW status means evidence or jurisdiction-specific rules are required; it is not a finding of non-compliance.', 'Primary legislation, notified rules and official government notifications prevail over summaries and AI-generated text.']
  };
}
