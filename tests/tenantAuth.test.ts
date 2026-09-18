import test from 'node:test';
import assert from 'node:assert/strict';
import { hashBearerToken, isTenantPrincipal, resolveTenantPrincipal } from '../src/security/tenantAuth';

const token = 'tenant-token-abcdefghijklmnopqrstuvwxyz-012345';
const tokenHash = hashBearerToken(token);

function envFor(subject: string, roles: string[] = ['hr-admin']): NodeJS.ProcessEnv {
  return {
    NODE_ENV: 'production',
    COMPLYOS_API_TOKENS_JSON: JSON.stringify([{ tokenHash, tenantId: 'tenant-a', subject, roles }])
  };
}

test('accepts safe tenant principal metadata', () => {
  const principal = resolveTenantPrincipal(`Bearer ${token}`, envFor('user-123'));
  assert.deepEqual(principal, { subject: 'user-123', tenantId: 'tenant-a', roles: ['hr-admin'] });
  assert.equal(isTenantPrincipal(principal), true);
});

test('rejects credentials with control characters in subject', () => {
  const principal = resolveTenantPrincipal(`Bearer ${token}`, envFor('user-123\nforged-log-line'));
  assert.equal(principal, null);
});

test('filters unsafe roles and keeps the principal valid', () => {
  const principal = resolveTenantPrincipal(`Bearer ${token}`, envFor('user-123', ['hr-admin', 'audit\tviewer']));
  assert.deepEqual(principal, { subject: 'user-123', tenantId: 'tenant-a', roles: ['hr-admin'] });
});

test('rejects externally constructed principals with unsafe metadata', () => {
  assert.equal(isTenantPrincipal({ subject: 'user-123\r\n', tenantId: 'tenant-a', roles: [] }), false);
  assert.equal(isTenantPrincipal({ subject: 'user-123', tenantId: 'tenant-a', roles: ['ok', 'bad\nrole'] }), false);
});
