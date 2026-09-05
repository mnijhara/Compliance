import test from 'node:test';
import assert from 'node:assert/strict';
import { denyWithoutAuth, validateTenantContext } from '../src/security/tenantContext';

const context = {
  subjectId: 'user-1',
  tenantId: 'tenant-a',
  roles: ['hr_admin'],
  issuedAt: '2026-09-06T00:00:00.000Z',
  expiresAt: '2026-09-06T01:00:00.000Z',
  authMethod: 'oidc' as const
};

test('tenant access fails closed when authentication context is absent', () => {
  assert.deepEqual(denyWithoutAuth(), {
    allowed: false,
    code: 'AUTH_REQUIRED',
    reason: 'No production authentication adapter is configured.'
  });
});

test('tenant access accepts a matching unexpired trusted context', () => {
  const result = validateTenantContext(context, 'tenant-a', new Date('2026-09-06T00:30:00.000Z'));
  assert.equal(result.allowed, true);
});

test('tenant access rejects cross-tenant access', () => {
  const result = validateTenantContext(context, 'tenant-b', new Date('2026-09-06T00:30:00.000Z'));
  assert.equal(result.allowed, false);
  assert.equal(result.code, 'TENANT_MISMATCH');
});

test('tenant access rejects expired authentication context', () => {
  const result = validateTenantContext(context, 'tenant-a', new Date('2026-09-06T01:00:00.000Z'));
  assert.equal(result.allowed, false);
  assert.equal(result.code, 'AUTH_EXPIRED');
});

test('tenant access rejects malformed authentication timestamps', () => {
  const result = validateTenantContext({ ...context, expiresAt: 'not-a-date' }, 'tenant-a', new Date('2026-09-06T00:30:00.000Z'));
  assert.equal(result.allowed, false);
  assert.equal(result.code, 'AUTH_INVALID');
});
