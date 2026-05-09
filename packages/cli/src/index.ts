#!/usr/bin/env node
import { cac } from "cac";
import pc from "picocolors";
import { buildTarget, dev, doctor, type Target } from "@deskjs/compiler";

const cli = cac("desk");

function getRoot() {
  return process.cwd();
}

function printError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${pc.red("deskjs error")}\n\n${message}\n`);
  process.exitCode = 1;
}

cli.command("dev", "Start the deskjs dev server").action(async () => {
  try {
    const server = await dev(getRoot());
    const urls = server.resolvedUrls;
    process.stdout.write(
      `${pc.bold("deskjs dev server")}\n\nLocal:   ${urls?.local[0] ?? "http://localhost:5173"}\nNetwork: ${urls?.network[0] ?? "unavailable"}\n\nPress q to quit.\n`
    );
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.on("data", async (key) => {
      if (key.toString() !== "q") return;
      await server.close();
      process.exit(0);
    });
  } catch (err) {
    printError(err);
  }
});

cli
  .command("build", "Build the app")
  .option("--target <target>", "Build target", { default: "web" })
  .action(async (options: { target: Target }) => {
    try {
      const result = await buildTarget(getRoot(), options.target);
      if ("message" in result) {
        process.stdout.write(`${pc.yellow(result.message)}\n`);
        return;
      }
      process.stdout.write(`${pc.green("Built")} ${result.target} app to ${result.outDir}\n`);
    } catch (err) {
      printError(err);
    }
  });

cli
  .command("run", "Run a target")
  .option("--target <target>", "Run target", { default: "web" })
  .action((options: { target: Target }) => {
    if (options.target === "web") {
      process.stdout.write("Run `desk dev` for the web target.\n");
      return;
    }
    process.stdout.write(
      `Run for ${options.target} will be enabled when the platform SDK integration lands.\n`
    );
  });

cli.command("doctor", "Check the local deskjs project").action(async () => {
  try {
    const result = await doctor(getRoot());
    process.stdout.write(`${pc.bold("deskjs doctor")}\n\nApp: ${result.app}\n`);
    for (const check of result.checks) process.stdout.write(`${pc.green("✓")} ${check}\n`);
  } catch (err) {
    printError(err);
  }
});

cli.help();
cli.parse();
