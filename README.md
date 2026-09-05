# ComplyOS

AI-native HR compliance operating system with an evidence-first architecture.

## Architecture

- **Source registry** — authoritative government sources with verification dates.
- **Deterministic compliance engine** — conservative controls that return `PASS`, `REVIEW`, `FAIL` or `NOT_ASSESSED`.
- **Evidence workflow** — missing evidence never becomes an automatic pass.
- **AI audit** — Gemini is assistive; generated legal propositions require source verification.
- **Agentic workflows** — orchestration around assessment and evidence collection with human approval points.
- **Audit trail domain model** — tamper-evident event payloads are designed for durable audit storage without pretending that in-memory state is production persistence.

## India baseline

The source registry records official Ministry of Labour & Employment and Ministry of Women & Child Development sources. The Labour Ministry's official implementation release states that the four Labour Codes came into force on 21 November 2025. State-specific conclusions require current primary state sources and are not inferred from the national baseline.

## Local development

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run lint
npm test
npm run build
npm start
```

Set `GEMINI_API_KEY` for AI-assisted audit, policy generation and chat. The deterministic Compliance Control Center remains usable without an AI key.

## Verification boundary

ComplyOS is a compliance-assessment aid, not a law firm, legal opinion, certification authority or substitute for current primary legislation, notified rules, official notifications and qualified legal counsel. A `PASS` in the deterministic engine means only that the implemented control logic passed its defined inputs; it is not a legal certification.

## Brand clearance

Before commercial launch, perform independent trademark and domain clearance for the ComplyOS name and logo in every target market.
