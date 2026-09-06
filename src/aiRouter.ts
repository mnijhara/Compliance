const DEFAULT_PROXY_URL = 'https://getjobready-ai-proxy.mnijhara.workers.dev';

function getProxyUrl(): string {
  return (process.env.AI_PROXY_URL?.trim() || DEFAULT_PROXY_URL).replace(/\/$/, '');
}

function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-3.7-flash';
}

// Gemini keys remain behind the Cloudflare Worker. ComplyOS never receives or stores them.
let workerFailures = 0;
let workerCooldownUntil = 0;
let workerRequests = 0;
let lastWorkerUse = 0;
let lastSuccessfulWorkerUse = 0;

export function configured(): boolean {
  return Boolean(getProxyUrl());
}

export function publicStatus() {
  const configuredProxy = configured();
  const cooldown = Date.now() < workerCooldownUntil;
  return {
    configured: configuredProxy,
    // Configuration is not proof that five provider keys are present or healthy.
    keySlots: configuredProxy ? 5 : 0,
    healthySlots: configuredProxy && !cooldown && lastSuccessfulWorkerUse > 0 ? 5 : 0,
    model: getModel(),
    router: 'Cloudflare 5-key automatic failover',
    proxy: getProxyUrl(),
    requests: workerRequests,
    lastRequestAt: lastWorkerUse || null,
    lastSuccessfulRequestAt: lastSuccessfulWorkerUse || null,
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
  lastSuccessfulWorkerUse = Date.now();
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
  const model = options.model || getModel();
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
  const proxyUrl = `${getProxyUrl()}/generate`;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(proxyUrl, {
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
