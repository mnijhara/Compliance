import { chromium } from 'playwright';

const baseUrl = process.env.LIVE_BASE_URL || 'https://complyos.online';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

try {
  const response = await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response?.ok()) throw new Error(`Live homepage returned ${response?.status() ?? 'no response'}`);
  await page.locator('h1').first().waitFor({ timeout: 10000 });
  const title = await page.title();
  if (!title.includes('ComplyOS')) throw new Error(`Unexpected live title: ${title}`);
  const favicon = await page.request.get(`${baseUrl}/branding/favicon.svg?v=2`);
  if (!favicon.ok()) throw new Error(`Live favicon returned ${favicon.status()}`);
  const body = await page.locator('body').innerText();
  for (const required of ['ComplyOS', 'Know what needs attention.', 'Evidence → finding → action', 'ILLUSTRATIVE']) {
    if (!body.includes(required)) throw new Error(`Live page is missing required text: ${required}`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`LIVE_OK ${baseUrl}`);
} finally {
  await browser.close();
}
