import assert from 'node:assert/strict';
import test from 'node:test';
import { COMPLIANCE_SOURCES } from '../src/data/complianceSources';
import { ApplicabilityAssessment, evaluateApplicabilityAssessment } from '../src/domain/applicability';

const baseAssessment = (overrides: Partial<ApplicabilityAssessment> = {}): ApplicabilityAssessment => ({
  id: 'assessment-1',
  requirementId: 'requirement-1',
  jurisdiction: 'India - Delhi',
  status: 'APPLICABLE',
  sourceIds: ['delhi-labour-department'],
  evidenceIds: ['evidence-1'],
  assessedAt: '2026-09-18T23:00:00.000Z',
  assessedBy: 'reviewer-1',
  rationale: 'Human-reviewed assessment supported by the cited source and evidence.',
  ...overrides,
});

test('applicability gate permits human review only with fresh authoritative evidence', () => {
  const result = evaluateApplicabilityAssessment(baseAssessment(), COMPLIANCE_SOURCES, new Date('2026-09-18T23:59:59.999Z'));
  assert.equal(result.status, 'READY_FOR_HUMAN_REVIEW');
  assert.deepEqual(result.verifiedSourceIds, ['delhi-labour-department']);
});

test('applicability gate blocks missing state source mapping', () => {
  const result = evaluateApplicabilityAssessment(baseAssessment({ sourceIds: [] }), COMPLIANCE_SOURCES);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reasons.includes('AUTHORITATIVE_SOURCE_REQUIRED'));
});

test('applicability gate blocks stale authority evidence', () => {
  const result = evaluateApplicabilityAssessment(baseAssessment(), COMPLIANCE_SOURCES, new Date('2027-01-01T00:00:00.000Z'));
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reasons.includes('AUTHORITATIVE_SOURCE_FRESHNESS_REQUIRED'));
  assert.deepEqual(result.verifiedSourceIds, []);
});

test('applicability gate blocks future-dated assessments', () => {
  const result = evaluateApplicabilityAssessment(
    baseAssessment({ assessedAt: '2026-09-19T00:00:00.000Z' }),
    COMPLIANCE_SOURCES,
    new Date('2026-09-18T23:59:59.999Z')
  );
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reasons.includes('ASSESSMENT_TIMESTAMP_IN_FUTURE'));
});

test('applicability gate blocks ambiguous or incomplete assessment states', () => {
  const result = evaluateApplicabilityAssessment(baseAssessment({
    status: 'CONFLICTING_EVIDENCE',
    evidenceIds: [],
    assessedBy: '',
    rationale: '',
  }), COMPLIANCE_SOURCES);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reasons.includes('SUPPORTING_EVIDENCE_REQUIRED'));
  assert.ok(result.reasons.includes('HUMAN_REVIEWER_REQUIRED'));
  assert.ok(result.reasons.includes('RATIONALE_REQUIRED'));
  assert.ok(result.reasons.includes('CONFLICTING_APPLICABILITY_EVIDENCE'));
});

test('applicability gate never accepts an unknown source id as authoritative', () => {
  const result = evaluateApplicabilityAssessment(baseAssessment({ sourceIds: ['unknown-source'] }), COMPLIANCE_SOURCES);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reasons.includes('SOURCE_REGISTRY_ID_UNKNOWN'));
  assert.ok(result.reasons.includes('AUTHORITATIVE_SOURCE_FRESHNESS_REQUIRED'));
  assert.deepEqual(result.verifiedSourceIds, []);
});
