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