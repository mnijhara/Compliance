import assert from 'node:assert/strict';
import test from 'node:test';
import { assertTenantId, boundedAuditLimit, requireTenantContext } from '../src/domain/evidenceAudit';

test('tenant IDs must be UUIDs', () => {
  assert.doesNotThrow(() => assertTenantId('123e4567-e89b-12d3-a456-426614174000'));
  assert.throws(() => assertTenantId('tenant-1'), /valid tenant identifier/);
});

test('tenant context requires a verified principal', () => {
  assert.deepEqual(
    requireTenantContext({
      subject: 'user-123',
      tenantId: '123e4567-e89b-12d3-a456-426614174000',
      authenticated: true
    }),
    { subject: 'user-123', tenantId: '123e4567-e89b-12d3-a456-426614174000' }
  );
  assert.throws(() => requireTenantContext(undefined), /Verified authentication is required/);
  assert.throws(() => requireTenantContext({ subject: 'user-123', tenantId: 'tenant-1', authenticated: true }), /valid tenant identifier/);
});

test('audit/evidence limits are bounded', () => {
  assert.equal(boundedAuditLimit(undefined), 100);
  assert.equal(boundedAuditLimit(500), 500);
  assert.throws(() => boundedAuditLimit(0), /from 1 to 500/);
  assert.throws(() => boundedAuditLimit(501), /from 1 to 500/);
});
