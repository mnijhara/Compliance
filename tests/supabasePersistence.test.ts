import assert from 'node:assert/strict';
import test from 'node:test';
import { SupabaseCompliancePersistence } from '../src/domain/supabasePersistence';

const TENANT_ID = '11111111-1111-4111-8111-111111111111';
const EVIDENCE_ID = '22222222-2222-4222-8222-222222222222';
const ACTOR_ID = '33333333-3333-4333-8333-333333333333';
const ACCESS_TOKEN = 'short-lived-test-token';

function response(body: unknown, status = 200): Response {
  return new Response(body === undefined ? '' : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('Supabase adapter sends authenticated tenant-scoped RPC requests', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const persistence = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: tenantId => {
      assert.equal(tenantId, TENANT_ID);
      return ACCESS_TOKEN;
    },
    fetchImpl: async (input, init) => {
      calls.push({ url: String(input), init });
      return response([]);
    },
  });

  await persistence.listAudit(TENANT_ID);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://example.supabase.co/rest/v1/rpc/complyos_list_audit');
  assert.equal(calls[0].init?.method, 'POST');
  const headers = new Headers(calls[0].init?.headers);
  assert.equal(headers.get('Authorization'), `Bearer ${ACCESS_TOKEN}`);
  assert.equal(headers.get('apikey'), 'public-anon-key');
  assert.equal(calls[0].init?.body, JSON.stringify({}));
});

test('Supabase adapter rejects a returned row from another tenant', async () => {
  const persistence = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: () => ACCESS_TOKEN,
    fetchImpl: async () => response([{
      id: EVIDENCE_ID,
      tenant_id: '44444444-4444-4444-8444-444444444444',
      kind: 'document',
      title: 'Cross-tenant row',
      status: 'verified',
      collected_at: '2026-09-20T00:00:00.000Z',
      metadata: {},
    }]),
  });

  await assert.rejects(
    () => persistence.listEvidence(TENANT_ID),
    /TENANT_CONTEXT_MISMATCH/,
  );
});

test('Supabase adapter does not expose provider error bodies', async () => {
  const persistence = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: () => ACCESS_TOKEN,
    fetchImpl: async () => new Response(
      JSON.stringify({ message: 'SQL policy details must not escape' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    ),
  });

  await assert.rejects(
    () => persistence.listAudit(TENANT_ID),
    error => {
      assert.equal((error as Error).message, 'PERSISTENCE_RPC_FAILED:403');
      assert.doesNotMatch((error as Error).message, /SQL policy details/);
      return true;
    },
  );
});

test('Supabase adapter rejects malformed successful RPC responses', async () => {
  const persistence = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: () => ACCESS_TOKEN,
    fetchImpl: async () => new Response('not-json', { status: 200 }),
  });

  await assert.rejects(
    () => persistence.listAudit(TENANT_ID),
    /PERSISTENCE_RPC_INVALID_RESPONSE/,
  );
});

test('Supabase adapter rejects non-array list responses', async () => {
  const persistence = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: () => ACCESS_TOKEN,
    fetchImpl: async () => response({ rows: [] }),
  });

  await assert.rejects(
    () => persistence.listEvidence(TENANT_ID),
    /PERSISTENCE_RPC_INVALID_RESPONSE/,
  );
});

test('Supabase adapter rejects malformed row objects', async () => {
  const persistence = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: () => ACCESS_TOKEN,
    fetchImpl: async () => response([{
      id: EVIDENCE_ID,
      tenant_id: TENANT_ID,
      kind: 'document',
    }]),
  });

  await assert.rejects(
    () => persistence.listEvidence(TENANT_ID),
    /PERSISTENCE_RPC_INVALID_RESPONSE/,
  );
});

test('Supabase adapter validates identifiers before network access', async () => {
  let networkCalls = 0;
  const persistence = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: () => ACCESS_TOKEN,
    fetchImpl: async () => {
      networkCalls += 1;
      return response([]);
    },
  });

  await assert.rejects(
    () => persistence.saveEvidence({
      id: EVIDENCE_ID,
      tenantId: 'not-a-uuid',
      kind: 'document',
      title: 'Invalid tenant',
      status: 'pending',
      collectedAt: '2026-09-20T00:00:00.000Z',
    }),
    /tenant identifier must be a UUID/,
  );
  assert.equal(networkCalls, 0);

  await assert.doesNotReject(() => persistence.appendAudit({
    id: '55555555-5555-4555-8555-555555555555',
    tenantId: TENANT_ID,
    actorId: ACTOR_ID,
    action: 'test',
    occurredAt: '2026-09-20T00:00:00.000Z',
    payload: {},
  }));
});
