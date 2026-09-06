import type { AuthenticatedTenantContext } from '../security/tenantContext';
import { validateTenantContext } from '../security/tenantContext';
import type { PersistenceReadiness } from './persistenceReadiness';

export type SystemOfRecordAccessResult =
  | { allowed: true; context: AuthenticatedTenantContext }
  | {
      allowed: false;
      code:
        | 'AUTH_REQUIRED'
        | 'TENANT_MISMATCH'
        | 'AUTH_EXPIRED'
        | 'AUTH_INVALID'
        | 'PERSISTENCE_NOT_DURABLE';
      reason: string;
    };

/**
 * Guard writes to compliance records that must survive process restarts.
 *
 * This deliberately requires both a trusted authenticated tenant context and
 * a durable persistence adapter. Development memory storage can support local
 * testing, but it must never be treated as a production system of record.
 */
export function authorizeSystemOfRecordWrite(
  context: AuthenticatedTenantContext | null | undefined,
  requestedTenantId: string,
  persistence: PersistenceReadiness,
  now = new Date()
): SystemOfRecordAccessResult {
  if (!persistence.durable) {
    return {
      allowed: false,
      code: 'PERSISTENCE_NOT_DURABLE',
      reason: 'A durable persistence adapter is required for system-of-record writes.'
    };
  }

  const tenantAccess = validateTenantContext(context, requestedTenantId, now);
  if (!tenantAccess.allowed) return tenantAccess;
  return tenantAccess;
}
