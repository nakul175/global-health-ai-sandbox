import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

// Loopback, synthetic local harness only. This is not a production database server.
const root = path.resolve(import.meta.dirname, "..");
const local = path.join(root, ".local");
fs.mkdirSync(local, { recursive: true, mode: 0o700 });
const db = await PGlite.create(
  process.env.SANDBOX_DATA_DIR || path.join(local, "pg"),
);
const server = new PGLiteSocketServer({
  db,
  host: "127.0.0.1",
  port: 55432,
  maxConnections: 16,
});
await server.start();
console.log(
  "Embedded PostgreSQL ready on 127.0.0.1:55432 (synthetic development only).",
);
async function stop() {
  await server.stop();
  await db.close();
  process.exit(0);
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
