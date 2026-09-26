import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
const python = path.join(root, ".venv/bin/python");
const children = [];
function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args, { cwd: root, stdio: "inherit", ...options });
    p.once("error", reject);
    p.once("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`Command failed (${code})`)),
    );
  });
}
let stopping = false;
async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const p of [...children].reverse()) {
    if (p.exitCode !== null || p.signalCode !== null) continue;
    await new Promise((resolve) => {
      const timer = setTimeout(() => p.kill("SIGKILL"), 10000);
      p.once("exit", () => {
        clearTimeout(timer);
        resolve();
      });
      p.kill("SIGTERM");
    });
  }
  process.exit(code);
}
process.on("SIGINT", () => {
  stop();
});
process.on("SIGTERM", () => {
  stop();
});
try {
  await run(python, ["scripts/configure_local.py"]);
  const config = JSON.parse(
    fs.readFileSync(path.join(root, ".local/config.json"), "utf8"),
  );
  if (config.db_engine === "pglite") {
    const db = spawn(process.execPath, ["scripts/embedded-db.mjs"], {
      cwd: root,
      stdio: ["ignore", "pipe", "inherit"],
    });
    children.push(db);
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Database startup timed out")),
        30000,
      );
      db.stdout.on("data", (data) => {
        process.stdout.write(data);
        if (data.toString().includes("ready on")) {
          clearTimeout(timeout);
          resolve();
        }
      });
      db.once("exit", (code) => {
        clearTimeout(timeout);
        reject(new Error(`Database exited (${code})`));
      });
    });
  }
  await run(python, ["scripts/bootstrap_local.py"]);
  await run("npm", ["run", "build"]);
  const api = spawn(
    python,
    [
      "-m",
      "uvicorn",
      "services.api.app.main:create_app",
      "--factory",
      "--host",
      "127.0.0.1",
      "--port",
      "8000",
      "--no-access-log",
    ],
    { cwd: root, stdio: "inherit" },
  );
  children.push(api);
  console.log(
    `\nOpen http://127.0.0.1:8000\nLocal synthetic sign-in code: ${config.dev_access_code}\n`,
  );
  api.once("exit", (code) => {
    stop(code ?? 1);
  });
} catch (e) {
  console.error(e.message);
  await stop(1);
}
