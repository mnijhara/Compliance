import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRegulatorySourceReachability, evaluateRegulatorySources } from '../src/domain/regulatoryMonitoring';
import type { ComplianceSource } from '../src/data/complianceSources';

const source = (lastVerified: string, url = 'https://example.gov.in/source'): ComplianceSource => ({
  id: 'test-source',
  title: 'Test source',
  authority: 'Test authority',
  jurisdiction: 'India - National',
  url,
  lastVerified,
  notes: 'Test-only source.'
});

test('regulatory monitoring marks current sources READY', () => {
  const result = evaluateRegulatorySources([source('2026-09-01')], '2026-09-06', 30);
  assert.equal(result.status, 'READY');
  assert.equal(result.sources[0]?.status, 'CURRENT');
  assert.equal(result.sources[0]?.ageDays, 5);
  assert.equal(result.sources[0]?.reachability, 'NOT_CHECKED');
});

test('regulatory monitoring marks stale sources REVIEW without asserting non-compliance', () => {
  const result = evaluateRegulatorySources([source('2026-07-01')], '2026-09-06', 30);
  assert.equal(result.status, 'REVIEW');
  assert.deepEqual(result.staleSourceIds, ['test-source']);
  assert.deepEqual(result.unreachableSourceIds, []);
  assert.match(result.sources[0]?.reason ?? '', /refresh the official source/);
});

test('regulatory monitoring blocks invalid dates', () => {
  const result = evaluateRegulatorySources([source('not-a-date')], '2026-09-06', 30);
  assert.equal(result.status, 'BLOCKED');
  assert.deepEqual(result.invalidSourceIds, ['test-source']);
  assert.equal(result.sources[0]?.ageDays, null);
});

test('regulatory reachability marks healthy official sources reachable', async () => {
  const sources = [source('2026-09-06')];
  const snapshot = evaluateRegulatorySources(sources, '2026-09-06', 30);
  const checked = await checkRegulatorySourceReachability(snapshot, sources, async () => new Response(null, { status: 200 }));
  assert.equal(checked.status, 'READY');
  assert.equal(checked.sources[0]?.reachability, 'REACHABLE');
  assert.equal(checked.sources[0]?.httpStatus, 200);
});

test('regulatory reachability treats HEAD-not-supported as reachable', async () => {
  const sources = [source('2026-09-06')];
  const snapshot = evaluateRegulatorySources(sources, '2026-09-06', 30);
  const checked = await checkRegulatorySourceReachability(snapshot, sources, async () => new Response(null, { status: 405 }));
  assert.equal(checked.status, 'READY');
  assert.equal(checked.sources[0]?.reachability, 'REACHABLE');
  assert.equal(checked.sources[0]?.httpStatus, 405);
});

test('regulatory reachability marks unavailable sources REVIEW', async () => {
  const sources = [source('2026-09-06')];
  const snapshot = evaluateRegulatorySources(sources, '2026-09-06', 30);
  const checked = await checkRegulatorySourceReachability(snapshot, sources, async () => new Response(null, { status: 503 }));
  assert.equal(checked.status, 'REVIEW');
  assert.deepEqual(checked.unreachableSourceIds, ['test-source']);
  assert.equal(checked.sources[0]?.httpStatus, 503);
  assert.match(checked.sources[0]?.reachabilityError ?? '', /HTTP 503/);
});

test('regulatory reachability rejects non-HTTPS registry URLs', async () => {
  const sources = [source('2026-09-06', 'http://example.gov.in/source')];
  const snapshot = evaluateRegulatorySources(sources, '2026-09-06', 30);
  let fetchCalled = false;
  const checked = await checkRegulatorySourceReachability(snapshot, sources, async () => {
    fetchCalled = true;
    return new Response(null, { status: 200 });
  });
  assert.equal(fetchCalled, false);
  assert.equal(checked.status, 'REVIEW');
  assert.deepEqual(checked.unreachableSourceIds, ['test-source']);
  assert.match(checked.sources[0]?.reachabilityError ?? '', /HTTPS/);
});

test('regulatory reachability does not follow redirects', async () => {
  const sources = [source('2026-09-06')];
  const snapshot = evaluateRegulatorySources(sources, '2026-09-06', 30);
  let requestedInit: RequestInit | undefined;
  const checked = await checkRegulatorySourceReachability(snapshot, sources, async (_input, init) => {
    requestedInit = init;
    return new Response(null, { status: 302, headers: { location: 'http://internal.example/' } });
  });
  assert.equal(checked.status, 'READY');
  assert.equal(checked.sources[0]?.reachability, 'REACHABLE');
  assert.equal(requestedInit?.redirect, 'manual');
});
