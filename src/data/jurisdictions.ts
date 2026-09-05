export interface JurisdictionProfile {
  country: string;
  state: string;
  establishmentTypes: string[];
  notes: string;
  sourceIds: string[];
}

/**
 * Starter jurisdiction registry. Do not infer state-law applicability from
 * this list alone; an authoritative notification/rule must be attached before
 * issuing a state-specific conclusion.
 */
export const JURISDICTION_PROFILES: JurisdictionProfile[] = [
  {
    country: 'India',
    state: 'Maharashtra',
    establishmentTypes: ['office', 'factory', 'shop', 'mixed'],
    notes: 'State-specific labour controls require the applicable current rules/notifications to be verified.',
    sourceIds: ['mole-labour-codes-effective']
  },
  {
    country: 'India',
    state: 'Delhi',
    establishmentTypes: ['office', 'factory', 'shop', 'mixed'],
    notes: 'State-specific labour controls require the applicable current rules/notifications to be verified.',
    sourceIds: ['mole-labour-codes-effective']
  },
  {
    country: 'India',
    state: 'Karnataka',
    establishmentTypes: ['office', 'factory', 'shop', 'mixed'],
    notes: 'State-specific labour controls require the applicable current rules/notifications to be verified.',
    sourceIds: ['mole-labour-codes-effective']
  }
];
