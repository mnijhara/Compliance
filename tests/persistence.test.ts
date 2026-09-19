import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryCompliancePersistence, PersistenceConflictError, PersistenceNotConfiguredError, createPersistence } from '../src/domain/persistence';

test('memory persistence isolates records by tenant', async () => {
  const store = new MemoryCompliancePersistence();
  await store.saveEvidence({ id: 'e1', tenantId: 'tenant-a', kind: 'DOCUMENT', title: 'Policy', status: 'ACCEPTED', collectedAt: '2026-09-05T00:00:00.000Z' });
  await store.saveEvidence({ id: 'e2', tenantId: 'tenant-b', kind: 'DOCUMENT', title: 'Other', status: 'ACCEPTED', collectedAt: '2026-09-05T00:00:00.000Z' });
  await store.appendAudit({ id: 'a1', tenantId: 'tenant-a', action: 'EVIDENCE_ACCEPTED', actorId: 'user-a', occurredAt: '2026-09-05T00:00:00.000Z', payload: { evidenceId: 'e1' } });

  assert.deepEqual((await store.listEvidence('tenant-a')).map(item => item.id), ['e1']);
  assert.deepEqual((await store.listEvidence('tenant-b')).map(item => item.id), ['e2']);
  assert.deepEqual((await store.listAudit('tenant-a')).map(item => item.id), ['a1']);
  assert.deepEqual(await store.listAudit('tenant-b'), []);
});

test('memory persistence rejects duplicate evidence and audit ids', async () => {
  const store = new MemoryCompliancePersistence();
  const evidence = { id: 'e1', tenantId: 'tenant-a', kind: 'DOCUMENT', title: 'Policy', status: 'ACCEPTED', collectedAt: '2026-09-05T00:00:00.000Z' };
  const audit = { id: 'a1', tenantId: 'tenant-a', action: 'EVIDENCE_ACCEPTED', actorId: 'user-a', occurredAt: '2026-09-05T00:00:00.000Z', payload: { evidenceId: 'e1' } };

  await store.saveEvidence(evidence);
  await assert.rejects(() => store.saveEvidence(evidence), (error: unknown) => error instanceof PersistenceConflictError && error.code === 'PERSISTENCE_CONFLICT');

  await store.appendAudit(audit);
  await assert.rejects(() => store.appendAudit(audit), (error: unknown) => error instanceof PersistenceConflictError && error.code === 'PERSISTENCE_CONFLICT');
});

test('default persistence fails closed instead of pretending to be durable', async () => {
  const store = createPersistence({});
  await assert.rejects(() => store.listEvidence('tenant-a'), (error: unknown) => error instanceof PersistenceNotConfiguredError && error.code === 'PERSISTENCE_NOT_CONFIGURED');
});

test('memory persistence is available only outside production', async () => {
  const developmentStore = createPersistence({ NODE_ENV: 'development', COMPLYOS_PERSISTENCE: 'memory' });
  assert.ok(developmentStore instanceof MemoryCompliancePersistence);

  const productionStore = createPersistence({ NODE_ENV: 'production', COMPLYOS_PERSISTENCE: 'memory' });
  assert.ok(!(productionStore instanceof MemoryCompliancePersistence));
  await assert.rejects(() => productionStore.listEvidence('tenant-a'), (error: unknown) => error instanceof PersistenceNotConfiguredError && error.code === 'PERSISTENCE_NOT_CONFIGURED');
});
