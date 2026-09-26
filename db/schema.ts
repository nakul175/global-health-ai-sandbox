import { sqliteTable, text, integer, index, uniqueIndex, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const spaces = sqliteTable('spaces', {
 id: text('id').primaryKey(), owner: text('owner').notNull(), tenant: text('tenant').notNull(),
 revision: integer('revision').notNull().default(1), lastCommand: text('last_command').notNull().default('seed'), createdAt: text('created_at').notNull(),
}, t => [uniqueIndex('spaces_owner_tenant').on(t.owner,t.tenant), check('spaces_revision_positive', sql`${t.revision} > 0`)]);
export const records = sqliteTable('records', {
 id: text('id').primaryKey(), spaceId: text('space_id').notNull().references(()=>spaces.id),
 kind:text('kind').notNull(), title:text('title').notNull(), status:text('status').notNull(), version:integer('version').notNull(),
 body:text('body').notNull(), createdBy:text('created_by').notNull(), createdAt:text('created_at').notNull(), updatedAt:text('updated_at').notNull(),
},t=>[index('records_space_kind').on(t.spaceId,t.kind),check('record_json',sql`json_valid(${t.body})`),check('record_version',sql`${t.version} > 0`),check('record_kind',sql`${t.kind} IN ('institution','member','programme','study','dataset','grant','model','run','report','concern','hold')`)]);
export const audit = sqliteTable('audit', {
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),sequence:integer('sequence').notNull(),
 actor:text('actor').notNull(),action:text('action').notNull(),recordId:text('record_id'),at:text('at').notNull(),digest:text('digest').notNull(),
},t=>[uniqueIndex('audit_space_sequence').on(t.spaceId,t.sequence)]);
export const snapshots = sqliteTable('snapshots',{
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),recordId:text('record_id').notNull().references(()=>records.id),version:integer('version').notNull(),body:text('body').notNull(),digest:text('digest').notNull(),
},t=>[uniqueIndex('snapshot_record_version').on(t.recordId,t.version),check('snapshot_json',sql`json_valid(${t.body})`)]);
export const receipts = sqliteTable('receipts',{
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),actor:text('actor').notNull(),key:text('key').notNull(),requestHash:text('request_hash').notNull(),response:text('response').notNull(),createdAt:text('created_at').notNull(),
},t=>[uniqueIndex('receipts_intent').on(t.spaceId,t.actor,t.key),check('receipt_json',sql`json_valid(${t.response})`)]);

// Additive Release 2 tables preserve every deployed v1 record and migration.
export const labRecords = sqliteTable('lab_records', {
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),
 kind:text('kind').notNull(),title:text('title').notNull(),status:text('status').notNull(),version:integer('version').notNull(),
 body:text('body').notNull(),createdBy:text('created_by').notNull(),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[index('lab_records_space_kind').on(t.spaceId,t.kind),check('lab_record_json',sql`json_valid(${t.body})`),check('lab_record_version',sql`${t.version} > 0`),check('lab_record_kind',sql`${t.kind} IN ('ecosystem','audio_model','lab_run','lab_report')`)]);
export const labSnapshots = sqliteTable('lab_snapshots',{
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),recordId:text('record_id').notNull().references(()=>labRecords.id),version:integer('version').notNull(),body:text('body').notNull(),digest:text('digest').notNull(),
},t=>[uniqueIndex('lab_snapshot_record_version').on(t.recordId,t.version),check('lab_snapshot_json',sql`json_valid(${t.body})`)]);

export const suiteRecords=sqliteTable('suite_records',{
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),kind:text('kind').notNull(),title:text('title').notNull(),status:text('status').notNull(),version:integer('version').notNull(),body:text('body').notNull(),createdBy:text('created_by').notNull(),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[index('suite_records_space_kind').on(t.spaceId,t.kind),check('suite_record_json',sql`json_valid(${t.body})`),check('suite_record_version',sql`${t.version}>0`),check('suite_record_kind',sql`${t.kind} IN ('connector','integration_test','job','media_session','analysis','access_request','service_identity','exercise','registry_change')`)]);
export const suiteSnapshots=sqliteTable('suite_snapshots',{
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),recordId:text('record_id').notNull().references(()=>suiteRecords.id),version:integer('version').notNull(),body:text('body').notNull(),digest:text('digest').notNull(),
},t=>[uniqueIndex('suite_snapshot_record_version').on(t.recordId,t.version),check('suite_snapshot_json',sql`json_valid(${t.body})`)]);

export const liveConnectors=sqliteTable('live_connectors',{
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),name:text('name').notNull(),status:text('status').notNull(),version:integer('version').notNull(),config:text('config').notNull(),credential:text('credential').notNull(),configHash:text('config_hash').notNull(),testAt:text('test_at'),testPassed:integer('test_passed').notNull().default(0),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[index('live_connector_space').on(t.spaceId),check('live_connector_json',sql`json_valid(${t.config}) AND json_valid(${t.credential})`),check('live_connector_version',sql`${t.version}>0`),check('live_connector_status',sql`${t.status} IN ('draft','active','disabled')`)]);
export const connectorCalls=sqliteTable('connector_calls',{
 id:text('id').primaryKey(),spaceId:text('space_id').notNull().references(()=>spaces.id),connectorId:text('connector_id').notNull().references(()=>liveConnectors.id),kind:text('kind').notNull(),status:text('status').notNull(),requestHash:text('request_hash').notNull(),configHash:text('config_hash').notNull(),actor:text('actor').notNull(),result:text('result').notNull(),createdAt:text('created_at').notNull(),finishedAt:text('finished_at'),
},t=>[index('connector_call_space').on(t.spaceId,t.createdAt),uniqueIndex('connector_one_running').on(t.connectorId).where(sql`${t.status}='running'`),check('connector_call_json',sql`json_valid(${t.result})`),check('connector_call_status',sql`${t.status} IN ('running','passed','failed','unknown','discarded')`)]);
