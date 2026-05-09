import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const packages = [
  "packages/focus",
  "packages/theme",
  "packages/router",
  "packages/platform-web",
  "packages/platform-tizen",
  "packages/platform-webos",
  "packages/platform-android",
  "packages/ui",
  "packages/core",
  "packages/compiler",
  "packages/cli",
  "packages/create-desk-app"
];

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: options.stdio ?? "pipe",
    ...options
  });

  if (result.status === 0) return result;
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  throw new Error(output || `${command} ${args.join(" ")} failed`);
}

function readPackage(dir) {
  const path = join(process.cwd(), dir, "package.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

function hasToken() {
  return Boolean(process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN);
}

function getVersion(name, version) {
  const result = spawnSync("npm", ["view", `${name}@${version}`, "version"], {
    encoding: "utf8",
    shell: process.platform === "win32"
  });

  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function publishPackage(dir) {
  const pkg = readPackage(dir);
  const current = getVersion(pkg.name, pkg.version);

  if (current === pkg.version) {
    process.stdout.write(`Skipping ${pkg.name}@${pkg.version}; already published.\n`);
    return;
  }

  const args = ["publish", "--no-git-checks"];
  if (pkg.name.startsWith("@")) args.push("--access", "public");

  process.stdout.write(`Publishing ${pkg.name}@${pkg.version}...\n`);
  runCommand("pnpm", args, { cwd: join(process.cwd(), dir), stdio: "inherit" });
}

if (!hasToken()) {
  throw new Error("Missing NPM_TOKEN GitHub secret.");
}

if (!existsSync("pnpm-lock.yaml")) {
  throw new Error("Run this script from the repository root.");
}

for (const dir of packages) {
  publishPackage(dir);
}
