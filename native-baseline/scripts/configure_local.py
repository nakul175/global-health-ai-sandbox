"""Generate distinct local secrets and an ephemeral development RSA issuer. Never check them in."""

import json
import secrets
from pathlib import Path

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

ROOT = Path(__file__).resolve().parents[1]
local = ROOT / ".local"
local.mkdir(exist_ok=True, mode=0o700)
path = local / "config.json"
if path.exists():
    print("Existing local configuration retained.")
else:
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private = local / "issuer.pem"
    private.write_bytes(
        key.private_bytes(
            serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()
        )
    )
    private.chmod(0o600)
    public = json.loads(jwt.algorithms.RSAAlgorithm.to_jwk(key.public_key()))
    public.update(kid="local-1", use="sig", alg="RS256")
    jwks = local / "jwks.json"
    jwks.write_text(json.dumps({"keys": [public]}))
    dsn = "postgresql://postgres:postgres@127.0.0.1:55432/postgres?sslmode=disable"
    values = dict(
        app_env="development",
        db_engine="pglite",
        database_url=dsn,
        policy_database_url=dsn,
        worker_database_url=dsn,
        issuer="http://127.0.0.1:8000/dev",
        audience="health-ai-sandbox",
        jwks_file=str(jwks),
        private_key_file=str(private),
        cursor_key=secrets.token_hex(32),
        dev_access_code=secrets.token_urlsafe(32),
        allow_dev_auth=True,
        region="test-region-1",
        origin="http://127.0.0.1:8000",
    )
    path.write_text(json.dumps(values, indent=2) + "\n")
    path.chmod(0o600)
    print("Created local configuration. npm run dev displays your local sign-in code.")
