import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRegulatorySources } from '../src/domain/regulatoryMonitoring';
import type { ComplianceSource } from '../src/data/complianceSources';

const source = (lastVerified: string): ComplianceSource => ({
  id: 'test-source',
  title: 'Test source',
  authority: 'Test authority',
  jurisdiction: 'India - National',
  url: 'https://example.gov.in/source',
  lastVerified,
  notes: 'Test-only source.'
});

test('regulatory monitoring marks current sources READY', () => {
  const result = evaluateRegulatorySources([source('2026-09-01')], '2026-09-06', 30);
  assert.equal(result.status, 'READY');
  assert.equal(result.sources[0]?.status, 'CURRENT');
  assert.equal(result.sources[0]?.ageDays, 5);
});

test('regulatory monitoring marks stale sources REVIEW without asserting non-compliance', () => {
  const result = evaluateRegulatorySources([source('2026-07-01')], '2026-09-06', 30);
  assert.equal(result.status, 'REVIEW');
  assert.deepEqual(result.staleSourceIds, ['test-source']);
  assert.match(result.sources[0]?.reason ?? '', /refresh the official source/);
});

test('regulatory monitoring blocks invalid dates', () => {
  const result = evaluateRegulatorySources([source('not-a-date')], '2026-09-06', 30);
  assert.equal(result.status, 'BLOCKED');
  assert.deepEqual(result.invalidSourceIds, ['test-source']);
  assert.equal(result.sources[0]?.ageDays, null);
});
