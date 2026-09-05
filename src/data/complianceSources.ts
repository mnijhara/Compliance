export interface ComplianceSource {
  id: string;
  title: string;
  authority: string;
  jurisdiction: string;
  url: string;
  effectiveDate?: string;
  lastVerified: string;
  notes: string;
}

/**
 * Source registry for the compliance engine. AI output must never be treated as
 * the primary legal source; these records provide the traceability layer.
 */
export const COMPLIANCE_SOURCES: ComplianceSource[] = [
  {
    id: 'mole-labour-handbook-2026',
    title: 'Compliance Handbook for the Labour Codes',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://www.labour.gov.in/static/uploads/2026/02/83978455025732b99b0165def80ab171.pdf',
    lastVerified: '2026-09-06',
    notes: 'Employer reference handbook; the enacted Codes and applicable Rules prevail if there is a discrepancy.'
  },
  {
    id: 'mole-labour-codes-effective',
    title: 'Implementation of the Four Labour Codes',
    authority: 'Ministry of Labour & Employment / Press Information Bureau',
    jurisdiction: 'India - National',
    url: 'https://labour.gov.in/sites/default/files/pib2200433.pdf',
    effectiveDate: '2025-11-21',
    lastVerified: '2026-09-06',
    notes: 'Official government release confirming implementation of the four Labour Codes from 21 November 2025.'
  },
  {
    id: 'mole-annual-report-2024-25',
    title: 'Ministry of Labour & Employment Annual Report 2024-25',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://labour.gov.in/sites/default/files/arenglish2024-25_compressed.pdf',
    lastVerified: '2026-09-06',
    notes: 'Background and implementation context for the four Labour Codes and state rule-making.'
  },
  {
    id: 'wcd-legislation',
    title: 'Acts, Rules and Regulations',
    authority: 'Ministry of Women & Child Development, Government of India',
    jurisdiction: 'India - National',
    url: 'https://www.spniwcd.wcd.gov.in/legislation1',
    lastVerified: '2026-09-06',
    notes: 'Official WCD legislation repository. Use primary legislation and notified rules for legal conclusions.'
  },
  {
    id: 'delhi-labour-department',
    title: 'Labour Department, Government of NCT of Delhi',
    authority: 'Labour Commissioner, Government of NCT of Delhi',
    jurisdiction: 'India - Delhi',
    url: 'https://labour.delhi.gov.in/',
    lastVerified: '2026-09-06',
    notes: 'Official Delhi labour authority portal. Use the current Acts, Rules, Gazette notifications and department notices linked from this portal.'
  },
  {
    id: 'delhi-shops-establishments-act',
    title: 'Delhi Shops & Establishments Act, 1954',
    authority: 'Labour Department, Government of NCT of Delhi',
    jurisdiction: 'India - Delhi',
    url: 'https://labour.delhi.gov.in/labour/delhi-shops-act-1954',
    lastVerified: '2026-09-06',
    notes: 'Primary Delhi departmental publication. Current notifications and exemptions must be checked before applying any provision.'
  },
  {
    id: 'karnataka-labour-district-department',
    title: 'Department of Labour, Government of Karnataka — District Labour Office',
    authority: 'Government of Karnataka, Department of Labour',
    jurisdiction: 'India - Karnataka',
    url: 'https://kodagu.nic.in/en/department-of-labour/',
    lastVerified: '2026-09-06',
    notes: 'Official Karnataka government labour-department page. Use the current state Gazette and department notifications for operative rules and applicability.'
  },
  {
    id: 'karnataka-labour-welfare-board',
    title: 'Karnataka Labour Welfare Fund Act and Rules — 2025-26',
    authority: 'Government of Karnataka, Labour Department / Karnataka Labour Welfare Board',
    jurisdiction: 'India - Karnataka',
    url: 'https://klwb.karnataka.gov.in/storage/pdf-files/NewLabourDept_English_Final_2%2C2025-26.pdf',
    lastVerified: '2026-09-06',
    notes: 'Official Karnataka Labour Welfare Board publication. Use the operative Act, Rules and Gazette notifications for statutory conclusions.'
  },
  {
    id: 'maharashtra-labour-commissioner',
    title: 'Commissioner of Labour, Government of Maharashtra',
    authority: 'Commissioner of Labour, Government of Maharashtra',
    jurisdiction: 'India - Maharashtra',
    url: 'https://mahakamgar.maharashtra.gov.in/',
    lastVerified: '2026-09-06',
    notes: 'Official Maharashtra labour authority portal, including minimum wage, new Codes and rules, construction-worker and other labour resources.'
  }
];

export const COMPLIANCE_SOURCE_VERSION = '2026-09-06';

export function isSourceFresh(source: ComplianceSource, asOf = COMPLIANCE_SOURCE_VERSION): boolean {
  const verifiedAt = Date.parse(source.lastVerified);
  const registryAsOf = Date.parse(asOf);
  return Number.isFinite(verifiedAt) && Number.isFinite(registryAsOf) && verifiedAt >= registryAsOf;
}
