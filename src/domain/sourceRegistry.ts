import { ComplianceSource } from '../data/complianceSources';

export type SourceRegistryIssueCode =
  | 'DUPLICATE_ID'
  | 'EMPTY_FIELD'
  | 'INVALID_URL'
  | 'INVALID_VERIFICATION_DATE'
  | 'INVALID_EFFECTIVE_DATE';

export interface SourceRegistryIssue {
  sourceId: string;
  code: SourceRegistryIssueCode;
  field: string;
}

export interface SourceRegistryIntegrity {
  valid: boolean;
  issues: SourceRegistryIssue[];
}

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && hasValue(url.hostname);
  } catch {
    return false;
  }
}

function isIsoDate(value: string): boolean {
  return /^\\d{4}-\\d{2}-\\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`));
}

export function validateSourceRegistry(sources: ComplianceSource[]): SourceRegistryIntegrity {
  const issues: SourceRegistryIssue[] = [];
  const seen = new Set<string>();

  for (const source of sources) {
    if (seen.has(source.id)) issues.push({ sourceId: source.id, code: 'DUPLICATE_ID', field: 'id' });
    seen.add(source.id);

    for (const field of ['id', 'title', 'authority', 'jurisdiction', 'url', 'lastVerified', 'notes'] as const) {
      if (!hasValue(source[field])) issues.push({ sourceId: source.id, code: 'EMPTY_FIELD', field });
    }

    if (!isHttpsUrl(source.url)) issues.push({ sourceId: source.id, code: 'INVALID_URL', field: 'url' });
    if (!isIsoDate(source.lastVerified)) issues.push({ sourceId: source.id, code: 'INVALID_VERIFICATION_DATE', field: 'lastVerified' });
    if (source.effectiveDate && !isIsoDate(source.effectiveDate)) issues.push({ sourceId: source.id, code: 'INVALID_EFFECTIVE_DATE', field: 'effectiveDate' });
  }

  return { valid: issues.length === 0, issues };
}
