import { spawn } from "child_process";

function start(command, args, name) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      process.exit(code);
    }
  });

  return child;
}

const api = start("node", ["server/index.js"], "api");
const ui = start("npm", ["run", "dev:ui"], "ui");

const shutdown = () => {
  api.kill();
  ui.kill();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
