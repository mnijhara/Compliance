-- Defense-in-depth constraints for the durable evidence/audit foundation.
-- This migration does not infer legal applicability or change compliance outcomes.
-- Existing rows are checked before the constraints become trusted by PostgreSQL.

alter table evidence_items
  add constraint evidence_items_source_url_https_chk
  check (source_url is null or source_url ~ '^https://') not valid;

alter table evidence_items
  add constraint evidence_items_verified_at_nonfuture_chk
  check (verified_at is null or verified_at <= created_at) not valid;

alter table audit_events
  add constraint audit_events_actor_nonempty_chk
  check (length(trim(actor_id)) > 0) not valid;

alter table audit_events
  add constraint audit_events_action_nonempty_chk
  check (length(trim(action)) > 0) not valid;

alter table audit_events
  add constraint audit_events_entity_type_nonempty_chk
  check (length(trim(entity_type)) > 0) not valid;

create index if not exists evidence_items_tenant_source_verified_idx
  on evidence_items (tenant_id, source_id, verified_at desc);

create index if not exists audit_events_tenant_actor_created_idx
  on audit_events (tenant_id, actor_id, created_at desc);

create index if not exists audit_events_tenant_action_created_idx
  on audit_events (tenant_id, action, created_at desc);

-- Validate only after the deployment has confirmed existing data satisfies the
-- same invariants. Validation failure must block promotion rather than weaken
-- the constraint or silently repair evidence/audit history.
alter table evidence_items validate constraint evidence_items_source_url_https_chk;
alter table evidence_items validate constraint evidence_items_verified_at_nonfuture_chk;
alter table audit_events validate constraint audit_events_actor_nonempty_chk;
alter table audit_events validate constraint audit_events_action_nonempty_chk;
alter table audit_events validate constraint audit_events_entity_type_nonempty_chk;
