import assert from 'node:assert/strict';
import test from 'node:test';
import { assessCompliance } from '../src/complianceEngine';

test('state-specific assessments expose a dedicated applicability verification control', () => {
  const result = assessCompliance({
    jurisdiction: 'India - Maharashtra',
    state: 'Maharashtra',
    employeeCount: 20,
    establishmentType: 'shop',
    hasContractWorkers: true,
    hasNightShift: true,
  });

  const control = result.controls.find(item => item.id === 'state-applicability-evidence');
  assert.ok(control);
  assert.equal(control.status, 'REVIEW');
  assert.equal(control.risk, 'HIGH');
  assert.ok(control.sourceIds.includes('maharashtra-labour-commissioner'));
  assert.match(control.nextAction, /verification date/i);
  assert.equal(result.score, null);
});

test('unprofiled Indian states cannot silently inherit national applicability', () => {
  const result = assessCompliance({
    jurisdiction: 'India - Tamil Nadu',
    employeeCount: 10,
    establishmentType: 'shop',
    hasContractWorkers: false,
    hasNightShift: false,
  });

  const control = result.controls.find(item => item.id === 'state-applicability-evidence');
  assert.ok(control);
  assert.equal(control.status, 'NOT_ASSESSED');
  assert.deepEqual(control.sourceIds, []);
  assert.match(control.rationale, /must not infer state-law applicability/i);
});
