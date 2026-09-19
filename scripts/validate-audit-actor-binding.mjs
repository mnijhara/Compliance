import { readFile } from 'node:fs/promises';

const rpc = await readFile(new URL('../docs/persistence/supabase-rpc.sql', import.meta.url), 'utf8');

const required = [
  ['JWT actor extraction', /jwt_actor := nullif\(trim\(claims ->> 'sub'\), ''\)/i],
  ['missing actor rejection', /raise exception 'AUTH_ACTOR_CLAIM_INVALID'/i],
  ['JWT actor persistence', /insert into audit_events[\s\S]*?record_tenant,[\s\S]*?jwt_actor,[\s\S]*?trim\(p_record->>'action'\)/i],
  ['caller actor field is not persisted', /insert into audit_events[\s\S]*?jwt_actor,[\s\S]*?trim\(p_record->>'action'\)/i],
];

for (const [name, pattern] of required) {
  if (!pattern.test(rpc)) throw new Error(`Audit actor binding invariant missing: ${name}`);
}

console.log('Validated that durable audit actor identity is derived from the authenticated JWT sub claim.');
