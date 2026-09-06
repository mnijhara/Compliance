export interface ComplianceControlDefinition {
  id: string;
  framework: string;
  title: string;
  applicability: string[];
  requiredEvidence: string[];
  sourceIds: string[];
  risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  ownerRole: string;
}

/**
 * Product control catalog. Applicability is intentionally expressed as
 * evidence requirements rather than guessed legal conclusions.
 */
export const COMPLIANCE_CONTROL_CATALOG: ComplianceControlDefinition[] = [
  {
    id: 'labour-code-profile',
    framework: 'Four Labour Codes',
    title: 'Establishment applicability profile',
    applicability: ['India establishment', 'Current employee/worker profile', 'Establishment type'],
    requiredEvidence: ['Legal entity details', 'Establishment registration', 'Headcount/worker profile', 'State/location list'],
    sourceIds: ['mole-labour-codes-effective', 'mole-code-wages-rules-2026', 'mole-social-security-rules-2026', 'mole-ir-rules-2026', 'mole-osh-rules-2026'],
    risk: 'HIGH',
    ownerRole: 'HR / Compliance'
  },
  {
    id: 'appointment-letter-evidence',
    framework: 'OSHWC / Labour Codes',
    title: 'Appointment letter evidence',
    applicability: ['Employees/workers engaged by the establishment'],
    requiredEvidence: ['Current template', 'Representative issued letters', 'Issuance workflow'],
    sourceIds: ['mole-osh-rules-2026', 'mole-labour-handbook-2026'],
    risk: 'HIGH',
    ownerRole: 'HR'
  },
  {
    id: 'wage-structure-review',
    framework: 'Code on Wages, 2019',
    title: 'Wage structure and payroll evidence',
    applicability: ['Employees/workers covered by applicable wage provisions', 'Applicable state/sector rules'],
    requiredEvidence: ['Payroll register', 'Salary structure', 'Wage calculation sample', 'Applicable notifications/rules'],
    sourceIds: ['mole-code-wages-rules-2026', 'mole-labour-handbook-2026'],
    risk: 'CRITICAL',
    ownerRole: 'Payroll / HR'
  },
  {
    id: 'posh-governance',
    framework: 'POSH Act / Rules',
    title: 'POSH governance evidence',
    applicability: ['Workplace covered by POSH framework', 'Threshold and workplace structure verified'],
    requiredEvidence: ['Policy', 'IC constitution', 'External member evidence', 'Training records', 'Annual reporting evidence'],
    sourceIds: ['wcd-legislation'],
    risk: 'HIGH',
    ownerRole: 'HR / POSH IC'
  },
  {
    id: 'contractor-governance',
    framework: 'OSHWC / contract labour',
    title: 'Contractor compliance evidence',
    applicability: ['Contract workers engaged', 'Principal-employer/contractor facts verified'],
    requiredEvidence: ['Contractor register', 'Licences/registrations', 'Worker roster', 'Wage/payment evidence'],
    sourceIds: ['mole-osh-rules-2026', 'mole-social-security-rules-2026'],
    risk: 'HIGH',
    ownerRole: 'HR / Procurement'
  },
  {
    id: 'night-work-safeguards',
    framework: 'OSHWC / applicable state rules',
    title: 'Night work safeguards',
    applicability: ['Night-shift work', 'Applicable state/establishment rules'],
    requiredEvidence: ['Roster', 'Consent/acknowledgement where applicable', 'Transport/security SOP', 'Applicable notification/rule'],
    sourceIds: ['mole-osh-rules-2026'],
    risk: 'HIGH',
    ownerRole: 'HR / Operations'
  }
];
