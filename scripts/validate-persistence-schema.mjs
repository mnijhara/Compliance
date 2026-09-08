import { readFile } from 'node:fs/promises';

const schemaPath = new URL('../docs/persistence/evidence-audit-schema.sql', import.meta.url);
const immutabilityPath = new URL('../docs/persistence/audit-immutability.sql', import.meta.url);
const schema = await readFile(schemaPath, 'utf8');
const immutability = await readFile(immutabilityPath, 'utf8');

const required = [
  ['tenants table', /create table if not exists tenants\s*\(/i],
  ['tenant UUID primary key', /id uuid primary key/i],
  ['evidence tenant foreign key', /tenant_id uuid not null references tenants\(id\)/i],
  ['audit tenant foreign key', /tenant_id uuid not null references tenants\(id\)/i],
  ['evidence verification timestamp', /verified_at timestamptz/i],
  ['evidence content hash', /content_hash text/i],
  ['evidence RLS', /alter table evidence_items enable row level security/i],
  ['audit RLS', /alter table audit_events enable row level security/i],
  ['evidence tenant policy', /create policy evidence_items_isolation on evidence_items/i],
  ['audit tenant policy', /create policy audit_events_isolation on audit_events/i],
  ['tenant claim binding', /current_setting\('request\.jwt\.claim\.tenant_id', true\)/i],
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

console.log('Validated persistence schema and audit immutability invariants.');
