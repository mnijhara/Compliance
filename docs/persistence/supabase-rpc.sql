-- Tenant-scoped application RPCs for Supabase/PostgREST.
-- These functions derive the tenant from the caller's JWT, then set the
-- transaction-local claim consumed by the existing RLS policies. They are
-- SECURITY INVOKER so RLS remains the final authorization boundary.

create or replace function complyos_set_tenant_claim()
returns void
language plpgsql
security invoker
as $$
declare
  claims jsonb;
  tenant_claim text;
begin
  claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
  tenant_claim := claims ->> 'tenant_id';

  if tenant_claim is null or tenant_claim !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    raise exception 'AUTH_TENANT_CLAIM_INVALID';
  end if;

  perform set_config('request.jwt.claim.tenant_id', tenant_claim, true);
end;
$$;

create or replace function complyos_list_evidence()
returns setof evidence_items
language plpgsql
security invoker
stable
as $$
begin
  perform complyos_set_tenant_claim();
  return query
    select * from evidence_items order by created_at desc;
end;
$$;

create or replace function complyos_save_evidence(p_record jsonb)
returns void
language plpgsql
security invoker
volatile
as $$
begin
  perform complyos_set_tenant_claim();
  insert into evidence_items (
    id, tenant_id, source_id, title, source_url, authority,
    verified_at, content_hash, metadata
  ) values (
    (p_record->>'id')::uuid,
    (p_record->>'tenantId')::uuid,
    p_record->>'sourceId',
    p_record->>'title',
    p_record->>'sourceUrl',
    p_record->>'authority',
    nullif(p_record->>'verifiedAt', '')::timestamptz,
    nullif(p_record->>'contentHash', ''),
    coalesce(p_record->'metadata', '{}'::jsonb)
  );
end;
$$;

create or replace function complyos_list_audit()
returns setof audit_events
language plpgsql
security invoker
stable
as $$
begin
  perform complyos_set_tenant_claim();
  return query
    select * from audit_events order by created_at asc;
end;
$$;

create or replace function complyos_append_audit(p_record jsonb)
returns void
language plpgsql
security invoker
volatile
as $$
begin
  perform complyos_set_tenant_claim();
  insert into audit_events (
    id, tenant_id, actor_id, action, entity_type, entity_id,
    evidence_ids, payload
  ) values (
    (p_record->>'id')::uuid,
    (p_record->>'tenantId')::uuid,
    p_record->>'actorId',
    p_record->>'action',
    coalesce(p_record->>'entityType', 'UNKNOWN'),
    nullif(p_record->>'entityId', '')::uuid,
    coalesce(
      array(
        select value::uuid
        from jsonb_array_elements_text(coalesce(p_record->'evidenceIds', '[]'::jsonb))
      ),
      '{}'::uuid[]
    ),
    coalesce(p_record->'payload', '{}'::jsonb)
  );
end;
$$;

comment on function complyos_set_tenant_claim() is 'Derives and validates tenant_id from the authenticated JWT for RLS.';
comment on function complyos_save_evidence(jsonb) is 'Tenant-scoped evidence insert; RLS remains authoritative.';
comment on function complyos_append_audit(jsonb) is 'Tenant-scoped append-only audit insert; RLS and immutability remain authoritative.';
