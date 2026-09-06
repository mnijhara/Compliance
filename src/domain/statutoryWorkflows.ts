export type StatutoryWorkflowStatus = 'NOT_STARTED' | 'EVIDENCE_REQUIRED' | 'IN_REVIEW' | 'READY_FOR_APPROVAL' | 'COMPLETED';

export interface StatutoryWorkflowStep {
  id: string;
  title: string;
  requiredEvidence: string[];
  sourceIds: string[];
  status: StatutoryWorkflowStatus;
  verificationRequired: boolean;
}

export interface StatutoryWorkflowDefinition {
  id: string;
  title: string;
  jurisdiction: string;
  description: string;
  steps: StatutoryWorkflowStep[];
  disclaimer: string;
}

/**
 * Workflow templates describe operational evidence collection. They do not
 * assert that a filing, notice, threshold or deadline applies to an employer.
 * Applicability must be established from the current authoritative source.
 */
export const STATUTORY_WORKFLOWS: StatutoryWorkflowDefinition[] = [
  {
    id: 'labour-code-readiness',
    title: 'Labour Code readiness review',
    jurisdiction: 'India - National',
    description: 'Collect employer facts and evidence needed to review Labour Code applicability and implementation readiness.',
    steps: [
      {
        id: 'employer-profile',
        title: 'Confirm establishment profile',
        requiredEvidence: ['Legal entity details', 'Workplace locations', 'Employee and worker counts', 'Establishment type', 'Industry classification'],
        sourceIds: ['mole-labour-codes-effective', 'mole-labour-handbook-2026'],
        status: 'EVIDENCE_REQUIRED',
        verificationRequired: true
      },
      {
        id: 'state-applicability',
        title: 'Verify state applicability',
        requiredEvidence: ['Current state notification/rule', 'State applicability mapping'],
        sourceIds: [],
        status: 'EVIDENCE_REQUIRED',
        verificationRequired: true
      },
      {
        id: 'control-evidence',
        title: 'Review implementation evidence',
        requiredEvidence: ['Appointment-letter evidence', 'Payroll evidence', 'Contract-worker evidence where applicable', 'Working-condition safeguards where applicable'],
        sourceIds: ['mole-labour-handbook-2026'],
        status: 'EVIDENCE_REQUIRED',
        verificationRequired: true
      },
      {
        id: 'human-review',
        title: 'Human compliance review',
        requiredEvidence: ['Reviewed evidence set', 'Reviewer decision record'],
        sourceIds: [],
        status: 'NOT_STARTED',
        verificationRequired: true
      }
    ],
    disclaimer: 'Workflow completion is an operational state only. It is not a legal opinion, certification, or representation that every statutory obligation has been satisfied.'
  }
];

export function getStatutoryWorkflow(id: string): StatutoryWorkflowDefinition | undefined {
  return STATUTORY_WORKFLOWS.find(workflow => workflow.id === id);
}

export function workflowCanAdvance(step: StatutoryWorkflowStep): boolean {
  return step.requiredEvidence.length > 0 && step.verificationRequired && step.status !== 'COMPLETED';
}
