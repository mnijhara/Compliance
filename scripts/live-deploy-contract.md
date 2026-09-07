# ComplyOS live deployment contract

The repository CI verifies the production build and Chromium browser smoke test. The production site must also be deployed by the configured Hostinger project after changes merge to `main`.

## Required release verification

1. Hostinger deploys the latest `main` commit.
2. `https://complyos.online/` serves the current `index.html` and assets.
3. `/branding/favicon.svg?v=2` returns successfully.
4. The live page renders the current ComplyOS hero and command-center preview.
5. A real Chromium smoke test is run against the public URL after deployment.

Do not mark a release complete from GitHub CI alone; CI verifies the build artifact, while the public-site check verifies deployment freshness.
