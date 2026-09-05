export interface AuthenticatedTenantContext {
  subjectId: string;
  tenantId: string;
  roles: readonly string[];
  issuedAt: string;
  expiresAt: string;
  authMethod: 'oidc' | 'sso' | 'service_identity';
}

export type TenantAccessResult =
  | { allowed: true; context: AuthenticatedTenantContext }
  | { allowed: false; code: 'AUTH_REQUIRED' | 'TENANT_MISMATCH' | 'AUTH_EXPIRED' | 'AUTH_INVALID'; reason: string };

function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Tenant identity must come from a trusted authentication adapter. Never build
 * this context from a user-controlled tenantId header, query parameter, or
 * request body. The current application intentionally has no default auth
 * adapter, so tenant-scoped production endpoints must fail closed until one is
 * configured.
 */
export function validateTenantContext(
  context: AuthenticatedTenantContext | null | undefined,
  requestedTenantId: string,
  now = new Date()
): TenantAccessResult {
  if (!context) return { allowed: false, code: 'AUTH_REQUIRED', reason: 'Authenticated tenant context is required.' };
  if (!isNonEmpty(context.subjectId) || !isNonEmpty(context.tenantId) || !isNonEmpty(requestedTenantId) || !isNonEmpty(context.issuedAt) || !isNonEmpty(context.expiresAt)) {
    return { allowed: false, code: 'AUTH_INVALID', reason: 'Authenticated tenant context is incomplete.' };
  }
  const issuedAt = Date.parse(context.issuedAt);
  const expiresAt = Date.parse(context.expiresAt);
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt) || expiresAt <= issuedAt) {
    return { allowed: false, code: 'AUTH_INVALID', reason: 'Authenticated tenant context has invalid timestamps.' };
  }
  if (now.getTime() >= expiresAt) return { allowed: false, code: 'AUTH_EXPIRED', reason: 'Authenticated tenant context has expired.' };
  if (context.tenantId !== requestedTenantId) return { allowed: false, code: 'TENANT_MISMATCH', reason: 'Authenticated tenant context does not match the requested tenant.' };
  return { allowed: true, context };
}

export function denyWithoutAuth(): TenantAccessResult {
  return { allowed: false, code: 'AUTH_REQUIRED', reason: 'No production authentication adapter is configured.' };
}
