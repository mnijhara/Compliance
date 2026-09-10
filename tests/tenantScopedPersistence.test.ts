import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryCompliancePersistence } from '../src/domain/persistence';
import { TenantScopedPersistence } from '../src/domain/tenantScopedPersistence';

test('tenant-scoped persistence lists only the authenticated tenant', async () => {
  const scoped = new TenantScopedPersistence(new MemoryCompliancePersistence());
  const tenantA = { tenantId: 'tenant-a', actorId: 'user-a' };
  const tenantB = { tenantId: 'tenant-b', actorId: 'user-b' };

  await scoped.saveEvidence(tenantA, {
    id: 'e1', tenantId: 'tenant-a', kind: 'DOCUMENT', title: 'Policy',
    status: 'ACCEPTED', collectedAt: '2026-09-11T00:00:00.000Z'
  });
  await scoped.saveEvidence(tenantB, {
    id: 'e2', tenantId: 'tenant-b', kind: 'DOCUMENT', title: 'Other',
    status: 'ACCEPTED', collectedAt: '2026-09-11T00:00:00.000Z'
  });

  assert.deepEqual((await scoped.listEvidence(tenantA)).map(item => item.id), ['e1']);
  assert.deepEqual((await scoped.listEvidence(tenantB)).map(item => item.id), ['e2']);
});

test('tenant-scoped persistence rejects cross-tenant writes', async () => {
  const scoped = new TenantScopedPersistence(new MemoryCompliancePersistence());
  const context = { tenantId: 'tenant-a', actorId: 'user-a' };

  await assert.rejects(
    () => scoped.saveEvidence(context, {
      id: 'e1', tenantId: 'tenant-b', kind: 'DOCUMENT', title: 'Policy',
      status: 'ACCEPTED', collectedAt: '2026-09-11T00:00:00.000Z'
    }),
    (error: unknown) => error instanceof Error && error.message === 'TENANT_CONTEXT_MISMATCH'
  );
});

test('tenant-scoped persistence rejects audit records from another actor', async () => {
  const scoped = new TenantScopedPersistence(new MemoryCompliancePersistence());
  const context = { tenantId: 'tenant-a', actorId: 'user-a' };

  await assert.rejects(
    () => scoped.appendAudit(context, {
      id: 'a1', tenantId: 'tenant-a', action: 'EVIDENCE_ACCEPTED', actorId: 'user-b',
      occurredAt: '2026-09-11T00:00:00.000Z', payload: { evidenceId: 'e1' }
    }),
    (error: unknown) => error instanceof Error && error.message === 'ACTOR_CONTEXT_MISMATCH'
  );
});

test('tenant-scoped persistence requires authenticated context', async () => {
  const scoped = new TenantScopedPersistence(new MemoryCompliancePersistence());

  await assert.rejects(
    () => scoped.listAudit({ tenantId: '', actorId: 'user-a' }),
    (error: unknown) => error instanceof Error && error.message === 'AUTH_REQUIRED'
  );
});
