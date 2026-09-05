export interface JurisdictionProfile {
  id: string;
  country: string;
  state: string;
  displayName: string;
  status: 'SOURCE_REQUIRED' | 'SOURCE_VERIFIED';
  authoritativeSourceTypes: string[];
  verificationPolicy: string;
  applicabilityInputs: string[];
}

/**
 * State profiles deliberately describe the evidence that must be collected.
 * They do not encode unsupported state-law conclusions.
 */
export const JURISDICTION_PROFILES: JurisdictionProfile[] = [
  {
    id: 'india-national', country: 'India', state: 'National', displayName: 'India - National', status: 'SOURCE_VERIFIED',
    authoritativeSourceTypes: ['Ministry of Labour & Employment', 'Central Government Gazette / notified rules'],
    verificationPolicy: 'Refresh against current primary legislation, notified rules and official government notifications before a material legal conclusion.',
    applicabilityInputs: ['employeeCount', 'establishmentType', 'industry', 'contractWorkers', 'nightShift']
  },
  {
    id: 'india-delhi', country: 'India', state: 'Delhi', displayName: 'India - Delhi', status: 'SOURCE_REQUIRED',
    authoritativeSourceTypes: ['Government of NCT of Delhi labour authority', 'Delhi Gazette / notified rules', 'Central Government where applicable'],
    verificationPolicy: 'A Delhi-specific conclusion requires a current primary Delhi source mapped to the control and verification date.',
    applicabilityInputs: ['employeeCount', 'establishmentType', 'industry', 'workplaceLocation', 'contractWorkers', 'nightShift']
  },
  {
    id: 'india-karnataka', country: 'India', state: 'Karnataka', displayName: 'India - Karnataka', status: 'SOURCE_REQUIRED',
    authoritativeSourceTypes: ['Government of Karnataka labour authority', 'Karnataka Gazette / notified rules', 'Central Government where applicable'],
    verificationPolicy: 'A Karnataka-specific conclusion requires a current primary Karnataka source mapped to the control and verification date.',
    applicabilityInputs: ['employeeCount', 'establishmentType', 'industry', 'workplaceLocation', 'contractWorkers', 'nightShift']
  },
  {
    id: 'india-maharashtra', country: 'India', state: 'Maharashtra', displayName: 'India - Maharashtra', status: 'SOURCE_REQUIRED',
    authoritativeSourceTypes: ['Government of Maharashtra labour authority', 'Maharashtra Gazette / notified rules', 'Central Government where applicable'],
    verificationPolicy: 'A Maharashtra-specific conclusion requires a current primary Maharashtra source mapped to the control and verification date.',
    applicabilityInputs: ['employeeCount', 'establishmentType', 'industry', 'workplaceLocation', 'contractWorkers', 'nightShift']
  }
];

export function getJurisdictionProfile(jurisdiction: string): JurisdictionProfile | undefined {
  const normalized = jurisdiction.trim().toLowerCase();
  return JURISDICTION_PROFILES.find(profile => profile.displayName.toLowerCase() === normalized);
}
