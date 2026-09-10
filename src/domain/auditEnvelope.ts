import { createHash, randomUUID } from 'node:crypto';

export interface AuditPrincipal {
  tenantId: string;
  subject: string;
}

export interface AuditEvidenceRef {
  id: string;
  sourceId?: string;
  contentHash?: string;
  verifiedAt?: string;
}

export interface AuditEventEnvelope {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  evidenceIds: string[];
  occurredAt: string;
  payloadHash: string;
  eventHash: string;
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map(key => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`;
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/**
 * Builds an audit record without retaining document text or other sensitive
 * payloads. The resulting event is safe to hand to a durable append-only
 * adapter; production persistence is intentionally a separate concern.
 */
export function createAuditEventEnvelope(input: {
  principal: AuditPrincipal;
  action: string;
  entityType: string;
  entityId?: string;
  evidence?: AuditEvidenceRef[];
  payload?: unknown;
  occurredAt?: string;
  id?: string;
}): AuditEventEnvelope {
  if (!input.principal.tenantId || !input.principal.subject) throw new Error('Audit principal is required');
  if (!input.action || !input.entityType) throw new Error('Audit action and entity type are required');

  const id = input.id || randomUUID();
  const occurredAt = input.occurredAt || new Date().toISOString();
  const evidenceIds = [...new Set((input.evidence || []).map(item => item.id).filter(Boolean))].sort();
  const payloadHash = sha256(stableJson(input.payload ?? {}));
  const eventHash = sha256(stableJson({ id, tenantId: input.principal.tenantId, actorId: input.principal.subject, action: input.action, entityType: input.entityType, entityId: input.entityId, evidenceIds, occurredAt, payloadHash }));

  return { id, tenantId: input.principal.tenantId, actorId: input.principal.subject, action: input.action, entityType: input.entityType, ...(input.entityId ? { entityId: input.entityId } : {}), evidenceIds, occurredAt, payloadHash, eventHash };
}
