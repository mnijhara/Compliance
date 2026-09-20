import { SupabaseCompliancePersistence, type SupabasePersistenceConfig } from './supabasePersistence';

export interface SupabasePersistenceEnvironment {
  COMPLYOS_PERSISTENCE?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

/**
 * Builds the durable adapter only when the deployment explicitly selects
 * Supabase and both public connection settings are present. The caller must
 * still provide a request-scoped access-token provider; no bearer token is
 * accepted from process configuration.
 */
export function createSupabasePersistence(
  env: SupabasePersistenceEnvironment,
  accessToken: SupabasePersistenceConfig['accessToken'],
  fetchImpl?: typeof fetch,
): SupabaseCompliancePersistence {
  if (env.COMPLYOS_PERSISTENCE !== 'supabase') {
    throw new Error('SUPABASE_PERSISTENCE_NOT_SELECTED');
  }
  if (typeof env.SUPABASE_URL !== 'string' || !/^https:\/\/[^\s/]+(?:\/.*)?$/i.test(env.SUPABASE_URL)) {
    throw new Error('SUPABASE_URL_INVALID');
  }
  if (typeof env.SUPABASE_ANON_KEY !== 'string' || !env.SUPABASE_ANON_KEY.trim()) {
    throw new Error('SUPABASE_ANON_KEY_REQUIRED');
  }

  return new SupabaseCompliancePersistence({
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    accessToken,
    ...(fetchImpl ? { fetchImpl } : {}),
  });
}
