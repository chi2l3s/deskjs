import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runCommand } from "@deskjs/platform-web/command";

export interface TizenConfig {
  appId: string;
  name: string;
  version: string;
  profile?: string;
}

export interface TizenOptions {
  root: string;
  webDir: string;
  config: TizenConfig;
}

export interface TizenPackageOptions {
  outDir: string;
  profile?: string;
}

export function createTizenConfig(config: TizenConfig) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="${config.appId}" version="${config.version}" viewmodes="maximized">
  <name>${config.name}</name>
  <tizen:application id="${config.appId}" package="${config.appId}" required_version="2.3" />
  <tizen:profile name="${config.profile ?? "tv"}" />
  <content src="index.html" />
  <feature name="http://tizen.org/feature/screen.size.all" />
</widget>
`;
}

export function buildTizen(options: TizenOptions) {
  const outDir = join(options.root, ".desk", "dist", "tizen");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  cpSync(options.webDir, outDir, { recursive: true });
  writeFileSync(join(outDir, "config.xml"), createTizenConfig(options.config));
  writeFileSync(
    join(outDir, "README.md"),
    "Package this folder with Tizen Studio CLI: tizen package -t wgt -s <profile> -- .\n"
  );
  return { outDir };
}

function findWidget(outDir: string) {
  return readdirSync(outDir)
    .filter((file) => file.endsWith(".wgt"))
    .map((file) => join(outDir, file))[0];
}

export function packageTizen(options: TizenPackageOptions) {
  const args = ["package", "-t", "wgt"];
  if (options.profile) args.push("-s", options.profile);
  args.push("--", ".");

  runCommand(
    "tizen",
    args,
    options.outDir,
    "Install Tizen Studio CLI and configure a signing profile, then rerun with --package."
  );

  const file = findWidget(options.outDir);
  if (!file) throw new Error("Tizen CLI completed, but no .wgt file was produced.");
  return { file };
}
