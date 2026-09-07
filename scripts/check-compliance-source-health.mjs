import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = new URL('../src/data/complianceSources.ts', import.meta.url);
const outputPath = new URL('../compliance-source-health.json', import.meta.url);
const maxAgeDays = Number.parseInt(process.env.MAX_SOURCE_AGE_DAYS ?? '30', 10);
const timeoutMs = Number.parseInt(process.env.SOURCE_TIMEOUT_MS ?? '10000', 10);
const retries = Number.parseInt(process.env.SOURCE_PROBE_RETRIES ?? '2', 10);
const strictReachability = process.env.STRICT_SOURCE_REACHABILITY === 'true';

if (!Number.isFinite(maxAgeDays) || maxAgeDays < 0) {
  throw new Error('MAX_SOURCE_AGE_DAYS must be a non-negative integer');
}
if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
  throw new Error('SOURCE_TIMEOUT_MS must be a positive integer');
}
if (!Number.isFinite(retries) || retries < 0) {
  throw new Error('SOURCE_PROBE_RETRIES must be a non-negative integer');
}

const text = await readFile(sourcePath, 'utf8');
const sourceBlocks = [...text.matchAll(/\{\n\s*id: '([^']+)',([\s\S]*?)\n\s*\},/g)];
if (sourceBlocks.length === 0) throw new Error('No compliance sources found');

const now = new Date();
const cutoff = now.getTime() - maxAgeDays * 24 * 60 * 60 * 1000;
const results = [];

async function probe(url) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'ComplyOS-source-health/1.0' },
      });
      if (response.status === 405 || response.status === 501) {
        response = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          signal: controller.signal,
          headers: { 'user-agent': 'ComplyOS-source-health/1.0' },
        });
      }
      return { ok: response.ok, status: response.status, finalUrl: response.url, attempts: attempt + 1 };
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
    if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  throw lastError;
}

for (const [, id, body] of sourceBlocks) {
  const url = body.match(/\n\s*url: '([^']+)',/)?.[1];
  const lastVerified = body.match(/\n\s*lastVerified: '([^']+)',/)?.[1];
  if (!url || !lastVerified) throw new Error(`Incomplete compliance source record: ${id}`);

  const verifiedAt = Date.parse(lastVerified);
  const fresh = Number.isFinite(verifiedAt) && verifiedAt >= cutoff;
  let probeResult;
  try {
    probeResult = await probe(url);
  } catch (error) {
    probeResult = {
      ok: false,
      status: null,
      attempts: retries + 1,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  results.push({
    id,
    url,
    lastVerified,
    fresh,
    reachable: probeResult.ok,
    httpStatus: probeResult.status ?? null,
    finalUrl: probeResult.finalUrl ?? null,
    attempts: probeResult.attempts ?? retries + 1,
    error: probeResult.error ?? null,
  });
}

const report = {
  checkedAt: now.toISOString(),
  maxAgeDays,
  strictReachability,
  sourceCount: results.length,
  sources: results,
};
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const stale = results.filter((source) => !source.fresh);
const unavailable = results.filter((source) => !source.reachable);
console.log(JSON.stringify({ checkedAt: report.checkedAt, sourceCount: report.sourceCount, stale: stale.map((s) => s.id), unavailable: unavailable.map((s) => s.id) }, null, 2));

if (stale.length || (strictReachability && unavailable.length)) {
  console.error(`Compliance source health check failed: ${stale.length} stale, ${strictReachability ? unavailable.length : 0} unavailable.`);
  process.exitCode = 1;
}
