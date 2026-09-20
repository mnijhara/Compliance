-- Tenant-scoped application RPCs for Supabase/PostgREST.
-- These functions derive the tenant and actor identity from the caller's JWT,
-- then set the transaction-local claim consumed by the existing RLS policies.
-- They are SECURITY INVOKER so RLS remains the final authorization boundary.

create or replace function complyos_set_tenant_claim()
returns void
language plpgsql
security invoker
volatile
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
volatile
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
declare
  jwt_tenant uuid;
  record_tenant uuid;
  collected_at timestamptz;
  expires_at timestamptz;
  metadata_value jsonb;
begin
  perform complyos_set_tenant_claim();
  jwt_tenant := current_setting('request.jwt.claim.tenant_id', true)::uuid;

  begin
    record_tenant := (p_record->>'tenantId')::uuid;
  exception when invalid_text_representation then
    raise exception 'TENANT_ID_INVALID';
  end;

  if record_tenant is null or record_tenant <> jwt_tenant then
    raise exception 'TENANT_CONTEXT_MISMATCH';
  end if;

  if nullif(trim(p_record->>'id'), '') is null
     or nullif(trim(p_record->>'title'), '') is null
     or nullif(trim(p_record->>'kind'), '') is null
     or nullif(trim(p_record->>'status'), '') is null
     or nullif(trim(p_record->>'collectedAt'), '') is null then
    raise exception 'EVIDENCE_RECORD_INVALID';
  end if;

  begin
    collected_at := (p_record->>'collectedAt')::timestamptz;
    if nullif(trim(p_record->>'expiresAt'), '') is not null then
      expires_at := (p_record->>'expiresAt')::timestamptz;
    end if;
  exception when others then
    raise exception 'EVIDENCE_TIMESTAMP_INVALID';
  end;

  metadata_value := coalesce(p_record->'metadata', '{}'::jsonb);
  if jsonb_typeof(metadata_value) <> 'object' then
    raise exception 'EVIDENCE_METADATA_INVALID';
  end if;

  insert into evidence_items (
    id, tenant_id, kind, title, status, collected_at, expires_at, metadata
  ) values (
    (p_record->>'id')::uuid,
    record_tenant,
    p_record->>'kind',
    trim(p_record->>'title'),
    p_record->>'status',
    collected_at,
    expires_at,
    metadata_value
  );
end;
$$;

create or replace function complyos_list_audit()
returns setof audit_events
language plpgsql
security invoker
volatile
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
declare
  claims jsonb;
  jwt_tenant uuid;
  jwt_actor text;
  record_tenant uuid;
  occurred_at timestamptz;
  evidence_ids uuid[];
begin
  perform complyos_set_tenant_claim();
  jwt_tenant := current_setting('request.jwt.claim.tenant_id', true)::uuid;
  claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
  jwt_actor := nullif(trim(claims ->> 'sub'), '');

  if jwt_actor is null then
    raise exception 'AUTH_ACTOR_CLAIM_INVALID';
  end if;

  begin
    record_tenant := (p_record->>'tenantId')::uuid;
  exception when invalid_text_representation then
    raise exception 'TENANT_ID_INVALID';
  end;

  if record_tenant is null or record_tenant <> jwt_tenant then
    raise exception 'TENANT_CONTEXT_MISMATCH';
  end if;

  if nullif(trim(p_record->'id'), '') is null
     or nullif(trim(p_record->>'action'), '') is null then
    raise exception 'AUDIT_RECORD_INVALID';
  end if;

  begin
    if nullif(trim(p_record->>'occurredAt'), '') is not null then
      occurred_at := (p_record->>'occurredAt')::timestamptz;
    end if;
    select coalesce(
      array(
        select value::uuid
        from jsonb_array_elements_text(coalesce(p_record->'evidenceIds', '[]'::jsonb))
      ),
      '{}'::uuid[]
    ) into evidence_ids;
  exception when others then
    raise exception 'AUDIT_PAYLOAD_INVALID';
  end;

  if jsonb_typeof(coalesce(p_record->'evidenceIds', '[]'::jsonb)) <> 'array' then
    raise exception 'AUDIT_EVIDENCE_IDS_INVALID';
  end if;

  if jsonb_typeof(coalesce(p_record->'payload', '{}'::jsonb)) <> 'object' then
    raise exception 'AUDIT_PAYLOAD_INVALID';
  end if;

  insert into audit_events (
    id, tenant_id, actor_id, action, entity_type, entity_id,
    evidence_ids, payload, created_at
  ) values (
    (p_record->>'id')::uuid,
    record_tenant,
    jwt_actor,
    trim(p_record->>'action'),
    coalesce(nullif(trim(p_record->>'entityType'), ''), 'UNKNOWN'),
    nullif(p_record->>'entityId', '')::uuid,
    evidence_ids,
    coalesce(p_record->'payload', '{}'::jsonb),
    coalesce(occurred_at, now())
  );
end;
$$;

comment on function complyos_set_tenant_claim() is 'Derives and validates tenant_id from the authenticated JWT for RLS.';
comment on function complyos_save_evidence(jsonb) is 'Tenant-scoped evidence insert; rejects caller tenant mismatch before RLS.';
comment on function complyos_append_audit(jsonb) is 'Tenant-scoped append-only audit insert; actor_id is derived from the authenticated JWT sub claim.';
