# ComplyOS QSR HR Compliance Product Audit

## Persona used

This audit treats ComplyOS as the operating system a Head of HR / Compliance would use for a large multi-site quick-service restaurant network in India.

The product must assess establishments, not assume that a national employee count produces one legal answer. Outlets can differ by state, registration, worker category, operating hours, contractors and evidence.

## High-risk findings addressed in this pass

1. **Company-wide scoring was the wrong abstraction.** Compliance Control Center is now establishment/outlet-level and requires a site identifier.
2. **A numeric score without evidence is unsafe.** The assessment now withholds a compliance score until verified evidence can support deterministic outcomes.
3. **Legacy labour-law content was presented too broadly.** The reference catalogue now centres on the four Labour Codes and current 2026 Central Rules, with state applicability kept source-required.
4. **Government forms were fabricated / presented too confidently.** Form Vault is now an internal evidence-template workspace and explicitly warns against submitting templates as official forms.
5. **Policy Generator had fictional company/headcount defaults and an implied compliance certification.** Inputs are now blank and output is explicitly a working draft requiring verification.
6. **Agent execution used a hard-coded 250-employee office profile.** Agents now require actual site/headcount/workforce inputs.
7. **Pricing/ROI claims were not backed by a billing or measurement system.** The commercial page no longer invents prices, savings or trial submissions.
8. **Payroll calculator mixed CTC-style assumptions with statutory wage logic.** It is now limited to the Code on Wages 50% allowance-rule model and clearly separates excluded components.

## QSR-specific controls required for the next product stage

- Outlet/site master and legal-entity mapping
- State/district-specific registration and rule mapping
- Worker-category master: direct, fixed-term, apprentice, contractor, migrant and other categories
- Night-shift and women-night-work safeguards
- Young-worker / age verification
- Contract-worker vendor register and renewal controls
- Payroll-to-attendance-to-statutory-remittance reconciliation
- POSH governance at the applicable workplace/entity level
- Maternity, nursing and crèche evidence where applicable
- Weekly rest, overtime and roster controls
- Appointment-letter issuance evidence
- Grievance / employee-relations workflow
- Incident, safety and workplace-health evidence
- Regulatory-change watch with source diffs, not only source freshness
- Evidence expiry and owner reminders

## Enterprise blockers before calling the product production-ready

- Trusted identity provider / SSO and role-based access
- Durable multi-tenant persistence
- Durable evidence storage with retention, encryption and access controls
- Confidential POSH case isolation
- Site-level task/approval workflow
- Government filing integrations with current portal/form verification
- Complete state-by-state source coverage and rule mapping
- Payroll/HRIS integration and reconciliation
- Distributed rate limiting and production observability
- Automated backup/restore and disaster-recovery controls
- Privacy, retention and deletion workflows for employee documents

## Product principle

`SOURCE -> APPLICABILITY -> EVIDENCE -> REVIEW -> DECISION`

AI can accelerate research and document review, but it must never skip an evidence or human-verification gate.
