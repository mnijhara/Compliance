-- Defense-in-depth for the durable audit trail.
-- RLS controls tenant visibility; this migration additionally makes audit events
-- immutable at the database layer so application bugs cannot rewrite history.

create or replace function prevent_audit_event_mutation()
returns trigger
language plpgsql
security invoker
as $$
begin
  raise exception 'audit_events are append-only';
end;
$$;

drop trigger if exists audit_events_immutable on audit_events;

create trigger audit_events_immutable
before update or delete on audit_events
for each row
execute function prevent_audit_event_mutation();

comment on function prevent_audit_event_mutation() is
  'Prevents UPDATE/DELETE of audit events; audit history is append-only.';
