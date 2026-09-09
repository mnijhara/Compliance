import * as crypto from 'node:crypto';

export interface TenantPrincipal {
  subject: string;
  tenantId: string;
  roles: string[];
}

interface ConfiguredCredential {
  tokenHash: string;
  tenantId: string;
  subject: string;
  roles?: string[];
}

const TENANT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const TOKEN_HASH_PATTERN = /^[a-f0-9]{64}$/;

function parseCredentials(raw: string | undefined): ConfiguredCredential[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const credentials = parsed.flatMap((entry): ConfiguredCredential[] => {
    if (!entry || typeof entry !== 'object') return [];
    const candidate = entry as Partial<ConfiguredCredential>;
    if (
      typeof candidate.tokenHash !== 'string' || !TOKEN_HASH_PATTERN.test(candidate.tokenHash) ||
      typeof candidate.tenantId !== 'string' || !TENANT_ID_PATTERN.test(candidate.tenantId) ||
      typeof candidate.subject !== 'string' || candidate.subject.length === 0 || candidate.subject.length > 128
    ) return [];
    const roles = Array.isArray(candidate.roles)
      ? candidate.roles.filter((role): role is string => typeof role === 'string' && role.length > 0 && role.length <= 64).slice(0, 20)
      : [];
    return [{ tokenHash: candidate.tokenHash, tenantId: candidate.tenantId, subject: candidate.subject, roles }];
  });

  // A bearer credential must identify exactly one tenant. If configuration
  // accidentally maps the same token hash to multiple principals, fail closed
  // for that hash instead of making array order an authorization decision.
  const counts = new Map<string, number>();
  for (const credential of credentials) {
    counts.set(credential.tokenHash, (counts.get(credential.tokenHash) ?? 0) + 1);
  }
  return credentials.filter((credential) => counts.get(credential.tokenHash) === 1);
}

export function hashBearerToken(token: string): string {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

/**
 * Resolves an opaque bearer token to a server-configured tenant principal.
 * The token itself is never stored in the configuration and tenant identity is
 * never accepted from request-controlled headers, query parameters, or bodies.
 */
export function resolveTenantPrincipal(
  authorization: string | undefined,
  env: NodeJS.ProcessEnv = process.env
): TenantPrincipal | null {
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) return null;
  const token = authorization.slice('Bearer '.length).trim();
  if (token.length < 32) return null;

  const presentedHash = hashBearerToken(token);
  const credentials = parseCredentials(env.COMPLYOS_API_TOKENS_JSON);
  const match = credentials.find((credential) => {
    const expected = Buffer.from(credential.tokenHash, 'hex');
    const presented = Buffer.from(presentedHash, 'hex');
    return expected.length === presented.length && crypto.timingSafeEqual(expected, presented);
  });
  if (!match) return null;

  return { subject: match.subject, tenantId: match.tenantId, roles: match.roles ?? [] };
}

export function isTenantPrincipal(value: unknown): value is TenantPrincipal {
  if (!value || typeof value !== 'object') return false;
  const principal = value as Partial<TenantPrincipal>;
  return typeof principal.subject === 'string' && principal.subject.length > 0 &&
    typeof principal.tenantId === 'string' && TENANT_ID_PATTERN.test(principal.tenantId) &&
    Array.isArray(principal.roles) && principal.roles.every(role => typeof role === 'string');
}
