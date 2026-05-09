import { createAndroidPlan, getAndroidMessage } from "@deskjs/platform-android";
import { getTizenMessage } from "@deskjs/platform-tizen";
import { getWebosMessage } from "@deskjs/platform-webos";
import { buildWeb, runDev } from "./vite";
import { loadConfig } from "./config";
import { ensureApp, writeRoutes } from "./routes";

export type Target = "web" | "tizen" | "webos" | "android";

export async function dev(root: string) {
  ensureApp(root);
  return runDev(root);
}

export async function buildTarget(root: string, target: Target = "web") {
  const config = await loadConfig(root);
  if (target === "web") {
    await buildWeb(root);
    return { target, outDir: ".desk/dist/web" };
  }

  if (target === "android") {
    return { target, message: getAndroidMessage(), plan: createAndroidPlan(config) };
  }

  if (target === "tizen") return { target, message: getTizenMessage() };
  return { target, message: getWebosMessage() };
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
