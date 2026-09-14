#!/usr/bin/env node

import { resolve } from "node:path";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { run } from "./cli";

export { openFolder, parseArgs, run } from "./cli";
export type {
  CliDependencies,
  CliOutput,
  CliPackageMetadata,
  PromptApi,
  SpinnerApi,
} from "./cli";

function canonicalPath(path: string): string {
  try {
    return realpathSync.native(path);
  } catch {
    return resolve(path);
  }
}

/** Determine whether argv[1] points at this module, including through a symlink. */
export function isMainEntry(entryPath: string | undefined): boolean {
  if (!entryPath) {
    return false;
  }

  const requestedPath = canonicalPath(entryPath);
  const modulePath = canonicalPath(fileURLToPath(import.meta.url));
  return process.platform === "win32"
    ? requestedPath.toLowerCase() === modulePath.toLowerCase()
    : requestedPath === modulePath;
}

if (isMainEntry(process.argv[1])) {
  run(process.argv.slice(2)).then((exitCode) => {
    process.exitCode = exitCode;
  }).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
