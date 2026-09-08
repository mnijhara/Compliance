import * as crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export type AuthDecision =
  | { allowed: true; reason: 'development-bypass' | 'valid-token' }
  | { allowed: false; status: 401 | 503; code: 'AUTH_REQUIRED' | 'AUTH_NOT_CONFIGURED' };

function configuredToken(env: NodeJS.ProcessEnv): string | null {
  const token = env.COMPLYOS_API_TOKEN;
  return typeof token === 'string' && token.length >= 32 ? token : null;
}

export function authorizeProductionRequest(
  request: Pick<Request, 'headers'>,
  env: NodeJS.ProcessEnv = process.env
): AuthDecision {
  if (env.NODE_ENV !== 'production') return { allowed: true, reason: 'development-bypass' };

  const expected = configuredToken(env);
  if (!expected) return { allowed: false, status: 503, code: 'AUTH_NOT_CONFIGURED' };

  const header = request.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
    return { allowed: false, status: 401, code: 'AUTH_REQUIRED' };
  }

  const supplied = header.slice('Bearer '.length).trim();
  if (!supplied) return { allowed: false, status: 401, code: 'AUTH_REQUIRED' };

  const expectedBytes = Buffer.from(expected, 'utf8');
  const suppliedBytes = Buffer.from(supplied, 'utf8');
  const sameLength = expectedBytes.length === suppliedBytes.length;
  const comparisonBytes = sameLength ? suppliedBytes : Buffer.alloc(expectedBytes.length);
  const matches = crypto.timingSafeEqual(expectedBytes, comparisonBytes) && sameLength;

  return matches
    ? { allowed: true, reason: 'valid-token' }
    : { allowed: false, status: 401, code: 'AUTH_REQUIRED' };
}

/**
 * Protects sensitive production API routes until a real identity/tenant adapter
 * is connected. Never trusts user-controlled tenant headers or query parameters.
 */
export function createProductionAuthGuard(env: NodeJS.ProcessEnv = process.env) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const decision = authorizeProductionRequest(req, env);
    if (decision.allowed) {
      next();
      return;
    }
    res.status(decision.status).json({
      error: decision.code === 'AUTH_NOT_CONFIGURED'
        ? 'Production API authentication is not configured.'
        : 'A valid Bearer token is required for this production API.',
      code: decision.code
    });
  };
}
