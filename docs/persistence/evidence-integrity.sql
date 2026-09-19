-- Defense-in-depth for durable evidence records.
-- Tenant RLS controls visibility; this migration additionally rejects malformed
-- content hashes and verification timestamps that are materially in the future.

create or replace function validate_evidence_item_integrity()
returns trigger
language plpgsql
security invoker
as $$
begin
  if new.content_hash is not null and new.content_hash !~ '^[0-9a-fA-F]{64}$' then
    raise exception 'evidence content_hash must be a SHA-256 hexadecimal digest';
  end if;

  if new.verified_at is not null and new.verified_at > now() + interval '5 minutes' then
    raise exception 'evidence verified_at cannot be materially future-dated';
  end if;

  if btrim(new.title) = '' then
    raise exception 'evidence title must not be empty';
  end if;

  return new;
end;
$$;

drop trigger if exists evidence_items_integrity on evidence_items;

create trigger evidence_items_integrity
before insert or update on evidence_items
for each row
execute function validate_evidence_item_integrity();

comment on function validate_evidence_item_integrity() is
  'Rejects malformed evidence hashes, future-dated verification timestamps, and empty titles.';
