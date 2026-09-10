import assert from 'node:assert/strict';
import test from 'node:test';
import { publicStatus } from '../src/aiRouter';

test('AI public status does not expose proxy internals or key-slot counts', () => {
  const status = publicStatus();

  assert.equal('proxy' in status, false);
  assert.equal('keySlots' in status, false);
  assert.equal('healthySlots' in status, false);
  assert.equal(typeof status.configured, 'boolean');
  assert.equal(typeof status.healthy, 'boolean');
  assert.equal(typeof status.model, 'string');
});
