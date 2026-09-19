import assert from 'node:assert/strict';
import test from 'node:test';
import { MemoryCompliancePersistence } from '../src/domain/persistence';
import { assertAuditRecord, assertEvidenceRecord, assertTenantMatch } from '../src/domain/persistenceGuards';

test('accepts valid tenant-scoped evidence and audit records', async () => {
  const evidence = {
    id: 'ev-1', tenantId: 'tenant:acme', kind: 'policy', title: 'POSH Policy', status: 'verified',
    collectedAt: '2026-09-19T00:00:00.000Z'
  };
  const audit = {
    id: 'audit-1', tenantId: 'tenant:acme', action: 'evidence.created', actorId: 'user-1',
    occurredAt: '2026-09-19T00:00:00.000Z', payload: { evidenceId: 'ev-1' }
  };
  assert.doesNotThrow(() => assertEvidenceRecord(evidence));
  assert.doesNotThrow(() => assertAuditRecord(audit));
  assert.doesNotThrow(() => assertTenantMatch('tenant:acme', evidence.tenantId));

  const persistence = new MemoryCompliancePersistence();
  await persistence.saveEvidence(evidence);
  await persistence.appendAudit(audit);
  assert.equal((await persistence.listEvidence('tenant:acme')).length, 1);
  assert.equal((await persistence.listAudit('tenant:acme')).length, 1);
});

test('rejects malformed tenant identifiers and cross-tenant context', () => {
  assert.throws(() => assertTenantMatch('tenant:a', 'tenant:b'), /Tenant context mismatch/);
  assert.throws(() => assertTenantMatch('', 'tenant:b'), /Invalid tenant identifier/);
  assert.throws(() => assertTenantMatch('tenant:a', 'tenant a'), /Invalid tenant identifier/);
});

test('rejects invalid persistence records before storage', async () => {
  const persistence = new MemoryCompliancePersistence();
  await assert.rejects(() => persistence.saveEvidence({
    id: 'ev-1', tenantId: 'tenant a', kind: 'policy', title: 'Policy', status: 'verified', collectedAt: '2026-09-19T00:00:00.000Z'
  }), /Invalid tenant identifier/);
  await assert.rejects(() => persistence.appendAudit({
    id: 'audit-1', tenantId: 'tenant:acme', action: 'x', actorId: '', occurredAt: '2026-09-19T00:00:00.000Z', payload: {}
  }), /Audit actorId is required/);
});
