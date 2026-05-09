#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";

function getTemplate() {
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "../../../templates/default");
}

function getName() {
  const name = process.argv[2];
  if (!name) throw new Error("Usage: npx create-desk-app my-tv-app");
  return name;
}

function createApp(name: string) {
  const target = resolve(process.cwd(), name);
  if (existsSync(target)) throw new Error(`Directory already exists: ${target}`);
  mkdirSync(target, { recursive: true });
  cpSync(getTemplate(), target, { recursive: true });
  return target;
}

try {
  const name = getName();
  createApp(name);
  process.stdout.write(
    `${pc.green("Created")} ${name}\n\nNext steps:\n  cd ${name}\n  pnpm install\n  pnpm dev\n`
  );
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${pc.red("create-desk-app error")}\n\n${message}\n`);
  process.exitCode = 1;
}
