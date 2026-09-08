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
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Request-Id', randomUUID());
  next();
});

const now = () => new Date().toISOString();
const sourceIds = new Set(COMPLIANCE_SOURCES.map(source => source.id));
const sourceRegistryIntegrity = validateSourceRegistry(COMPLIANCE_SOURCES);
const productionAuthGuard = createProductionAuthGuard();

// Sensitive APIs are fail-closed in production until a real identity/tenant adapter is configured.
app.use('/api/audit', productionAuthGuard);
app.use('/api/policy-generate', productionAuthGuard);
app.use('/api/chat', productionAuthGuard);
app.use('/api/agent-run', productionAuthGuard);

type AuditRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
type CitationStatus = 'VERIFIED_SOURCE' | 'NEEDS_SOURCE_VERIFICATION' | 'NOT_APPLICABLE';
interface AuditClause { id: string; clauseTitle: string; originalText: string; riskLevel: AuditRisk; sourceIds: string[]; citationStatus: CitationStatus; issueDescription: string; suggestedFix: string; }
interface AuditResult { policyTitle: string; jurisdiction: string; summary: string; overallRiskTier: AuditRisk; clauses: AuditClause[]; }
interface UploadedDocument { name: string; mimeType?: string; text?: string; data?: string; }

function validateAuditResult(value: unknown): AuditResult {
  if (!value || typeof value !== 'object') throw new Error('AI audit returned a non-object response');
  const result = value as Partial<AuditResult>;
  if (typeof result.policyTitle !== 'string' || typeof result.jurisdiction !== 'string' || typeof result.summary !== 'string' || !Array.isArray(result.clauses)) throw new Error('AI audit response failed schema validation');
  const clauses = result.clauses.map((clause) => {
    if (!clause || typeof clause !== 'object') throw new Error('AI audit returned an invalid clause');
    const candidate = clause as AuditClause;
    const verifiedIds = Array.isArray(candidate.sourceIds) ? candidate.sourceIds.filter(id => typeof id === 'string' && sourceIds.has(id)) : [];
    const citationStatus: CitationStatus = candidate.citationStatus === 'NOT_APPLICABLE' ? 'NOT_APPLICABLE' : verifiedIds.length > 0 && candidate.citationStatus === 'VERIFIED_SOURCE' ? 'VERIFIED_SOURCE' : 'NEEDS_SOURCE_VERIFICATION';
    return { ...candidate, sourceIds: verifiedIds, citationStatus };
  });
  return { policyTitle: result.policyTitle, jurisdiction: result.jurisdiction, summary: result.summary, overallRiskTier: result.overallRiskTier || 'MODERATE', clauses };
}

app.get('/api/health', (_req, res) => {
  const persistence = getPersistenceReadiness();
  const aiProxy = aiProxyStatus();
  const status = sourceRegistryIntegrity.valid ? 'ok' : 'degraded';
  res.json({ status, platform: 'ComplyOS Evidence-First Engine', version: '0.5.0', geminiAvailable: aiProxy.configured && aiProxy.healthySlots > 0, aiProxy, complianceEngine: 'evidence-first', persistence, sourceRegistryIntegrity, productionReadyForSystemOfRecord: persistence.durable && sourceRegistryIntegrity.valid, timestamp: now() });
});

app.get('/api/regulatory-monitoring', async (req, res) => {
  if (!regulatoryMonitoringRateLimit(req.ip || 'unknown')) return res.status(429).json({ error: 'Regulatory monitoring checks are temporarily rate limited.', code: 'REGULATORY_MONITORING_RATE_LIMITED' });
  const asOf = now();
  const maxAgeRaw = typeof req.query.maxAgeDays === 'string' ? Number(req.query.maxAgeDays) : 30;
  const maxAgeDays = Number.isFinite(maxAgeRaw) && maxAgeRaw >= 0 && maxAgeRaw <= 3650 ? maxAgeRaw : 30;
  const snapshot = evaluateRegulatorySources(COMPLIANCE_SOURCES, asOf, maxAgeDays);
  try {
    const checked = await checkRegulatorySourceReachability(snapshot, COMPLIANCE_SOURCES);
    return res.json({ ...checked, disclaimer: 'Source health is an operational verification signal only. Stale or unreachable sources require review and never establish compliance or non-compliance.' });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Regulatory source check failed.', code: 'REGULATORY_SOURCE_CHECK_FAILED' });
  }
});

async function startServer() {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')));
  app.listen(PORT, () => console.log(`ComplyOS listening on http://localhost:${PORT}`));
}

startServer().catch((error) => {
  console.error('ComplyOS startup failed:', error);
  process.exitCode = 1;
});
