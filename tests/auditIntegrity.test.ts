import assert from 'node:assert/strict';
import test from 'node:test';
import { createAuditEntry } from '../src/auditTrail';
import { protectAuditEntry, verifyAuditEntry } from '../src/security/auditIntegrity';

test('protectAuditEntry creates a verifiable integrity hash', async () => {
  const entry = createAuditEntry({
    actor: 'system',
    action: 'COMPLIANCE_REVIEW',
    resourceType: 'workflow',
    resourceId: 'workflow-1',
    result: 'REVIEW',
    details: 'Evidence requires human verification.'
  });

  const protectedEntry = await protectAuditEntry(entry);
  assert.equal(protectedEntry.previousHash, null);
  assert.equal(protectedEntry.integrityHash.length, 64);
  assert.equal(await verifyAuditEntry(protectedEntry), true);
});

test('verifyAuditEntry rejects tampered audit data', async () => {
  const entry = createAuditEntry({
    actor: 'system',
    action: 'SOURCE_CHECK',
    resourceType: 'source',
    resourceId: 'source-1',
    result: 'SUCCESS',
    details: 'Source metadata validated.'
  });

  const protectedEntry = await protectAuditEntry(entry, 'previous-hash');
  const tampered = { ...protectedEntry, details: 'Fabricated verification.' };
  assert.equal(await verifyAuditEntry(tampered), false);
});

test('hash chaining changes when the previous event changes', async () => {
  const entry = createAuditEntry({
    actor: 'reviewer',
    action: 'EVIDENCE_REVIEW',
    resourceType: 'evidence',
    resourceId: 'evidence-1',
    result: 'SUCCESS',
    details: 'Evidence accepted by reviewer.'
  });

  const first = await protectAuditEntry(entry, 'hash-a');
  const second = await protectAuditEntry(entry, 'hash-b');
  assert.notEqual(first.integrityHash, second.integrityHash);
  assert.equal(await verifyAuditEntry(first), true);
  assert.equal(await verifyAuditEntry(second), true);
});
