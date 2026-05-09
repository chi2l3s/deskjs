import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createManifest } from "@deskjs/router/manifest";

function toImport(path: string, root: string) {
  const value = `/${relative(root, path).split(sep).join("/")}`;
  return value.replace(/\\/g, "/");
}

function renderRoute(route: ReturnType<typeof createManifest>[number], root: string) {
  const page = toImport(route.page, root);
  const layouts = route.layouts
    .map((layout) => `() => import("${toImport(layout, root)}")`)
    .join(", ");
  return `{ id: "${route.id}", path: "${route.path}", params: ${JSON.stringify(route.params)}, page: () => import("${page}"), layouts: [${layouts}] }`;
}

export function ensureApp(root: string) {
  const page = join(root, "app", "page.tsx");
  if (existsSync(page)) return;
  throw new Error(
    `Could not find app directory.\n\nExpected:\n  ./app/page.tsx\n\nCreate one or run:\n  npx create-desk-app my-app`
  );
}

export function writeRoutes(root: string) {
  ensureApp(root);
  const appDir = join(root, "app");
  const routes = createManifest(appDir);
  const outDir = join(root, ".desk");
  mkdirSync(outDir, { recursive: true });
  const code = `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport { RouterProvider } from "@deskjs/router";\nimport "./../styles/globals.css";\n\nexport const manifest = [${routes.map((route) => renderRoute(route, root)).join(",")}];\n\ncreateRoot(document.getElementById("root")!).render(<RouterProvider manifest={manifest} />);\n`;
  const entry = join(outDir, "entry.tsx");
  writeFileSync(entry, code);
  return { entry, routes };
}
