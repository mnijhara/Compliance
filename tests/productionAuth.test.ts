import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Request } from 'express';
import { authorizeProductionRequest } from '../src/security/productionAuth';

const request = (authorization?: string): Pick<Request, 'headers'> => ({
  headers: authorization ? { authorization } : {}
});

const productionEnv = { NODE_ENV: 'production', COMPLYOS_API_TOKEN: 'a'.repeat(32) } as NodeJS.ProcessEnv;

test('development bypass is explicit and production remains protected', () => {
  assert.deepEqual(authorizeProductionRequest(request(), { NODE_ENV: 'development' } as NodeJS.ProcessEnv), {
    allowed: true,
    reason: 'development-bypass'
  });
  assert.deepEqual(authorizeProductionRequest(request(), productionEnv), {
    allowed: false,
    status: 401,
    code: 'AUTH_REQUIRED'
  });
});

test('production authentication fails closed when no token is configured', () => {
  assert.deepEqual(authorizeProductionRequest(request('Bearer anything'), { NODE_ENV: 'production' } as NodeJS.ProcessEnv), {
    allowed: false,
    status: 503,
    code: 'AUTH_NOT_CONFIGURED'
  });
});

test('production authentication accepts only the configured bearer token', () => {
  assert.deepEqual(authorizeProductionRequest(request(`Bearer ${productionEnv.COMPLYOS_API_TOKEN}`), productionEnv), {
    allowed: true,
    reason: 'valid-token'
  });
  assert.deepEqual(authorizeProductionRequest(request('Bearer wrong-token'), productionEnv), {
    allowed: false,
    status: 401,
    code: 'AUTH_REQUIRED'
  });
});

test('short production tokens are rejected as not configured', () => {
  assert.deepEqual(authorizeProductionRequest(request('Bearer short'), {
    NODE_ENV: 'production',
    COMPLYOS_API_TOKEN: 'short'
  } as NodeJS.ProcessEnv), {
    allowed: false,
    status: 503,
    code: 'AUTH_NOT_CONFIGURED'
  });
});
