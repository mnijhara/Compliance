import test from 'node:test';
import assert from 'node:assert/strict';
import { getSecurityHeaders } from '../src/security/securityHeaders';

test('production API responses receive transport and no-store protections', () => {
  const headers = getSecurityHeaders({ path: '/api/audit', production: true });

  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['X-Frame-Options'], 'DENY');
  assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(headers['Permissions-Policy'], 'camera=(), microphone=(), geolocation=()');
  assert.equal(headers['Strict-Transport-Security'], 'max-age=31536000; includeSubDomains');
  assert.equal(headers['Cache-Control'], 'no-store');
});

test('development and non-API responses do not receive production-only policies', () => {
  const headers = getSecurityHeaders({ path: '/', production: false });

  assert.equal(headers['Strict-Transport-Security'], undefined);
  assert.equal(headers['Cache-Control'], undefined);
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['X-Frame-Options'], 'DENY');
});

test('API prefix matching is path based and does not cache API routes', () => {
  const headers = getSecurityHeaders({ path: '/api/health', production: false });
  assert.equal(headers['Cache-Control'], 'no-store');
});
