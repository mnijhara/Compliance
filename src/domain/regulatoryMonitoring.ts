import type { ComplianceSource } from '../data/complianceSources';

export type RegulatorySourceStatus = 'CURRENT' | 'STALE' | 'INVALID';

export interface RegulatorySourceMonitorResult {
  sourceId: string;
  status: RegulatorySourceStatus;
  verifiedAt: string;
  ageDays: number | null;
  maxAgeDays: number;
  reason: string;
}

export interface RegulatoryMonitoringSnapshot {
  asOf: string;
  maxAgeDays: number;
  status: 'READY' | 'REVIEW' | 'BLOCKED';
  sources: RegulatorySourceMonitorResult[];
  staleSourceIds: string[];
  invalidSourceIds: string[];
}

const MS_PER_DAY = 86_400_000;

export function evaluateRegulatorySources(
  sources: ComplianceSource[],
  asOf: string,
  maxAgeDays = 30
): RegulatoryMonitoringSnapshot {
  const asOfMs = Date.parse(asOf);
  const safeMaxAgeDays = Number.isFinite(maxAgeDays) && maxAgeDays >= 0 ? maxAgeDays : 30;
  const results = sources.map((source): RegulatorySourceMonitorResult => {
    const verifiedAtMs = Date.parse(source.lastVerified);
    if (!Number.isFinite(asOfMs) || !Number.isFinite(verifiedAtMs)) {
      return {
        sourceId: source.id,
        status: 'INVALID',
        verifiedAt: source.lastVerified,
        ageDays: null,
        maxAgeDays: safeMaxAgeDays,
        reason: 'Verification date or monitoring date is invalid.'
      };
    }

    const ageDays = Math.max(0, Math.floor((asOfMs - verifiedAtMs) / MS_PER_DAY));
    if (ageDays > safeMaxAgeDays) {
      return {
        sourceId: source.id,
        status: 'STALE',
        verifiedAt: source.lastVerified,
        ageDays,
        maxAgeDays: safeMaxAgeDays,
        reason: `Source verification is ${ageDays} days old; refresh the official source before relying on it.`
      };
    }

    return {
      sourceId: source.id,
      status: 'CURRENT',
      verifiedAt: source.lastVerified,
      ageDays,
      maxAgeDays: safeMaxAgeDays,
      reason: 'Source verification is within the configured monitoring window.'
    };
  });

  const staleSourceIds = results.filter(result => result.status === 'STALE').map(result => result.sourceId);
  const invalidSourceIds = results.filter(result => result.status === 'INVALID').map(result => result.sourceId);

  return {
    asOf,
    maxAgeDays: safeMaxAgeDays,
    status: invalidSourceIds.length > 0 ? 'BLOCKED' : staleSourceIds.length > 0 ? 'REVIEW' : 'READY',
    sources: results,
    staleSourceIds,
    invalidSourceIds
  };
}
