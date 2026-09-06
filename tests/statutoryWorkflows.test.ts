import assert from 'node:assert/strict';
import test from 'node:test';
import { COMPLIANCE_SOURCES } from '../src/data/complianceSources';
import { EvidenceItem } from '../src/domain/evidence';
import { evaluateWorkflowStep, getStatutoryWorkflow, STATUTORY_WORKFLOWS, workflowCanAdvance } from '../src/domain/statutoryWorkflows';

const acceptedEvidence = (controlId: string): EvidenceItem => ({
  id: `evidence-${controlId}`,
  tenantId: 'tenant-test',
  controlId,
  kind: 'DOCUMENT',
  title: 'Verified evidence',
  contentHash: 'sha256:test',
  collectedAt: '2026-09-06T00:00:00.000Z',
  verifiedAt: '2026-09-06T00:01:00.000Z',
  status: 'ACCEPTED',
  verifiedBy: 'reviewer-test'
});

test('Labour Code workflow is evidence-first and requires human verification', () => {
  const workflow = getStatutoryWorkflow('labour-code-readiness');
  assert.ok(workflow);
  assert.equal(workflow.jurisdiction, 'India - National');
  assert.ok(workflow.steps.length >= 4);
  assert.ok(workflow.steps.every(step => step.verificationRequired));
  assert.match(workflow.disclaimer, /not a legal opinion/i);
});

test('workflow never treats an empty evidence requirement as advanceable', () => {
  const workflow = STATUTORY_WORKFLOWS[0];
  assert.ok(workflow);
  const stateStep = workflow.steps.find(step => step.id === 'state-applicability');
  assert.ok(stateStep);
  assert.equal(stateStep.sourceIds.length, 0);
  assert.equal(workflowCanAdvance({ ...stateStep, requiredEvidence: [] }), false);
});

test('workflow advancement remains explicit rather than automatic completion', () => {
  const workflow = STATUTORY_WORKFLOWS[0];
  assert.ok(workflow);
  const profileStep = workflow.steps[0];
  assert.equal(profileStep.status, 'EVIDENCE_REQUIRED');
  assert.equal(workflowCanAdvance(profileStep), true);
  assert.notEqual(profileStep.status, 'COMPLETED');
});

test('workflow gate blocks without current evidence', () => {
  const workflow = STATUTORY_WORKFLOWS[0];
  assert.ok(workflow);
  const step = workflow.steps.find(item => item.id === 'employer-profile');
  assert.ok(step);
  const result = evaluateWorkflowStep(step, [], COMPLIANCE_SOURCES);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reasons.includes('CURRENT_EVIDENCE_REQUIRED'));
});

test('workflow gate permits review only with current evidence and fresh authoritative sources', () => {
  const workflow = STATUTORY_WORKFLOWS[0];
  assert.ok(workflow);
  const step = workflow.steps.find(item => item.id === 'employer-profile');
  assert.ok(step);
  const evidence = [acceptedEvidence(step.id)];
  const result = evaluateWorkflowStep(step, evidence, COMPLIANCE_SOURCES);
  assert.equal(result.status, 'READY_FOR_REVIEW');
  assert.deepEqual(result.currentEvidenceIds, [evidence[0].id]);
  assert.deepEqual(result.verifiedSourceIds, step.sourceIds);
});

test('state applicability remains blocked until an authoritative source is mapped', () => {
  const workflow = STATUTORY_WORKFLOWS[0];
  assert.ok(workflow);
  const step = workflow.steps.find(item => item.id === 'state-applicability');
  assert.ok(step);
  const result = evaluateWorkflowStep(step, [acceptedEvidence(step.id)], COMPLIANCE_SOURCES);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reasons.includes('AUTHORITATIVE_SOURCE_REQUIRED'));
});

test('workflow source freshness respects the evaluation timestamp', () => {
  const workflow = STATUTORY_WORKFLOWS[0];
  assert.ok(workflow);
  const step = workflow.steps.find(item => item.id === 'employer-profile');
  assert.ok(step);
  const evidence = [acceptedEvidence(step.id)];
  const future = new Date('2027-01-01T00:00:00.000Z');
  const result = evaluateWorkflowStep(step, evidence, COMPLIANCE_SOURCES, future);
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reasons.includes('AUTHORITATIVE_SOURCE_FRESHNESS_REQUIRED'));
  assert.deepEqual(result.verifiedSourceIds, []);
});
