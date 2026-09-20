import test from 'node:test';
import assert from 'node:assert/strict';
import { createTenantBoundSupabaseAccessTokenProvider } from '../src/domain/supabaseTenantToken';

function jwt(tenantId: string): string {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ tenant_id: tenantId })}.signature`;
}

test('accepts a token whose tenant_id matches the requested tenant', async () => {
  const provider = createTenantBoundSupabaseAccessTokenProvider(() => jwt('11111111-1111-4111-8111-111111111111'));
  const token = await provider('11111111-1111-4111-8111-111111111111');
  assert.match(token, /^.+\..+\..+$/);
});

test('rejects a token bound to a different tenant', async () => {
  const provider = createTenantBoundSupabaseAccessTokenProvider(() => jwt('11111111-1111-4111-8111-111111111111'));
  await assert.rejects(
    provider('22222222-2222-4222-8222-222222222222'),
    /TENANT_CONTEXT_MISMATCH/
  );
});

test('rejects malformed or non-JWT access tokens', async () => {
  const provider = createTenantBoundSupabaseAccessTokenProvider(() => 'not-a-jwt');
  await assert.rejects(
    provider('11111111-1111-4111-8111-111111111111'),
    /AUTH_TOKEN_INVALID/
  );
});
