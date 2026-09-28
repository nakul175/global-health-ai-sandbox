import json
import os
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
# Only SANDBOX_<FIELD> variables override the JSON configuration. These earlier names from the
# environment template are refused so that a stale .env file fails loudly instead of being ignored.
LEGACY_NAMES = {
    "APP_ENV": "app_env",
    "REGION": "region",
    "DATABASE_URL": "database_url",
    "POLICY_DATABASE_URL": "policy_database_url",
    "WORKER_DATABASE_URL": "worker_database_url",
    "OIDC_ISSUER": "issuer",
    "OIDC_AUDIENCE": "audience",
    "ALLOW_DEV_AUTH": "allow_dev_auth",
    "CURSOR_SIGNING_KEY": "cursor_key",
}


def as_bool(value):
    """Accept only a JSON boolean or the strings true/false (any case); never truthiness of a string."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str) and value.lower() in {"true", "false"}:
        return value.lower() == "true"
    raise ValueError("allow_dev_auth must be exactly true or false")


@dataclass(frozen=True)
class Settings:
    app_env: str
    db_engine: str
    database_url: str
    policy_database_url: str
    worker_database_url: str
    issuer: str
    audience: str
    jwks_file: str
    private_key_file: str
    cursor_key: str
    dev_access_code: str
    allow_dev_auth: bool
    region: str
    origin: str

    @classmethod
    def load(cls):
        legacy = sorted(name for name in LEGACY_NAMES if name in os.environ)
        if legacy:
            raise ValueError(
                "Unsupported environment variables "
                + ", ".join(legacy)
                + "; the application reads only SANDBOX_<FIELD> overrides, here "
                + ", ".join("SANDBOX_" + LEGACY_NAMES[name].upper() for name in legacy)
            )
        path = Path(os.getenv("SANDBOX_CONFIG", ROOT / ".local/config.json"))
        values = json.loads(path.read_text()) if path.exists() else {}
        for key in cls.__dataclass_fields__:
            if "SANDBOX_" + key.upper() in os.environ:
                values[key] = os.environ["SANDBOX_" + key.upper()]
        if "allow_dev_auth" in values:
            values["allow_dev_auth"] = as_bool(values["allow_dev_auth"])
        settings = cls(**values)
        settings.validate()
        return settings

    def validate(self):
        if not isinstance(self.allow_dev_auth, bool):
            raise ValueError("allow_dev_auth must be exactly true or false")
        if self.app_env not in {"development", "test", "staging", "production"}:
            raise ValueError("Unknown application environment")
        if self.db_engine not in {"postgres", "pglite"}:
            raise ValueError("Unsupported database engine")
        if self.app_env not in {"development", "test"}:
            if self.allow_dev_auth or self.db_engine == "pglite" or self.private_key_file:
                raise ValueError("Development identity and embedded database are forbidden here")
            if not self.issuer.startswith("https://") or not self.origin.startswith("https://"):
                raise ValueError("HTTPS issuer and origin required")
        if len(self.cursor_key) < 64 or self.cursor_key == self.dev_access_code:
            raise ValueError("A distinct random cursor key of at least 64 characters is required")
        if self.allow_dev_auth and (
            len(self.dev_access_code) < 32 or not self.origin.startswith("http://127.0.0.1:")
        ):
            raise ValueError("Development authentication requires a loopback origin and access code")
        if not self.region or not self.issuer or not self.audience:
            raise ValueError("Region and identity configuration required")
