export type AuditRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type CitationStatus = 'VERIFIED_SOURCE' | 'NEEDS_SOURCE_VERIFICATION' | 'NOT_APPLICABLE';

export interface AuditClause {
  id: string;
  clauseTitle: string;
  originalText: string;
  riskLevel: AuditRisk;
  sourceIds: string[];
  citationStatus: CitationStatus;
  issueDescription: string;
  suggestedFix: string;
}

export interface AuditResult {
  policyTitle: string;
  jurisdiction: string;
  summary: string;
  overallRiskTier: AuditRisk;
  clauses: AuditClause[];
}

const AUDIT_RISKS = new Set<AuditRisk>(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']);
const AUDIT_CITATION_STATUSES = new Set<CitationStatus>(['VERIFIED_SOURCE', 'NEEDS_SOURCE_VERIFICATION', 'NOT_APPLICABLE']);
const MAX_AUDIT_STRING_CHARS = 12_000;

function requireBoundedString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > MAX_AUDIT_STRING_CHARS) {
    throw new Error(`AI audit response has an invalid ${field}`);
  }
  return value;
}

export function validateAuditResult(value: unknown, sourceIds: ReadonlySet<string>): AuditResult {
  if (!value || typeof value !== 'object') throw new Error('AI audit returned a non-object response');
  const result = value as Partial<AuditResult>;
  const policyTitle = requireBoundedString(result.policyTitle, 'policyTitle');
  const jurisdiction = requireBoundedString(result.jurisdiction, 'jurisdiction');
  const summary = requireBoundedString(result.summary, 'summary');
  if (!Array.isArray(result.clauses)) throw new Error('AI audit response failed schema validation: clauses must be an array');
  if (result.clauses.length > 100) throw new Error('AI audit response contains too many clauses');
  if (!AUDIT_RISKS.has(result.overallRiskTier as AuditRisk)) throw new Error('AI audit response has an invalid overallRiskTier');

  const clauses = result.clauses.map((clause, index) => {
    if (!clause || typeof clause !== 'object') throw new Error(`AI audit returned an invalid clause at index ${index}`);
    const candidate = clause as Partial<AuditClause>;
    const id = requireBoundedString(candidate.id, `clause[${index}].id`);
    const clauseTitle = requireBoundedString(candidate.clauseTitle, `clause[${index}].clauseTitle`);
    const originalText = requireBoundedString(candidate.originalText, `clause[${index}].originalText`);
    const issueDescription = requireBoundedString(candidate.issueDescription, `clause[${index}].issueDescription`);
    const suggestedFix = requireBoundedString(candidate.suggestedFix, `clause[${index}].suggestedFix`);
    if (!AUDIT_RISKS.has(candidate.riskLevel as AuditRisk)) throw new Error(`AI audit response has an invalid riskLevel at clause ${index}`);
    if (!AUDIT_CITATION_STATUSES.has(candidate.citationStatus as CitationStatus)) throw new Error(`AI audit response has an invalid citationStatus at clause ${index}`);
    if (!Array.isArray(candidate.sourceIds) || candidate.sourceIds.some(id => typeof id !== 'string' || id.length > 200)) throw new Error(`AI audit response has invalid sourceIds at clause ${index}`);
    const verifiedIds = [...new Set(candidate.sourceIds.filter(id => sourceIds.has(id)))];
    const citationStatus: CitationStatus = candidate.citationStatus === 'NOT_APPLICABLE'
      ? 'NOT_APPLICABLE'
      : verifiedIds.length > 0 && candidate.citationStatus === 'VERIFIED_SOURCE'
        ? 'VERIFIED_SOURCE'
        : 'NEEDS_SOURCE_VERIFICATION';
    return { id, clauseTitle, originalText, riskLevel: candidate.riskLevel as AuditRisk, sourceIds: verifiedIds, citationStatus, issueDescription, suggestedFix };
  });

  return { policyTitle, jurisdiction, summary, overallRiskTier: result.overallRiskTier as AuditRisk, clauses };
}
