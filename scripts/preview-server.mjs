import { createReadStream, existsSync, statSync } from "fs";
import { mkdir, readFile } from "fs/promises";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");
const port = Number(process.env.PREVIEW_PORT || 4173);
const apiTarget = process.env.PREVIEW_API_TARGET || "http://127.0.0.1:8787";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mimeTypes[ext] || "application/octet-stream";
  const stat = statSync(filePath);
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": stat.size,
  });
  createReadStream(filePath).pipe(res);
}

function resolveAsset(urlPath) {
  const clean = urlPath === "/" ? "/index.html" : urlPath.split("?")[0];
  const target = path.normalize(path.join(distDir, clean));
  if (!target.startsWith(path.normalize(distDir))) {
    return null;
  }
  return target;
}

async function proxyApi(req, res) {
  const upstream = new URL(req.url || "/", apiTarget);
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const upstreamResponse = await fetch(upstream, {
    method: req.method,
    headers: req.headers,
    body: chunks.length ? Buffer.concat(chunks) : undefined,
  });

  res.writeHead(upstreamResponse.status, Object.fromEntries(upstreamResponse.headers.entries()));
  const buffer = Buffer.from(await upstreamResponse.arrayBuffer());
  res.end(buffer);
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = req.url || "/";
    if (urlPath.startsWith("/api/")) {
      await proxyApi(req, res);
      return;
    }

    const assetPath = resolveAsset(urlPath);
    if (assetPath && existsSync(assetPath) && statSync(assetPath).isFile()) {
      serveFile(assetPath, res);
      return;
    }

    serveFile(path.join(distDir, "index.html"), res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Preview server running at http://127.0.0.1:${port}`);
  console.log(`Proxying API to ${apiTarget}`);
});
