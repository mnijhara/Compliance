import assert from 'node:assert/strict';
import test from 'node:test';
import { getStatutoryWorkflow, STATUTORY_WORKFLOWS, workflowCanAdvance } from '../src/domain/statutoryWorkflows';

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
