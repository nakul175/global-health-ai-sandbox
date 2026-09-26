declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    MEDIA?: R2Bucket;
    EVIDENCE_SIGNING_JWK?: string;
    CHECKPOINT_KEY_HEX?: string;
  }
}
