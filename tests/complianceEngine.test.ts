import assert from 'node:assert/strict';
import test from 'node:test';
import { assessCompliance } from '../src/complianceEngine';
import { getJurisdictionProfile } from '../src/data/jurisdictionProfiles';
import { evidenceCanSupportPass, isEvidenceCurrent, EvidenceItem } from '../src/domain/evidence';
import { canonicalAuditPayload } from '../src/domain/auditTrail';

test('India assessment never turns missing evidence into PASS', () => {
  const result = assessCompliance({ jurisdiction: 'India - National', employeeCount: 25, establishmentType: 'office', hasContractWorkers: true, hasNightShift: true });
  assert.ok(result.controls.some(control => control.id === 'appointment-letters' && control.status === 'REVIEW'));
  assert.ok(result.controls.some(control => control.id === 'contract-labour' && control.status === 'REVIEW'));
  assert.ok(result.controls.some(control => control.id === 'night-shift-safety' && control.status === 'REVIEW'));
  assert.match(result.caveats.join(' '), /legal opinion or certification/i);
});

test('unsupported jurisdiction is not assessed as compliant', () => {
  const result = assessCompliance({ jurisdiction: 'United States - California', employeeCount: 25, establishmentType: 'office', hasContractWorkers: false, hasNightShift: false });
  assert.equal(result.controls[0]?.status, 'NOT_ASSESSED');
  assert.equal(result.score, null);
});

test('state profiles require authoritative source verification before conclusions', () => {
  const profile = getJurisdictionProfile('India - Maharashtra');
  assert.equal(profile?.status, 'SOURCE_REQUIRED');
  assert.ok(profile?.authoritativeSourceTypes.length);
});

test('accepted evidence with verification and a valid hash can support a pass', () => {
  const item: EvidenceItem = {
    id: 'ev-1', tenantId: 'tenant-1', controlId: 'appointment-letters', kind: 'DOCUMENT', title: 'Appointment letter',
    contentHash: 'sha256:abc', collectedAt: '2026-09-05T10:00:00Z', verifiedAt: '2026-09-05T10:05:00Z',
    expiresAt: '2027-09-05T10:05:00Z', status: 'ACCEPTED', verifiedBy: 'reviewer-1'
  };
  assert.equal(isEvidenceCurrent(item, new Date('2026-09-05T11:00:00Z')), true);
  assert.equal(evidenceCanSupportPass(item, new Date('2026-09-05T11:00:00Z')), true);
});

test('expired or rejected evidence cannot support a pass', () => {
  const base: EvidenceItem = {
    id: 'ev-2', tenantId: 'tenant-1', controlId: 'wage-definition', kind: 'PAYROLL', title: 'Payroll register',
    contentHash: 'sha256:def', collectedAt: '2026-01-01T00:00:00Z', verifiedAt: '2026-01-02T00:00:00Z',
    expiresAt: '2026-02-01T00:00:00Z', status: 'ACCEPTED'
  };
  assert.equal(evidenceCanSupportPass(base, new Date('2026-09-05T00:00:00Z')), false);
  assert.equal(evidenceCanSupportPass({ ...base, status: 'REJECTED' }, new Date('2026-01-15T00:00:00Z')), false);
});

test('audit payload canonicalization is deterministic', () => {
  const event = {
    id: 'audit-1', tenantId: 'tenant-1', actorId: 'user-1', action: 'ASSESSMENT_CREATED' as const,
    entityType: 'assessment', entityId: 'assessment-1', occurredAt: '2026-09-05T12:00:00Z',
    metadata: { sourceVersion: '2026-09-05' }, previousHash: null
  };
  assert.equal(canonicalAuditPayload(event), canonicalAuditPayload({ ...event }));
  assert.match(canonicalAuditPayload(event), /"tenantId":"tenant-1"/);
});
