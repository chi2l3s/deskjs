import { copyFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import { buildAndroid, packageAndroid } from "@deskjs/platform-android";
import { buildTizen, packageTizen } from "@deskjs/platform-tizen";
import { normalizeWeb } from "@deskjs/platform-web";
import { buildWebos, packageWebos } from "@deskjs/platform-webos";
import { buildWeb, runDev } from "./vite";
import { loadConfig } from "./config";
import { ensureApp, writeRoutes } from "./routes";

export type Target = "web" | "tizen" | "webos" | "android";

export interface BuildOptions {
  shouldPackage?: boolean;
  signProfile?: string;
}

export async function dev(root: string) {
  ensureApp(root);
  return runDev(root);
}

function copyArtifact(root: string, file: string) {
  const outDir = join(root, ".desk", "output");
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, basename(file));
  copyFileSync(file, target);
  return target;
}

function createResult(target: Target, outDir: string, file?: string) {
  return { target, outDir, file };
}

export async function buildTarget(
  root: string,
  target: Target = "web",
  options: BuildOptions = {}
) {
  const config = await loadConfig(root);
  await buildWeb(root);
  const web = normalizeWeb(root);

  if (target === "web") {
    return createResult(target, web.outDir);
  }

  if (target === "android") {
    const android = buildAndroid({ root, webDir: web.outDir, config });
    const artifact = options.shouldPackage
      ? copyArtifact(root, packageAndroid(android.outDir).file)
      : undefined;
    return createResult(target, android.outDir, artifact);
  }

  if (target === "tizen") {
    const profile = config.targets.tizen?.profile;
    const tizen = buildTizen({ root, webDir: web.outDir, config: { ...config, profile } });
    const artifact = options.shouldPackage
      ? copyArtifact(
          root,
          packageTizen({
            outDir: tizen.outDir,
            profile: options.signProfile ?? process.env.DESK_TIZEN_SIGN_PROFILE
          }).file
        )
      : undefined;
    return createResult(target, tizen.outDir, artifact);
  }

  const vendor = config.targets.webos?.vendor;
  const webos = buildWebos({ root, webDir: web.outDir, config: { ...config, vendor } });
  const artifact = options.shouldPackage
    ? copyArtifact(root, packageWebos(webos.outDir).file)
    : undefined;
  return createResult(target, webos.outDir, artifact);
}

export async function doctor(root: string) {
  const config = await loadConfig(root);
  ensureApp(root);
  writeRoutes(root);
  return {
    app: config.name,
    checks: ["app/page.tsx found", "desk.config.ts valid", "route manifest generated"]
  };
}

export { createVite, buildWeb, runDev } from "./vite";
export { loadConfig } from "./config";
export { writeRoutes, ensureApp } from "./routes";
