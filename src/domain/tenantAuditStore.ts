import type { AuditTrailEntry } from '../auditTrail';

export interface AuthenticatedTenantContext {
  tenantId: string;
  actorId: string;
}

export interface TenantAuditStore {
  append(context: AuthenticatedTenantContext, entry: AuditTrailEntry): Promise<void>;
  list(context: AuthenticatedTenantContext): Promise<AuditTrailEntry[]>;
}

/**
 * Development-only store. It deliberately requires an authenticated tenant
 * context and never accepts a tenant ID from an audit entry as the access key.
 * Replace with a durable server-side implementation before system-of-record use.
 */
export class MemoryTenantAuditStore implements TenantAuditStore {
  private readonly entries = new Map<string, AuditTrailEntry[]>();

  async append(context: AuthenticatedTenantContext, entry: AuditTrailEntry): Promise<void> {
    this.assertContext(context);
    const tenantEntries = this.entries.get(context.tenantId) ?? [];
    tenantEntries.push({ ...entry });
    this.entries.set(context.tenantId, tenantEntries);
  }

  async list(context: AuthenticatedTenantContext): Promise<AuditTrailEntry[]> {
    this.assertContext(context);
    return (this.entries.get(context.tenantId) ?? []).map(entry => ({ ...entry }));
  }

  private assertContext(context: AuthenticatedTenantContext): void {
    if (!context || typeof context.tenantId !== 'string' || context.tenantId.trim().length === 0) {
      throw new Error('AUTH_REQUIRED');
    }
    if (typeof context.actorId !== 'string' || context.actorId.trim().length === 0) {
      throw new Error('AUTH_INVALID');
    }
  }
}
