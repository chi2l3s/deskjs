import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { RouteManifest } from "./match";

export type { RouteManifest, RouteRecord } from "./match";

function toPath(route: string) {
  const parts = route.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  return `/${parts.map((part) => (part.startsWith("[") ? `:${part.slice(1, -1)}` : part)).join("/")}`;
}

function getParams(path: string) {
  return path
    .split("/")
    .filter((part) => part.startsWith(":"))
    .map((part) => part.slice(1));
}

function walkFiles(dir: string) {
  const files: string[] = [];
  for (const item of readdirSync(dir)) {
    const path = join(dir, item);
    if (statSync(path).isDirectory()) {
      files.push(...walkFiles(path));
      continue;
    }
    files.push(path);
  }
  return files;
}

function findLayouts(appDir: string, routeDir: string) {
  const layouts: string[] = [];
  let current = routeDir;

  while (current.startsWith(appDir)) {
    const layout = join(current, "layout.tsx");
    if (statSync(current).isDirectory()) {
      try {
        if (statSync(layout).isFile()) layouts.unshift(layout);
      } catch {
        // Missing layouts are expected.
      }
    }
    if (current === appDir) break;
    current = join(current, "..");
  }

  return layouts;
}

export function createManifest(appDir: string): RouteManifest {
  return walkFiles(appDir)
    .filter((file) => file.endsWith(`${sep}page.tsx`))
    .map((page) => {
      const routeDir = page.slice(0, -"/page.tsx".length);
      const route = relative(appDir, routeDir).split(sep).join("/");
      const path = toPath(route);
      return {
        id: path,
        path,
        page,
        layouts: findLayouts(appDir, routeDir),
        params: getParams(path)
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}
