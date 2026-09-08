-- ComplyOS durable evidence/audit foundation for PostgreSQL/Supabase.
-- This migration is intentionally separate from application wiring: production
-- readiness must remain false until a real connection and identity adapter exist.

create extension if not exists pgcrypto;

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists evidence_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  source_id text,
  title text not null,
  source_url text,
  authority text,
  verified_at timestamptz,
  content_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  actor_id text not null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  evidence_ids uuid[] not null default '{}',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists evidence_items_tenant_created_idx
  on evidence_items (tenant_id, created_at desc);
create index if not exists audit_events_tenant_created_idx
  on audit_events (tenant_id, created_at desc);

-- Row Level Security is fail-closed: application roles must set a trusted
-- transaction-local tenant claim before reading or writing tenant records.
alter table tenants enable row level security;
alter table evidence_items enable row level security;
alter table audit_events enable row level security;

create policy tenants_isolation on tenants
  using (id = nullif(current_setting('request.jwt.claim.tenant_id', true), '')::uuid)
  with check (id = nullif(current_setting('request.jwt.claim.tenant_id', true), '')::uuid);

create policy evidence_items_isolation on evidence_items
  using (tenant_id = nullif(current_setting('request.jwt.claim.tenant_id', true), '')::uuid)
  with check (tenant_id = nullif(current_setting('request.jwt.claim.tenant_id', true), '')::uuid);

create policy audit_events_isolation on audit_events
  using (tenant_id = nullif(current_setting('request.jwt.claim.tenant_id', true), '')::uuid)
  with check (tenant_id = nullif(current_setting('request.jwt.claim.tenant_id', true), '')::uuid);

comment on table evidence_items is 'Tenant-scoped evidence records; verified_at records when the authoritative source was last checked.';
comment on table audit_events is 'Append-only application audit trail. Application roles should grant INSERT/SELECT only as required.';
