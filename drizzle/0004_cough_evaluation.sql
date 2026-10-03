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
