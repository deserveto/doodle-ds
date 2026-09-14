import { execFile as execFileCallback } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const execFile = promisify(execFileCallback);
const repositoryRoot = resolve(import.meta.dirname, "..");
const cliPackageRoot = resolve(repositoryRoot, "packages/create-doodle-app");
const cliEntry = resolve(cliPackageRoot, "dist/index.js");
const runIntegration = process.env.DOODLE_DS_RUN_INTEGRATION === "1";

function npmInvocation(): { command: string; args: string[] } {
  if (process.platform === "win32") {
    return {
      command: process.execPath,
      args: [resolve(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js")],
    };
  }
  return { command: "npm", args: [] };
}

async function ensureBuiltCli(): Promise<void> {
  try {
    await access(cliEntry);
  } catch {
    const npm = npmInvocation();
    await execFile(npm.command, [...npm.args, "run", "build", "-w", "create-doodle-app"], {
      cwd: repositoryRoot,
      maxBuffer: 10 * 1024 * 1024,
    });
  }
}

describe("create-doodle-app integration", () => {
  it.skipIf(!runIntegration)(
    "scaffolds a buildable app with aligned Doodle DS dependencies",
    async () => {
      await ensureBuiltCli();
      const temporaryRoot = await mkdtemp(join(tmpdir(), "doodle-app-integration-"));
      const projectDirectory = join(temporaryRoot, "my-app");

      try {
        const npm = npmInvocation();
        await execFile(process.execPath, [cliEntry, "my-app"], {
          cwd: temporaryRoot,
          maxBuffer: 10 * 1024 * 1024,
        });

        const packageJson = JSON.parse(
          await readFile(join(projectDirectory, "package.json"), "utf8"),
        ) as {
          dependencies?: Record<string, string>;
          devDependencies?: Record<string, string>;
        };
        const cliPackageJson = JSON.parse(
          await readFile(join(cliPackageRoot, "package.json"), "utf8"),
        ) as { doodleCoreVersion: string };

        await expectFiles(projectDirectory, [
          "package.json",
          "vite.config.ts",
          "index.html",
          "src/main.tsx",
          "src/App.tsx",
          "src/index.css",
          "README.md",
          "DESIGN_SYSTEM.md",
        ]);

        expect(packageJson.dependencies).toMatchObject({
          "@sangisalarp/icons": cliPackageJson.doodleCoreVersion,
          "@sangisalarp/tokens": cliPackageJson.doodleCoreVersion,
          "@sangisalarp/ui": cliPackageJson.doodleCoreVersion,
        });
        expect(packageJson.devDependencies).toMatchObject({
          "@tailwindcss/vite": expect.any(String),
          tailwindcss: expect.any(String),
          vite: expect.any(String),
        });

        await execFile(npm.command, [...npm.args, "run", "build"], {
          cwd: projectDirectory,
          maxBuffer: 10 * 1024 * 1024,
        });
      } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
      }
    },
    180_000,
  );
});

async function expectFiles(directory: string, files: string[]): Promise<void> {
  for (const file of files) {
    await expect(access(join(directory, file))).resolves.toBeUndefined();
  }
}
