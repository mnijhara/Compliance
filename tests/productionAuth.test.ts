import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { authorizeProductionRequest } from '../src/security/productionAuth';
import { hashBearerToken, resolveTenantPrincipal } from '../src/security/tenantAuth';

type TestRequest = { headers: { authorization?: string } };

const token = 'a'.repeat(48);
const tokenHash = hashBearerToken(token);
const productionEnv = {
  NODE_ENV: 'production',
  COMPLYOS_API_TOKENS_JSON: JSON.stringify([{ tokenHash, tenantId: 'tenant-acme', subject: 'user-123', roles: ['admin'] }])
} as NodeJS.ProcessEnv;

const request = (authorization?: string): TestRequest => ({
  headers: authorization ? { authorization } : {}
});

test('development bypass is explicit', () => {
  assert.deepEqual(authorizeProductionRequest(request(), { NODE_ENV: 'development' } as NodeJS.ProcessEnv), {
    allowed: true,
    reason: 'development-bypass'
  });
});

test('production authentication fails closed without tenant credential configuration', () => {
  assert.deepEqual(authorizeProductionRequest(request(`Bearer ${token}`), { NODE_ENV: 'production' } as NodeJS.ProcessEnv), {
    allowed: false,
    status: 503,
    code: 'AUTH_NOT_CONFIGURED'
  });
});

test('valid opaque credential resolves only to the configured tenant principal', () => {
  assert.deepEqual(resolveTenantPrincipal(`Bearer ${token}`, productionEnv), {
    tenantId: 'tenant-acme',
    subject: 'user-123',
    roles: ['admin']
  });
  assert.deepEqual(authorizeProductionRequest(request(`Bearer ${token}`), productionEnv), {
    allowed: true,
    reason: 'valid-token',
    principal: { tenantId: 'tenant-acme', subject: 'user-123', roles: ['admin'] }
  });
});

test('wrong, malformed, or short credentials are rejected', () => {
  assert.equal(resolveTenantPrincipal('Bearer wrong-token', productionEnv), null);
  assert.equal(resolveTenantPrincipal(undefined, productionEnv), null);
  assert.equal(resolveTenantPrincipal('Basic abc', productionEnv), null);
  assert.equal(resolveTenantPrincipal('Bearer short', productionEnv), null);
});
