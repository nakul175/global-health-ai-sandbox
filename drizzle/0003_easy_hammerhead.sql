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