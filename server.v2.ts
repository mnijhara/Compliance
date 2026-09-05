import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { assessCompliance, ComplianceProfile } from './src/complianceEngine';
import { COMPLIANCE_SOURCES } from './src/data/complianceSources';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
app.disable('x-powered-by');
app.use(express.json({ limit: '10mb' }));
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Request-Id', randomUUID());
  next();
});

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({ apiKey });
}

const now = () => new Date().toISOString();
const sourceIds = new Set(COMPLIANCE_SOURCES.map(source => source.id));

type AuditRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
type CitationStatus = 'VERIFIED_SOURCE' | 'NEEDS_SOURCE_VERIFICATION' | 'NOT_APPLICABLE';
interface AuditClause { id: string; clauseTitle: string; originalText: string; riskLevel: AuditRisk; sourceIds: string[]; citationStatus: CitationStatus; issueDescription: string; suggestedFix: string; }
interface AuditResult { policyTitle: string; jurisdiction: string; summary: string; overallRiskTier: AuditRisk; clauses: AuditClause[]; }

const auditResponseSchema = {
  type: 'object',
  properties: {
    policyTitle: { type: 'string' },
    jurisdiction: { type: 'string' },
    summary: { type: 'string' },
    overallRiskTier: { type: 'string', enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] },
    clauses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          clauseTitle: { type: 'string' },
          originalText: { type: 'string' },
          riskLevel: { type: 'string', enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] },
          sourceIds: { type: 'array', items: { type: 'string' } },
          citationStatus: { type: 'string', enum: ['VERIFIED_SOURCE', 'NEEDS_SOURCE_VERIFICATION', 'NOT_APPLICABLE'] },
          issueDescription: { type: 'string' },
          suggestedFix: { type: 'string' }
        },
        required: ['id', 'clauseTitle', 'originalText', 'riskLevel', 'sourceIds', 'citationStatus', 'issueDescription', 'suggestedFix']
      }
    }
  },
  required: ['policyTitle', 'jurisdiction', 'summary', 'overallRiskTier', 'clauses']
};

function validateAuditResult(value: unknown): AuditResult {
  if (!value || typeof value !== 'object') throw new Error('AI audit returned a non-object response');
  const result = value as Partial<AuditResult>;
  if (typeof result.policyTitle !== 'string' || typeof result.jurisdiction !== 'string' || typeof result.summary !== 'string' || !Array.isArray(result.clauses)) {
    throw new Error('AI audit response failed schema validation');
  }
  const clauses = result.clauses.map((clause) => {
    if (!clause || typeof clause !== 'object') throw new Error('AI audit returned an invalid clause');
    const candidate = clause as AuditClause;
    const verifiedIds = Array.isArray(candidate.sourceIds) ? candidate.sourceIds.filter(id => typeof id === 'string' && sourceIds.has(id)) : [];
    const citationStatus: CitationStatus = candidate.citationStatus === 'NOT_APPLICABLE'
      ? 'NOT_APPLICABLE'
      : verifiedIds.length > 0 && candidate.citationStatus === 'VERIFIED_SOURCE'
        ? 'VERIFIED_SOURCE'
        : 'NEEDS_SOURCE_VERIFICATION';
    return { ...candidate, sourceIds: verifiedIds, citationStatus };
  });
  return { policyTitle: result.policyTitle, jurisdiction: result.jurisdiction, summary: result.summary, overallRiskTier: result.overallRiskTier || 'MODERATE', clauses };
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', platform: 'ComplyOS Evidence-First Engine', version: '0.3.0', geminiAvailable: Boolean(getGeminiClient()), complianceEngine: 'evidence-first', timestamp: now() });
});

app.post('/api/compliance/assess', (req, res) => {
  try {
    const profile = req.body as ComplianceProfile;
    if (!profile || typeof profile.employeeCount !== 'number' || !profile.jurisdiction) return res.status(400).json({ error: 'jurisdiction and numeric employeeCount are required' });
    return res.json(assessCompliance(profile));
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Assessment failed' });
  }
});

app.post('/api/audit', async (req, res) => {
  const { documentText, policyTitle = 'Document', jurisdiction = 'India - National' } = req.body ?? {};
  if (!documentText || typeof documentText !== 'string') return res.status(400).json({ error: 'documentText string is required' });
  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ error: 'AI audit is unavailable because GEMINI_API_KEY is not configured.', code: 'AI_NOT_CONFIGURED', guidance: 'Use the Compliance Control Center for deterministic evidence-first assessment.' });

  try {
    const sourceContext = COMPLIANCE_SOURCES.map(source => `${source.id}: ${source.title} (${source.authority}; ${source.url})`).join('\n');
    const prompt = `You are an HR compliance document analysis assistant. Analyze the document for ${jurisdiction}. Do not invent statutes, citations, deadlines, thresholds or penalties. Only mark citationStatus VERIFIED_SOURCE when the proposition is directly supported by one or more supplied source IDs. Otherwise use NEEDS_SOURCE_VERIFICATION. Distinguish document-level observations from legal conclusions. A source ID is not proof by itself; the human reviewer must verify the cited source.\n\nAuthoritative source registry:\n${sourceContext}\n\nPolicy: ${policyTitle}\nDocument:\n${documentText}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.7-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: auditResponseSchema } });
    const parsed = JSON.parse(response.text || '{}');
    const result = validateAuditResult(parsed);
    return res.json({ policyTitle, jurisdiction, result, auditedAt: now(), mode: 'AI_ASSISTED_REVIEW', disclaimer: 'AI analysis is assistive. VERIFIED_SOURCE means the model supplied a known registry ID; it does not replace human verification of the cited primary source.' });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Audit execution failed', code: 'AI_AUDIT_INVALID' });
  }
});

app.post('/api/policy-generate', async (req, res) => {
  const { policyType = 'HR Policy', jurisdiction = 'India - National', companyName = 'Company', employeeCount = 1, specialProvisions = '' } = req.body ?? {};
  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ error: 'Policy generation requires GEMINI_API_KEY.', code: 'AI_NOT_CONFIGURED' });
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3.7-flash', contents: `Draft a professional HR policy for ${companyName}. Policy: ${policyType}. Jurisdiction: ${jurisdiction}. Employees: ${employeeCount}. Special provisions: ${specialProvisions || 'None'}. Use conservative legal language. Do not state that the policy is legally binding or compliant without source verification. Include a Sources / Verification Required section and clearly identify propositions requiring local counsel or current rules verification.` });
    return res.json({ policyTitle: `${policyType} - ${companyName}`, jurisdiction, content: response.text || '', generatedAt: now(), verificationRequired: true });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Policy generation failed' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body ?? {};
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });
  const ai = getGeminiClient();
  if (!ai) return res.json({ reply: 'Nova is in evidence-first offline mode. Configure GEMINI_API_KEY for AI-assisted explanations. For a defensible compliance assessment, use the Compliance Control Center and upload the requested evidence.' });
  try {
    const chat = ai.chats.create({ model: 'gemini-3.7-flash', config: { systemInstruction: 'You are Nova, an HR compliance research assistant. Never invent legal citations. State when a source must be verified. Separate factual source summaries from legal interpretation. Encourage review of current official legislation/rules for material decisions.' } });
    const result = await chat.sendMessage({ message });
    return res.json({ reply: result.text || '', mode: 'AI_ASSISTED_RESEARCH' });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Chat request failed' });
  }
});

app.post('/api/agent-run', (req, res) => {
  const agentId = typeof req.body?.agentId === 'string' ? req.body.agentId : 'compliance-assessment-agent';
  const profile: ComplianceProfile = { jurisdiction: req.body?.profile?.jurisdiction || 'India - National', employeeCount: Number(req.body?.profile?.employeeCount ?? 0), establishmentType: req.body?.profile?.establishmentType || 'office', hasContractWorkers: Boolean(req.body?.profile?.hasContractWorkers), hasNightShift: Boolean(req.body?.profile?.hasNightShift), industry: req.body?.profile?.industry };
  const assessment = assessCompliance(profile);
  const timestamp = new Date().toLocaleTimeString();
  const logs = [
    { timestamp, level: 'info', message: `Initialized evidence-first agent ${agentId}.` },
    { timestamp, level: 'info', message: `Evaluated ${assessment.controls.length} deterministic controls for ${profile.jurisdiction}.` },
    { timestamp, level: assessment.controls.some(c => c.status === 'REVIEW') ? 'warn' : 'success', message: `${assessment.controls.filter(c => c.status === 'REVIEW').length} controls require evidence or jurisdiction-specific verification.` },
    { timestamp, level: 'success', message: 'Assessment completed without asserting unsupported compliance or penalty outcomes.' }
  ];
  return res.json({ agentId, status: 'completed', timestamp: now(), assessment, logs });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`ComplyOS running on port ${PORT}`));
}

startServer();
