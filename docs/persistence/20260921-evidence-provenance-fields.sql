-- Preserve authoritative-source provenance when evidence_items predates the
-- evidence-audit-schema.sql definition. Safe to run after the existing
-- evidence workflow migration on PostgreSQL/Supabase.

alter table evidence_items
  add column if not exists source_id text,
  add column if not exists source_url text,
  add column if not exists authority text,
  add column if not exists verified_at timestamptz,
  add column if not exists content_hash text;

create index if not exists evidence_items_tenant_verified_idx
  on evidence_items (tenant_id, verified_at desc);
