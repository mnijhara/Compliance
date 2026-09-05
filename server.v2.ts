import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { assessCompliance, ComplianceProfile } from './src/complianceEngine';

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

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    platform: 'ComplyOS Evidence-First Engine',
    version: '0.2.0',
    geminiAvailable: Boolean(getGeminiClient()),
    complianceEngine: 'evidence-first',
    timestamp: now()
  });
});

app.post('/api/compliance/assess', (req, res) => {
  try {
    const profile = req.body as ComplianceProfile;
    if (!profile || typeof profile.employeeCount !== 'number' || !profile.jurisdiction) {
      return res.status(400).json({ error: 'jurisdiction and numeric employeeCount are required' });
    }
    return res.json(assessCompliance(profile));
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Assessment failed' });
  }
});

app.post('/api/audit', async (req, res) => {
  const { documentText, policyTitle = 'Document', jurisdiction = 'India - National' } = req.body ?? {};
  if (!documentText || typeof documentText !== 'string') {
    return res.status(400).json({ error: 'documentText string is required' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'AI audit is unavailable because GEMINI_API_KEY is not configured.',
      code: 'AI_NOT_CONFIGURED',
      guidance: 'Use the Compliance Control Center for deterministic evidence-first assessment.'
    });
  }

  try {
    const prompt = `You are an HR compliance document analysis assistant. Analyze the document below for ${jurisdiction}. Do not invent statutes, citations, deadlines, thresholds or penalties. If a legal proposition cannot be verified from the supplied authoritative source context, mark it as NEEDS_SOURCE_VERIFICATION. Distinguish document-level observations from legal conclusions. Return JSON with: policyTitle, jurisdiction, summary, overallRiskTier, clauses[]. Each clause must contain id, clauseTitle, originalText, riskLevel, citation, citationStatus, issueDescription, suggestedFix. citationStatus must be VERIFIED_SOURCE, NEEDS_SOURCE_VERIFICATION, or NOT_APPLICABLE. Do not claim that the document is legally compliant solely because a clause looks reasonable.\n\nPolicy: ${policyTitle}\nDocument:\n${documentText}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.7-flash', contents: prompt });
    const raw = response.text || '';
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { parsed = { rawText: raw }; }
    return res.json({ policyTitle, jurisdiction, result: parsed, auditedAt: now(), mode: 'AI_ASSISTED_REVIEW', disclaimer: 'AI analysis is an assistive review and is not a legal opinion or certification.' });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Audit execution failed' });
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
