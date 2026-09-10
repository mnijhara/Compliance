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

test('future-dated verification is blocked rather than treated as current', () => {
  const result = evaluateRegulatorySources([source('2026-09-10')], '2026-09-06', 30);
  assert.equal(result.status, 'BLOCKED');
  assert.deepEqual(result.invalidSourceIds, ['test-source']);
  assert.equal(result.sources[0]?.status, 'INVALID');
  assert.equal(result.sources[0]?.ageDays, null);
  assert.match(result.sources[0]?.reason ?? '', /later than the monitoring date/);
});
