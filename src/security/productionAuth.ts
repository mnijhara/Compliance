import type { NextFunction, Request, Response } from 'express';
import { createRateLimiter } from './inputGuards';
import { isTenantPrincipal, resolveTenantPrincipal, type TenantPrincipal } from './tenantAuth';

export type AuthDecision =
  | { allowed: true; reason: 'development-bypass' | 'valid-token'; principal?: TenantPrincipal }
  | { allowed: false; status: 401 | 503; code: 'AUTH_REQUIRED' | 'AUTH_NOT_CONFIGURED' };

type AuthorizationRequest = { headers: { authorization?: string } };
type AuthenticatedRequest = Request & { complyosPrincipal?: TenantPrincipal };

function tenantCredentialsConfigured(env: NodeJS.ProcessEnv): boolean {
  return typeof env.COMPLYOS_API_TOKENS_JSON === 'string' && env.COMPLYOS_API_TOKENS_JSON.trim().length > 0;
}

export function authorizeProductionRequest(
  request: AuthorizationRequest,
  env: NodeJS.ProcessEnv = process.env
): AuthDecision {
  if (env.NODE_ENV !== 'production') return { allowed: true, reason: 'development-bypass' };

  if (!tenantCredentialsConfigured(env)) {
    return { allowed: false, status: 503, code: 'AUTH_NOT_CONFIGURED' };
  }

  const principal = resolveTenantPrincipal(request.headers.authorization, env);
  return principal
    ? { allowed: true, reason: 'valid-token', principal }
    : { allowed: false, status: 401, code: 'AUTH_REQUIRED' };
}

/**
 * Protects sensitive production API routes. In production, tenant identity is
 * derived exclusively from a server-configured opaque token credential and is
 * attached to the request as a verified principal. User-controlled tenant IDs
 * in headers, query parameters, and bodies are never authorization inputs.
 */
export function createProductionAuthGuard(env: NodeJS.ProcessEnv = process.env) {
  const authRateLimit = createRateLimiter(60, 60_000);

  return (req: Request, res: Response, next: NextFunction): void => {
    if (env.NODE_ENV === 'production' && !authRateLimit(req.ip || 'unknown')) {
      res.status(429).json({
        error: 'Too many authentication attempts. Please retry shortly.',
        code: 'AUTH_RATE_LIMITED'
      });
      return;
    }

    const decision = authorizeProductionRequest(req, env);
    if (decision.allowed) {
      if (decision.principal && !isTenantPrincipal(decision.principal)) {
        res.status(503).json({ error: 'Authenticated tenant principal is invalid.', code: 'AUTH_PRINCIPAL_INVALID' });
        return;
      }
      const authenticatedRequest = req as AuthenticatedRequest;
      authenticatedRequest.complyosPrincipal = decision.principal;
      next();
      return;
    }

    if (decision.allowed === false) {
      const { status, code } = decision;
      res.status(status).json({
        error: code === 'AUTH_NOT_CONFIGURED'
          ? 'Production API authentication is not configured for tenant-aware access.'
          : 'A valid tenant-scoped Bearer credential is required for this production API.',
        code
      });
    }
  };
}
