-- R3 design candidate only. Do not apply directly to a hosted database.
-- Validated against disposable SQLite; promote via a reviewed active migration.
PRAGMA foreign_keys = ON;
BEGIN;
CREATE TABLE gov_organisations (
 id TEXT PRIMARY KEY, name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 200),
 country_code TEXT NOT NULL CHECK(length(country_code)=2),
 status TEXT NOT NULL CHECK(status IN ('draft','active','suspended')),
 policy_profile TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1 CHECK(version>0), created_at TEXT NOT NULL
);
CREATE TABLE gov_people (
 id TEXT PRIMARY KEY, issuer TEXT NOT NULL, subject TEXT NOT NULL,
 UNIQUE(issuer,subject)
);
CREATE TABLE gov_memberships (
 org_id TEXT NOT NULL REFERENCES gov_organisations(id), person_id TEXT NOT NULL REFERENCES gov_people(id),
 role TEXT NOT NULL CHECK(role IN ('institution_admin','programme_lead','evaluator','finance','procurement','vendor','safety','auditor','service','support')),
 status TEXT NOT NULL CHECK(status IN ('invited','active','suspended','revoked')),
 expires_at TEXT, version INTEGER NOT NULL CHECK(version>0),
 PRIMARY KEY(org_id,person_id,role)
);
CREATE TABLE gov_objects (
 org_id TEXT NOT NULL REFERENCES gov_organisations(id), id TEXT NOT NULL,
 kind TEXT NOT NULL, status TEXT NOT NULL, version INTEGER NOT NULL CHECK(version>0),
 programme_id TEXT, programme_kind TEXT NOT NULL DEFAULT 'programme' CHECK(programme_kind='programme'),
 context_id TEXT, context_kind TEXT NOT NULL DEFAULT 'context' CHECK(context_kind='context'),
 protocol_id TEXT, protocol_kind TEXT NOT NULL DEFAULT 'protocol' CHECK(protocol_kind='protocol'),
 pilot_id TEXT, pilot_kind TEXT NOT NULL DEFAULT 'pilot' CHECK(pilot_kind='pilot'),
 created_by TEXT NOT NULL REFERENCES gov_people(id),
 payload TEXT NOT NULL CHECK(json_valid(payload) AND json_type(payload)='object'),
 result TEXT CHECK(result IS NULL OR (json_valid(result) AND json_type(result)='object')),
 digest TEXT NOT NULL CHECK(length(digest)=64 AND digest NOT GLOB '*[^0-9a-f]*'),
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 PRIMARY KEY(org_id,id), UNIQUE(org_id,id,kind),
 FOREIGN KEY(org_id,programme_id,programme_kind) REFERENCES gov_objects(org_id,id,kind),
 FOREIGN KEY(org_id,context_id,context_kind) REFERENCES gov_objects(org_id,id,kind),
 FOREIGN KEY(org_id,protocol_id,protocol_kind) REFERENCES gov_objects(org_id,id,kind),
 FOREIGN KEY(org_id,pilot_id,pilot_kind) REFERENCES gov_objects(org_id,id,kind),
 CHECK((kind='programme' AND programme_id IS NULL) OR (kind!='programme' AND programme_id IS NOT NULL)),
 CHECK(kind NOT IN ('protocol','budget') OR context_id IS NOT NULL),
 CHECK(kind!='run' OR protocol_id IS NOT NULL),
 CHECK(kind!='alert' OR pilot_id IS NOT NULL),
 CHECK((kind='programme' AND status IN ('draft','active','archived')) OR
    (kind='context' AND status IN ('draft','published','superseded')) OR
    (kind='submission' AND status IN ('draft','submitted','accepted','returned','withdrawn')) OR
    (kind='protocol' AND status IN ('draft','in_review','frozen','retired')) OR
    (kind='run' AND status IN ('queued','running','succeeded','failed','cancel_requested','cancelled','unknown')) OR
    (kind='budget' AND status IN ('draft','calculated','reviewed','superseded')) OR
    (kind='evidence' AND status IN ('draft','in_review','changes_requested','rejected','approved','issued','withdrawn','superseded')) OR
    (kind='adapter' AND status IN ('draft','tested','active','disabled')) OR
    (kind='adapter_test' AND status IN ('queued','running','passed','failed','blocked','unknown')) OR
    (kind='pilot' AND status IN ('draft','in_review','approved','active','paused','completed')) OR
    (kind='alert' AND status IN ('open','acknowledged','investigating','resolved','dismissed')) OR
    (kind='registry_share' AND status IN ('draft','approved','active','revoked','expired')) OR (kind='access_grant' AND status IN ('requested','approved','active','revoked','expired')) OR (kind='safety_hold' AND status IN ('active','resolved')))
);
CREATE INDEX gov_objects_programme ON gov_objects(org_id,programme_id,kind,created_at DESC,id DESC);
CREATE INDEX gov_objects_list ON gov_objects(org_id,kind,created_at DESC,id DESC);
CREATE TABLE gov_assignments (
 org_id TEXT NOT NULL, person_id TEXT NOT NULL, role TEXT NOT NULL,
 resource_id TEXT NOT NULL, resource_kind TEXT NOT NULL, purpose TEXT NOT NULL, expires_at TEXT,
 PRIMARY KEY(org_id,person_id,role,resource_id,purpose),
 FOREIGN KEY(org_id,person_id,role) REFERENCES gov_memberships(org_id,person_id,role),
 FOREIGN KEY(org_id,resource_id,resource_kind) REFERENCES gov_objects(org_id,id,kind)
);
CREATE TABLE gov_links (
 org_id TEXT NOT NULL, source_id TEXT NOT NULL, source_kind TEXT NOT NULL,
 target_id TEXT NOT NULL, target_kind TEXT NOT NULL, relation TEXT NOT NULL,
 PRIMARY KEY(org_id,source_id,target_id,relation),
 FOREIGN KEY(org_id,source_id,source_kind) REFERENCES gov_objects(org_id,id,kind),
 FOREIGN KEY(org_id,target_id,target_kind) REFERENCES gov_objects(org_id,id,kind),
 CHECK((relation='evaluates' AND source_kind IN ('protocol','run') AND target_kind='submission') OR
       (relation='includes_run' AND source_kind='evidence' AND target_kind='run') OR
       (relation='includes_budget' AND source_kind='evidence' AND target_kind='budget') OR
       (relation='supersedes' AND source_kind='evidence' AND target_kind='evidence') OR
       (relation='shares' AND source_kind='registry_share' AND target_kind='evidence')),
 CHECK(source_id!=target_id)
);
CREATE TABLE gov_snapshots (
 org_id TEXT NOT NULL, object_id TEXT NOT NULL, version INTEGER NOT NULL CHECK(version>0),
 payload TEXT NOT NULL CHECK(json_valid(payload) AND json_type(payload)='object'),
 digest TEXT NOT NULL CHECK(length(digest)=64), created_at TEXT NOT NULL,
 PRIMARY KEY(org_id,object_id,version), FOREIGN KEY(org_id,object_id) REFERENCES gov_objects(org_id,id)
);
CREATE TABLE gov_reviews (
 org_id TEXT NOT NULL, id TEXT NOT NULL, object_id TEXT NOT NULL, object_kind TEXT NOT NULL,
 reviewer_id TEXT NOT NULL REFERENCES gov_people(id), reviewed_digest TEXT NOT NULL CHECK(length(reviewed_digest)=64),
 decision TEXT NOT NULL CHECK(decision IN ('approve','changes_requested','reject')),
 conflict_declared INTEGER NOT NULL CHECK(conflict_declared IN (0,1)), reason TEXT NOT NULL CHECK(length(reason)>0),
 created_at TEXT NOT NULL, PRIMARY KEY(org_id,id),
 FOREIGN KEY(org_id,object_id,object_kind) REFERENCES gov_objects(org_id,id,kind),
 CHECK(object_kind IN ('protocol','budget','evidence','pilot')),
 CHECK(decision!='approve' OR conflict_declared=0)
);
CREATE TRIGGER gov_review_no_self BEFORE INSERT ON gov_reviews
 WHEN NEW.decision='approve' AND NEW.reviewer_id=(SELECT created_by FROM gov_objects WHERE org_id=NEW.org_id AND id=NEW.object_id)
 BEGIN SELECT RAISE(ABORT,'independent reviewer required'); END;
CREATE TABLE gov_receipts (
 org_id TEXT NOT NULL REFERENCES gov_organisations(id), actor_id TEXT NOT NULL REFERENCES gov_people(id),
 idempotency_key TEXT NOT NULL, method TEXT NOT NULL, path TEXT NOT NULL,
 request_digest TEXT NOT NULL CHECK(length(request_digest)=64), response TEXT NOT NULL CHECK(json_valid(response)),
 created_at TEXT NOT NULL, expires_at TEXT NOT NULL,
 PRIMARY KEY(org_id,actor_id,idempotency_key)
);
CREATE TABLE gov_audit (
 org_id TEXT NOT NULL REFERENCES gov_organisations(id), sequence INTEGER NOT NULL CHECK(sequence>0),
 actor_id TEXT NOT NULL REFERENCES gov_people(id), action TEXT NOT NULL, object_id TEXT,
 object_version INTEGER CHECK(object_version IS NULL OR object_version>0), at TEXT NOT NULL, digest TEXT NOT NULL CHECK(length(digest)=64),
 PRIMARY KEY(org_id,sequence)
);
CREATE TABLE gov_outbox (
 event_id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES gov_organisations(id), aggregate_id TEXT NOT NULL,
 aggregate_version INTEGER NOT NULL CHECK(aggregate_version>0), type TEXT NOT NULL,
 payload TEXT NOT NULL CHECK(json_valid(payload) AND json_type(payload)='object'),
 state TEXT NOT NULL CHECK(state IN ('pending','delivering','delivered','dead_letter')), attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts>=0),
 created_at TEXT NOT NULL, next_attempt_at TEXT
);
CREATE INDEX gov_outbox_dispatch ON gov_outbox(state,next_attempt_at);
CREATE TABLE gov_inbox (
 consumer TEXT NOT NULL, event_id TEXT NOT NULL, processed_at TEXT NOT NULL, PRIMARY KEY(consumer,event_id)
);
CREATE TABLE gov_jobs (
 org_id TEXT NOT NULL, id TEXT NOT NULL, object_id TEXT NOT NULL,
 state TEXT NOT NULL CHECK(state IN ('queued','running','succeeded','failed','cancel_requested','cancelled','blocked','unknown')),
 lease_owner TEXT, lease_until TEXT, fence INTEGER NOT NULL DEFAULT 0 CHECK(fence>=0),
 attempt INTEGER NOT NULL DEFAULT 0 CHECK(attempt>=0), result_digest TEXT, created_at TEXT NOT NULL,
 PRIMARY KEY(org_id,id), FOREIGN KEY(org_id,object_id) REFERENCES gov_objects(org_id,id)
);
CREATE INDEX gov_jobs_dispatch ON gov_jobs(state,lease_until,created_at);
CREATE TABLE gov_observations (
 org_id TEXT NOT NULL, id TEXT NOT NULL, pilot_id TEXT NOT NULL, pilot_kind TEXT NOT NULL DEFAULT 'pilot' CHECK(pilot_kind='pilot'),
 source_id TEXT NOT NULL, source_event_id TEXT NOT NULL, site_id TEXT NOT NULL,
 indicator_code TEXT NOT NULL CHECK(indicator_code IN ('screened','referred','confirmed','service_error','latency_ms','staff_minutes')),
 value_decimal TEXT, unit TEXT NOT NULL CHECK(unit IN ('count','milliseconds','minutes')),
 quality TEXT NOT NULL CHECK(quality IN ('accepted','suspect','missing')), observed_at TEXT NOT NULL, received_at TEXT NOT NULL,
 payload_digest TEXT NOT NULL CHECK(length(payload_digest)=64),
 CHECK((quality='missing' AND value_decimal IS NULL) OR (quality!='missing' AND value_decimal IS NOT NULL)),
 PRIMARY KEY(org_id,id), UNIQUE(org_id,source_id,source_event_id),
 FOREIGN KEY(org_id,pilot_id,pilot_kind) REFERENCES gov_objects(org_id,id,kind)
);
CREATE INDEX gov_observations_window ON gov_observations(org_id,pilot_id,observed_at);
CREATE TABLE gov_share_grants (
 org_id TEXT NOT NULL, share_id TEXT NOT NULL, share_kind TEXT NOT NULL DEFAULT 'registry_share' CHECK(share_kind='registry_share'),
 recipient_org_id TEXT NOT NULL REFERENCES gov_organisations(id), projection TEXT NOT NULL CHECK(json_valid(projection) AND json_type(projection)='object'),
 expires_at TEXT NOT NULL, revoked_at TEXT,
 PRIMARY KEY(org_id,share_id,recipient_org_id), FOREIGN KEY(org_id,share_id,share_kind) REFERENCES gov_objects(org_id,id,kind), CHECK(org_id!=recipient_org_id)
);
CREATE TRIGGER gov_objects_fixed_scope BEFORE UPDATE OF org_id,id,kind,created_by,programme_id,context_id,protocol_id,pilot_id ON gov_objects
 BEGIN SELECT RAISE(ABORT,'identity and parent references are immutable'); END;
CREATE TRIGGER gov_frozen_payload BEFORE UPDATE OF payload,result,digest ON gov_objects
 WHEN (OLD.kind='protocol' AND OLD.status IN ('frozen','retired')) OR
      (OLD.kind='evidence' AND OLD.status IN ('issued','withdrawn','superseded')) OR
      (OLD.kind='context' AND OLD.status IN ('published','superseded')) OR
      (OLD.kind='submission' AND OLD.status IN ('submitted','accepted','withdrawn'))
 BEGIN SELECT RAISE(ABORT,'frozen payload is immutable'); END;
CREATE TRIGGER gov_protected_no_delete BEFORE DELETE ON gov_objects
 WHEN OLD.kind IN ('protocol','evidence','context','submission') AND OLD.status NOT IN ('draft','returned','changes_requested','rejected')
 BEGIN SELECT RAISE(ABORT,'protected history cannot be deleted'); END;
CREATE TRIGGER gov_objects_version BEFORE UPDATE ON gov_objects
 WHEN NEW.version!=OLD.version+1 BEGIN SELECT RAISE(ABORT,'version must increment exactly once'); END;
CREATE TRIGGER gov_audit_no_update BEFORE UPDATE ON gov_audit BEGIN SELECT RAISE(ABORT,'audit is append-only'); END;
CREATE TRIGGER gov_audit_no_delete BEFORE DELETE ON gov_audit BEGIN SELECT RAISE(ABORT,'audit is append-only'); END;
CREATE TRIGGER gov_snapshot_no_update BEFORE UPDATE ON gov_snapshots BEGIN SELECT RAISE(ABORT,'snapshot is immutable'); END;
CREATE TRIGGER gov_snapshot_no_delete BEFORE DELETE ON gov_snapshots BEGIN SELECT RAISE(ABORT,'snapshot is immutable'); END;
CREATE TRIGGER gov_state_transition BEFORE UPDATE OF status ON gov_objects
 WHEN NEW.status!=OLD.status AND NOT ((OLD.kind='access_grant' AND (OLD.status || ':' || NEW.status) IN ('requested:approved','approved:active','active:revoked','active:expired')) OR (OLD.kind='safety_hold' AND OLD.status='active' AND NEW.status='resolved') OR (OLD.kind='programme' AND (OLD.status || ':' || NEW.status) IN ('draft:active','draft:archived','active:archived')) OR (OLD.kind='context' AND (OLD.status || ':' || NEW.status) IN ('draft:published','published:superseded')) OR (OLD.kind='submission' AND (OLD.status || ':' || NEW.status) IN ('draft:submitted','submitted:accepted','submitted:returned','submitted:withdrawn','returned:draft','accepted:withdrawn')) OR (OLD.kind='protocol' AND (OLD.status || ':' || NEW.status) IN ('draft:in_review','in_review:frozen','in_review:draft','frozen:retired')) OR (OLD.kind='run' AND (OLD.status || ':' || NEW.status) IN ('queued:running','queued:cancel_requested','running:cancel_requested','running:succeeded','running:failed','running:unknown','cancel_requested:cancelled','cancel_requested:unknown','unknown:succeeded','unknown:failed','unknown:cancelled')) OR (OLD.kind='budget' AND (OLD.status || ':' || NEW.status) IN ('draft:calculated','calculated:reviewed','calculated:superseded','reviewed:superseded')) OR (OLD.kind='evidence' AND (OLD.status || ':' || NEW.status) IN ('draft:in_review','in_review:changes_requested','in_review:rejected','in_review:approved','changes_requested:draft','approved:issued','approved:draft','issued:withdrawn','issued:superseded')) OR (OLD.kind='adapter' AND (OLD.status || ':' || NEW.status) IN ('draft:tested','tested:active','tested:draft','active:disabled','active:draft','disabled:draft')) OR (OLD.kind='adapter_test' AND (OLD.status || ':' || NEW.status) IN ('queued:running','queued:blocked','running:passed','running:failed','running:unknown','unknown:passed','unknown:failed')) OR (OLD.kind='pilot' AND (OLD.status || ':' || NEW.status) IN ('draft:in_review','in_review:approved','in_review:draft','approved:active','active:paused','active:completed','paused:active','paused:completed')) OR (OLD.kind='alert' AND (OLD.status || ':' || NEW.status) IN ('open:acknowledged','open:investigating','open:dismissed','acknowledged:investigating','investigating:resolved','investigating:dismissed')) OR (OLD.kind='registry_share' AND (OLD.status || ':' || NEW.status) IN ('draft:approved','approved:active','active:revoked','active:expired')))
 BEGIN SELECT RAISE(ABORT,'invalid state transition'); END;
COMMIT;
