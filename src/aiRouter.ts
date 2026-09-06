const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-3.7-flash';
const DEFAULT_PROXY_URL = 'https://getjobready-ai-proxy.mnijhara.workers.dev';
const WORKER_URL = (process.env.AI_PROXY_URL?.trim() || DEFAULT_PROXY_URL).replace(/\/$/, '');
const GENERATE_URL = `${WORKER_URL}/generate`;

// Gemini keys remain behind the Cloudflare Worker. ComplyOS never receives or stores them.
let workerFailures = 0;
let workerCooldownUntil = 0;
let workerRequests = 0;
let lastWorkerUse = 0;

export function configured(): boolean {
  return Boolean(WORKER_URL);
}

export function publicStatus() {
  const healthy = Date.now() >= workerCooldownUntil;
  return {
    configured: configured(),
    keySlots: configured() ? 5 : 0,
    healthySlots: configured() && healthy ? 5 : 0,
    model: DEFAULT_MODEL,
    router: 'Cloudflare 5-key round-robin + automatic failover',
    proxy: WORKER_URL,
    requests: workerRequests,
    lastRequestAt: lastWorkerUse || null,
  };
}

function markFailure(status: number) {
  workerFailures += 1;
  const seconds = status === 429
    ? Math.min(90, 10 * workerFailures)
    : status === 401 || status === 403
      ? 300
      : 15;
  workerCooldownUntil = Date.now() + seconds * 1000;
}

function markSuccess() {
  workerFailures = 0;
  workerCooldownUntil = 0;
}

function parseJson(text: string): unknown {
  const cleaned = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini returned invalid JSON');
  }
}

function extractText(data: any): string {
  if (typeof data === 'string') return data;
  if (data?.candidates?.[0]?.content?.parts) return data.candidates[0].content.parts.map((part: any) => part.text || '').join('');
  if (typeof data?.text === 'string') return data.text;
  if (typeof data?.output === 'string') return data.output;
  if (typeof data?.response === 'string') return data.response;
  if (typeof data?.result === 'string') return data.result;
  if (data?.result && typeof data.result === 'object') return JSON.stringify(data.result);
  return '';
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const REQUEST_TIMEOUT_MS = 25_000;

export interface GenerateOptions {
  model?: string;
  parts?: Array<Record<string, unknown>>;
  responseMimeType?: string;
  maxOutputTokens?: number;
  json?: boolean;
}

export async function generate(prompt: string, options: GenerateOptions = {}): Promise<any> {
  if (!configured()) throw Object.assign(new Error('AI_NOT_CONFIGURED'), { code: 'AI_NOT_CONFIGURED' });
  if (Date.now() < workerCooldownUntil) throw new Error('AI_PROXY_COOLDOWN');

  const suppliedParts = options.parts || (prompt ? [{ text: prompt }] : []);
  const parts = suppliedParts.length ? suppliedParts : [{ text: prompt || '' }];
  const model = options.model || DEFAULT_MODEL;
  const generationConfig = {
    responseMimeType: options.responseMimeType || 'application/json',
    maxOutputTokens: options.maxOutputTokens || 6000,
  };
  const body = {
    model,
    contents: [{ role: 'user', parts }],
    generationConfig,
  };

  workerRequests += 1;
  lastWorkerUse = Date.now();
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        const retryable = response.status === 429 || response.status >= 500;
        if (retryable && attempt < maxAttempts) {
          await sleep(response.status === 429 ? 250 * attempt : 150 * attempt);
          continue;
        }
        markFailure(response.status);
        throw new Error(`AI proxy ${response.status}: ${errorBody.slice(0, 300)}`);
      }
      const data = await response.json();
      const text = extractText(data);
      if (!text) {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          markSuccess();
          return options.json === false ? JSON.stringify(data) : data;
        }
        throw new Error('AI proxy returned an empty response');
      }
      markSuccess();
      return options.json === false ? text : parseJson(text);
    } catch (error) {
      clearTimeout(timeout);
      const message = error instanceof Error ? error.message : String(error);
      const retryableNetwork = !message.startsWith('AI proxy ') && attempt < maxAttempts;
      if (retryableNetwork) {
        await sleep(150 * attempt);
        continue;
      }
      if (!message.startsWith('AI proxy ')) markFailure(500);
      throw error;
    }
  }
  throw new Error('AI proxy request failed');
}
