import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { resolveConfig, type DeskConfig, type ResolvedConfig } from "@chi2l3s/tablejs";

export async function loadConfig(root: string): Promise<ResolvedConfig> {
  const path = join(root, "desk.config.ts");
  if (!existsSync(path)) return resolveConfig({});
  const mod = (await import(`${pathToFileURL(path).href}?t=${Date.now()}`)) as {
    default?: DeskConfig;
  };
  return resolveConfig(mod.default ?? {});
}
