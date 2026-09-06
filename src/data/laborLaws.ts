import { LaborLawItem } from '../types';

/**
 * High-confidence statutory reference catalog.
 *
 * This intentionally avoids reproducing legacy forms, penalties and state
 * thresholds that require a control-specific primary-source mapping. The
 * Control Center is the place for applicability/evidence decisions.
 */
export const LABOR_LAWS_DATA: LaborLawItem[] = [
  {
    id: 'code-on-wages-2019',
    title: 'Code on Wages, 2019',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Current central wage framework. Minimum wages apply across employee categories, and statutory wage calculations use the Code definition of wages.',
    keyMandates: [
      'Minimum wages are universalised across employees under the Code.',
      'The statutory definition of wages can require excess excluded allowances to be added back when the prescribed proportion is exceeded.',
      'Overtime under the Code is payable at not less than twice the normal rate where the Code provisions apply.',
      'Wage-payment and deduction controls must be tested against the current Code and 2026 Central Rules.'
    ],
    penaltyDetails: 'Penalty outcomes are not displayed here because the applicable offence, facts and current enforcement provisions must be verified against the operative Code, Rules and notifications.',
    applicability: 'Establishment- and worker-specific. State rules and the appropriate government must be mapped before a conclusion is issued.',
    lastUpdated: 'Source registry verified 06 Sep 2026',
    statutoryForm: 'Use the current Code on Wages (Central) Rules, 2026 schedules/forms where applicable; verify the operative state form.'
  },
  {
    id: 'code-social-security-2020',
    title: 'Code on Social Security, 2020',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Current central social-security framework covering EPF, ESI, gratuity, maternity and related social-security provisions, subject to applicability rules and notifications.',
    keyMandates: [
      'EPF and ESI coverage must be determined from the current Code, Rules, notifications and establishment facts.',
      'The current framework uses a common statutory wage definition for relevant calculations.',
      'Direct fixed-term employees can have gratuity rights after one year of service under the current Code framework and Ministry clarifications.',
      'Maternity and crèche obligations must be tested against the current Code and rules for the establishment.'
    ],
    penaltyDetails: 'Do not infer a penalty amount from a generic catalogue. Verify the specific offence and current enforcement provision before escalation.',
    applicability: 'Depends on establishment, worker status, wage, headcount and current notifications. Contractor labour and direct fixed-term employment must not be conflated.',
    lastUpdated: 'Source registry verified 06 Sep 2026',
    statutoryForm: 'Use the current Social Security (Central) Rules, 2026 schedules and official EPFO/ESIC portals.'
  },
  {
    id: 'industrial-relations-code-2020',
    title: 'Industrial Relations Code, 2020',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Contract Labor',
    shortSummary: 'Current central framework for industrial relations, standing orders, trade unions and industrial disputes, with applicability dependent on establishment and worker status.',
    keyMandates: [
      'Standing-order and industrial-relations requirements must be tested against the current Code and 2026 Central Rules.',
      'Strike/lockout notice and dispute processes are governed by the current Code framework rather than a legacy-only checklist.',
      'Retrenchment, closure and worker re-skilling obligations require a fact-specific review before action.',
      'Collective-bargaining and worker-representation controls should be mapped to the establishment and worker population.'
    ],
    penaltyDetails: 'Verify the specific offence and current enforcement provision from the Code and Central Rules; no generic fine is asserted.',
    applicability: 'Fact-specific. Do not assume that an office, retail outlet or QSR site is an industrial establishment for every provision.',
    lastUpdated: 'Source registry verified 06 Sep 2026',
    statutoryForm: 'Use the Industrial Relations (Central) Rules, 2026 schedules/forms where applicable.'
  },
  {
    id: 'oshwc-code-2020',
    title: 'Occupational Safety, Health and Working Conditions Code, 2020',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Workplace Safety & POSH',
    shortSummary: 'Current central workplace-safety and working-conditions framework. The 2026 Central Rules provide current forms and operational requirements.',
    keyMandates: [
      'Appointment-letter and establishment-registration controls must be tested using the current Code and Rules.',
      'Working conditions, health, safety and welfare obligations depend on the establishment and worker category.',
      'Night work and women night-work safeguards require current state-specific verification in addition to central requirements.',
      'Contract-labour and inter-state migrant-worker obligations require worker classification and contractor evidence.'
    ],
    penaltyDetails: 'No generic penalty is asserted. Verify the specific offence, facts and current enforcement provision before escalation.',
    applicability: 'Establishment- and worker-specific; state rules and notifications may add conditions.',
    lastUpdated: 'Source registry verified 06 Sep 2026',
    statutoryForm: 'Use the Occupational Safety, Health and Working Conditions (Central) Rules, 2026 annexures/forms where applicable.'
  },
  {
    id: 'posh-act-2013',
    title: 'Sexual Harassment of Women at Workplace (POSH) Act, 2013',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Workplace Safety & POSH',
    shortSummary: 'Central workplace framework for prevention, prohibition and redressal of sexual harassment, including Internal Committee governance where applicable.',
    keyMandates: [
      'Employers must maintain workplace prevention and redressal arrangements required by the Act.',
      'Internal Committee constitution and composition must be tested at the applicable workplace level.',
      'Complaint inquiry and confidentiality requirements must be handled through the statutory process.',
      'Annual-reporting obligations should be tracked from the Act/rules and the applicable District Officer process rather than a generic universal date.'
    ],
    penaltyDetails: 'Verify the specific non-compliance provision in Section 26 and current applicable rules before stating a fine or business consequence.',
    applicability: 'Workplace-specific. Headcount, workplace structure and complaint jurisdiction must be verified.',
    lastUpdated: 'Source registry verified 06 Sep 2026',
    statutoryForm: 'Use the operative POSH Act/Rules and applicable District Officer format; ComplyOS does not present a fabricated official form.'
  },
  {
    id: 'epfo-current-reference',
    title: 'EPFO / EPF current employer reference',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Operational EPF reference anchored to the current EPFO employer resources and the Code on Social Security framework.',
    keyMandates: [
      'The commonly applicable EPF contribution rate remains 12% for employee contribution, subject to the governing scheme and applicable wage base.',
      'The statutory wage ceiling used for standard EPF contribution calculations is currently ₹15,000 per month; higher-wage contribution arrangements require separate verification.',
      'ECR processes and validations should be checked against the current EPFO system rather than a legacy Form 5/10 checklist.',
      'Employee master, UAN, wage and contribution reconciliation should be retained as evidence.'
    ],
    penaltyDetails: 'Interest/damages and enforcement must be calculated from the current EPFO rules/orders and actual delay; no generic penalty is asserted.',
    applicability: 'Establishment and member-specific. Verify coverage, excluded employees and higher-wage options from EPFO guidance.',
    lastUpdated: 'EPFO reference verified 06 Sep 2026',
    statutoryForm: 'Current EPFO ECR / employer portal workflows.'
  },
  {
    id: 'esic-current-reference',
    title: 'ESIC current employer reference',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Operational ESIC reference for coverage and contribution controls, anchored to current ESIC resources.',
    keyMandates: [
      'Current ESIC guidance states employer contribution of 3.25% and employee contribution of 0.75% of wages for covered employees.',
      'Current ESIC guidance states a ₹21,000 monthly wage threshold for ordinary coverage, subject to the governing law and current notifications.',
      'Coverage must be tested by establishment and employee facts rather than gross salary alone.',
      'ESIC registration, contribution and reconciliation evidence should be retained.'
    ],
    penaltyDetails: 'Verify current interest, damages and offence provisions from ESIC/Code sources for the actual event.',
    applicability: 'Establishment and employee-specific; confirm notified establishment coverage and wage basis.',
    lastUpdated: 'ESIC reference verified 06 Sep 2026',
    statutoryForm: 'Use the current ESIC employer portal and applicable return workflows.'
  }
];
