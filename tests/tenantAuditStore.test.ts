import assert from 'node:assert/strict';
import test from 'node:test';
import { createAuditEntry } from '../src/auditTrail';
import { MemoryTenantAuditStore } from '../src/domain/tenantAuditStore';

test('tenant audit store isolates entries by authenticated tenant context', async () => {
  const store = new MemoryTenantAuditStore();
  const entry = createAuditEntry({
    actor: 'actor-a',
    action: 'EVIDENCE_REVIEW',
    resourceType: 'evidence',
    resourceId: 'evidence-1',
    result: 'REVIEW',
    details: 'Requires human verification.'
  });

  await store.append({ tenantId: 'tenant-a', actorId: 'actor-a' }, entry);

  assert.equal((await store.list({ tenantId: 'tenant-a', actorId: 'actor-a' })).length, 1);
  assert.equal((await store.list({ tenantId: 'tenant-b', actorId: 'actor-b' })).length, 0);
});

test('tenant audit store rejects missing authenticated context', async () => {
  const store = new MemoryTenantAuditStore();
  const entry = createAuditEntry({
    actor: 'actor-a',
    action: 'ASSESSMENT_CREATED',
    resourceType: 'assessment',
    resourceId: 'assessment-1',
    result: 'SUCCESS',
    details: 'Deterministic assessment created.'
  });

  await assert.rejects(
    store.append({ tenantId: '', actorId: 'actor-a' }, entry),
    /AUTH_REQUIRED/
  );
  await assert.rejects(
    store.list({ tenantId: 'tenant-a', actorId: '' }),
    /AUTH_INVALID/
  );
});

test('tenant audit store returns copies rather than mutable internal entries', async () => {
  const store = new MemoryTenantAuditStore();
  const entry = createAuditEntry({
    actor: 'actor-a',
    action: 'CONTROL_REVIEWED',
    resourceType: 'control',
    resourceId: 'control-1',
    result: 'SUCCESS',
    details: 'Reviewed.'
  });

  await store.append({ tenantId: 'tenant-a', actorId: 'actor-a' }, entry);
  const listed = await store.list({ tenantId: 'tenant-a', actorId: 'actor-a' });
  listed[0].details = 'mutated locally';

  assert.equal((await store.list({ tenantId: 'tenant-a', actorId: 'actor-a' }))[0].details, 'Reviewed.');
});
