import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAuditResult } from '../src/domain/aiAuditSchema';

const sources = new Set(['mole-labour-codes-effective']);

const validResult = () => ({
  policyTitle: 'Employment Policy',
  jurisdiction: 'India - National',
  summary: 'Review requires human verification.',
  overallRiskTier: 'MODERATE',
  clauses: [{
    id: 'clause-1',
    clauseTitle: 'Notice clause',
    originalText: 'Original clause text',
    riskLevel: 'HIGH',
    sourceIds: ['mole-labour-codes-effective', 'unknown-source'],
    citationStatus: 'VERIFIED_SOURCE',
    issueDescription: 'Potential issue requiring review.',
    suggestedFix: 'Verify against the current primary source.'
  }]
});

test('accepts a bounded structured audit result and strips unknown source IDs', () => {
  const result = validateAuditResult(validResult(), sources);
  assert.equal(result.overallRiskTier, 'MODERATE');
  assert.deepEqual(result.clauses[0]?.sourceIds, ['mole-labour-codes-effective']);
  assert.equal(result.clauses[0]?.citationStatus, 'VERIFIED_SOURCE');
});

test('rejects unsupported risk tiers instead of silently defaulting', () => {
  const value = validResult();
  value.overallRiskTier = 'CERTIFIED';
  assert.throws(() => validateAuditResult(value, sources), /invalid overallRiskTier/);
});

test('rejects unsupported clause risk levels', () => {
  const value = validResult();
  value.clauses[0].riskLevel = 'CERTIFIED';
  assert.throws(() => validateAuditResult(value, sources), /invalid riskLevel/);
});

test('rejects unsupported citation states', () => {
  const value = validResult();
  value.clauses[0].citationStatus = 'LEGAL_ADVICE';
  assert.throws(() => validateAuditResult(value, sources), /invalid citationStatus/);
});

test('rejects missing required clause text', () => {
  const value = validResult();
  value.clauses[0].suggestedFix = '';
  assert.throws(() => validateAuditResult(value, sources), /invalid clause\[0\]\.suggestedFix/);
});
