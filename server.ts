import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get initialized GoogleGenAI instance safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'CmpliHR.ai Nova Engine 3.0',
    geminiAvailable: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
  });
});

// 2. AI Policy & Contract Auditor Endpoint
app.post('/api/audit', async (req, res) => {
  try {
    const { documentText, policyTitle = 'Document', jurisdiction = 'India - National' } = req.body;

    if (!documentText || typeof documentText !== 'string') {
      return res.status(400).json({ error: 'documentText string is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return simulated intelligent compliance audit result if API key is not yet set
      return res.json({
        policyTitle,
        jurisdiction,
        complianceScore: 62,
        overallRiskTier: 'High-Risk',
        summary: `Audit scan completed for ${jurisdiction}. Identified critical gaps in statutory overtime definitions, missing POSH IC external member mandates, and unlawful non-compete clauses.`,
        totalIssuesCount: { critical: 2, high: 2, moderate: 1, compliant: 1 },
        clauses: [
          {
            id: 'c-1',
            clauseTitle: 'Unlawful Post-Employment Non-Compete Restriction',
            originalText: 'For a period of two (2) years following termination... Employee shall not engage in or perform services for any competitor.',
            riskLevel: 'CRITICAL',
            citation: 'Section 27 of Indian Contract Act, 1872 / CA Bus & Prof Code § 16600',
            issueDescription: 'Blanket non-compete clauses restraining lawful trade/profession are void and unenforceable by law in this jurisdiction.',
            suggestedFix: 'Replace with standard non-solicitation of clients and confidentiality protection provisions.'
          },
          {
            id: 'c-2',
            clauseTitle: 'Non-Compliant Overtime Pay Definition',
            originalText: 'Overtime will only be compensated if pre-approved in writing at flat hourly rates.',
            riskLevel: 'CRITICAL',
            citation: 'Maharashtra Shops & Est. Act § 15 / FLSA 29 U.S.C. § 207',
            issueDescription: 'Law requires mandatory 2.0x double wage rate for overtime exceeding daily limit regardless of prior written approval.',
            suggestedFix: 'Mandate double regular rate pay for work exceeding 9 hours/day or 48 hours/week.'
          },
          {
            id: 'c-3',
            clauseTitle: 'Unlawful Direct Salary Deductions for Fines',
            originalText: 'Company reserves the right to deduct unreturned equipment costs or fines directly from final paycheck.',
            riskLevel: 'HIGH',
            citation: 'Payment of Wages Act, 1936 § 7 / CA Labor Code § 221',
            issueDescription: 'Employer cannot make unilateral salary deductions without employee explicit written consent and statutory limit.',
            suggestedFix: 'Deductions must follow statutory notice procedures and statutory percentage caps.'
          }
        ],
        compliantRewrite: `REVISED & STATUTORILY COMPLIANT CONTRACT PROVISIONS\n\n1. HOURS OF WORK & OVERTIME: Normal working hours shall be 8 hours per day, not exceeding 48 hours per week. Any work performed beyond 9 hours in a day or 48 hours in a week shall be compensated at double the regular wage rate as mandated by statutory labor codes.\n\n2. CONFIDENTIALITY & NON-SOLICITATION: Employee agrees during and for 12 months following employment not to solicit company clients or disclose proprietary trade secrets. (Non-compete clause removed to comply with Section 27).\n\n3. WAGE PROTECTIONS: All wage disbursements and authorized deductions shall strictly comply with the Payment of Wages Act. No unauthorized deductions shall be made from final compensation.\n\n4. GOVERNING LAW: Disputes shall be adjudicated under local labor court jurisdiction with full statutory rights preserved.`,
        auditedAt: new Date().toISOString()
      });
    }

    const prompt = `You are CmpliHR.ai's Lead Autonomous Legal Compliance Auditor. Audit the following HR document/contract against the specified jurisdiction's labor laws.

Jurisdiction: ${jurisdiction}
Document Title: ${policyTitle}
Document Text:
"""
${documentText}
"""

Evaluate the document thoroughly. Provide an objective JSON audit response matching this structure:
{
  "policyTitle": string,
  "jurisdiction": string,
  "complianceScore": number (0-100),
  "overallRiskTier": "Prohibited" | "High-Risk" | "Limited-Risk" | "Minimal-Risk" | "Compliant",
  "summary": string,
  "totalIssuesCount": { "critical": number, "high": number, "moderate": number, "compliant": number },
  "clauses": [
    {
      "id": string,
      "clauseTitle": string,
      "originalText": string,
      "riskLevel": "CRITICAL" | "HIGH" | "MODERATE" | "COMPLIANT",
      "citation": string (e.g., exact statute or legal section),
      "issueDescription": string,
      "suggestedFix": string
    }
  ],
  "compliantRewrite": string (fully rewritten legal version correcting all non-compliant clauses)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            policyTitle: { type: Type.STRING },
            jurisdiction: { type: Type.STRING },
            complianceScore: { type: Type.NUMBER },
            overallRiskTier: { type: Type.STRING },
            summary: { type: Type.STRING },
            totalIssuesCount: {
              type: Type.OBJECT,
              properties: {
                critical: { type: Type.NUMBER },
                high: { type: Type.NUMBER },
                moderate: { type: Type.NUMBER },
                compliant: { type: Type.NUMBER }
              },
              required: ['critical', 'high', 'moderate', 'compliant']
            },
            clauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  clauseTitle: { type: Type.STRING },
                  originalText: { type: Type.STRING },
                  riskLevel: { type: Type.STRING },
                  citation: { type: Type.STRING },
                  issueDescription: { type: Type.STRING },
                  suggestedFix: { type: Type.STRING }
                },
                required: ['id', 'clauseTitle', 'originalText', 'riskLevel', 'citation', 'issueDescription', 'suggestedFix']
              }
            },
            compliantRewrite: { type: Type.STRING }
          },
          required: ['policyTitle', 'jurisdiction', 'complianceScore', 'overallRiskTier', 'summary', 'totalIssuesCount', 'clauses', 'compliantRewrite']
        }
      }
    });

    const auditData = JSON.parse(response.text || '{}');
    auditData.auditedAt = new Date().toISOString();
    return res.json(auditData);

  } catch (err: any) {
    console.error('Error in /api/audit:', err);
    res.status(500).json({ error: err.message || 'Audit execution failed' });
  }
});

// 3. AI Policy Generator Endpoint
app.post('/api/policy-generate', async (req, res) => {
  try {
    const {
      policyType = 'POSH Policy',
      jurisdiction = 'India - National',
      companyName = 'Acme Enterprises',
      employeeCount = 50,
      specialProvisions = ''
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback draft generator
      const draft = `# ${companyName.toUpperCase()} - STATUTORY ${policyType.toUpperCase()}
Jurisdiction: ${jurisdiction} | Effective Date: ${new Date().toLocaleDateString()} | Employee Threshold: ${employeeCount}

1. POLICY STATEMENT & SCOPE
${companyName} is committed to providing a safe, compliant, and respectful work environment for all ${employeeCount} employees in strict accordance with ${jurisdiction} labor laws.

2. STATUTORY COMPLIANCE & DEFINITIONS
This policy explicitly incorporates statutory mandates under governing employment codes, including working hour limits, non-discrimination standards, and complaint escalation pathways.

3. INTERNAL COMPLAINTS COMMITTEE (IC) & ESCALATION
In compliance with statutory rules for organizations with 10+ employees:
- Presiding Officer: Senior Woman Leader
- External Member: Independent NGO Representative / Legal Specialist
- Inquiry SLA: Investigation completed within 90 days of written complaint submission.

4. REMEDIAL ACTIONS & STATUTORY REPORTING
Violations will result in disciplinary sanctions up to termination of employment. Annual returns will be filed with statutory district officers as required by law.

5. REVIEW SCHEDULE
This policy shall be reviewed annually by the Chief Human Resources Officer (CHRO) and legal counsel.`;

      return res.json({
        policyTitle: `${policyType} - ${companyName}`,
        jurisdiction,
        content: draft,
        generatedAt: new Date().toISOString()
      });
    }

    const prompt = `You are CmpliHR.ai's Expert AI HR Policy Architect. Generate a complete, legally defensible, highly detailed corporate HR Policy.

Company Name: ${companyName}
Policy Type: ${policyType}
Jurisdiction: ${jurisdiction}
Employee Count: ${employeeCount}
Special Provisions / Requirements: ${specialProvisions || 'None'}

Formatting Instructions:
- Write a professional Markdown formatted policy.
- Include clear Section Headings (e.g. 1. Purpose & Scope, 2. Statutory Framework, 3. Rights & Obligations, 4. Dispute Resolution & Escalation, 5. Reporting & Audit).
- Cite specific statutory acts relevant to ${jurisdiction}.
- Ensure language is formal, actionable, and ready for CHRO adoption.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt
    });

    return res.json({
      policyTitle: `${policyType} - ${companyName}`,
      jurisdiction,
      content: response.text || '',
      generatedAt: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Error in /api/policy-generate:', err);
    res.status(500).json({ error: err.message || 'Policy generation failed' });
  }
});

// 4. Compliance Chat Assistant Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `[CmpliHR Assistant]: Under statutory guidelines for ${message.includes('POSH') ? 'POSH Act 2013' : 'Labor Laws'}, organizations must ensure strict compliance with local state mandates, maintain digital audit trails, and file required returns on time. Please configure your GEMINI_API_KEY for live real-time AI compliance queries.`
      });
    }

    const chat = ai.chats.create({
      model: 'gemini-3.7-flash',
      config: {
        systemInstruction: `You are Nova AI, the specialized HR Compliance & Labor Law Intelligence Assistant for CmpliHR.ai.
You serve CHROs, HR Managers, Legal Counsel, and Compliance Officers.
Provide precise, legally grounded, authoritative advice on labor codes (US FLSA/California Labor Code, India Labor Codes/POSH/PF/ESI, UK Employment Rights, etc.).
Structure your answers with clear bullet points, statutory citations, and actionable next steps for the CHRO.`
      }
    });

    const result = await chat.sendMessage({ message });
    return res.json({ reply: result.text || '' });

  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Chat request failed' });
  }
});

// 5. Agent Trigger Endpoint
app.post('/api/agent-run', (req, res) => {
  const { agentId = 'agent-1' } = req.body;
  const timestamp = new Date().toLocaleTimeString();
  
  const simulatedRunLogs = [
    { timestamp, level: 'info', message: `Initializing Autonomous Nova Agent (${agentId}). Fetching statutory updates...` },
    { timestamp, level: 'success', message: 'Connected to State Labor Board API gateway.' },
    { timestamp, level: 'info', message: 'Cross-verifying 850 employee wage records with statutory caps.' },
    { timestamp, level: 'success', message: 'Audit completed: 100% compliance verified. 0 statutory penalties incurred.' }
  ];

  res.json({
    agentId,
    status: 'completed',
    timestamp: new Date().toISOString(),
    logs: simulatedRunLogs
  });
});

// -------------------------------------------------------------
// Vite Server / Static Server Integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CmpliHR.ai platform running on http://localhost:${PORT}`);
  });
}

startServer();
