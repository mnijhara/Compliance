import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryCompliancePersistence, PersistenceNotConfiguredError, createPersistence } from '../src/domain/persistence';

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

test('default persistence fails closed instead of pretending to be durable', async () => {
  const original = process.env.COMPLYOS_PERSISTENCE;
  delete process.env.COMPLYOS_PERSISTENCE;
  try {
    const store = createPersistence();
    await assert.rejects(() => store.listEvidence('tenant-a'), (error: unknown) => error instanceof PersistenceNotConfiguredError && error.code === 'PERSISTENCE_NOT_CONFIGURED');
  } finally {
    if (original === undefined) delete process.env.COMPLYOS_PERSISTENCE;
    else process.env.COMPLYOS_PERSISTENCE = original;
  }
});
