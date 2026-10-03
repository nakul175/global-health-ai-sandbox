import type { ReactNode } from 'react';
import type { RecordItem, Profile } from './domain';
import type { Resource, scorePredictions } from './lab';

// Type-only projections of the existing transport and persisted record shapes.
// Runtime validation remains in the existing closed schemas and route guards.
export type ApiError = { error: { code: string; message: string } };
export type AuditEntry = { sequence: number; actor: string; action: string; recordId: string | null; at: string; digest: string };
export type WorkspaceView = ApiError & { revision: number; records: RecordItem[]; audit: AuditEntry[]; profile: Profile };
export type CommandResult = ApiError & { revision: number; recordIds: string[] };
export type RegistryView = ApiError & { items: Resource[]; total: number; next_cursor: string | null };
export type Prediction = { subjectId: string; probability: number };
export type MediaPart = { index: number; size: number; sha256: string };
export type Assertion = { id: string; label: string; passed: boolean; actual: number; expected: number };
export type LabEvent = { id: string; atHour: number; type: string; subjectId: string; effectKey: string; duplicate?: boolean; outcome?: string };
export type GroupMetrics = { group: string; n: number; suppressed: boolean; metrics: ReturnType<typeof scorePredictions> | null };
export type CheckpointItem = { id: string; createdAt: string; revision: number; encryptedBytes: number };
export type CheckpointResponse = ApiError & { items: CheckpointItem[] };
export type JobAttempt = { epoch: number; [field: string]: unknown };
export type FormValue = string | number | boolean | null | undefined;
export type DisplayValue = ReactNode;
