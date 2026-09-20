import { ComplianceSource, isSourceFresh } from '../data/complianceSources';

/**
 * Applicability is deliberately a separate evidence-backed state. The platform
 * must not infer that a statute/rule applies merely because a jurisdiction or
 * employer profile was entered.
 */
export type ApplicabilityStatus =
  | 'NOT_ASSESSED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'APPLICABLE'
  | 'NOT_APPLICABLE'
  | 'CONFLICTING_EVIDENCE';

export interface ApplicabilityAssessment {
  id: string;
  requirementId: string;
  jurisdiction: string;
  status: ApplicabilityStatus;
  sourceIds: string[];
  evidenceIds: string[];
  assessedAt: string;
  assessedBy: string;
  rationale: string;
}

export interface ApplicabilityGate {
  status: 'BLOCKED' | 'READY_FOR_HUMAN_REVIEW';
  reasons: string[];
  verifiedSourceIds: string[];
}

/**
 * A gate for applicability decisions. It does not decide whether a law
 * applies; it only determines whether the supplied assessment has enough
 * current authoritative evidence to be reviewed by a human.
 */
export function evaluateApplicabilityAssessment(
  assessment: ApplicabilityAssessment,
  sources: ComplianceSource[],
  asOf = new Date()
): ApplicabilityGate {
  const reasons: string[] = [];
  const sourceById = new Map(sources.map(source => [source.id, source]));
  const verifiedSourceIds = assessment.sourceIds.filter(id => {
    const source = sourceById.get(id);
    return Boolean(source && isSourceFresh(source, asOf.toISOString().slice(0, 10)));
  });

  if (!assessment.id.trim()) reasons.push('ASSESSMENT_ID_REQUIRED');
  if (!assessment.requirementId.trim()) reasons.push('REQUIREMENT_ID_REQUIRED');
  if (!assessment.jurisdiction.trim()) reasons.push('JURISDICTION_REQUIRED');
  if (!assessment.assessedBy.trim()) reasons.push('HUMAN_REVIEWER_REQUIRED');
  if (!assessment.rationale.trim()) reasons.push('RATIONALE_REQUIRED');
  if (!Number.isFinite(Date.parse(assessment.assessedAt))) reasons.push('INVALID_ASSESSMENT_TIMESTAMP');
  if (assessment.sourceIds.length === 0) reasons.push('AUTHORITATIVE_SOURCE_REQUIRED');
  if (assessment.evidenceIds.length === 0) reasons.push('SUPPORTING_EVIDENCE_REQUIRED');
  if (assessment.sourceIds.some(id => !sourceById.has(id))) reasons.push('SOURCE_REGISTRY_ID_UNKNOWN');
  if (verifiedSourceIds.length !== assessment.sourceIds.length) reasons.push('AUTHORITATIVE_SOURCE_FRESHNESS_REQUIRED');
  if (assessment.status === 'NOT_ASSESSED') reasons.push('APPLICABILITY_NOT_ASSESSED');
  if (assessment.status === 'INSUFFICIENT_EVIDENCE') reasons.push('INSUFFICIENT_APPLICABILITY_EVIDENCE');
  if (assessment.status === 'CONFLICTING_EVIDENCE') reasons.push('CONFLICTING_APPLICABILITY_EVIDENCE');

  return {
    status: reasons.length === 0 ? 'READY_FOR_HUMAN_REVIEW' : 'BLOCKED',
    reasons,
    verifiedSourceIds,
  };
}
