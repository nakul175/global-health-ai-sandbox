"""Checksum-guarded transactional PostgreSQL migrator. Bootstrap requires privileged DBA identity."""
import os,hashlib
from pathlib import Path
import psycopg
ROOT=Path(__file__).resolve().parent
with psycopg.connect(os.environ['MIGRATION_DATABASE_URL'],autocommit=True) as c:
 c.execute('SELECT pg_advisory_lock(194812,110)')
 try:
  c.execute('CREATE TABLE IF NOT EXISTS public.sandbox_migrations(version text PRIMARY KEY, sha256 text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())')
  for p in sorted((ROOT/'migrations').glob('*.sql')):
   digest=hashlib.sha256(p.read_bytes()).hexdigest()
   previous=c.execute('SELECT sha256 FROM public.sandbox_migrations WHERE version=%s',(p.name,)).fetchone()
   if previous:
    if previous[0]!=digest:raise RuntimeError('Applied migration checksum changed: '+p.name)
    continue
   with c.transaction():
    c.execute("SET LOCAL lock_timeout='5s'");c.execute("SET LOCAL statement_timeout='120s'")
    c.execute(p.read_text())
    c.execute('INSERT INTO public.sandbox_migrations(version,sha256) VALUES(%s,%s)',(p.name,digest))
   print('Applied '+p.name)
 finally:c.execute('SELECT pg_advisory_unlock(194812,110)')
