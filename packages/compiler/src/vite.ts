import { writeFileSync } from "node:fs";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { build, createServer, type InlineConfig } from "vite";
import { prepareWeb } from "@deskjs/platform-web";
import { writeRoutes } from "./routes";

function writeHtml(root: string) {
  const html =
    '<!doctype html><html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>deskjs</title></head><body><div id="root"></div><script type="module" src="/.desk/entry.tsx"></script></body></html>';
  const path = join(root, ".desk", "index.html");
  writeFileSync(path, html);
  return path;
}

export function createVite(root: string, mode: "development" | "production"): InlineConfig {
  writeRoutes(root);
  writeHtml(root);
  return {
    root,
    mode,
    plugins: [react(), tailwindcss()],
    build: {
      outDir: prepareWeb({ root }).outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: join(root, ".desk", "index.html")
      }
    },
    server: {
      host: true,
      port: 5173
    }
  };
}

export async function runDev(root: string) {
  const server = await createServer(createVite(root, "development"));
  await server.listen();
  return server;
}

export async function buildWeb(root: string) {
  await build(createVite(root, "production"));
}
