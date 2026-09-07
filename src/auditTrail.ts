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
 *
 * Audit identifiers must come from a cryptographically secure UUID source.
 * Silently falling back to Math.random() can create collisions and is not an
 * acceptable identity primitive for evidence/audit records.
 */
export function createAuditEntry(input: Omit<AuditTrailEntry, 'id' | 'timestamp'>): AuditTrailEntry {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (!randomUUID) {
    throw new Error('AUDIT_ID_GENERATION_UNAVAILABLE');
  }

  return {
    ...input,
    id: randomUUID.call(globalThis.crypto),
    timestamp: new Date().toISOString()
  };
}
