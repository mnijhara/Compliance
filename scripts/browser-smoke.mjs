import { chromium } from 'playwright';

const baseURL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true });
const failures = [];

async function inspectViewport(name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  try {
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.locator('h1').first().waitFor({ state: 'visible' });

    const title = await page.title();
    if (!title.includes('ComplyOS')) failures.push(`${name}: unexpected title: ${title}`);

    const heading = await page.locator('h1').first().innerText();
    if (!heading.includes('Turn compliance into an operating system.')) failures.push(`${name}: command-center hero heading missing`);

    const reviewButton = page.getByRole('button', { name: /Review my documents/i }).first();
    await reviewButton.click();
    await page.locator('#document-review').waitFor({ state: 'visible' });

    if (!(await page.locator('#document-review').isVisible())) {
      failures.push(`${name}: document review section is not visible`);
    }

    const faviconStatus = await page.evaluate(async () => {
      const link = document.querySelector('link[rel="icon"]');
      if (!link?.href) return 'missing';
      const response = await fetch(link.href, { cache: 'no-store' });
      return response.ok ? 'ok' : `http-${response.status}`;
    });
    if (faviconStatus !== 'ok') failures.push(`${name}: favicon check failed: ${faviconStatus}`);

    if (consoleErrors.length) failures.push(`${name}: console errors: ${consoleErrors.join(' | ')}`);
    if (pageErrors.length) failures.push(`${name}: page errors: ${pageErrors.join(' | ')}`);
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await page.close();
  }
}

await inspectViewport('desktop', 1440, 900);
await inspectViewport('mobile', 390, 844);
await browser.close();

if (failures.length) {
  console.error('Browser smoke verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Playwright Chromium UI smoke verification passed for desktop and mobile.');
