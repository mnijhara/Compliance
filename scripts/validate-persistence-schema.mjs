import { readFile } from 'node:fs/promises';

const schemaPath = new URL('../docs/persistence/evidence-audit-schema.sql', import.meta.url);
const immutabilityPath = new URL('../docs/persistence/audit-immutability.sql', import.meta.url);
const evidenceIntegrityPath = new URL('../docs/persistence/evidence-integrity.sql', import.meta.url);
const schema = await readFile(schemaPath, 'utf8');
const immutability = await readFile(immutabilityPath, 'utf8');
const evidenceIntegrity = await readFile(evidenceIntegrityPath, 'utf8');

const required = [
  ['tenants table', /create table if not exists tenants\s*\(/i],
  ['tenant UUID primary key', /id uuid primary key/i],
  ['evidence tenant foreign key', /tenant_id uuid not null references tenants\(id\)/i],
  ['audit tenant foreign key', /tenant_id uuid not null references tenants\(id\)/i],
  ['evidence verification timestamp', /verified_at timestamptz/i],
  ['evidence content hash', /content_hash text/i],
  ['tenants RLS', /alter table tenants enable row level security/i],
  ['evidence RLS', /alter table evidence_items enable row level security/i],
  ['audit RLS', /alter table audit_events enable row level security/i],
  ['tenants isolation policy', /create policy tenants_isolation on tenants/i],
  ['evidence tenant policy', /create policy evidence_items_isolation on evidence_items/i],
  ['audit tenant policy', /create policy audit_events_isolation on audit_events/i],
  ['tenant claim binding', /current_setting\('request\.jwt\.claim\.tenant_id', true\)/i],
  ['tenant claim UUID guard', /~\*\s*'\^\[0-9a-f\]\{8\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{12\}\$'/i],
  ['evidence policy read binding', /evidence_items_isolation[\s\S]*?using\s*\(tenant_id\s*=\s*case\s+when[\s\S]*?current_setting\('request\.jwt\.claim\.tenant_id', true\)::uuid[\s\S]*?end\)/i],
  ['audit policy read binding', /audit_events_isolation[\s\S]*?using\s*\(tenant_id\s*=\s*case\s+when[\s\S]*?current_setting\('request\.jwt\.claim\.tenant_id', true\)::uuid[\s\S]*?end\)/i],
  ['evidence policy write binding', /evidence_items_isolation[\s\S]*?with check\s*\(tenant_id\s*=\s*case\s+when[\s\S]*?current_setting\('request\.jwt\.claim\.tenant_id', true\)::uuid[\s\S]*?end\)/i],
  ['audit policy write binding', /audit_events_isolation[\s\S]*?with check\s*\(tenant_id\s*=\s*case\s+when[\s\S]*?current_setting\('request\.jwt\.claim\.tenant_id', true\)::uuid[\s\S]*?end\)/i],
];

for (const [name, pattern] of required) {
  if (!pattern.test(schema)) throw new Error(`Persistence schema invariant missing: ${name}`);
}

const immutableRequired = [
  ['mutation trigger function', /create or replace function prevent_audit_event_mutation\(\)/i],
  ['UPDATE protection', /before update or delete on audit_events/i],
  ['trigger installation', /create trigger audit_events_immutable/i],
];

for (const [name, pattern] of immutableRequired) {
  if (!pattern.test(immutability)) throw new Error(`Audit immutability invariant missing: ${name}`);
}

const evidenceIntegrityRequired = [
  ['evidence integrity function', /create or replace function validate_evidence_item_integrity\(\)/i],
  ['SHA-256 hash validation', /content_hash is not null[\s\S]*\^\[0-9a-fA-F\]\{64\}\$/i],
  ['future verification guard', /verified_at is not null[\s\S]*verified_at > now\(\) \+ interval '5 minutes'/i],
  ['non-empty evidence title guard', /btrim\(new\.title\) = ''/i],
  ['evidence integrity trigger', /create trigger evidence_items_integrity/i],
];

for (const [name, pattern] of evidenceIntegrityRequired) {
  if (!pattern.test(evidenceIntegrity)) throw new Error(`Evidence integrity invariant missing: ${name}`);
}

console.log('Validated persistence schema, tenant isolation, audit immutability, and evidence integrity invariants.');
