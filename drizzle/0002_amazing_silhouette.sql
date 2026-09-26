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