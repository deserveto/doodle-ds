#!/usr/bin/env node

import { resolve } from "node:path";
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

const entryPath = process.argv[1] ? resolve(process.argv[1]) : undefined;
if (entryPath === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2)).then((exitCode) => {
    process.exitCode = exitCode;
  }).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
