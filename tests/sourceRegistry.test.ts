import assert from 'node:assert/strict';
import test from 'node:test';
import { COMPLIANCE_SOURCES } from '../src/data/complianceSources';
import { validateSourceRegistry } from '../src/domain/sourceRegistry';

test('configured compliance source registry is structurally valid', () => {
  const result = validateSourceRegistry(COMPLIANCE_SOURCES, new Date('2026-09-19T00:00:00Z'));
  assert.equal(result.valid, true, JSON.stringify(result.issues));
  assert.deepEqual(result.issues, []);
});

test('registry rejects duplicate IDs and non-HTTPS URLs', () => {
  const source = { ...COMPLIANCE_SOURCES[0], url: 'http://example.gov.in' };
  const result = validateSourceRegistry([source, { ...source }], new Date('2026-09-19T00:00:00Z'));
  assert.equal(result.valid, false);
  assert.ok(result.issues.some(issue => issue.code === 'DUPLICATE_ID'));
  assert.ok(result.issues.some(issue => issue.code === 'INVALID_URL'));
});

test('registry rejects malformed verification and effective dates', () => {
  const source = { ...COMPLIANCE_SOURCES[0], lastVerified: '06-09-2026', effectiveDate: '2025/11/21' };
  const result = validateSourceRegistry([source], new Date('2026-09-19T00:00:00Z'));
  assert.equal(result.valid, false);
  assert.ok(result.issues.some(issue => issue.code === 'INVALID_VERIFICATION_DATE'));
  assert.ok(result.issues.some(issue => issue.code === 'INVALID_EFFECTIVE_DATE'));
});

test('registry rejects verification dates in the future relative to the supplied as-of time', () => {
  const source = { ...COMPLIANCE_SOURCES[0], lastVerified: '2026-09-20' };
  const result = validateSourceRegistry([source], new Date('2026-09-19T22:00:00+05:30'));
  assert.equal(result.valid, false);
  assert.ok(result.issues.some(issue => issue.code === 'FUTURE_VERIFICATION_DATE'));
});
