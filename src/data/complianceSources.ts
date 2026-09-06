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
 * Primary-source registry. AI output is never a legal source; these records
 * provide traceability and a verification anchor for evidence-first controls.
 */
export const COMPLIANCE_SOURCES: ComplianceSource[] = [
  {
    id: 'mole-labour-handbook-2026',
    title: 'Compliance Handbook for the Labour Codes',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://www.labour.gov.in/static/uploads/2026/02/83978455025732b99b0165def80ab171.pdf',
    lastVerified: '2026-09-06',
    notes: 'Employer reference handbook; enacted Codes and applicable Rules prevail if there is a discrepancy.'
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
    id: 'mole-code-wages-rules-2026',
    title: 'Code on Wages (Central) Rules, 2026',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://www.labour.gov.in/static/uploads/2026/05/6eb0c35ba63b776487a025e5123b6b12.pdf',
    effectiveDate: '2026-05-08',
    lastVerified: '2026-09-06',
    notes: 'Official Gazette rules. State rules and establishment-specific applicability must also be checked.'
  },
  {
    id: 'mole-social-security-rules-2026',
    title: 'Code on Social Security (Central) Rules, 2026',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://www.labour.gov.in/static/uploads/2026/05/49aa9b62c2125499c37399b90e969d67.pdf',
    effectiveDate: '2026-05-08',
    lastVerified: '2026-09-06',
    notes: 'Official Gazette rules superseding the listed central rules; current notifications and state provisions remain relevant.'
  },
  {
    id: 'mole-ir-rules-2026',
    title: 'Industrial Relations (Central) Rules, 2026',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://www.labour.gov.in/static/uploads/2026/05/f05a2c220dcdec0ea9c55e84d9ff791f.pdf',
    effectiveDate: '2026-05-08',
    lastVerified: '2026-09-06',
    notes: 'Official Gazette rules under the Industrial Relations Code, 2020.'
  },
  {
    id: 'mole-osh-rules-2026',
    title: 'Occupational Safety, Health and Working Conditions (Central) Rules, 2026',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://www.labour.gov.in/static/uploads/2026/05/ee246f790cad0b8e99c3828f34fa09a6.pdf',
    effectiveDate: '2026-05-08',
    lastVerified: '2026-09-06',
    notes: 'Official Gazette rules. State-specific Shops/Establishments and other applicable rules must also be verified.'
  },
  {
    id: 'mole-annual-report-2024-25',
    title: 'Ministry of Labour & Employment Annual Report 2024-25',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://labour.gov.in/sites/default/files/arenglish2024-25_compressed.pdf',
    lastVerified: '2026-09-06',
    notes: 'Background and implementation context; not a substitute for operative legislation or rules.'
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
    notes: 'Official Delhi labour authority portal. Current Acts, Rules, Gazette notifications and department notices must be checked.'
  },
  {
    id: 'delhi-shops-establishments-act',
    title: 'Delhi Shops & Establishments Act, 1954',
    authority: 'Labour Department, Government of NCT of Delhi',
    jurisdiction: 'India - Delhi',
    url: 'https://labour.delhi.gov.in/labour/delhi-shops-and-establishments-act1954',
    lastVerified: '2026-09-06',
    notes: 'Official Delhi departmental publication. Current notifications and exemptions must be checked before applying a provision.'
  },
  {
    id: 'karnataka-labour-district-department',
    title: 'Department of Labour, Government of Karnataka — District Labour Office',
    authority: 'Government of Karnataka, Department of Labour',
    jurisdiction: 'India - Karnataka',
    url: 'https://kodagu.nic.in/en/department-of-labour/',
    lastVerified: '2026-09-06',
    notes: 'Official Karnataka government labour-department page. Use current state Gazette and department notifications for operative rules.'
  },
  {
    id: 'karnataka-labour-welfare-board',
    title: 'Karnataka Labour Welfare Fund Act and Rules — 2025-26',
    authority: 'Government of Karnataka, Labour Department / Karnataka Labour Welfare Board',
    jurisdiction: 'India - Karnataka',
    url: 'https://klwb.karnataka.gov.in/storage/pdf-files/NewLabourDept_English_Final_2%2C2025-26.pdf',
    lastVerified: '2026-09-06',
    notes: 'Official Karnataka Labour Welfare Board publication. Use operative Act, Rules and Gazette notifications for conclusions.'
  },
  {
    id: 'maharashtra-labour-commissioner',
    title: 'Commissioner of Labour, Government of Maharashtra',
    authority: 'Commissioner of Labour, Government of Maharashtra',
    jurisdiction: 'India - Maharashtra',
    url: 'https://mahakamgar.maharashtra.gov.in/',
    lastVerified: '2026-09-06',
    notes: 'Official Maharashtra labour authority portal. Current state rules, notifications and orders must be mapped to each control.'
  }
];

export const COMPLIANCE_SOURCE_VERSION = '2026-09-06';

export function isSourceFresh(source: ComplianceSource, asOf = COMPLIANCE_SOURCE_VERSION): boolean {
  const verifiedAt = Date.parse(source.lastVerified);
  const registryAsOf = Date.parse(asOf);
  return Number.isFinite(verifiedAt) && Number.isFinite(registryAsOf) && verifiedAt >= registryAsOf;
}
