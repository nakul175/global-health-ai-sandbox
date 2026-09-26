SELECT version();
SELECT c.relname,c.relrowsecurity,c.relforcerowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='sandbox' AND c.relkind='r' ORDER BY c.relname;
SELECT rolname,rolsuper,rolbypassrls,rolcanlogin FROM pg_roles WHERE rolname IN('sandbox_owner','sandbox_api','sandbox_worker','sandbox_auditor');
SELECT table_name,privilege_type,grantee FROM information_schema.role_table_grants WHERE table_schema='sandbox' ORDER BY table_name,grantee,privilege_type;
