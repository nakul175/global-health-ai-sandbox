-- Additive slice migration. 001/002 are the unchanged, checksum-pinned baseline.
SET ROLE sandbox_owner;
SET search_path = sandbox, pg_catalog;

CREATE TABLE identity_bindings (
 tenant_id uuid NOT NULL, principal_id uuid NOT NULL, issuer text NOT NULL,
 subject_sha256 text NOT NULL CHECK(subject_sha256 ~ '^[a-f0-9]{64}$'),
 PRIMARY KEY(tenant_id,issuer,subject_sha256),
 FOREIGN KEY(tenant_id,principal_id) REFERENCES principals(tenant_id,id)
);
CREATE TABLE context_activity (
 tenant_id uuid NOT NULL, context_id uuid NOT NULL,
 last_seen_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(tenant_id,context_id),
 FOREIGN KEY(tenant_id,context_id) REFERENCES auth_contexts(tenant_id,id)
);
CREATE TABLE programme_creation_scopes (
 tenant_id uuid NOT NULL, membership_id uuid NOT NULL,
 purpose text NOT NULL CHECK(purpose='programme administration'),
 valid_until timestamptz NOT NULL, revoked_at timestamptz,
 PRIMARY KEY(tenant_id,membership_id),
 FOREIGN KEY(tenant_id,membership_id) REFERENCES memberships(tenant_id,id)
);
CREATE TABLE resource_snapshot_bytes (
 tenant_id uuid NOT NULL, resource_id uuid NOT NULL, version bigint NOT NULL,
 canonical_bytes bytea NOT NULL CHECK(octet_length(canonical_bytes) BETWEEN 1 AND 1048576),
 PRIMARY KEY(tenant_id,resource_id,version),
 FOREIGN KEY(tenant_id,resource_id,version) REFERENCES resource_versions(tenant_id,resource_id,version)
);
CREATE FUNCTION validate_snapshot_bytes() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM resource_versions WHERE tenant_id=NEW.tenant_id
 AND resource_id=NEW.resource_id AND version=NEW.version
 AND canonical_sha256=encode(sha256(NEW.canonical_bytes),'hex')) THEN
 RAISE EXCEPTION 'snapshot digest mismatch' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER snapshot_digest BEFORE INSERT ON resource_snapshot_bytes
 FOR EACH ROW EXECUTE FUNCTION validate_snapshot_bytes();
CREATE TABLE operation_results (
 tenant_id uuid NOT NULL, receipt_id uuid NOT NULL,
 status_code integer NOT NULL CHECK(status_code IN(200,201)),
 response_bytes bytea NOT NULL CHECK(octet_length(response_bytes) BETWEEN 1 AND 1048576),
 PRIMARY KEY(tenant_id,receipt_id),
 FOREIGN KEY(tenant_id,receipt_id) REFERENCES command_receipts(tenant_id,receipt_id)
);
CREATE TABLE assurance_index (
 tenant_id uuid NOT NULL, event_id uuid NOT NULL, resource_id uuid NOT NULL,
 resource_version bigint NOT NULL, event_type text NOT NULL,
 processed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(tenant_id,event_id),
 FOREIGN KEY(tenant_id,event_id) REFERENCES outbox(tenant_id,event_id),
 FOREIGN KEY(tenant_id,resource_id) REFERENCES resources(tenant_id,id)
);
CREATE TABLE safety_impact_tasks (
 tenant_id uuid NOT NULL, hold_id uuid NOT NULL, scope_id uuid NOT NULL,
 state text NOT NULL DEFAULT 'pending' CHECK(state IN('pending','reviewed')),
 PRIMARY KEY(tenant_id,hold_id,scope_id),
 FOREIGN KEY(tenant_id,hold_id) REFERENCES holds(tenant_id,id),
 FOREIGN KEY(tenant_id,scope_id) REFERENCES resources(tenant_id,id)
);
ALTER TABLE programme_countries ADD COLUMN retired_at timestamptz;
-- Preserve legacy values while allowing the exact public command vocabulary.
ALTER TABLE holds DROP CONSTRAINT holds_hold_type_check;
ALTER TABLE holds ADD CONSTRAINT holds_hold_type_check CHECK
 (hold_type IN('safety','security','rights','retention','clinical','legal','governance'));
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['identity_bindings','context_activity','programme_creation_scopes',
 'resource_snapshot_bytes','operation_results','assurance_index','safety_impact_tasks'] LOOP
 EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY',t);
 EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY',t);
 EXECUTE format('CREATE POLICY tenant_boundary ON %I USING (tenant_id=current_tenant() AND current_principal() IS NOT NULL) WITH CHECK (tenant_id=current_tenant() AND current_principal() IS NOT NULL)',t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['resource_snapshot_bytes','operation_results','assurance_index','identity_bindings'] LOOP
 EXECUTE format('CREATE TRIGGER immutable_record BEFORE UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION deny_mutation()',t);
 END LOOP;
END $$;
GRANT SELECT ON identity_bindings,context_activity,programme_creation_scopes,resource_snapshot_bytes,
 operation_results,safety_impact_tasks TO sandbox_api,sandbox_policy;
GRANT SELECT ON assurance_index TO sandbox_api,sandbox_worker;
GRANT INSERT ON identity_bindings,context_activity,programme_creation_scopes TO sandbox_policy;
GRANT UPDATE(last_seen_at) ON context_activity TO sandbox_api;
GRANT UPDATE(revoked_at) ON programme_creation_scopes TO sandbox_policy;
GRANT INSERT ON resource_snapshot_bytes,operation_results,safety_impact_tasks TO sandbox_api;
GRANT UPDATE(retired_at) ON programme_countries TO sandbox_api;
GRANT INSERT ON assurance_index TO sandbox_worker;
-- The API may grant only its current membership the newly created draft scope.
-- A narrow RLS policy prevents using this write privilege to delegate other records.
DROP POLICY tenant_boundary ON membership_scopes;
CREATE POLICY scope_read ON membership_scopes FOR SELECT USING
 (tenant_id=current_tenant() AND current_principal() IS NOT NULL);
CREATE POLICY scope_policy_insert ON membership_scopes FOR INSERT TO sandbox_policy WITH CHECK
 (tenant_id=current_tenant() AND current_principal() IS NOT NULL);
CREATE POLICY scope_creator_insert ON membership_scopes FOR INSERT TO sandbox_api WITH CHECK
 (tenant_id=current_tenant() AND purpose='programme administration'
 AND EXISTS(SELECT 1 FROM memberships m JOIN programme_creation_scopes s
 ON s.tenant_id=m.tenant_id AND s.membership_id=m.id
 WHERE m.tenant_id=membership_scopes.tenant_id AND m.id=membership_scopes.membership_id
 AND m.principal_id=current_principal() AND m.role_code='PM' AND m.state='active'
 AND m.valid_from<=now() AND m.valid_until>now() AND s.revoked_at IS NULL AND s.valid_until>now())
 AND EXISTS(SELECT 1 FROM programmes p JOIN resources r ON r.tenant_id=p.tenant_id AND r.id=p.id
 WHERE p.tenant_id=membership_scopes.tenant_id AND p.id=membership_scopes.resource_id
 AND p.owner_membership_id=membership_scopes.membership_id AND r.created_by=current_principal()
 AND r.state='draft' AND r.version=1));
GRANT INSERT ON membership_scopes TO sandbox_api;
RESET ROLE;
