import { readFile } from 'node:fs/promises';

const path = new URL('../src/data/complianceSources.ts', import.meta.url);
const text = await readFile(path, 'utf8');

const versionMatch = text.match(/export const COMPLIANCE_SOURCE_VERSION\s*=\s*'([^']+)'/);
if (!versionMatch) throw new Error('COMPLIANCE_SOURCE_VERSION is missing');

const registryVersion = Date.parse(versionMatch[1]);
if (!Number.isFinite(registryVersion)) throw new Error(`Invalid COMPLIANCE_SOURCE_VERSION: ${versionMatch[1]}`);

const sourceBlocks = [...text.matchAll(/\{\n\s*id: '([^']+)',([\s\S]*?)\n\s*\},/g)];
if (sourceBlocks.length === 0) throw new Error('No compliance sources found');

const ids = new Set();
for (const [, id, body] of sourceBlocks) {
  if (ids.has(id)) throw new Error(`Duplicate compliance source id: ${id}`);
  ids.add(id);

  const url = body.match(/\n\s*url: '([^']+)',/);
  const verified = body.match(/\n\s*lastVerified: '([^']+)',/);
  const title = body.match(/\n\s*title: '([^']+)',/);
  const authority = body.match(/\n\s*authority: '([^']+)',/);
  const jurisdiction = body.match(/\n\s*jurisdiction: '([^']+)',/);
  const notes = body.match(/\n\s*notes: '([^']+)'/);

  if (!title || !authority || !jurisdiction || !url || !verified || !notes) {
    throw new Error(`Incomplete compliance source record: ${id}`);
  }
  if (!url[1].startsWith('https://')) throw new Error(`Non-HTTPS compliance source URL: ${id}`);

  const verifiedAt = Date.parse(verified[1]);
  if (!Number.isFinite(verifiedAt)) throw new Error(`Invalid lastVerified for ${id}: ${verified[1]}`);
  // COMPLIANCE_SOURCE_VERSION is an as-of floor: a source verified after the
  // snapshot is newer and therefore valid. A stale verification predating the
  // snapshot is what must fail the registry integrity gate.
  if (verifiedAt < registryVersion) {
    throw new Error(`Source ${id} is verified before registry version ${versionMatch[1]}`);
  }
}

console.log(`Validated ${sourceBlocks.length} compliance sources at registry version ${versionMatch[1]}.`);
