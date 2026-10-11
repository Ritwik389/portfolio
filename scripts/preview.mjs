import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT || 3000);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".pdf": "application/pdf", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8" };

if (!existsSync(root)) {
  console.error("Build the portfolio first with npm run build.");
  process.exit(1);
}

createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) pathname = pathname.slice(basePath.length) || "/";
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const info = await stat(file);
    response.writeHead(200, { "Content-Type": pathname.replace(/\/$/, "") === "/api/ratings" ? "application/json; charset=utf-8" : types[extname(file)] || "application/octet-stream", "Content-Length": info.size });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Portfolio preview: http://localhost:${port}${basePath}/`));
