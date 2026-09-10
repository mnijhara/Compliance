import type {
  AuditRecord,
  CompliancePersistence,
  EvidenceRecord
} from './persistence';

export interface AuthenticatedTenantContext {
  tenantId: string;
  actorId: string;
}

/**
 * Binds persistence operations to an already-authenticated tenant context.
 *
 * The wrapped persistence provider remains responsible for durable storage and
 * database-level RLS. This boundary prevents future callers from accidentally
 * using a caller-supplied tenant ID as the authorization key.
 */
export class TenantScopedPersistence implements CompliancePersistence {
  constructor(private readonly delegate: CompliancePersistence) {}

  saveEvidence(context: AuthenticatedTenantContext, record: EvidenceRecord): Promise<void> {
    this.assertContext(context);
    this.assertTenantMatch(context, record.tenantId);
    return this.delegate.saveEvidence({ ...record, tenantId: context.tenantId });
  }

  listEvidence(context: AuthenticatedTenantContext): Promise<EvidenceRecord[]> {
    this.assertContext(context);
    return this.delegate.listEvidence(context.tenantId);
  }

  appendAudit(context: AuthenticatedTenantContext, record: AuditRecord): Promise<void> {
    this.assertContext(context);
    this.assertTenantMatch(context, record.tenantId);
    if (record.actorId !== context.actorId) {
      throw new Error('ACTOR_CONTEXT_MISMATCH');
    }
    return this.delegate.appendAudit({ ...record, tenantId: context.tenantId, actorId: context.actorId });
  }

  listAudit(context: AuthenticatedTenantContext): Promise<AuditRecord[]> {
    this.assertContext(context);
    return this.delegate.listAudit(context.tenantId);
  }

  private assertContext(context: AuthenticatedTenantContext): void {
    if (!context || typeof context.tenantId !== 'string' || context.tenantId.trim().length === 0) {
      throw new Error('AUTH_REQUIRED');
    }
    if (typeof context.actorId !== 'string' || context.actorId.trim().length === 0) {
      throw new Error('AUTH_INVALID');
    }
  }

  private assertTenantMatch(context: AuthenticatedTenantContext, tenantId: string): void {
    if (tenantId !== context.tenantId) throw new Error('TENANT_CONTEXT_MISMATCH');
  }
}
