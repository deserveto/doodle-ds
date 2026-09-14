import type { CommandSpec } from "./types";

export type PackageManager = "npm";

export function buildInstallCommand(
  packageManager: PackageManager,
  projectDirectory: string,
): CommandSpec {
  if (packageManager !== "npm") {
    throw new Error(`Unsupported package manager: ${String(packageManager)}`);
  }

  return {
    command: "npm",
    args: ["install"],
    cwd: projectDirectory,
  };
}
