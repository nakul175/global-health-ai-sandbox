-- Read-lock current identity under a narrow owner function; API gains no membership mutation privilege.
SET ROLE sandbox_owner;
CREATE FUNCTION sandbox.lock_current_identity(context_ref uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=sandbox,pg_catalog AS $$
BEGIN
 PERFORM 1 FROM auth_contexts c JOIN memberships m ON m.tenant_id=c.tenant_id AND m.id=c.membership_id
 JOIN principals p ON p.tenant_id=c.tenant_id AND p.id=c.principal_id
 JOIN tenants t ON t.id=c.tenant_id
 WHERE c.tenant_id=current_tenant() AND c.principal_id=current_principal() AND c.id=context_ref
 FOR SHARE OF c,m,p,t;
 PERFORM 1 FROM programme_creation_scopes s JOIN auth_contexts c
 ON c.tenant_id=s.tenant_id AND c.membership_id=s.membership_id
 WHERE c.tenant_id=current_tenant() AND c.principal_id=current_principal() AND c.id=context_ref
 FOR SHARE OF s;
END $$;
REVOKE ALL ON FUNCTION sandbox.lock_current_identity(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION sandbox.lock_current_identity(uuid) TO sandbox_api;
RESET ROLE;
