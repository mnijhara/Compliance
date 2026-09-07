import type { AuditTrailEntry } from '../auditTrail';

export interface IntegrityProtectedAuditEntry extends AuditTrailEntry {
  previousHash: string | null;
  integrityHash: string;
}

function canonicalPayload(entry: Omit<IntegrityProtectedAuditEntry, 'integrityHash'>): string {
  return JSON.stringify({
    id: entry.id,
    timestamp: entry.timestamp,
    actor: entry.actor,
    action: entry.action,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId,
    result: entry.result,
    details: entry.details,
    previousHash: entry.previousHash
  });
}

async function sha256(value: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error('CRYPTO_UNAVAILABLE');
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Adds a tamper-evident hash link to an audit event. This does not provide
 * durability or prove who created an event; those guarantees belong to the
 * authenticated persistence layer.
 */
export async function protectAuditEntry(
  entry: AuditTrailEntry,
  previousHash: string | null = null
): Promise<IntegrityProtectedAuditEntry> {
  const protectedEntry: Omit<IntegrityProtectedAuditEntry, 'integrityHash'> = {
    ...entry,
    previousHash
  };
  return { ...protectedEntry, integrityHash: await sha256(canonicalPayload(protectedEntry)) };
}

export async function verifyAuditEntry(entry: IntegrityProtectedAuditEntry): Promise<boolean> {
  const { integrityHash, ...payload } = entry;
  return integrityHash === await sha256(canonicalPayload(payload));
}

/**
 * Verifies both each event's own hash and the ordering links between events.
 * An empty chain is valid; a non-empty chain must begin with a null previousHash.
 */
export async function verifyAuditChain(entries: readonly IntegrityProtectedAuditEntry[]): Promise<boolean> {
  if (entries.length === 0) return true;
  if (entries[0].previousHash !== null) return false;

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (!(await verifyAuditEntry(entry))) return false;
    if (index > 0 && entry.previousHash !== entries[index - 1].integrityHash) return false;
  }
  return true;
}
