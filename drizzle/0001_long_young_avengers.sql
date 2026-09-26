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