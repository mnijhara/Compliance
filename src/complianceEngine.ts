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
  hasWomenNightWork?: boolean;
  hasFixedTermWorkers?: boolean;
  hasMigrantWorkers?: boolean;
  hasApprentices?: boolean;
  hasWorkersUnder18?: boolean;
  operatingModel?: 'single-site' | 'multi-site' | 'franchise-network';
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
  /** A numeric compliance score is intentionally unavailable until evidence is verified. */
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
  const isQsr = /restaurant|qsr|food|retail|hospitality/i.test(profile.industry || '');

  if (india) {
    controls.push(control(
      'labour-codes-baseline',
      'Four Labour Codes applicability baseline',
      'Four Labour Codes',
      'REVIEW',
      'MODERATE',
      'The four Labour Codes are in force, but a source being current does not establish that this establishment is compliant. Applicability, state rules and evidence must be evaluated site by site.',
      ['Legal entity details', 'Establishment registration', 'Worker/headcount profile', 'Current state/central rules'],
      sourceIds('mole-labour-codes-effective', 'mole-code-wages-rules-2026', 'mole-social-security-rules-2026', 'mole-ir-rules-2026', 'mole-osh-rules-2026'),
      'Create an establishment profile and map each applicable central and state rule before issuing a conclusion.'
    ));

    controls.push(control(
      'establishment-registration',
      'Establishment registration / licence evidence',
      'OSHWC / applicable state establishment law',
      'REVIEW',
      'HIGH',
      'A multi-outlet employer should maintain an auditable registration/licence record for each establishment and applicable operating model. ComplyOS will not infer registration from headcount.',
      ['Establishment registration certificate', 'Current licence/intimation', 'Legal entity and address mapping', 'Renewal/expiry record'],
      sourceIds('mole-osh-rules-2026', 'delhi-labour-department', 'karnataka-labour-district-department', 'maharashtra-labour-commissioner'),
      'Map each outlet/site to its legal entity, state, establishment registration and expiry/renewal status.'
    ));

    controls.push(control(
      'appointment-letters',
      'Appointment / employment letter control',
      'Labour Codes / OSHWC',
      profile.employeeCount > 0 ? 'REVIEW' : 'NOT_ASSESSED',
      'HIGH',
      'Current central labour-code materials require formalisation through appointment letters. The engine needs actual templates and issuance evidence before any PASS can be issued.',
      ['Current appointment-letter template', 'Representative issued letters', 'HRIS issuance workflow', 'Exception report'],
      sourceIds('mole-labour-handbook-2026', 'mole-osh-rules-2026'),
      'Sample current appointment letters across outlet, corporate, fixed-term and other worker categories.'
    ));

    controls.push(control(
      'minimum-wage-and-wage-definition',
      'Minimum wage and statutory wage-definition review',
      'Code on Wages, 2019',
      'REVIEW',
      'CRITICAL',
      'Minimum wages are universalised under the Code on Wages and the wage definition affects statutory calculations. A national source cannot establish the correct state, skill/category or establishment rate for an outlet.',
      ['Payroll register', 'Salary structure', 'State minimum-wage notification', 'Skill/category mapping', 'Wage calculation sample'],
      sourceIds('mole-code-wages-rules-2026', 'mole-labour-handbook-2026'),
      'Run payroll by state, worker category and wage period against the current applicable minimum-wage notification.'
    ));

    controls.push(control(
      'working-hours-rest-ot',
      'Working hours, weekly rest and overtime',
      'Code on Wages / OSHWC / state establishment rules',
      'REVIEW',
      'CRITICAL',
      'Working-hour and overtime obligations depend on the applicable establishment law and state rules. The central Code on Wages sets an overtime floor of at least twice the normal rate where its conditions apply, but ComplyOS must not replace state-specific analysis with a universal schedule.',
      ['Rosters', 'Attendance data', 'Overtime register', 'Payroll OT calculation', 'Weekly-rest records', 'Applicable state notification'],
      sourceIds('mole-code-wages-rules-2026', 'mole-osh-rules-2026'),
      'Reconcile timekeeping to payroll and test overtime, breaks and weekly rest by outlet and worker category.'
    ));

    controls.push(control(
      'social-security',
      'EPF / ESI / gratuity / social-security evidence',
      'Code on Social Security, 2020',
      'REVIEW',
      'CRITICAL',
      'Coverage and calculation depend on worker status, establishment coverage, wage definitions and current notifications. The product must not label a workforce compliant from a headcount threshold alone.',
      ['EPFO registration and ECR', 'ESIC registration and contribution records', 'Gratuity calculations/provisions', 'Employee master', 'Coverage/exclusion decisions'],
      sourceIds('mole-social-security-rules-2026', 'mole-labour-handbook-2026'),
      'Reconcile the employee master, payroll and statutory remittances; separately review fixed-term gratuity treatment.'
    ));

    if (profile.employeeCount >= 10) {
      controls.push(control(
        'posh-governance',
        'POSH governance and workplace coverage',
        'POSH Act, 2013',
        'REVIEW',
        'HIGH',
        'POSH governance must be tested at the workplace/entity level, including Internal Committee constitution where applicable, policy, training, complaint handling and reporting evidence. A corporate-wide count cannot substitute for workplace mapping.',
        ['Workplace/entity list', 'IC constitution/order', 'External member details', 'POSH policy', 'Training records', 'Annual report evidence', 'Complaint register controls'],
        sourceIds('wcd-legislation'),
        'Map every applicable workplace to its POSH governance record and preserve evidence without exposing complaint details unnecessarily.'
      ));
    }

    controls.push(control(
      'maternity-and-creche',
      'Maternity, nursing and crèche readiness',
      'Code on Social Security / maternity provisions',
      profile.employeeCount >= 10 ? 'REVIEW' : 'NOT_ASSESSED',
      'HIGH',
      'Maternity protections and related facilities require evidence-based testing. Crèche obligations can depend on establishment headcount and the applicable rules; do not infer compliance from a policy document alone.',
      ['Maternity policy', 'Leave records', 'Nursing-break process', 'Crèche arrangement/evidence where applicable', 'Vendor/service agreement where applicable'],
      sourceIds('mole-social-security-rules-2026', 'mole-labour-handbook-2026'),
      'Test maternity and nursing processes and determine crèche applicability for each establishment.'
    ));

    if (profile.hasContractWorkers) {
      controls.push(control(
        'contract-labour',
        'Contract-worker and vendor compliance',
        'OSHWC / contract labour',
        'REVIEW',
        'HIGH',
        'QSR and other multi-site operations often use vendors for housekeeping, security, maintenance or other services. Principal-employer and contractor obligations must be verified against the current Code, rules and state requirements.',
        ['Contractor register', 'Contracts/SOWs', 'Licences/registrations', 'Worker roster', 'Wage/payment evidence', 'Statutory remittance evidence'],
        sourceIds('mole-osh-rules-2026', 'mole-social-security-rules-2026'),
        'Create a vendor register with site assignment, worker count, licence/registration status and renewal dates.'
      ));
    }

    if (profile.hasNightShift) {
      controls.push(control(
        'night-shift-safety',
        'Night-shift safeguards',
        'OSHWC / applicable state rules',
        'REVIEW',
        'HIGH',
        'Night operations require an establishment-specific review of applicable state rules, worker consent/conditions where applicable, transport, security and incident controls. Do not treat a generic night-shift policy as proof.',
        ['Night-shift roster', 'Applicable state notification/rule', 'Transport SOP and vendor records', 'Security controls', 'Incident/escalation records'],
        sourceIds('mole-osh-rules-2026'),
        'Verify the current state-specific night-work conditions and test transport/security evidence for the actual operating sites.'
      ));
    }

    if (profile.hasWomenNightWork) {
      controls.push(control(
        'women-night-work',
        'Women night-work safeguards',
        'OSHWC / applicable state rules',
        'REVIEW',
        'CRITICAL',
        'Where women work at night, safeguards must be tested against the current central and state framework and actual site controls. This is particularly important for late-closing QSR outlets and delivery operations.',
        ['Consent/acknowledgement where applicable', 'Transport logs', 'Security/access controls', 'Site risk assessment', 'Applicable state rule/notification'],
        sourceIds('mole-osh-rules-2026'),
        'Run a site-level women-night-work checklist and verify the current state notification before scheduling shifts.'
      ));
    }

    if (profile.hasFixedTermWorkers) {
      controls.push(control(
        'fixed-term-gratuity',
        'Fixed-term employment and gratuity review',
        'Code on Social Security, 2020',
        'REVIEW',
        'HIGH',
        'Current Ministry FAQs state that fixed-term employees directly engaged by the employer can qualify for gratuity after one year of service. Contract labour through a contractor is a different legal category and must not be conflated with fixed-term employment.',
        ['Fixed-term contracts', 'Joining/exit dates', 'Gratuity calculations', 'Worker classification evidence'],
        sourceIds('mole-social-security-rules-2026', 'mole-labour-handbook-2026'),
        'Separate direct fixed-term employees from contractor labour and test gratuity treatment from the contract start date.'
      ));
    }

    if (profile.hasMigrantWorkers) {
      controls.push(control(
        'migrant-worker-governance',
        'Inter-state migrant worker safeguards',
        'OSHWC / applicable rules',
        'REVIEW',
        'HIGH',
        'Migrant-worker obligations depend on how workers are recruited and engaged. The system should collect classification and contractor evidence before applying any specific statutory benefit or threshold.',
        ['Worker origin/state data where lawfully collected', 'Recruitment/contractor records', 'Worker roster', 'Applicable state/central requirements'],
        sourceIds('mole-osh-rules-2026'),
        'Classify direct and contractor-engaged migrant workers and map the applicable statutory safeguards.'
      ));
    }

    if (profile.hasApprentices) {
      controls.push(control(
        'apprentice-governance',
        'Apprenticeship governance',
        'Apprentices Act / current rules',
        'REVIEW',
        'MODERATE',
        'Apprentices have a distinct legal status and should not be treated as ordinary employees or contract labour for every statutory purpose.',
        ['Apprenticeship contracts', 'Portal records', 'Stipend records', 'Training plan', 'Attendance/working-hour records'],
        sourceIds('mole-labour-handbook-2026'),
        'Verify apprenticeship classification, contract registration and stipend/working-hour records.'
      ));
    }

    if (profile.hasWorkersUnder18) {
      controls.push(control(
        'young-worker-safeguards',
        'Young-worker / age verification',
        'Child and adolescent labour / applicable employment law',
        'REVIEW',
        'CRITICAL',
        'Any workforce containing persons under 18 requires a dedicated age-verification and permitted-work review. QSR operators should never infer that a role is permissible from the employee title alone.',
        ['Age/identity verification process', 'Role and duty mapping', 'Working-hour records', 'Applicable state/central requirements'],
        sourceIds('mole-labour-handbook-2026'),
        'Run an age-verification and role eligibility review before assigning shifts or duties.'
      ));
    }

    if (isQsr) {
      controls.push(control(
        'qsr-operational-compliance',
        'QSR outlet operating-risk profile',
        'Evidence-first QSR controls',
        'REVIEW',
        'HIGH',
        'Restaurant operations create recurring compliance risk around outlet-by-outlet headcount, late hours, attendance, contract labour, young workers, women night work and state-specific establishment rules.',
        ['Outlet master', 'State/city mapping', 'Role catalogue', 'Shift patterns', 'Vendor register', 'Worker-category mapping'],
        sourceIds('mole-labour-codes-effective', 'mole-osh-rules-2026'),
        'Use one compliance profile per establishment/outlet or a controlled site cluster; do not assess an entire national network as one workplace.'
      ));
    }

    const sourcesFresh = INDIA_SOURCES.length > 0 && INDIA_SOURCES.every(source => isSourceFresh(source));
    controls.push(control(
      'source-freshness',
      'Regulatory source freshness',
      'Governance',
      sourcesFresh ? 'PASS' : 'REVIEW',
      'LOW',
      'This control only measures whether the registered source verification dates are current. It is not evidence that the company is legally compliant.',
      ['Source registry', 'Verification dates', 'Monitoring snapshot'],
      INDIA_SOURCES.map(s => s.id),
      'Refresh the source registry when a Gazette notification, rule, amendment or official clarification changes applicability.'
    ));
  } else {
    controls.push(control(
      'jurisdiction-support',
      'Jurisdiction support boundary',
      'Global framework',
      'NOT_ASSESSED',
      'HIGH',
      'The current evidence-first rule set is scoped to India. A non-India jurisdiction requires an authoritative source pack before a compliance conclusion can be made.',
      ['Authoritative jurisdiction source pack'],
      [],
      'Select an India jurisdiction or configure an authoritative source pack for the requested jurisdiction.'
    ));
  }

  return {
    assessedAt: new Date().toISOString(),
    engineVersion: '0.3.0-establishment-evidence-first',
    sourceVersion: COMPLIANCE_SOURCE_VERSION,
    profile,
    score: null,
    confidence: india ? 'LOW' : 'LOW',
    controls,
    caveats: [
      'This is an establishment-level compliance assessment aid, not a legal opinion or certification or filing submission.',
      'A REVIEW status means evidence, worker classification or jurisdiction-specific rules are required; it is not a finding of non-compliance.',
      'A numeric compliance score is intentionally withheld until verified evidence can support deterministic PASS/FAIL outcomes.',
      'For multi-site employers, assess each establishment/site or an explicitly controlled cluster; do not infer site-level compliance from corporate headcount.',
      'Primary legislation, notified rules, Gazette notifications and official government directions prevail over summaries and AI-generated text.'
    ]
  };
}
