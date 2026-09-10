import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Request } from 'express';
import { authorizeProductionRequest, tenantContextMatchesPrincipal } from '../src/security/productionAuth';
import { hashBearerToken, resolveTenantPrincipal } from '../src/security/tenantAuth';

type TestRequest = { headers: { authorization?: string; 'x-tenant-id'?: string }; query?: Request['query']; body?: Request['body'] };
type TenantContextRequest = Pick<Request, 'headers' | 'query' | 'body'>;

const token = 'a'.repeat(48);
const tokenHash = hashBearerToken(token);
const productionEnv = {
  NODE_ENV: 'production',
  COMPLYOS_API_TOKENS_JSON: JSON.stringify([{ tokenHash, tenantId: 'tenant-acme', subject: 'user-123', roles: ['admin'] }])
} as NodeJS.ProcessEnv;

const request = (authorization?: string): TestRequest => ({
  headers: authorization ? { authorization } : {}
});

const tenantRequest = (request: TenantContextRequest): TenantContextRequest => ({
  headers: request.headers,
  query: request.query,
  body: request.body
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

test('duplicate token hashes fail closed instead of selecting by configuration order', () => {
  const ambiguousEnv = {
    NODE_ENV: 'production',
    COMPLYOS_API_TOKENS_JSON: JSON.stringify([
      { tokenHash, tenantId: 'tenant-acme', subject: 'user-123', roles: ['admin'] },
      { tokenHash, tenantId: 'tenant-other', subject: 'user-456', roles: ['admin'] }
    ])
  } as NodeJS.ProcessEnv;

  assert.equal(resolveTenantPrincipal(`Bearer ${token}`, ambiguousEnv), null);
  assert.deepEqual(authorizeProductionRequest(request(`Bearer ${token}`), ambiguousEnv), {
    allowed: false,
    status: 401,
    code: 'AUTH_REQUIRED'
  });
});

test('tenant context is optional but, when supplied, must match the authenticated principal', () => {
  const principal = { tenantId: 'tenant-acme', subject: 'user-123', roles: ['admin'] };
  assert.equal(tenantContextMatchesPrincipal(tenantRequest({ headers: {} }), principal), true);
  assert.equal(tenantContextMatchesPrincipal(tenantRequest({ headers: { 'x-tenant-id': 'tenant-acme' } }), principal), true);
  assert.equal(tenantContextMatchesPrincipal(tenantRequest({ headers: { 'x-tenant-id': 'tenant-other' } }), principal), false);
  assert.equal(tenantContextMatchesPrincipal(tenantRequest({ headers: {}, query: { tenantId: 'tenant-other' } }), principal), false);
  assert.equal(tenantContextMatchesPrincipal(tenantRequest({ headers: {}, body: { tenantId: 'tenant-other' } }), principal), false);
  assert.equal(tenantContextMatchesPrincipal(tenantRequest({ headers: { 'x-tenant-id': 'tenant-acme' }, query: { tenantId: 'tenant-acme' }, body: { tenantId: 'tenant-acme' } }), principal), true);
});
