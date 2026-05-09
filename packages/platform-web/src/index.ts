import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

export interface WebOptions {
  root: string;
  outDir?: string;
}

export function getWebOutDir(root: string, outDir = ".desk/dist/web") {
  return join(root, outDir);
}

export function prepareWeb(options: WebOptions) {
  const outDir = getWebOutDir(options.root, options.outDir);
  mkdirSync(dirname(outDir), { recursive: true });
  return { outDir };
}

export function copyPublic(root: string, outDir: string) {
  const publicDir = join(root, "public");
  if (!existsSync(publicDir)) return;
  cpSync(publicDir, outDir, { recursive: true });
}

export function normalizeWeb(root: string) {
  const outDir = getWebOutDir(root);
  const nested = join(outDir, ".desk", "index.html");
  const index = join(outDir, "index.html");
  if (existsSync(nested)) {
    rmSync(index, { force: true });
    renameSync(nested, index);
    rmSync(join(outDir, ".desk"), { recursive: true, force: true });
  }
  return { outDir };
}
