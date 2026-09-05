# CmpliHR.ai

AI-native HR compliance intelligence with an evidence-first architecture.

## Architecture

- **Source registry** — authoritative government sources with verification dates.
- **Deterministic compliance engine** — conservative controls that return `PASS`, `REVIEW`, `FAIL` or `NOT_ASSESSED`.
- **Evidence workflow** — missing evidence never becomes an automatic pass.
- **AI audit** — Gemini is assistive; generated citations must be source-verified.
- **Agentic workflows** — orchestration around assessment and evidence collection with human approval points.

## India baseline

The current source registry records the Ministry of Labour & Employment's 2026 Labour Codes handbook and official implementation release, plus the Ministry of Women & Child Development legislation repository. The official Labour Ministry release states that the four Labour Codes came into force on 21 November 2025.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run lint
npm run build
npm start
```

Set `GEMINI_API_KEY` for AI-assisted audit, policy generation and chat. The deterministic Compliance Control Center remains usable without an AI key.

## Important boundary

CmpliHR.ai is a compliance-assessment aid, not a law firm, legal opinion, certification authority or substitute for current primary legislation, notified rules and qualified legal counsel.
