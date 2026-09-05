import { randomUUID } from 'crypto';

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
 * Process-local adapter for development/tests only. It deliberately does not
 * claim durability and must never be used as a compliance system of record.
 */
export class MemoryCompliancePersistence implements CompliancePersistence {
  private readonly evidence = new Map<string, EvidenceRecord[]>();
  private readonly audit = new Map<string, AuditRecord[]>();

  async saveEvidence(record: EvidenceRecord): Promise<void> {
    const records = this.evidence.get(record.tenantId) ?? [];
    records.push({ ...record });
    this.evidence.set(record.tenantId, records);
  }

  async listEvidence(tenantId: string): Promise<EvidenceRecord[]> {
    return (this.evidence.get(tenantId) ?? []).map(record => ({ ...record }));
  }

  async appendAudit(record: AuditRecord): Promise<void> {
    const records = this.audit.get(record.tenantId) ?? [];
    records.push({ ...record, payload: { ...record.payload } });
    this.audit.set(record.tenantId, records);
  }

  async listAudit(tenantId: string): Promise<AuditRecord[]> {
    return (this.audit.get(tenantId) ?? []).map(record => ({ ...record, payload: { ...record.payload } }));
  }
}

export function createPersistence(): CompliancePersistence {
  if (process.env.COMPLYOS_PERSISTENCE === 'memory') return new MemoryCompliancePersistence();
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
