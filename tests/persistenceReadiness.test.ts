import test from 'node:test';
import assert from 'node:assert/strict';
import { getPersistenceReadiness } from '../src/domain/persistenceReadiness';

test('persistence readiness fails closed when no adapter is configured', () => {
  assert.deepEqual(getPersistenceReadiness({}), {
    configured: false,
    durable: false,
    mode: 'unconfigured'
  });
});

test('memory persistence is explicitly non-durable outside production', () => {
  assert.deepEqual(getPersistenceReadiness({ NODE_ENV: 'development', COMPLYOS_PERSISTENCE: 'memory' }), {
    configured: true,
    durable: false,
    mode: 'memory'
  });
});

test('production never reports memory persistence as configured', () => {
  assert.deepEqual(getPersistenceReadiness({ NODE_ENV: 'production', COMPLYOS_PERSISTENCE: 'memory' }), {
    configured: false,
    durable: false,
    mode: 'unconfigured'
  });
});
