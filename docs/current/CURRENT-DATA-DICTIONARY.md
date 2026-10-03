# Current data dictionary and migration ledger

Documentation edition **1.1**, 2026-10-03. Reconciled to repository source **8b4b4b5a4b22** plus the unmerged independent cough provider candidate. Hosted alpha package 0.6.0; this candidate is not deployed.

The candidate hosted migrations below are applied, in order, to disposable SQLite during documentation generation. This validates the inventory, not hosted D1 performance or deployment. JSON body rules remain in the closed TypeScript domain schemas. D1 has application-enforced owner scope, not PostgreSQL RLS.

| Migration | SHA-256 |
|---|---|
| drizzle/0000_messy_war_machine.sql | 8fc84930e30e1a904c5b7b5d14682aad3843b08c70e3779d9adcc5c2ac8a1bf6 |
| drizzle/0001_long_young_avengers.sql | 0db7df0abe9519ea170234b60fc7af45e23671a8cdcf500cee82e0429e7e24c2 |
| drizzle/0002_amazing_silhouette.sql | 138b1d5bb5c2199c16473ba2ec93bc6f2fb166b536a0975bb28e2043fb137488 |
| drizzle/0003_easy_hammerhead.sql | 7069058239efaefbf9d7145ae08028c3bfb50fca96c1b62e4e57ce20ebdc1e1c |
| drizzle/0004_cough_evaluation.sql | e4823bef2b6b5bbcd1ccb4b2858bbb3b732ef7430d6ea3c60f33ec5244f68051 |

## audit

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | sequence | INTEGER | 1 | None | 0 |
| 3 | actor | TEXT | 1 | None | 0 |
| 4 | action | TEXT | 1 | None | 0 |
| 5 | record_id | TEXT | 0 | None | 0 |
| 6 | at | TEXT | 1 | None | 0 |
| 7 | digest | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`sequence` integer NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`record_id` text,
	`at` text NOT NULL,
	`digest` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action
);
~~~

## connector_calls

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | connector_id | TEXT | 1 | None | 0 |
| 3 | kind | TEXT | 1 | None | 0 |
| 4 | status | TEXT | 1 | None | 0 |
| 5 | request_hash | TEXT | 1 | None | 0 |
| 6 | config_hash | TEXT | 1 | None | 0 |
| 7 | actor | TEXT | 1 | None | 0 |
| 8 | result | TEXT | 1 | None | 0 |
| 9 | created_at | TEXT | 1 | None | 0 |
| 10 | finished_at | TEXT | 0 | None | 0 |

~~~sql
CREATE TABLE `connector_calls` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`connector_id` text NOT NULL,
	`kind` text NOT NULL,
	`status` text NOT NULL,
	`request_hash` text NOT NULL,
	`config_hash` text NOT NULL,
	`actor` text NOT NULL,
	`result` text NOT NULL,
	`created_at` text NOT NULL,
	`finished_at` text,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`connector_id`) REFERENCES `live_connectors`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "connector_call_json" CHECK(json_valid("connector_calls"."result")),
	CONSTRAINT "connector_call_status" CHECK("connector_calls"."status" IN ('running','passed','failed','unknown','discarded'))
);
~~~

## cough_customers

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | customer_id | TEXT | 1 | None | 0 |
| 3 | active | INTEGER | 1 | None | 0 |
| 4 | version | INTEGER | 1 | None | 0 |
| 5 | agreement_ref | TEXT | 1 | None | 0 |
| 6 | created_at | TEXT | 1 | None | 0 |
| 7 | updated_at | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE cough_customers (
 id text PRIMARY KEY NOT NULL,
 space_id text NOT NULL REFERENCES spaces(id),
 customer_id text NOT NULL CHECK(customer_id='saha-demo'),
 active integer NOT NULL CHECK(active IN (0,1)),
 version integer NOT NULL CHECK(version>0),
 agreement_ref text NOT NULL,
 created_at text NOT NULL,
 updated_at text NOT NULL,
 UNIQUE(space_id,customer_id)
);
~~~

## cough_evaluations

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | customer_id | TEXT | 1 | None | 0 |
| 3 | request_id | TEXT | 1 | None | 0 |
| 4 | request_hash | TEXT | 1 | None | 0 |
| 5 | fixture | TEXT | 1 | None | 0 |
| 6 | agreement_version | INTEGER | 1 | None | 0 |
| 7 | status | TEXT | 1 | None | 0 |
| 8 | result | TEXT | 0 | None | 0 |
| 9 | created_at | TEXT | 1 | None | 0 |
| 10 | finished_at | TEXT | 0 | None | 0 |

~~~sql
CREATE TABLE cough_evaluations (
 id text PRIMARY KEY NOT NULL,
 space_id text NOT NULL REFERENCES spaces(id),
 customer_id text NOT NULL REFERENCES cough_customers(id),
 request_id text NOT NULL,
 request_hash text NOT NULL,
 fixture text NOT NULL CHECK(fixture IN ('generated-waveform','silence')),
 agreement_version integer NOT NULL CHECK(agreement_version>0),
 status text NOT NULL CHECK(status IN ('reserved','completed','blocked')),
 result text CHECK(result IS NULL OR json_valid(result)),
 created_at text NOT NULL,
 finished_at text,
 UNIQUE(space_id,customer_id,request_id),
 CHECK((status='completed' AND result IS NOT NULL) OR (status!='completed' AND result IS NULL))
);
~~~

## lab_records

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | kind | TEXT | 1 | None | 0 |
| 3 | title | TEXT | 1 | None | 0 |
| 4 | status | TEXT | 1 | None | 0 |
| 5 | version | INTEGER | 1 | None | 0 |
| 6 | body | TEXT | 1 | None | 0 |
| 7 | created_by | TEXT | 1 | None | 0 |
| 8 | created_at | TEXT | 1 | None | 0 |
| 9 | updated_at | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `lab_records` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "lab_record_json" CHECK(json_valid("lab_records"."body")),
	CONSTRAINT "lab_record_version" CHECK("lab_records"."version" > 0),
	CONSTRAINT "lab_record_kind" CHECK("lab_records"."kind" IN ('ecosystem','audio_model','lab_run','lab_report'))
);
~~~

## lab_snapshots

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | record_id | TEXT | 1 | None | 0 |
| 3 | version | INTEGER | 1 | None | 0 |
| 4 | body | TEXT | 1 | None | 0 |
| 5 | digest | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `lab_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`record_id` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`digest` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`record_id`) REFERENCES `lab_records`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "lab_snapshot_json" CHECK(json_valid("lab_snapshots"."body"))
);
~~~

## live_connectors

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | name | TEXT | 1 | None | 0 |
| 3 | status | TEXT | 1 | None | 0 |
| 4 | version | INTEGER | 1 | None | 0 |
| 5 | config | TEXT | 1 | None | 0 |
| 6 | credential | TEXT | 1 | None | 0 |
| 7 | config_hash | TEXT | 1 | None | 0 |
| 8 | test_at | TEXT | 0 | None | 0 |
| 9 | test_passed | INTEGER | 1 | 0 | 0 |
| 10 | created_at | TEXT | 1 | None | 0 |
| 11 | updated_at | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `live_connectors` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`version` integer NOT NULL,
	`config` text NOT NULL,
	`credential` text NOT NULL,
	`config_hash` text NOT NULL,
	`test_at` text,
	`test_passed` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "live_connector_json" CHECK(json_valid("live_connectors"."config") AND json_valid("live_connectors"."credential")),
	CONSTRAINT "live_connector_version" CHECK("live_connectors"."version">0),
	CONSTRAINT "live_connector_status" CHECK("live_connectors"."status" IN ('draft','active','disabled'))
);
~~~

## receipts

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | actor | TEXT | 1 | None | 0 |
| 3 | key | TEXT | 1 | None | 0 |
| 4 | request_hash | TEXT | 1 | None | 0 |
| 5 | response | TEXT | 1 | None | 0 |
| 6 | created_at | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`actor` text NOT NULL,
	`key` text NOT NULL,
	`request_hash` text NOT NULL,
	`response` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "receipt_json" CHECK(json_valid("receipts"."response"))
);
~~~

## records

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | kind | TEXT | 1 | None | 0 |
| 3 | title | TEXT | 1 | None | 0 |
| 4 | status | TEXT | 1 | None | 0 |
| 5 | version | INTEGER | 1 | None | 0 |
| 6 | body | TEXT | 1 | None | 0 |
| 7 | created_by | TEXT | 1 | None | 0 |
| 8 | created_at | TEXT | 1 | None | 0 |
| 9 | updated_at | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "record_json" CHECK(json_valid("records"."body")),
	CONSTRAINT "record_version" CHECK("records"."version" > 0),
	CONSTRAINT "record_kind" CHECK("records"."kind" IN ('institution','member','programme','study','dataset','grant','model','run','report','concern','hold'))
);
~~~

## snapshots

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | record_id | TEXT | 1 | None | 0 |
| 3 | version | INTEGER | 1 | None | 0 |
| 4 | body | TEXT | 1 | None | 0 |
| 5 | digest | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`record_id` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`digest` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "snapshot_json" CHECK(json_valid("snapshots"."body"))
);
~~~

## spaces

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | owner | TEXT | 1 | None | 0 |
| 2 | tenant | TEXT | 1 | None | 0 |
| 3 | revision | INTEGER | 1 | 1 | 0 |
| 4 | last_command | TEXT | 1 | 'seed' | 0 |
| 5 | created_at | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `spaces` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`tenant` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`last_command` text DEFAULT 'seed' NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "spaces_revision_positive" CHECK("spaces"."revision" > 0)
);
~~~

## suite_records

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | kind | TEXT | 1 | None | 0 |
| 3 | title | TEXT | 1 | None | 0 |
| 4 | status | TEXT | 1 | None | 0 |
| 5 | version | INTEGER | 1 | None | 0 |
| 6 | body | TEXT | 1 | None | 0 |
| 7 | created_by | TEXT | 1 | None | 0 |
| 8 | created_at | TEXT | 1 | None | 0 |
| 9 | updated_at | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `suite_records` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "suite_record_json" CHECK(json_valid("suite_records"."body")),
	CONSTRAINT "suite_record_version" CHECK("suite_records"."version">0),
	CONSTRAINT "suite_record_kind" CHECK("suite_records"."kind" IN ('connector','integration_test','job','media_session','analysis','access_request','service_identity','exercise','registry_change'))
);
~~~

## suite_snapshots

| Ordinal | Column | SQL type | Required | Default | Primary key |
|---|---|---|---|---|---|
| 0 | id | TEXT | 1 | None | 1 |
| 1 | space_id | TEXT | 1 | None | 0 |
| 2 | record_id | TEXT | 1 | None | 0 |
| 3 | version | INTEGER | 1 | None | 0 |
| 4 | body | TEXT | 1 | None | 0 |
| 5 | digest | TEXT | 1 | None | 0 |

~~~sql
CREATE TABLE `suite_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`record_id` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`digest` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`record_id`) REFERENCES `suite_records`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "suite_snapshot_json" CHECK(json_valid("suite_snapshots"."body"))
);
~~~

## Full migration text

### drizzle/0000_messy_war_machine.sql

~~~sql
CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`sequence` integer NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`record_id` text,
	`at` text NOT NULL,
	`digest` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audit_space_sequence` ON `audit` (`space_id`,`sequence`);--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`actor` text NOT NULL,
	`key` text NOT NULL,
	`request_hash` text NOT NULL,
	`response` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "receipt_json" CHECK(json_valid("receipts"."response"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `receipts_intent` ON `receipts` (`space_id`,`actor`,`key`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "record_json" CHECK(json_valid("records"."body")),
	CONSTRAINT "record_version" CHECK("records"."version" > 0),
	CONSTRAINT "record_kind" CHECK("records"."kind" IN ('institution','member','programme','study','dataset','grant','model','run','report','concern','hold'))
);
--> statement-breakpoint
CREATE INDEX `records_space_kind` ON `records` (`space_id`,`kind`);--> statement-breakpoint
CREATE TABLE `snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`record_id` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`digest` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "snapshot_json" CHECK(json_valid("snapshots"."body"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `snapshot_record_version` ON `snapshots` (`record_id`,`version`);--> statement-breakpoint
CREATE TABLE `spaces` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`tenant` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`last_command` text DEFAULT 'seed' NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "spaces_revision_positive" CHECK("spaces"."revision" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `spaces_owner_tenant` ON `spaces` (`owner`,`tenant`);
~~~

### drizzle/0001_long_young_avengers.sql

~~~sql
CREATE TABLE `lab_records` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "lab_record_json" CHECK(json_valid("lab_records"."body")),
	CONSTRAINT "lab_record_version" CHECK("lab_records"."version" > 0),
	CONSTRAINT "lab_record_kind" CHECK("lab_records"."kind" IN ('ecosystem','audio_model','lab_run','lab_report'))
);
--> statement-breakpoint
CREATE INDEX `lab_records_space_kind` ON `lab_records` (`space_id`,`kind`);--> statement-breakpoint
CREATE TABLE `lab_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`record_id` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`digest` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`record_id`) REFERENCES `lab_records`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "lab_snapshot_json" CHECK(json_valid("lab_snapshots"."body"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lab_snapshot_record_version` ON `lab_snapshots` (`record_id`,`version`);
~~~

### drizzle/0002_amazing_silhouette.sql

~~~sql
CREATE TABLE `suite_records` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "suite_record_json" CHECK(json_valid("suite_records"."body")),
	CONSTRAINT "suite_record_version" CHECK("suite_records"."version">0),
	CONSTRAINT "suite_record_kind" CHECK("suite_records"."kind" IN ('connector','integration_test','job','media_session','analysis','access_request','service_identity','exercise','registry_change'))
);
--> statement-breakpoint
CREATE INDEX `suite_records_space_kind` ON `suite_records` (`space_id`,`kind`);--> statement-breakpoint
CREATE TABLE `suite_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`record_id` text NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`digest` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`record_id`) REFERENCES `suite_records`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "suite_snapshot_json" CHECK(json_valid("suite_snapshots"."body"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `suite_snapshot_record_version` ON `suite_snapshots` (`record_id`,`version`);
~~~

### drizzle/0003_easy_hammerhead.sql

~~~sql
CREATE TABLE `connector_calls` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`connector_id` text NOT NULL,
	`kind` text NOT NULL,
	`status` text NOT NULL,
	`request_hash` text NOT NULL,
	`config_hash` text NOT NULL,
	`actor` text NOT NULL,
	`result` text NOT NULL,
	`created_at` text NOT NULL,
	`finished_at` text,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`connector_id`) REFERENCES `live_connectors`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "connector_call_json" CHECK(json_valid("connector_calls"."result")),
	CONSTRAINT "connector_call_status" CHECK("connector_calls"."status" IN ('running','passed','failed','unknown','discarded'))
);
--> statement-breakpoint
CREATE INDEX `connector_call_space` ON `connector_calls` (`space_id`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `connector_one_running` ON `connector_calls` (`connector_id`) WHERE "connector_calls"."status"='running';--> statement-breakpoint
CREATE TABLE `live_connectors` (
	`id` text PRIMARY KEY NOT NULL,
	`space_id` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`version` integer NOT NULL,
	`config` text NOT NULL,
	`credential` text NOT NULL,
	`config_hash` text NOT NULL,
	`test_at` text,
	`test_passed` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "live_connector_json" CHECK(json_valid("live_connectors"."config") AND json_valid("live_connectors"."credential")),
	CONSTRAINT "live_connector_version" CHECK("live_connectors"."version">0),
	CONSTRAINT "live_connector_status" CHECK("live_connectors"."status" IN ('draft','active','disabled'))
);
--> statement-breakpoint
CREATE INDEX `live_connector_space` ON `live_connectors` (`space_id`);
~~~

### drizzle/0004_cough_evaluation.sql

~~~sql
-- Additive synthetic partner ledger. Existing migrations remain immutable.
CREATE TABLE cough_customers (
 id text PRIMARY KEY NOT NULL,
 space_id text NOT NULL REFERENCES spaces(id),
 customer_id text NOT NULL CHECK(customer_id='saha-demo'),
 active integer NOT NULL CHECK(active IN (0,1)),
 version integer NOT NULL CHECK(version>0),
 agreement_ref text NOT NULL,
 created_at text NOT NULL,
 updated_at text NOT NULL,
 UNIQUE(space_id,customer_id)
);
--> statement-breakpoint
CREATE TABLE cough_evaluations (
 id text PRIMARY KEY NOT NULL,
 space_id text NOT NULL REFERENCES spaces(id),
 customer_id text NOT NULL REFERENCES cough_customers(id),
 request_id text NOT NULL,
 request_hash text NOT NULL,
 fixture text NOT NULL CHECK(fixture IN ('generated-waveform','silence')),
 agreement_version integer NOT NULL CHECK(agreement_version>0),
 status text NOT NULL CHECK(status IN ('reserved','completed','blocked')),
 result text CHECK(result IS NULL OR json_valid(result)),
 created_at text NOT NULL,
 finished_at text,
 UNIQUE(space_id,customer_id,request_id),
 CHECK((status='completed' AND result IS NOT NULL) OR (status!='completed' AND result IS NULL))
);
--> statement-breakpoint
CREATE INDEX cough_evaluations_customer_time ON cough_evaluations(customer_id,created_at);

~~~

R3 candidate SQL remains under [releases/r3/database](../releases/r3/database/001-government-foundation.sql), outside active migrations. The original PostgreSQL profile remains under [native-baseline](../../native-baseline/README.md).
