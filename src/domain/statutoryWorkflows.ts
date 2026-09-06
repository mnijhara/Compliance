import { isEvidenceCurrent, EvidenceItem } from './evidence';
import { ComplianceSource, isSourceFresh } from '../data/complianceSources';

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

export type WorkflowGateStatus = 'BLOCKED' | 'READY_FOR_REVIEW';

export interface WorkflowStepGate {
  status: WorkflowGateStatus;
  reasons: string[];
  currentEvidenceIds: string[];
  verifiedSourceIds: string[];
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

/**
 * Evaluate whether a workflow step has enough current evidence and source
 * freshness to enter human review. This is a gate, not a legal conclusion.
 * Evidence must belong to the step via controlId and be accepted/current.
 * Every configured source must be present and freshly verified; an empty source
 * list is intentionally blocked for steps that require statutory verification.
 */
export function evaluateWorkflowStep(
  step: StatutoryWorkflowStep,
  evidence: EvidenceItem[],
  sources: ComplianceSource[],
  asOf = new Date()
): WorkflowStepGate {
  const reasons: string[] = [];
  const currentEvidence = evidence.filter(item => item.controlId === step.id && isEvidenceCurrent(item, asOf));
  const sourceById = new Map(sources.map(source => [source.id, source]));
  const verifiedSourceIds = step.sourceIds.filter(id => {
    const source = sourceById.get(id);
    return Boolean(source && isSourceFresh(source));
  });

  if (currentEvidence.length === 0) reasons.push('CURRENT_EVIDENCE_REQUIRED');
  if (step.verificationRequired && step.sourceIds.length === 0) reasons.push('AUTHORITATIVE_SOURCE_REQUIRED');
  if (step.sourceIds.some(id => !sourceById.has(id))) reasons.push('SOURCE_REGISTRY_ID_UNKNOWN');
  if (step.sourceIds.some(id => !verifiedSourceIds.includes(id))) reasons.push('AUTHORITATIVE_SOURCE_FRESHNESS_REQUIRED');
  if (step.status === 'COMPLETED') reasons.push('STEP_ALREADY_COMPLETED');

  return {
    status: reasons.length === 0 ? 'READY_FOR_REVIEW' : 'BLOCKED',
    reasons,
    currentEvidenceIds: currentEvidence.map(item => item.id),
    verifiedSourceIds
  };
}
