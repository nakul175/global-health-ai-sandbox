import hashlib
import logging
import threading
import time
from contextlib import asynccontextmanager
from uuid import UUID, uuid4

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from psycopg import Error as DatabaseError
from psycopg.errors import UniqueViolation
from starlette.concurrency import run_in_threadpool
from starlette.exceptions import HTTPException

from . import programmes, safety
from .auth import Verifier
from .config import ROOT, Settings
from .contracts import parse_json
from .db import check_runtime, connection, set_context
from .dev_auth import PROFILES, login
from .errors import Fault

log = logging.getLogger("sandbox")


class RequestGuard:
    def __init__(self, app, settings):
        self.app, self.settings = app, settings
        self.buckets = {}
        self.lock = threading.Lock()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        correlation = str(uuid4())
        scope.setdefault("state", {})["correlation"] = correlation
        headers = dict(scope["headers"])

        async def secured_send(message):
            if message["type"] == "http.response.start":
                message["headers"] += [
                    (b"x-correlation-id", correlation.encode()),
                    (b"cache-control", b"no-store"),
                    (b"x-content-type-options", b"nosniff"),
                    (b"referrer-policy", b"no-referrer"),
                    (
                        b"content-security-policy",
                        b"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
                    ),
                    (b"permissions-policy", b"camera=(), microphone=(), geolocation=()"),
                ]
            await send(message)

        try:
            for name in [
                b"authorization",
                b"x-context-id",
                b"host",
                b"origin",
                b"if-match",
                b"idempotency-key",
                b"content-type",
            ]:
                if sum(key.lower() == name for key, value in scope["headers"]) > 1:
                    raise Fault(400, "E_BAD_REQUEST", "Security and intent headers must not be repeated.")
            host = headers.get(b"host", b"").decode()
            from urllib.parse import urlparse

            if host != urlparse(self.settings.origin).netloc:
                raise Fault(400, "E_BAD_REQUEST", "Unrecognized application host.")
            origin = headers.get(b"origin", b"").decode()
            if origin and origin != self.settings.origin:
                raise Fault(403, "E_ACCESS_DENIED", "Use the configured application origin.")
            if scope["path"].startswith("/dev/") and (
                not self.settings.allow_dev_auth or scope.get("client", ("",))[0] not in {"127.0.0.1", "::1"}
            ):
                raise Fault(404, "E_UNAVAILABLE", "Route unavailable.")
            bucket = (scope.get("client", ("unknown",))[0], scope["path"].startswith("/dev/session"))
            now = time.monotonic()
            with self.lock:
                timestamps = [t for t in self.buckets.get(bucket, []) if t > now - 60]
                if len(timestamps) >= (30 if bucket[1] else 600):
                    raise Fault(429, "E_RATE_LIMIT", "Too many requests. Try again shortly.", retryable=True)
                self.buckets[bucket] = timestamps + [now]
                if len(self.buckets) > 10000:
                    self.buckets = {k: v for k, v in self.buckets.items() if v[-1] > now - 60}
            if scope["method"] in {"POST", "PATCH", "PUT"}:
                if headers.get(b"content-encoding", b"identity") != b"identity":
                    raise Fault(415, "E_UNSUPPORTED_MEDIA", "Compressed request bodies are not accepted.")
                if headers.get(b"content-type", b"").split(b";")[0].strip() != b"application/json":
                    raise Fault(415, "E_UNSUPPORTED_MEDIA", "Send application/json.")
                chunks, length = [], 0
                while True:
                    event = await receive()
                    if event["type"] == "http.disconnect":
                        return
                    chunk = event.get("body", b"")
                    length += len(chunk)
                    if length > 1048576:
                        raise Fault(413, "E_BODY_TOO_LARGE", "The JSON body exceeds 1 MiB.")
                    chunks.append(chunk)
                    if not event.get("more_body"):
                        break
                body = b"".join(chunks)
                consumed = False
                original_receive = receive

                async def replay_receive():
                    nonlocal consumed
                    if not consumed:
                        consumed = True
                        return {"type": "http.request", "body": body, "more_body": False}
                    return await original_receive()

                receive = replay_receive
            return await self.app(scope, receive, secured_send)
        except Fault as exc:
            response = JSONResponse(
                exc.body(correlation),
                status_code=exc.status,
                headers={"Retry-After": "1"} if exc.retryable else {},
            )
            return await response(scope, receive, secured_send)


def create_app(settings=None):
    settings = settings or Settings.load()
    settings.validate()
    verifier = Verifier(settings)

    @asynccontextmanager
    async def lifespan(app):
        await run_in_threadpool(check_runtime, settings)
        yield

    app = FastAPI(
        title="Global Health AI Sandbox", lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None
    )
    app.add_middleware(RequestGuard, settings=settings)
    app.state.settings = settings

    def execute(request, operation):
        with connection(settings) as c:
            actor = verifier.actor(
                c, request.headers.get("Authorization"), request.headers.get("X-Context-Id")
            )
            request.state.actor = actor
            return operation(c, actor)

    def audit_failure(request, fault):
        actor = getattr(request.state, "actor", None)
        if actor is None:
            return
        try:
            with connection(settings) as c:
                set_context(c, actor.tenant, actor.principal)
                c.execute(
                    """INSERT INTO audit_events(tenant_id,id,actor_id,action,target_ref_digest,
                    correlation_id,outcome) VALUES(%s,%s,%s,%s,%s,%s,%s)""",
                    (
                        actor.tenant,
                        str(uuid4()),
                        actor.principal,
                        request.method + ":" + fault.code,
                        hashlib.sha256(request.url.path.encode()).hexdigest(),
                        request.state.correlation,
                        "denied" if fault.status < 500 else "failed",
                    ),
                )
        except DatabaseError:
            log.error("audit_failure correlation=%s", request.state.correlation)

    @app.exception_handler(Fault)
    async def fault_handler(request, exc):
        await run_in_threadpool(audit_failure, request, exc)
        return JSONResponse(
            exc.body(request.state.correlation),
            status_code=exc.status,
            headers={"Retry-After": "1"} if exc.retryable else {},
        )

    @app.exception_handler(DatabaseError)
    async def database_handler(request, exc):
        if isinstance(exc, UniqueViolation):
            fault = Fault(422, "E_SEMANTIC", "This programme code is already in use in your institution.")
        else:
            log.error("database_failure correlation=%s sqlstate=%s", request.state.correlation, exc.sqlstate)
            fault = Fault(
                503,
                "E_DEPENDENCY",
                "The service could not complete the request. Retry the same action.",
                retryable=True,
            )
        return await fault_handler(request, fault)

    @app.exception_handler(HTTPException)
    async def http_error(request, exc):
        return await fault_handler(
            request,
            Fault(
                exc.status_code,
                "E_UNAVAILABLE" if exc.status_code == 404 else "E_BAD_REQUEST",
                "Route unavailable." if exc.status_code == 404 else "Unsupported request.",
            ),
        )

    @app.exception_handler(Exception)
    async def unexpected_handler(request, exc):
        log.error("unexpected_failure correlation=%s type=%s", request.state.correlation, type(exc).__name__)
        return await fault_handler(
            request, Fault(500, "E_DEPENDENCY", "The request could not be completed.", retryable=True)
        )

    def response(result):
        body, status = result
        version = body.get("version")
        return JSONResponse(body, status_code=status, headers={"ETag": f'"v{version}"'} if version else {})

    def domain_enabled(domain):
        if domain != "ORG":
            raise Fault(409, "E_CAPABILITY_DISABLED", "This module is not enabled in this release.")

    def identifier(value):
        try:
            return str(UUID(value))
        except ValueError:
            raise Fault(422, "E_VALIDATION", "Use a valid record identifier.") from None

    @app.get("/health/live")
    def live():
        return {"status": "ok"}

    @app.get("/health/ready")
    def ready():
        try:
            with connection(settings) as c:
                c.execute("SELECT 1 FROM sandbox.operation_results LIMIT 0")
            return {"status": "ok"}
        except DatabaseError:
            return JSONResponse({"status": "unavailable"}, status_code=503)

    @app.get("/dev/profiles")
    def profiles():
        return {"profiles": [{"id": key, "label": value[2]} for key, value in PROFILES.items()]}

    @app.post("/dev/session")
    async def dev_session(request: Request):
        body = parse_json(await request.body())
        if not isinstance(body, dict) or set(body) != {"profile"} or not isinstance(body["profile"], str):
            raise Fault(422, "E_VALIDATION", "Choose a synthetic identity.")
        return await run_in_threadpool(
            login, settings, body["profile"], request.headers.get("X-Dev-Access-Code", "")
        )

    @app.get("/v1/me")
    def me(request: Request):
        return execute(
            request,
            lambda c, a: {
                "principal_id": a.principal,
                "contexts": [
                    {"context_id": a.context, "display_name": a.tenant_code, "assurance": a.assurance}
                ],
            },
        )

    @app.get("/v1/session")
    def session(request: Request):
        return execute(
            request,
            lambda c, a: {
                "principal_id": a.principal,
                "context_id": a.context,
                "membership_id": a.membership,
                "role": a.role,
                "institution": a.tenant_code,
                "region": settings.region,
                "can_create_programme": programmes.can_create(c, a),
            },
        )

    @app.get("/v1/capabilities")
    def capabilities(request: Request):
        return execute(
            request,
            lambda c, a: {
                "contract_version": "1.1",
                "region": settings.region,
                "enabled_commands": ["RecordSafetyConcern"]
                + (["ApplyHold"] if a.role in {"CS", "SO", "CO"} else []),
                "writable_payloads": ["Programme"] if programmes.can_create(c, a) else [],
            },
        )

    @app.get("/v1/resources/{domain}")
    def list_resources(request: Request, domain: str):
        def operation(c, actor):
            domain_enabled(domain)
            try:
                if set(request.query_params) - {"limit", "cursor"}:
                    raise ValueError()
                value = request.query_params.get("limit", "50")
                if not value.isdigit() or not 1 <= int(value) <= 200:
                    raise ValueError()
            except ValueError:
                raise Fault(422, "E_VALIDATION", "Use a page size between 1 and 200.") from None
            return programmes.listing(
                c, actor, int(value), request.query_params.get("cursor"), settings.cursor_key
            )

        return execute(request, operation)

    @app.post("/v1/resources/{domain}")
    async def create_resource(request: Request, domain: str):
        body = parse_json(await request.body())

        def operation(c, actor):
            domain_enabled(domain)
            return programmes.create(
                c, actor, body, request.headers.get("Idempotency-Key"), request.state.correlation
            )

        return response(await run_in_threadpool(execute, request, operation))

    @app.get("/v1/resources/{domain}/{resource_id}")
    def get_resource(request: Request, domain: str, resource_id: str):
        def operation(c, actor):
            domain_enabled(domain)
            row = programmes.available(c, actor, identifier(resource_id))
            return programmes.represent(c, actor, row), 200

        return response(execute(request, operation))

    @app.get("/v1/resources/ORG/{resource_id}/restrictions")
    def restrictions(request: Request, resource_id: str):
        def operation(c, actor):
            row = programmes.available(c, actor, identifier(resource_id))
            holds = c.execute(
                """SELECT hold_type,applied_at FROM holds WHERE tenant_id=%s AND scope_id=%s
                AND released_at IS NULL ORDER BY applied_at""",
                (actor.tenant, resource_id),
            ).fetchall()
            return {
                "holds": [{"type": h["hold_type"], "applied_at": h["applied_at"].isoformat()} for h in holds],
                "can_edit": actor.role == "PM"
                and str(row["owner_membership_id"]) == actor.membership
                and row["state"] in {"draft", "returned"}
                and not holds,
            }

        return execute(request, operation)

    @app.patch("/v1/resources/{domain}/{resource_id}")
    async def update_resource(request: Request, domain: str, resource_id: str):
        body = parse_json(await request.body())

        def operation(c, actor):
            domain_enabled(domain)
            return programmes.update(
                c,
                actor,
                identifier(resource_id),
                body,
                request.headers.get("Idempotency-Key"),
                request.headers.get("If-Match"),
                request.state.correlation,
            )

        return response(await run_in_threadpool(execute, request, operation))

    @app.post("/v1/commands/{command}")
    async def command(request: Request, command: str):
        body = parse_json(await request.body())

        def operation(c, actor):
            if command not in {"RecordSafetyConcern", "ApplyHold"}:
                raise Fault(409, "E_CAPABILITY_DISABLED", "This command is not enabled in this release.")
            handler = safety.concern if command == "RecordSafetyConcern" else safety.hold
            return handler(c, actor, body, request.headers.get("Idempotency-Key"), request.state.correlation)

        return response(await run_in_threadpool(execute, request, operation))

    @app.get("/openapi.json")
    def contract():
        return FileResponse(ROOT / "contracts/runtime-openapi.json", media_type="application/json")

    build = ROOT / "apps/web/dist"
    if (build / "assets").exists():
        app.mount("/assets", StaticFiles(directory=build / "assets"), name="assets")

    @app.get("/")
    def index():
        if not (build / "index.html").exists():
            raise Fault(503, "E_DEPENDENCY", "Build the web client with npm run build.")
        return FileResponse(build / "index.html")

    return app
