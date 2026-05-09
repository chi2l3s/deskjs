import { spawnSync } from "node:child_process";

export interface CommandResult {
  stdout: string;
  stderr: string;
}

function getOutput(result: CommandResult) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}

export function runCommand(command: string, args: string[], cwd: string, help: string) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: "pipe"
  });

  if (result.status === 0) return result;
  const output = getOutput(result);
  throw new Error(`${command} ${args.join(" ")} failed.\n\n${output || help}`);
}
