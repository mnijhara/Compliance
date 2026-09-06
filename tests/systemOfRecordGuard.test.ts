import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeSystemOfRecordWrite } from '../src/domain/systemOfRecordGuard';
import type { AuthenticatedTenantContext } from '../src/security/tenantContext';

const context: AuthenticatedTenantContext = {
  subjectId: 'user-1',
  tenantId: 'tenant-a',
  roles: ['compliance_admin'],
  issuedAt: '2026-09-06T08:00:00.000Z',
  expiresAt: '2026-09-06T09:00:00.000Z',
  authMethod: 'oidc'
};

const durablePersistence = { configured: true, durable: true, mode: 'unconfigured' as const };

 test('blocks system-of-record writes without durable persistence', () => {
  const result = authorizeSystemOfRecordWrite(context, 'tenant-a', { configured: false, durable: false, mode: 'unconfigured' });
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.equal(result.code, 'PERSISTENCE_NOT_DURABLE');
});

test('blocks system-of-record writes without authentication', () => {
  const result = authorizeSystemOfRecordWrite(null, 'tenant-a', durablePersistence);
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.equal(result.code, 'AUTH_REQUIRED');
});

test('blocks cross-tenant system-of-record writes', () => {
  const result = authorizeSystemOfRecordWrite(context, 'tenant-b', durablePersistence);
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.equal(result.code, 'TENANT_MISMATCH');
});

test('allows a write only when auth and durable persistence both pass', () => {
  const result = authorizeSystemOfRecordWrite(context, 'tenant-a', durablePersistence, new Date('2026-09-06T08:30:00.000Z'));
  assert.equal(result.allowed, true);
  if (result.allowed) assert.equal(result.context.tenantId, 'tenant-a');
});
