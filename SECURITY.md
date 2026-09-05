# Security Policy

## Scope

ComplyOS handles HR compliance information that may contain confidential employee, payroll and policy data. Do not commit credentials, API keys, production personal data or confidential customer documents to the repository.

## Reporting a vulnerability

Please report suspected vulnerabilities privately to the repository maintainers rather than opening a public issue with exploitable details. Include the affected component, impact, reproduction steps and any suggested mitigation.

## Security expectations

- Keep secrets in environment variables or a managed secret store.
- Use HTTPS in production.
- Keep dependencies and GitHub Actions updated.
- Treat AI output as untrusted until source-verified.
- Do not use a `PASS` result as a substitute for legal review.
- Production persistence must enforce tenant isolation and authorization at the data layer.
