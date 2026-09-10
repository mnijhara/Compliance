import assert from 'node:assert/strict';
import test from 'node:test';
import { createAuditEventEnvelope } from '../src/domain/auditEnvelope';

test('creates a tenant-bound audit envelope without storing payload text', () => {
  const event = createAuditEventEnvelope({
    principal: { tenantId: 'tenant-acme', subject: 'user-123' },
    action: 'DOCUMENT_AUDITED',
    entityType: 'compliance_audit',
    entityId: 'audit-1',
    evidence: [
      { id: 'evidence-2', sourceId: 'source-b', verifiedAt: '2026-09-10T00:00:00.000Z' },
      { id: 'evidence-1', sourceId: 'source-a', contentHash: 'abc' },
      { id: 'evidence-1', sourceId: 'source-a', contentHash: 'abc' }
    ],
    payload: { documentText: 'sensitive employee policy', model: 'test' },
    id: 'event-1',
    occurredAt: '2026-09-10T12:00:00.000Z'
  });

  assert.equal(event.id, 'event-1');
  assert.equal(event.tenantId, 'tenant-acme');
  assert.equal(event.actorId, 'user-123');
  assert.deepEqual(event.evidenceIds, ['evidence-1', 'evidence-2']);
  assert.ok(/^[a-f0-9]{64}$/.test(event.payloadHash));
  assert.ok(/^[a-f0-9]{64}$/.test(event.eventHash));
  assert.equal('documentText' in event, false);
});

test('canonicalizes payload key order for stable payload hashes', () => {
  const first = createAuditEventEnvelope({
    principal: { tenantId: 'tenant-a', subject: 'user-a' },
    action: 'ASSESSMENT_CREATED',
    entityType: 'assessment',
    payload: { b: 2, a: 1 },
    id: 'event-a',
    occurredAt: '2026-09-10T12:00:00.000Z'
  });
  const second = createAuditEventEnvelope({
    principal: { tenantId: 'tenant-a', subject: 'user-a' },
    action: 'ASSESSMENT_CREATED',
    entityType: 'assessment',
    payload: { a: 1, b: 2 },
    id: 'event-a',
    occurredAt: '2026-09-10T12:00:00.000Z'
  });

  assert.equal(first.payloadHash, second.payloadHash);
  assert.equal(first.eventHash, second.eventHash);
});

test('rejects missing tenant identity', () => {
  assert.throws(() => createAuditEventEnvelope({
    principal: { tenantId: '', subject: 'user-a' },
    action: 'ASSESSMENT_CREATED',
    entityType: 'assessment'
  }));
});
