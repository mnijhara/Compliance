import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createTenantBoundSupabaseAccessTokenProvider } from '../src/domain/supabaseTenantToken.ts';

function base64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function jwt(tenantId: string): string {
  const encode = (value: object) => base64Url(JSON.stringify(value));
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
