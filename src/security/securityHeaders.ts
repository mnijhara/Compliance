export interface SecurityHeaderRequest {
  path: string;
  production: boolean;
}

export function getSecurityHeaders(request: SecurityHeaderRequest): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };

  if (request.production) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }

  if (request.path.startsWith('/api/')) {
    headers['Cache-Control'] = 'no-store';
  }

  return headers;
}
