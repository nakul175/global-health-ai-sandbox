-- Privileged, one-time bootstrap in a dedicated database. No passwords in source.
DO $$ BEGIN
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='sandbox_owner') THEN CREATE ROLE sandbox_owner NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS; END IF;
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='sandbox_api') THEN CREATE ROLE sandbox_api NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS; END IF;
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='sandbox_worker') THEN CREATE ROLE sandbox_worker NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS; END IF;
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='sandbox_auditor') THEN CREATE ROLE sandbox_auditor NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS; END IF;
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='sandbox_policy') THEN CREATE ROLE sandbox_policy NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS; END IF;
END $$;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
CREATE SCHEMA IF NOT EXISTS sandbox AUTHORIZATION sandbox_owner;
REVOKE ALL ON SCHEMA sandbox FROM PUBLIC;
GRANT USAGE ON SCHEMA sandbox TO sandbox_api,sandbox_worker,sandbox_auditor,sandbox_policy;
-- Provision separate LOGIN roles via the secret manager and grant exactly one runtime role.
-- Never grant sandbox_owner to a runtime identity. Migrator assumes sandbox_owner only for DDL.
