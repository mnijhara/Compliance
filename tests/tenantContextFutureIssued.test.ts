import assert from 'node:assert/strict';
import test from 'node:test';
import { validateTenantContext } from '../src/security/tenantContext';

const baseContext = {
  subjectId: 'user-123',
  tenantId: 'tenant-acme',
  roles: ['admin'],
  issuedAt: '2026-09-11T08:00:00.000Z',
  expiresAt: '2026-09-11T10:00:00.000Z',
  authMethod: 'oidc' as const
};

test('accepts a context issued within the configured clock-skew window', () => {
  const result = validateTenantContext(
    { ...baseContext, issuedAt: '2026-09-11T08:03:00.000Z' },
    'tenant-acme',
    new Date('2026-09-11T08:00:00.000Z')
  );

  assert.equal(result.allowed, true);
});

test('rejects a materially future-dated authentication context', () => {
  const result = validateTenantContext(
    { ...baseContext, issuedAt: '2026-09-11T08:06:00.000Z' },
    'tenant-acme',
    new Date('2026-09-11T08:00:00.000Z')
  );

  assert.deepEqual(result, {
    allowed: false,
    code: 'AUTH_INVALID',
    reason: 'Authenticated tenant context is issued materially in the future.'
  });
});
