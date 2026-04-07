import { openSync } from "fs";
import { spawn } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
const logPath = path.join(root, "ui-preview.log");
const logFd = openSync(logPath, "a");

const child = spawn(process.execPath, [viteBin, "--host", "127.0.0.1"], {
  cwd: root,
  detached: true,
  stdio: ["ignore", logFd, logFd],
  windowsHide: true,
  env: process.env,
});

child.unref();

console.log(`Started Vite preview launcher. Logs: ${pathToFileURL(logPath).href}`);
