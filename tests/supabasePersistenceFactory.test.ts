import test from 'node:test';
import assert from 'node:assert/strict';
import { createSupabasePersistence } from '../src/domain/supabasePersistenceFactory';

test('Supabase factory requires explicit durable mode selection', () => {
  assert.throws(
    () => createSupabasePersistence(
      { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_ANON_KEY: 'anon' },
      () => 'short-lived-token'
    ),
    /SUPABASE_PERSISTENCE_NOT_SELECTED/
  );
});

test('Supabase factory requires a valid URL and anon key', () => {
  assert.throws(
    () => createSupabasePersistence(
      { COMPLYOS_PERSISTENCE: 'supabase', SUPABASE_URL: 'not-a-url', SUPABASE_ANON_KEY: 'anon' },
      () => 'short-lived-token'
    ),
    /SUPABASE_URL_INVALID/
  );

  assert.throws(
    () => createSupabasePersistence(
      { COMPLYOS_PERSISTENCE: 'supabase', SUPABASE_URL: 'https://example.supabase.co', SUPABASE_ANON_KEY: '   ' },
      () => 'short-lived-token'
    ),
    /SUPABASE_ANON_KEY_REQUIRED/
  );
});

test('Supabase factory accepts a request-scoped token provider without storing a bearer token in configuration', () => {
  const persistence = createSupabasePersistence(
    {
      COMPLYOS_PERSISTENCE: 'supabase',
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_ANON_KEY: 'anon',
    },
    (tenantId) => `token-for-${tenantId}`,
  );

  assert.ok(persistence);
});
