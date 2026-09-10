import type { NextFunction, Request, Response } from 'express';
import { createRateLimiter } from './inputGuards';
import { isTenantPrincipal, resolveTenantPrincipal, type TenantPrincipal } from './tenantAuth';

export type AuthDecision =
  | { allowed: true; reason: 'development-bypass' | 'valid-token'; principal?: TenantPrincipal }
  | { allowed: false; status: 401 | 403 | 503; code: 'AUTH_REQUIRED' | 'AUTH_NOT_CONFIGURED' | 'TENANT_CONTEXT_MISMATCH' };

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

function scalarTenantId(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Rejects request-supplied tenant identifiers that disagree with the
 * authenticated principal. The authenticated principal remains the source of
 * truth; a missing tenant identifier is allowed so callers do not have to
 * duplicate identity data in request bodies or query strings.
 */
export function tenantContextMatchesPrincipal(
  request: Pick<Request, 'headers' | 'query' | 'body'>,
  principal: TenantPrincipal
): boolean {
  const headerTenantId = scalarTenantId(request.headers['x-tenant-id']);
  const queryTenantId = scalarTenantId(request.query?.tenantId);
  const bodyTenantId = scalarTenantId(request.body?.tenantId);
  return [headerTenantId, queryTenantId, bodyTenantId]
    .filter((value): value is string => value !== undefined)
    .every(value => value === principal.tenantId);
}

/**
 * Protects sensitive production API routes. In production, tenant identity is
 * derived exclusively from a server-configured opaque token credential and is
 * attached to the request as a verified principal. User-controlled tenant IDs
 * never become authorization inputs; if supplied, they must agree with the
 * authenticated principal or the request is rejected.
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
      if (decision.principal && !tenantContextMatchesPrincipal(req, decision.principal)) {
        res.status(403).json({
          error: 'The supplied tenant context does not match the authenticated tenant.',
          code: 'TENANT_CONTEXT_MISMATCH'
        });
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
