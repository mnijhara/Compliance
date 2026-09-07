import assert from 'node:assert/strict';
import test from 'node:test';
import { getJurisdictionCoverage } from '../src/data/jurisdictionCoverage';
import { assessCompliance } from '../src/complianceEngine';

test('registered states expose partial evidence coverage, not legal applicability', () => {
  const coverage = getJurisdictionCoverage('Delhi');
  assert.equal(coverage.jurisdiction, 'India - Delhi');
  assert.equal(coverage.status, 'PARTIAL');
  assert.deepEqual(coverage.sourceIds, ['delhi-labour-department', 'delhi-shops-establishments-act']);
  assert.equal(coverage.lastVerified, '2026-09-06');
});

test('unknown states fail closed instead of inheriting another state\'s rules', () => {
  const coverage = getJurisdictionCoverage('Rajasthan');
  assert.equal(coverage.status, 'NOT_VERIFIED');
  assert.deepEqual(coverage.sourceIds, []);
  assert.equal(coverage.lastVerified, null);
});

test('missing state is explicitly not verified', () => {
  const coverage = getJurisdictionCoverage('');
  assert.equal(coverage.status, 'NOT_VERIFIED');
  assert.equal(coverage.jurisdiction, 'India - state unspecified');
});

test('assessment surfaces partial state applicability as a caveat', () => {
  const assessment = assessCompliance({
    jurisdiction: 'India',
    state: 'Delhi',
    employeeCount: 20,
    establishmentType: 'shop',
    hasContractWorkers: false,
    hasNightShift: false
  });

  assert.equal(assessment.score, null);
  assert.ok(assessment.caveats.some(caveat => caveat.includes('India - Delhi') && caveat.includes('not fully mapped')));
});
