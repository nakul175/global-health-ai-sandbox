# ADR 010 — Private hosted adapter for user acceptance testing

Status: accepted for synthetic testing only. Date: 2026-09-25.

## Context

The user asked for a hosted application to test. Available hosting supports a Cloudflare-compatible Worker and managed D1; it cannot run the existing Python service with a persistent PostgreSQL TCP connection. No external cloud account or production identity realm is configured.

## Decision

Deliver a private Worker application using the supplied React/Vinext hosting integration, dispatch-owned ChatGPT authentication and D1. Preserve the native Python/PostgreSQL implementation byte-for-byte under `native-baseline`. The hosted adapter implements a connected synthetic workflow over shared source concepts, with explicit capability limits.

The owner ID is never taken from request body, query parameters or browser storage. The edge dispatcher supplies authenticated identity. Synthetic role selection does not confer access to any other real person's workspace. D1 queries always bind the server-derived workspace ID, which combines owner and selected synthetic tenant. D1 has no PostgreSQL RLS; the adapter's scoping is application-enforced and tested.

## Atomic writes and concurrency

A workspace has a monotonic revision. A mutation validates role, current institution, safety overlay and relevant data rights before checking an old receipt. A conditional revision increment starts a D1 atomic batch. Every dependent record, immutable snapshot, audit row and receipt is conditional on the same generated command ID. A competing batch that loses the revision match writes nothing. The loser may return an existing matching receipt for a concurrent identical intent; otherwise it reports 409.

Snapshots and receipts contain canonical JSON. Canonicalization sorts keys for this bounded JSON vocabulary; it is not presented as the complete original RFC8785 cross-language contract. No application endpoint modifies prior snapshots or audit rows. D1 credentials and SQL privileges are managed by hosting rather than per-runtime PostgreSQL roles.

## Data and evaluation

A strict CSV parser accepts 2–1,000 rows, at most 150 KB, with four specified fields. Structured rows are stored in the record payload and suppressed from ordinary API responses. The fixed logistic evaluator computes metrics and freezes input hashes. No arbitrary uploaded code or external network execution is supported. All outputs carry synthetic-only limitations.

## Consequences

Users can test saved workflows immediately without cloud credentials. This is a separate hosted test adapter, not an in-place migration or claim that the original API, NFR catalogue and production architecture have been delivered. Production requires the native service/runner architecture, real identity and governance authorities, accepted regional infrastructure and requirement-level verification.
