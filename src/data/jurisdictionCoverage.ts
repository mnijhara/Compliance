export type JurisdictionCoverageStatus = 'VERIFIED' | 'PARTIAL' | 'NOT_VERIFIED';

export interface JurisdictionCoverage {
  jurisdiction: string;
  status: JurisdictionCoverageStatus;
  sourceIds: string[];
  lastVerified: string | null;
  /** Coverage describes the evidence pack, not legal applicability or compliance. */
  notes: string;
}

/**
 * State coverage is deliberately conservative. A government portal/source pack
 * does not by itself establish every rule, exemption, notification or control
 * applicable to an establishment. Therefore the currently registered states
 * remain PARTIAL until control-level state evidence is mapped and verified.
 */
const COVERAGE: Record<string, JurisdictionCoverage> = {
  delhi: {
    jurisdiction: 'India - Delhi',
    status: 'PARTIAL',
    sourceIds: ['delhi-labour-department', 'delhi-shops-establishments-act'],
    lastVerified: '2026-09-06',
    notes: 'Official state sources are registered, but control-level applicability is not yet fully mapped.'
  },
  karnataka: {
    jurisdiction: 'India - Karnataka',
    status: 'PARTIAL',
    sourceIds: ['karnataka-labour-district-department', 'karnataka-labour-welfare-board'],
    lastVerified: '2026-09-06',
    notes: 'Official state sources are registered, but control-level applicability is not yet fully mapped.'
  },
  maharashtra: {
    jurisdiction: 'India - Maharashtra',
    status: 'PARTIAL',
    sourceIds: ['maharashtra-labour-commissioner'],
    lastVerified: '2026-09-06',
    notes: 'Official state source is registered, but control-level applicability is not yet fully mapped.'
  }
};

function normalizeState(state: string): string {
  return state.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getJurisdictionCoverage(state?: string): JurisdictionCoverage {
  if (!state?.trim()) {
    return {
      jurisdiction: 'India - state unspecified',
      status: 'NOT_VERIFIED',
      sourceIds: [],
      lastVerified: null,
      notes: 'A state is required before state-specific applicability can be assessed.'
    };
  }

  return COVERAGE[normalizeState(state)] ?? {
    jurisdiction: `India - ${state.trim()}`,
    status: 'NOT_VERIFIED',
    sourceIds: [],
    lastVerified: null,
    notes: 'No registered state evidence pack exists yet; do not infer state-specific applicability.'
  };
}
