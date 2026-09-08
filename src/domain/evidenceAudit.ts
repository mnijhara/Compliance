export interface EvidenceItem {
  id: string;
  tenantId: string;
  sourceId?: string;
  title: string;
  sourceUrl?: string;
  authority?: string;
  verifiedAt?: string;
  contentHash?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  evidenceIds: string[];
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface EvidenceAuditStore {
  appendEvidence(item: Omit<EvidenceItem, 'id' | 'createdAt'>): Promise<EvidenceItem>;
  appendAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>): Promise<AuditEvent>;
  listEvidence(tenantId: string, limit?: number): Promise<EvidenceItem[]>;
  listAuditEvents(tenantId: string, limit?: number): Promise<AuditEvent[]>;
}

export interface VerifiedPrincipal {
  subject: string;
  tenantId: string;
  authenticated: true;
}

export interface TenantContext {
  subject: string;
  tenantId: string;
}

export function assertTenantId(tenantId: unknown): asserts tenantId is string {
  if (typeof tenantId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)) {
    throw new Error('A valid tenant identifier is required');
  }
}

/**
 * Derives tenant context only from an already-verified principal. Tenant IDs
 * supplied by request headers, query parameters, or bodies must never reach
 * tenant-scoped storage APIs.
 */
export function requireTenantContext(principal: VerifiedPrincipal | null | undefined): TenantContext {
  if (!principal || principal.authenticated !== true) {
    throw new Error('Verified authentication is required');
  }
  if (typeof principal.subject !== 'string' || principal.subject.trim() === '') {
    throw new Error('Verified subject is required');
  }
  assertTenantId(principal.tenantId);
  return { subject: principal.subject, tenantId: principal.tenantId };
}

export function boundedAuditLimit(limit: number | undefined): number {
  if (limit === undefined) return 100;
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error('Audit/evidence limit must be an integer from 1 to 500');
  return limit;
}
