-- Defense-in-depth constraints for the durable evidence/audit foundation.
-- This migration does not infer legal applicability or change compliance outcomes.
-- Existing rows are checked before the constraints become trusted by PostgreSQL.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'evidence_items_source_url_https_chk'
  ) THEN
    ALTER TABLE evidence_items
      ADD CONSTRAINT evidence_items_source_url_https_chk
      CHECK (source_url IS NULL OR source_url ~ '^https://') NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'evidence_items_verified_at_nonfuture_chk'
  ) THEN
    ALTER TABLE evidence_items
      ADD CONSTRAINT evidence_items_verified_at_nonfuture_chk
      CHECK (verified_at IS NULL OR verified_at <= created_at) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_events_actor_nonempty_chk'
  ) THEN
    ALTER TABLE audit_events
      ADD CONSTRAINT audit_events_actor_nonempty_chk
      CHECK (length(trim(actor_id)) > 0) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_events_action_nonempty_chk'
  ) THEN
    ALTER TABLE audit_events
      ADD CONSTRAINT audit_events_action_nonempty_chk
      CHECK (length(trim(action)) > 0) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_events_entity_type_nonempty_chk'
  ) THEN
    ALTER TABLE audit_events
      ADD CONSTRAINT audit_events_entity_type_nonempty_chk
      CHECK (length(trim(entity_type)) > 0) NOT VALID;
  END IF;
END $$;

create index if not exists evidence_items_tenant_source_verified_idx
  on evidence_items (tenant_id, source_id, verified_at desc);

create index if not exists audit_events_tenant_actor_created_idx
  on audit_events (tenant_id, actor_id, created_at desc);

create index if not exists audit_events_tenant_action_created_idx
  on audit_events (tenant_id, action, created_at desc);

-- Validation failure must block promotion rather than weaken the constraint
-- or silently repair evidence/audit history.
alter table evidence_items validate constraint evidence_items_source_url_https_chk;
alter table evidence_items validate constraint evidence_items_verified_at_nonfuture_chk;
alter table audit_events validate constraint audit_events_actor_nonempty_chk;
alter table audit_events validate constraint audit_events_action_nonempty_chk;
alter table audit_events validate constraint audit_events_entity_type_nonempty_chk;
