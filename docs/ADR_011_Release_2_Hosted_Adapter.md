# ADR 011 — Synthetic lab inside the existing Site

Date: 25 September 2026. Adopted for the technical alpha only.

## Context and decision

The Site already provides private hosted identity, persistent D1 storage, protected commands and atomic audit/snapshot/receipt writes. The regional Release 2 architecture requires additional infrastructure for arbitrary model code, protected datasets and remote integrations.

Deliver a bounded synchronous synthetic lab using existing identity, scope, command transport and safety policy. Add `lab_records` and `lab_snapshots` via an additive migration; preserve legacy object constraints. Store deterministic plans, events and fixtures in scoped JSON records; expose permitted projections.

Reconstruct generated media from recipes instead of implying media upload/object storage. Execute a fixed audio feature function with bounded coefficients or imported predictions. Never execute submitted code. Keep callbacks internal. Freeze recipe, data, model, prediction and scenario hashes, and issue exact evidence bytes.

## Consequences

The owner can exercise a complete ecosystem-to-evidence journey. State, inference, persistence, audit and failure behavior execute in the application; health services and identities are fictional.

This adapter does not implement the regional LLD. D1 has no PostgreSQL RLS/runtime-role model: trusted identity and scoped queries enforce owner/institution separation. Labels are not physically isolated. There are no fenced workers, event bus, remote inference, service accounts, signed evidence or production SLO guarantees.

Document `/api/commands` and `/api/lab/*` separately from the proposed `/v2` API. Future production work requires explicit versioning and migration. Preserve the native FastAPI/PostgreSQL baseline and original acceptance criteria.

## Deployment and rollback

Apply migrations in journal order before new code serves traffic. `0001_long_young_avengers.sql` adds only lab tables/indexes. Roll application code back by redeploying a previous compatible Site version; retain additive tables/data. No destructive down migration is supplied. Hosted restoration objectives remain unverified.
