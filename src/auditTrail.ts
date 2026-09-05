export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resourceType: string;
  resourceId: string;
  result: 'SUCCESS' | 'REVIEW' | 'FAILURE';
  details: string;
}

/**
 * Client-safe audit entry factory. Persistence should be supplied by the
 * authenticated backend; this helper deliberately does not claim durability.
 */
export function createAuditEntry(input: Omit<AuditTrailEntry, 'id' | 'timestamp'>): AuditTrailEntry {
  return {
    ...input,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString()
  };
}
