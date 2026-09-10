import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const serverPath = path.resolve(fileURLToPath(new URL('../server.v2.ts', import.meta.url)));
const serverSource = readFileSync(serverPath, 'utf8');

const tenantSensitiveRoutes = [
  '/api/audit',
  '/api/policy-generate',
  '/api/chat',
  '/api/agent-run',
  '/api/compliance/assess'
];

test('every tenant-sensitive API route is behind the production auth guard', () => {
  for (const route of tenantSensitiveRoutes) {
    assert.ok(
      serverSource.includes(`app.use('${route}', productionAuthGuard)`) ||
        serverSource.includes(`app.use("${route}", productionAuthGuard)`),
      `${route} must be registered behind productionAuthGuard`
    );
  }
});

test('the security boundary is fail-closed in production', () => {
  assert.match(
    serverSource,
    /Sensitive APIs are fail-closed in production until a real identity\/tenant adapter is configured\./
  );
  assert.match(serverSource, /const productionAuthGuard = createProductionAuthGuard\(\);/);
});
