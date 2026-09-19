import { randomUUID } from 'crypto';
import { assertAuditRecord, assertEvidenceRecord, assertTenantId } from './persistenceGuards';

export interface EvidenceRecord {
  id: string;
  tenantId: string;
  kind: string;
  title: string;
  status: string;
  collectedAt: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditRecord {
  id: string;
  tenantId: string;
  action: string;
  actorId: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface CompliancePersistence {
  saveEvidence(record: EvidenceRecord): Promise<void>;
  listEvidence(tenantId: string): Promise<EvidenceRecord[]>;
  appendAudit(record: AuditRecord): Promise<void>;
  listAudit(tenantId: string): Promise<AuditRecord[]>;
}

export class PersistenceNotConfiguredError extends Error {
  readonly code = 'PERSISTENCE_NOT_CONFIGURED';

  constructor() {
    super('Durable persistence is not configured for this deployment.');
    this.name = 'PersistenceNotConfiguredError';
  }
}

/**
 * Signals a duplicate record id. Durable PostgreSQL storage enforces the same
 * invariant through primary keys; the development adapter mirrors it so retry
 * and idempotency behavior cannot diverge between test and production.
 */
export class PersistenceConflictError extends Error {
  readonly code = 'PERSISTENCE_CONFLICT';

  constructor(recordType: 'evidence' | 'audit', id: string) {
    super(`A ${recordType} record with id ${id} already exists.`);
    this.name = 'PersistenceConflictError';
  }
}

/**
 * Process-local adapter for development/tests only. It deliberately does not
 * claim durability and must never be used as a compliance system of record.
 */
export class MemoryCompliancePersistence implements CompliancePersistence {
  private readonly evidence = new Map<string, EvidenceRecord[]>();
  private readonly audit = new Map<string, AuditRecord[]>();

  async saveEvidence(record: EvidenceRecord): Promise<void> {
    assertEvidenceRecord(record);
    const records = this.evidence.get(record.tenantId) ?? [];
    if (records.some(existing => existing.id === record.id)) {
      throw new PersistenceConflictError('evidence', record.id);
    }
    records.push({ ...record, metadata: record.metadata ? { ...record.metadata } : undefined });
    this.evidence.set(record.tenantId, records);
  }

  async listEvidence(tenantId: string): Promise<EvidenceRecord[]> {
    assertTenantId(tenantId);
    return (this.evidence.get(tenantId) ?? []).map(record => ({ ...record, metadata: record.metadata ? { ...record.metadata } : undefined }));
  }

  async appendAudit(record: AuditRecord): Promise<void> {
    assertAuditRecord(record);
    const records = this.audit.get(record.tenantId) ?? [];
    if (records.some(existing => existing.id === record.id)) {
      throw new PersistenceConflictError('audit', record.id);
    }
    records.push({ ...record, payload: { ...record.payload } });
    this.audit.set(record.tenantId, records);
  }

  async listAudit(tenantId: string): Promise<AuditRecord[]> {
    assertTenantId(tenantId);
    return (this.audit.get(tenantId) ?? []).map(record => ({ ...record, payload: { ...record.payload } }));
  }
}

export function createPersistence(env: NodeJS.ProcessEnv = process.env): CompliancePersistence {
  // Memory persistence is intentionally unavailable in production. Allowing
  // it there would make a deployment appear writable while losing the system
  // of record on restart or across replicas.
  if (env.COMPLYOS_PERSISTENCE === 'memory' && env.NODE_ENV !== 'production') {
    return new MemoryCompliancePersistence();
  }
  return {
    async saveEvidence() { throw new PersistenceNotConfiguredError(); },
    async listEvidence() { throw new PersistenceNotConfiguredError(); },
    async appendAudit() { throw new PersistenceNotConfiguredError(); },
    async listAudit() { throw new PersistenceNotConfiguredError(); }
  };
}

export function createRecordId(): string {
  return randomUUID();
}
