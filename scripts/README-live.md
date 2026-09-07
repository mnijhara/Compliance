# Live verification

`npm run test:live` uses Playwright + Chromium against `https://complyos.online` (or `LIVE_BASE_URL`) and checks the deployed homepage, title, favicon, key hero copy, and browser errors.

This is intentionally separate from local production CI: a green build does not prove Hostinger has deployed the latest artifact.
