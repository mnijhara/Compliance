import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { MemoryCompliancePersistence } from '../src/domain/persistence.ts';

test('preserves authoritative source provenance on evidence records', async () => {
  const persistence = new MemoryCompliancePersistence();
  const tenantId = '11111111-1111-4111-8111-111111111111';

  await persistence.saveEvidence({
    id: '22222222-2222-4222-8222-222222222222',
    tenantId,
    kind: 'DOCUMENT',
    title: 'Official labour rule',
    status: 'REVIEW',
    collectedAt: '2026-09-21T00:00:00.000Z',
    sourceId: 'mole-code-wages-rules-2026',
    sourceUrl: 'https://www.labour.gov.in/example',
    authority: 'Ministry of Labour & Employment, Government of India',
    verifiedAt: '2026-09-20T00:00:00.000Z',
    contentHash: 'sha256:example',
    metadata: { origin: 'primary-source' },
  });

  const [record] = await persistence.listEvidence(tenantId);
  assert.equal(record.sourceId, 'mole-code-wages-rules-2026');
  assert.equal(record.sourceUrl, 'https://www.labour.gov.in/example');
  assert.equal(record.authority, 'Ministry of Labour & Employment, Government of India');
  assert.equal(record.verifiedAt, '2026-09-20T00:00:00.000Z');
  assert.equal(record.contentHash, 'sha256:example');
});
