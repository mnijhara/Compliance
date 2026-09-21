import { assertAuditRecord, assertEvidenceRecord, assertTenantId } from './persistenceGuards';
import type { AuditRecord, CompliancePersistence, EvidenceRecord } from './persistence';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface SupabasePersistenceConfig {
  url: string;
  anonKey: string;
  /** Returns the caller's short-lived access token for the authenticated tenant. */
  accessToken: (tenantId: string) => Promise<string> | string;
  fetchImpl?: typeof fetch;
}

type SupabaseEvidenceRow = {
  id: string;
  tenant_id: string;
  kind: string;
  title: string;
  status: string;
  collected_at: string;
  expires_at?: string | null;
  source_id?: string | null;
  source_url?: string | null;
  authority?: string | null;
  verified_at?: string | null;
  content_hash?: string | null;
  metadata?: Record<string, unknown> | null;
};

type SupabaseAuditRow = {
  id: string;
  tenant_id: string;
  actor_id: string;
  action: string;
  created_at: string;
  payload?: Record<string, unknown> | null;
};

/**
 * Durable adapter for Supabase/PostgREST.
 *
 * It deliberately requires a caller-provided access token. A service-role key
 * is never accepted, cached, or used here, so database RLS remains the final
 * tenant-isolation boundary. The token must contain the tenant_id claim used by
 * the database RPCs.
 */
export class SupabaseCompliancePersistence implements CompliancePersistence {
  private readonly baseUrl: string;
  private readonly anonKey: string;
  private readonly accessToken: SupabasePersistenceConfig['accessToken'];
  private readonly fetchImpl: typeof fetch;

  constructor(config: SupabasePersistenceConfig) {
    if (!/^https:\/\/[^\s/]+(?:\/.*)?$/i.test(config.url)) throw new Error('SUPABASE_URL_INVALID');
    if (!config.anonKey.trim()) throw new Error('SUPABASE_ANON_KEY_REQUIRED');
    this.baseUrl = config.url.replace(/\/$/, '');
    this.anonKey = config.anonKey;
    this.accessToken = config.accessToken;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async saveEvidence(record: EvidenceRecord): Promise<void> {
    assertEvidenceRecord(record);
    this.assertUuid(record.tenantId, 'tenant');
    this.assertUuid(record.id, 'evidence');
    await this.rpc('complyos_save_evidence', record.tenantId, { p_record: {
      id: record.id,
      tenantId: record.tenantId,
      kind: record.kind,
      title: record.title,
      status: record.status,
      collectedAt: record.collectedAt,
      expiresAt: record.expiresAt ?? null,
      sourceId: record.sourceId ?? null,
      sourceUrl: record.sourceUrl ?? null,
      authority: record.authority ?? null,
      verifiedAt: record.verifiedAt ?? null,
      contentHash: record.contentHash ?? null,
      metadata: record.metadata ?? {},
    } });
  }

  async listEvidence(tenantId: string): Promise<EvidenceRecord[]> {
    assertTenantId(tenantId);
    this.assertUuid(tenantId, 'tenant');
    const rows = this.requireArrayResponse(await this.rpc<unknown>('complyos_list_evidence', tenantId, {}));
    return rows.map(row => {
      if (!this.isEvidenceRow(row)) throw new Error('PERSISTENCE_RPC_INVALID_RESPONSE');
      this.assertUuid(row.tenant_id, 'returned tenant');
      if (row.tenant_id !== tenantId) throw new Error('TENANT_CONTEXT_MISMATCH');
      this.assertUuid(row.id, 'returned evidence');
      return {
        id: row.id,
        tenantId: row.tenant_id,
        kind: row.kind,
        title: row.title,
        status: row.status,
        collectedAt: row.collected_at,
        ...(row.expires_at ? { expiresAt: row.expires_at } : {}),
        ...(row.source_id ? { sourceId: row.source_id } : {}),
        ...(row.source_url ? { sourceUrl: row.source_url } : {}),
        ...(row.authority ? { authority: row.authority } : {}),
        ...(row.verified_at ? { verifiedAt: row.verified_at } : {}),
        ...(row.content_hash ? { contentHash: row.content_hash } : {}),
        metadata: row.metadata ?? {},
      };
    });
  }

  async appendAudit(record: AuditRecord): Promise<void> {
    assertAuditRecord(record);
    this.assertUuid(record.tenantId, 'tenant');
    this.assertUuid(record.id, 'audit');
    await this.rpc('complyos_append_audit', record.tenantId, { p_record: {
      id: record.id,
      tenantId: record.tenantId,
      actorId: record.actorId,
      action: record.action,
      occurredAt: record.occurredAt,
      payload: record.payload,
    } });
  }

  async listAudit(tenantId: string): Promise<AuditRecord[]> {
    assertTenantId(tenantId);
    this.assertUuid(tenantId, 'tenant');
    const rows = this.requireArrayResponse(await this.rpc<unknown>('complyos_list_audit', tenantId, {}));
    return rows.map(row => {
      if (!this.isAuditRow(row)) throw new Error('PERSISTENCE_RPC_INVALID_RESPONSE');
      this.assertUuid(row.tenant_id, 'returned tenant');
      if (row.tenant_id !== tenantId) throw new Error('TENANT_CONTEXT_MISMATCH');
      this.assertUuid(row.id, 'returned audit');
      return {
        id: row.id,
        tenantId: row.tenant_id,
        action: row.action,
        actorId: row.actor_id,
        occurredAt: row.created_at,
        payload: row.payload ?? {},
      };
    });
  }

  private requireArrayResponse(value: unknown): unknown[] {
    if (!Array.isArray(value)) throw new Error('PERSISTENCE_RPC_INVALID_RESPONSE');
    return value;
  }

  private isEvidenceRow(value: unknown): value is SupabaseEvidenceRow {
    if (!value || typeof value !== 'object') return false;
    const row = value as Record<string, unknown>;
    return typeof row.id === 'string'
      && typeof row.tenant_id === 'string'
      && typeof row.kind === 'string'
      && typeof row.title === 'string'
      && typeof row.status === 'string'
      && typeof row.collected_at === 'string'
      && (row.expires_at === undefined || row.expires_at === null || typeof row.expires_at === 'string')
      && (row.source_id === undefined || row.source_id === null || typeof row.source_id === 'string')
      && (row.source_url === undefined || row.source_url === null || typeof row.source_url === 'string')
      && (row.authority === undefined || row.authority === null || typeof row.authority === 'string')
      && (row.verified_at === undefined || row.verified_at === null || typeof row.verified_at === 'string')
      && (row.content_hash === undefined || row.content_hash === null || typeof row.content_hash === 'string')
      && (row.metadata === undefined || row.metadata === null || (typeof row.metadata === 'object' && !Array.isArray(row.metadata)));
  }

  private isAuditRow(value: unknown): value is SupabaseAuditRow {
    if (!value || typeof value !== 'object') return false;
    const row = value as Record<string, unknown>;
    return typeof row.id === 'string'
      && typeof row.tenant_id === 'string'
      && typeof row.actor_id === 'string'
      && typeof row.action === 'string'
      && typeof row.created_at === 'string'
      && (row.payload === undefined || row.payload === null || (typeof row.payload === 'object' && !Array.isArray(row.payload)));
  }

  private assertUuid(value: string, label: string): void {
    if (!UUID_PATTERN.test(value)) throw new Error(`${label} identifier must be a UUID`);
  }

  private async rpc<T = unknown>(name: string, tenantId: string, body: Record<string, unknown>): Promise<T> {
    const token = await this.accessToken(tenantId);
    if (!token || token.length > 8192) throw new Error('AUTH_TOKEN_INVALID');

    const response = await this.fetchImpl(`${this.baseUrl}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: {
        apikey: this.anonKey,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Never surface PostgREST/Supabase response bodies to callers. They can
      // contain SQL, policy, schema, or provider details that are not part of
      // the public application error contract.
      throw new Error(`PERSISTENCE_RPC_FAILED:${response.status}`);
    }

    const text = await response.text();
    try {
      return (text ? JSON.parse(text) : undefined) as T;
    } catch {
      throw new Error('PERSISTENCE_RPC_INVALID_RESPONSE');
    }
  }
}
