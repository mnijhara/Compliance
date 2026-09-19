import test from 'node:test';
import assert from 'node:assert/strict';
import { SupabaseCompliancePersistence } from '../src/domain/supabasePersistence';

const tenantId = '11111111-1111-4111-8111-111111111111';
const evidenceId = '22222222-2222-4222-8222-222222222222';
const auditId = '33333333-3333-4333-8333-333333333333';

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

test('Supabase adapter uses caller token and tenant-scoped RPCs', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const store = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: (requestedTenant) => {
      assert.equal(requestedTenant, tenantId);
      return 'short-lived-user-token';
    },
    fetchImpl: async (url, init) => {
      calls.push({ url: String(url), init });
      if (String(url).endsWith('/complyos_list_evidence')) return response([]);
      if (String(url).endsWith('/complyos_list_audit')) return response([]);
      return response(null);
    },
  });

  await store.saveEvidence({ id: evidenceId, tenantId, kind: 'DOCUMENT', title: 'Policy', status: 'REVIEW', collectedAt: '2026-09-19T00:00:00.000Z' });
  await store.listEvidence(tenantId);
  await store.appendAudit({ id: auditId, tenantId, action: 'EVIDENCE_ACCEPTED', actorId: 'user-1', occurredAt: '2026-09-19T00:00:00.000Z', payload: { evidenceId } });
  await store.listAudit(tenantId);

  assert.equal(calls.length, 4);
  for (const call of calls) {
    assert.equal(new Headers(call.init?.headers).get('authorization'), 'Bearer short-lived-user-token');
    assert.equal(new Headers(call.init?.headers).get('apikey'), 'public-anon-key');
  }
  assert.ok(calls.some(call => call.url.endsWith('/complyos_save_evidence')));
  assert.ok(calls.some(call => call.url.endsWith('/complyos_append_audit')));
});

test('Supabase adapter rejects non-UUID tenant ids before network access', async () => {
  let networkCalls = 0;
  const store = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: () => 'token',
    fetchImpl: async () => { networkCalls += 1; return response([]); },
  });

  await assert.rejects(
    () => store.listEvidence('tenant-a'),
    /UUID/i,
  );
  assert.equal(networkCalls, 0);
});

test('Supabase adapter surfaces server failures without treating them as success', async () => {
  const store = new SupabaseCompliancePersistence({
    url: 'https://example.supabase.co',
    anonKey: 'public-anon-key',
    accessToken: () => 'token',
    fetchImpl: async () => response({ message: 'row-level security denied' }, 401),
  });

  await assert.rejects(
    () => store.listEvidence(tenantId),
    /PERSISTENCE_RPC_FAILED:401/,
  );
});
