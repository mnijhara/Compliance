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
    lastVerified: '2026-09-05',
    notes: 'Employer reference handbook; the enacted Codes and applicable Rules prevail if there is a discrepancy.'
  },
  {
    id: 'mole-labour-codes-effective',
    title: 'Implementation of the Four Labour Codes',
    authority: 'Ministry of Labour & Employment / Press Information Bureau',
    jurisdiction: 'India - National',
    url: 'https://labour.gov.in/sites/default/files/pib2200433.pdf',
    effectiveDate: '2025-11-21',
    lastVerified: '2026-09-05',
    notes: 'Official government release confirming implementation of the four Labour Codes from 21 November 2025.'
  },
  {
    id: 'mole-annual-report-2024-25',
    title: 'Ministry of Labour & Employment Annual Report 2024-25',
    authority: 'Ministry of Labour & Employment, Government of India',
    jurisdiction: 'India - National',
    url: 'https://labour.gov.in/sites/default/files/arenglish2024-25_compressed.pdf',
    lastVerified: '2026-09-05',
    notes: 'Background and implementation context for the four Labour Codes and state rule-making.'
  },
  {
    id: 'wcd-legislation',
    title: 'Acts, Rules and Regulations',
    authority: 'Ministry of Women & Child Development, Government of India',
    jurisdiction: 'India - National',
    url: 'https://www.spniwcd.wcd.gov.in/legislation1',
    lastVerified: '2026-09-05',
    notes: 'Official WCD legislation repository. Use primary legislation and notified rules for legal conclusions.'
  }
];

export const COMPLIANCE_SOURCE_VERSION = '2026-09-05';

export function isSourceFresh(source: ComplianceSource, asOf = COMPLIANCE_SOURCE_VERSION): boolean {
  const verifiedAt = Date.parse(source.lastVerified);
  const registryAsOf = Date.parse(asOf);
  return Number.isFinite(verifiedAt) && Number.isFinite(registryAsOf) && verifiedAt >= registryAsOf;
}
