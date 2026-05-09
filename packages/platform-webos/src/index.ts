import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runCommand } from "@deskjs/platform-web/command";

export interface WebosConfig {
  appId: string;
  name: string;
  version: string;
  vendor?: string;
}

export interface WebosOptions {
  root: string;
  webDir: string;
  config: WebosConfig;
}

export function createWebosInfo(config: WebosConfig) {
  return {
    id: config.appId,
    title: config.name,
    version: config.version,
    vendor: config.vendor ?? "deskjs",
    type: "web",
    main: "index.html"
  };
}

export function buildWebos(options: WebosOptions) {
  const outDir = join(options.root, ".desk", "dist", "webos");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  cpSync(options.webDir, outDir, { recursive: true });
  writeFileSync(
    join(outDir, "appinfo.json"),
    `${JSON.stringify(createWebosInfo(options.config), null, 2)}\n`
  );
  writeFileSync(
    join(outDir, "README.md"),
    "Package this folder with webOS TV CLI: ares-package .\n"
  );
  return { outDir };
}

function findPackage(outDir: string) {
  return readdirSync(outDir)
    .filter((file) => file.endsWith(".ipk"))
    .map((file) => join(outDir, file))[0];
}

export function packageWebos(outDir: string) {
  runCommand(
    "ares-package",
    ["."],
    outDir,
    "Install webOS TV CLI so `ares-package` is available, then rerun with --package."
  );

  const file = findPackage(outDir);
  if (!file) throw new Error("webOS CLI completed, but no .ipk file was produced.");
  return { file };
}
