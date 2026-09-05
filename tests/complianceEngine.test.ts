import assert from 'node:assert/strict';
import test from 'node:test';
import { assessCompliance } from '../src/complianceEngine';
import { getJurisdictionProfile } from '../src/data/jurisdictionProfiles';

test('India assessment never turns missing evidence into PASS', () => {
  const result = assessCompliance({
    jurisdiction: 'India - National',
    employeeCount: 25,
    establishmentType: 'office',
    hasContractWorkers: true,
    hasNightShift: true
  });

  assert.ok(result.controls.some(control => control.id === 'appointment-letters' && control.status === 'REVIEW'));
  assert.ok(result.controls.some(control => control.id === 'contract-labour' && control.status === 'REVIEW'));
  assert.ok(result.controls.some(control => control.id === 'night-shift-safety' && control.status === 'REVIEW'));
  assert.match(result.caveats.join(' '), /legal opinion or certification/i);
});

test('unsupported jurisdiction is not assessed as compliant', () => {
  const result = assessCompliance({
    jurisdiction: 'United States - California',
    employeeCount: 25,
    establishmentType: 'office',
    hasContractWorkers: false,
    hasNightShift: false
  });

  assert.equal(result.controls[0]?.status, 'NOT_ASSESSED');
  assert.equal(result.score, null);
});

test('state profiles require authoritative source verification before conclusions', () => {
  const profile = getJurisdictionProfile('India - Maharashtra');
  assert.equal(profile?.status, 'SOURCE_REQUIRED');
  assert.ok(profile?.authoritativeSourceTypes.length);
});
