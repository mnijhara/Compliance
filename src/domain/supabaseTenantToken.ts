export type SupabaseAccessTokenProvider = (tenantId: string) => Promise<string> | string;

interface JwtPayload {
  tenant_id?: unknown;
}

/**
 * Wraps a request-scoped Supabase access-token provider with a local tenant
 * binding check. Signature verification remains the responsibility of
 * Supabase/PostgREST and its RLS boundary; this check only prevents an
 * accidentally mis-bound token from being sent for another tenant.
 */
export function createTenantBoundSupabaseAccessTokenProvider(
  provider: SupabaseAccessTokenProvider,
): SupabaseAccessTokenProvider {
  return async (tenantId: string): Promise<string> => {
    const token = await provider(tenantId);
    if (typeof token !== 'string' || token.length === 0 || token.length > 8192) {
      throw new Error('AUTH_TOKEN_INVALID');
    }

    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('AUTH_TOKEN_INVALID');

    let payload: JwtPayload;
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const binary = atob(padded);
      const utf8 = Array.from(binary, (character) =>
        `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
      ).join('');
      const decoded = decodeURIComponent(utf8);
      payload = JSON.parse(decoded) as JwtPayload;
    } catch {
      throw new Error('AUTH_TOKEN_INVALID');
    }

    if (payload.tenant_id !== tenantId) {
      throw new Error('TENANT_CONTEXT_MISMATCH');
    }

    return token;
  };
}
