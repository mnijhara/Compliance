import assert from 'node:assert/strict';
import test from 'node:test';
import { assessCompliance } from '../src/complianceEngine';
import { getJurisdictionProfile } from '../src/data/jurisdictionProfiles';
import { COMPLIANCE_SOURCE_VERSION, isSourceFresh } from '../src/data/complianceSources';
import { evidenceCanSupportPass, isEvidenceCurrent, EvidenceItem } from '../src/domain/evidence';
import { canonicalAuditPayload } from '../src/domain/auditTrail';
import { createRateLimiter, isNonEmptyString, MAX_DOCUMENT_CHARS } from '../src/security/inputGuards';

test('India assessment never turns missing evidence into PASS or a numeric score', () => {
  const result = assessCompliance({ jurisdiction: 'India - National', employeeCount: 25, establishmentType: 'office', hasContractWorkers: true, hasNightShift: true });
  assert.ok(result.controls.some(control => control.id === 'appointment-letters' && control.status === 'REVIEW'));
  assert.ok(result.controls.some(control => control.id === 'contract-labour' && control.status === 'REVIEW'));
  assert.ok(result.controls.some(control => control.id === 'night-shift-safety' && control.status === 'REVIEW'));
  assert.equal(result.score, null);
  assert.match(result.caveats.join(' '), /legal opinion, certification or filing submission/i);
});

test('state profiles require authoritative source verification before conclusions', () => {
  const profile = getJurisdictionProfile('India - Maharashtra');
  assert.equal(profile?.status, 'SOURCE_REQUIRED');
  assert.ok(profile?.authoritativeSourceTypes.length);
  assert.ok(profile?.authoritativeSourceIds.includes('maharashtra-labour-commissioner'));
});

test('all configured state profiles map to known source registry IDs', async () => {
  const { COMPLIANCE_SOURCES } = await import('../src/data/complianceSources');
  const sourceIds = new Set(COMPLIANCE_SOURCES.map(source => source.id));
  for (const jurisdiction of ['India - Delhi', 'India - Karnataka', 'India - Maharashtra']) {
    const profile = getJurisdictionProfile(jurisdiction);
    assert.ok(profile);
    assert.ok(profile.authoritativeSourceIds.length > 0);
    for (const sourceId of profile.authoritativeSourceIds) assert.equal(sourceIds.has(sourceId), true, `${jurisdiction} references unknown source ${sourceId}`);
  }
});

test('source freshness compares actual dates rather than strings', () => {
  assert.equal(COMPLIANCE_SOURCE_VERSION, '2026-09-06');
  const source = { id: 'test', title: 'test', authority: 'test', jurisdiction: 'India - National', url: 'https://example.com', lastVerified: '2026-09-10', notes: '' };
  assert.equal(isSourceFresh(source, '2026-09-05'), true);
  assert.equal(isSourceFresh({ ...source, lastVerified: '2026-08-31' }, '2026-09-05'), false);
  assert.equal(isSourceFresh({ ...source, lastVerified: 'not-a-date' }, '2026-09-05'), false);
});

test('accepted evidence with verification and a valid hash can support a pass', () => {
  const item: EvidenceItem = { id: 'ev-1', tenantId: 'tenant-1', controlId: 'appointment-letters', kind: 'DOCUMENT', title: 'Appointment letter', contentHash: 'sha256:abc', collectedAt: '2026-09-05T10:00:00Z', verifiedAt: '2026-09-05T10:05:00Z', expiresAt: '2027-09-05T10:05:00Z', status: 'ACCEPTED', verifiedBy: 'reviewer-1' };
  assert.equal(isEvidenceCurrent(item, new Date('2026-09-05T11:00:00Z')), true);
  assert.equal(evidenceCanSupportPass(item, new Date('2026-09-05T11:00:00Z')), true);
});

test('expired or rejected evidence cannot support a pass', () => {
  const base: EvidenceItem = { id: 'ev-2', tenantId: 'tenant-1', controlId: 'wage-definition', kind: 'PAYROLL', title: 'Payroll register', contentHash: 'sha256:def', collectedAt: '2026-01-01T00:00:00Z', verifiedAt: '2026-01-02T00:00:00Z', expiresAt: '2026-02-01T00:00:00Z', status: 'ACCEPTED' };
  assert.equal(evidenceCanSupportPass(base, new Date('2026-09-05T00:00:00Z')), false);
  assert.equal(evidenceCanSupportPass({ ...base, status: 'REJECTED' }, new Date('2026-01-15T00:00:00Z')), false);
});

test('audit payload canonicalization is deterministic', () => {
  const event = { id: 'audit-1', tenantId: 'tenant-1', actorId: 'user-1', action: 'ASSESSMENT_CREATED' as const, entityType: 'assessment', entityId: 'assessment-1', occurredAt: '2026-09-05T12:00:00Z', metadata: { sourceVersion: '2026-09-05' }, previousHash: null };
  assert.equal(canonicalAuditPayload(event), canonicalAuditPayload({ ...event }));
  assert.match(canonicalAuditPayload(event), /\"tenantId\":\"tenant-1\"/);
});

test('API input guards reject empty or oversized documents', () => {
  assert.equal(isNonEmptyString('policy', MAX_DOCUMENT_CHARS), true);
  assert.equal(isNonEmptyString('   ', MAX_DOCUMENT_CHARS), false);
  assert.equal(isNonEmptyString('x'.repeat(MAX_DOCUMENT_CHARS + 1), MAX_DOCUMENT_CHARS), false);
});

test('rate limiter allows the configured burst and rejects the next request', () => {
  const limiter = createRateLimiter(2, 60_000);
  assert.equal(limiter('tenant-or-ip', 1_000), true);
  assert.equal(limiter('tenant-or-ip', 1_001), true);
  assert.equal(limiter('tenant-or-ip', 1_002), false);
  assert.equal(limiter('tenant-or-ip', 61_001), true);
});
