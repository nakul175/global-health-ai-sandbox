declare namespace Cloudflare {
  interface Env {
    COUGH_PROVIDER_OWNER_ID?:string;
    COUGH_SAHA_API_KEY?:string;
    COUGH_RESULT_SIGNING_KEY?:string;
    COUGH_EVALUATION_ENABLED?:string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
    MEDIA?: R2Bucket;
    EVIDENCE_SIGNING_JWK?: string;
    CHECKPOINT_KEY_HEX?: string;
  }
}
