export type EvidenceKind = 'DOCUMENT' | 'REGISTER' | 'PAYROLL' | 'POLICY' | 'GOVERNMENT_SOURCE' | 'OTHER';
export type EvidenceStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface EvidenceItem {
  id: string;
  tenantId: string;
  controlId: string;
  kind: EvidenceKind;
  title: string;
  sourceUri?: string;
  contentHash: string;
  collectedAt: string;
  verifiedAt?: string;
  expiresAt?: string;
  status: EvidenceStatus;
  verifiedBy?: string;
  notes?: string;
}

export function isEvidenceCurrent(item: EvidenceItem, at = new Date()): boolean {
  if (item.status !== 'ACCEPTED') return false;
  if (item.expiresAt && new Date(item.expiresAt).getTime() < at.getTime()) return false;
  return Boolean(item.verifiedAt);
}

export function evidenceCanSupportPass(item: EvidenceItem, at = new Date()): boolean {
  return isEvidenceCurrent(item, at) && Boolean(item.contentHash);
}
