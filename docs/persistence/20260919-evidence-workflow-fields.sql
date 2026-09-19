-- Add typed workflow fields to an existing evidence_items table.
-- Safe to run after evidence-audit-schema.sql on PostgreSQL/Supabase.

alter table evidence_items
  add column if not exists kind text not null default 'DOCUMENT',
  add column if not exists status text not null default 'REVIEW',
  add column if not exists collected_at timestamptz not null default now(),
  add column if not exists expires_at timestamptz;

create index if not exists evidence_items_tenant_collected_idx
  on evidence_items (tenant_id, collected_at desc);
