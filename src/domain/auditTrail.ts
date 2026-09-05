export type AuditAction =
  | 'ASSESSMENT_CREATED'
  | 'EVIDENCE_ATTACHED'
  | 'CONTROL_REVIEWED'
  | 'SOURCE_VERIFIED'
  | 'POLICY_GENERATED'
  | 'AI_REVIEW_COMPLETED';

export interface AuditEvent {
  id: string;
  tenantId: string;
  actorId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
  previousHash: string | null;
  hash: string;
}

/**
 * Deterministic canonical representation used for tamper-evident event chains.
 * Persistence and cryptographic signing are intentionally separate concerns.
 */
export function canonicalAuditPayload(event: Omit<AuditEvent, 'hash'>): string {
  return JSON.stringify({
    id: event.id,
    tenantId: event.tenantId,
    actorId: event.actorId,
    action: event.action,
    entityType: event.entityType,
    entityId: event.entityId,
    occurredAt: event.occurredAt,
    metadata: event.metadata,
    previousHash: event.previousHash
  });
}
