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
    main: "index.html",
    icon: "icon.png"
  };
}

function writeIcon(outDir: string) {
  const png =
    "iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAACXBIWXMAAAsTAAALEwEAmpwYAAABfElEQVR4nO3bMQ6CQBBA0R3F/3/loqVJo2JhZ2SQm2HFBLbNNIDPrhPggwAAAAAAAAAAAAAAAAAAwPU5z7Pz7sz86fQy65v33jp9Ci5tTq9zgITlAQmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAYmLAcm1y7ll3dx4GJCoGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwGJCwHJt3gDcqER7r1YK6wAAAABJRU5ErkJggg==";
  writeFileSync(join(outDir, "icon.png"), Buffer.from(png, "base64"));
}

export function buildWebos(options: WebosOptions) {
  const outDir = join(options.root, ".desk", "dist", "webos");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  cpSync(options.webDir, outDir, { recursive: true });
  writeIcon(outDir);
  writeFileSync(
    join(outDir, "appinfo.json"),
    `${JSON.stringify(createWebosInfo(options.config), null, 2)}\n`
  );
  writeFileSync(
    join(outDir, "README.md"),
    "Package this folder with webOS TV CLI: ares-package --no-minify .\n"
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
    ["--no-minify", "."],
    outDir,
    "Install webOS TV CLI so `ares-package` is available, then rerun with --package."
  );

  const file = findPackage(outDir);
  if (!file) throw new Error("webOS CLI completed, but no .ipk file was produced.");
  return { file };
}
