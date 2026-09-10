import assert from 'node:assert/strict';
import test from 'node:test';
import { COMPLIANCE_SOURCES, COMPLIANCE_SOURCE_VERSION, isSourceFresh } from '../src/data/complianceSources';
import { JURISDICTION_PROFILES } from '../src/data/jurisdictionProfiles';

const sourceById = new Map(COMPLIANCE_SOURCES.map(source => [source.id, source]));

test('every jurisdiction source reference resolves to a registered source', () => {
  for (const profile of JURISDICTION_PROFILES) {
    for (const sourceId of profile.authoritativeSourceIds) {
      const source = sourceById.get(sourceId);
      assert.ok(source, `${profile.id} references missing source ${sourceId}`);
      assert.equal(source?.jurisdiction, profile.displayName, `${sourceId} jurisdiction mismatch`);
    }
  }
});

test('registered compliance sources have traceable verification metadata', () => {
  for (const source of COMPLIANCE_SOURCES) {
    assert.match(source.url, /^https:\/\//, `${source.id} must use HTTPS`);
    assert.ok(Number.isFinite(Date.parse(source.lastVerified)), `${source.id} has invalid lastVerified`);
    assert.ok(source.lastVerified <= COMPLIANCE_SOURCE_VERSION, `${source.id} is verified after the registry version`);
    assert.ok(isSourceFresh(source), `${source.id} is stale for the registry version`);
  }
});

test('source registry does not contain duplicate source identifiers', () => {
  assert.equal(sourceById.size, COMPLIANCE_SOURCES.length);
});
