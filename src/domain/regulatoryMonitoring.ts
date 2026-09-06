import type { ComplianceSource } from '../data/complianceSources';

export type RegulatorySourceStatus = 'CURRENT' | 'STALE' | 'INVALID';
export type RegulatorySourceReachability = 'REACHABLE' | 'UNREACHABLE' | 'NOT_CHECKED';

export interface RegulatorySourceMonitorResult {
  sourceId: string;
  status: RegulatorySourceStatus;
  verifiedAt: string;
  ageDays: number | null;
  maxAgeDays: number;
  reason: string;
  reachability: RegulatorySourceReachability;
  httpStatus?: number;
  reachabilityError?: string;
}

export interface RegulatoryMonitoringSnapshot {
  asOf: string;
  maxAgeDays: number;
  status: 'READY' | 'REVIEW' | 'BLOCKED';
  sources: RegulatorySourceMonitorResult[];
  staleSourceIds: string[];
  invalidSourceIds: string[];
  unreachableSourceIds: string[];
}

const MS_PER_DAY = 86_400_000;
const DEFAULT_REACHABILITY_TIMEOUT_MS = 4_000;

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
        reason: 'Verification date or monitoring date is invalid.',
        reachability: 'NOT_CHECKED'
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
        reason: `Source verification is ${ageDays} days old; refresh the official source before relying on it.`,
        reachability: 'NOT_CHECKED'
      };
    }

    return {
      sourceId: source.id,
      status: 'CURRENT',
      verifiedAt: source.lastVerified,
      ageDays,
      maxAgeDays: safeMaxAgeDays,
      reason: 'Source verification is within the configured monitoring window.',
      reachability: 'NOT_CHECKED'
    };
  });

  return buildSnapshot(results, asOf, safeMaxAgeDays);
}

function buildSnapshot(
  sources: RegulatorySourceMonitorResult[],
  asOf: string,
  maxAgeDays: number
): RegulatoryMonitoringSnapshot {
  const staleSourceIds = sources.filter(result => result.status === 'STALE').map(result => result.sourceId);
  const invalidSourceIds = sources.filter(result => result.status === 'INVALID').map(result => result.sourceId);
  const unreachableSourceIds = sources.filter(result => result.reachability === 'UNREACHABLE').map(result => result.sourceId);

  return {
    asOf,
    maxAgeDays,
    status: invalidSourceIds.length > 0 ? 'BLOCKED' : staleSourceIds.length > 0 || unreachableSourceIds.length > 0 ? 'REVIEW' : 'READY',
    sources,
    staleSourceIds,
    invalidSourceIds,
    unreachableSourceIds
  };
}

export type RegulatoryFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

function isAllowedSourceUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

async function probeSource(source: ComplianceSource, fetcher: RegulatoryFetch, timeoutMs: number): Promise<Pick<RegulatorySourceMonitorResult, 'reachability' | 'httpStatus' | 'reachabilityError'>> {
  if (!isAllowedSourceUrl(source.url)) {
    return { reachability: 'UNREACHABLE', reachabilityError: 'Source URL must use HTTPS.' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(source.url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    if (response.ok || (response.status >= 300 && response.status < 400)) {
      return { reachability: 'REACHABLE', httpStatus: response.status };
    }
    return { reachability: 'UNREACHABLE', httpStatus: response.status, reachabilityError: `Official source returned HTTP ${response.status}.` };
  } catch (error) {
    return { reachability: 'UNREACHABLE', reachabilityError: error instanceof Error ? error.name === 'AbortError' ? 'Source check timed out.' : error.message : 'Source check failed.' };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Performs network checks only against URLs already present in the trusted
 * source registry. A failed reachability check triggers REVIEW; it never
 * upgrades a control or asserts non-compliance.
 */
export async function checkRegulatorySourceReachability(
  snapshot: RegulatoryMonitoringSnapshot,
  sources: ComplianceSource[],
  fetcher: RegulatoryFetch = fetch,
  timeoutMs = DEFAULT_REACHABILITY_TIMEOUT_MS
): Promise<RegulatoryMonitoringSnapshot> {
  const sourceById = new Map(sources.map(source => [source.id, source]));
  const checks = await Promise.all(snapshot.sources.map(async result => {
    const source = sourceById.get(result.sourceId);
    if (!source) return { ...result, reachability: 'UNREACHABLE' as const, reachabilityError: 'Source is missing from the registry.' };
    return { ...result, ...(await probeSource(source, fetcher, timeoutMs)) };
  }));

  return buildSnapshot(checks, snapshot.asOf, snapshot.maxAgeDays);
}
