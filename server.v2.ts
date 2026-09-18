import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { assessCompliance, ComplianceProfile } from './src/complianceEngine';
import { COMPLIANCE_SOURCES } from './src/data/complianceSources';
import { evaluateRegulatorySources, checkRegulatorySourceReachability } from './src/domain/regulatoryMonitoring';
import { getPersistenceReadiness } from './src/domain/persistenceReadiness';
import { validateSourceRegistry } from './src/domain/sourceRegistry';
import { createRateLimiter, isNonEmptyString, MAX_DOCUMENT_CHARS, MAX_MESSAGE_CHARS, MAX_POLICY_FIELD_CHARS } from './src/security/inputGuards';
import { getSecurityHeaders } from './src/security/securityHeaders';
import { createProductionAuthGuard } from './src/security/productionAuth';
import { generate as generateAI, publicStatus as aiProxyStatus } from './src/aiRouter';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
const apiRateLimit = createRateLimiter(120, 60_000);
const regulatoryMonitoringRateLimit = createRateLimiter(6, 60_000);
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (!apiRateLimit(req.ip || 'unknown')) return res.status(429).json({ error: 'Too many requests. Please retry shortly.', code: 'RATE_LIMITED' });
  next();
});
app.use((_req, res, next) => {
  const headers = getSecurityHeaders({ path: _req.path, production: process.env.NODE_ENV === 'production' });
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  res.setHeader('X-Request-Id', randomUUID());
  next();
});

const now = () => new Date().toISOString();
const sourceIds = new Set(COMPLIANCE_SOURCES.map(source => source.id));
const sourceRegistryIntegrity = validateSourceRegistry(COMPLIANCE_SOURCES);
const productionAuthGuard = createProductionAuthGuard();
