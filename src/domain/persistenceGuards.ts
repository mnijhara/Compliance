import type { AuditRecord, EvidenceRecord } from './persistence';

const TENANT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const RECORD_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function assertTenantId(tenantId: string): void {
  if (!TENANT_ID_PATTERN.test(tenantId)) {
    throw new Error('Invalid tenant identifier');
  }
}

export function assertEvidenceRecord(record: EvidenceRecord): void {
  assertTenantId(record.tenantId);
  if (!RECORD_ID_PATTERN.test(record.id)) throw new Error('Invalid evidence record identifier');
  if (typeof record.kind !== 'string' || !record.kind.trim()) throw new Error('Evidence kind is required');
  if (typeof record.title !== 'string' || !record.title.trim()) throw new Error('Evidence title is required');
  if (typeof record.status !== 'string' || !record.status.trim()) throw new Error('Evidence status is required');
  if (!Number.isFinite(Date.parse(record.collectedAt))) throw new Error('Evidence collectedAt must be an ISO date');
  if (record.expiresAt !== undefined && !Number.isFinite(Date.parse(record.expiresAt))) throw new Error('Evidence expiresAt must be an ISO date');
  if (record.sourceId !== undefined && (typeof record.sourceId !== 'string' || !record.sourceId.trim())) throw new Error('Evidence sourceId must be a non-empty string');
  if (record.sourceUrl !== undefined && !/^https:\/\/\S+$/i.test(record.sourceUrl)) throw new Error('Evidence sourceUrl must be HTTPS');
  if (record.authority !== undefined && (typeof record.authority !== 'string' || !record.authority.trim())) throw new Error('Evidence authority must be a non-empty string');
  if (record.verifiedAt !== undefined && !Number.isFinite(Date.parse(record.verifiedAt))) throw new Error('Evidence verifiedAt must be an ISO date');
  if (record.contentHash !== undefined && (typeof record.contentHash !== 'string' || !record.contentHash.trim())) throw new Error('Evidence contentHash must be a non-empty string');
}

export function assertAuditRecord(record: AuditRecord): void {
  assertTenantId(record.tenantId);
  if (!RECORD_ID_PATTERN.test(record.id)) throw new Error('Invalid audit record identifier');
  if (typeof record.action !== 'string' || !record.action.trim()) throw new Error('Audit action is required');
  if (typeof record.actorId !== 'string' || !record.actorId.trim()) throw new Error('Audit actorId is required');
  if (!Number.isFinite(Date.parse(record.occurredAt))) throw new Error('Audit occurredAt must be an ISO date');
  if (!record.payload || typeof record.payload !== 'object' || Array.isArray(record.payload)) throw new Error('Audit payload must be an object');
}

export function assertTenantMatch(expectedTenantId: string, recordTenantId: string): void {
  assertTenantId(expectedTenantId);
  assertTenantId(recordTenantId);
  if (expectedTenantId !== recordTenantId) throw new Error('Tenant context mismatch');
}
