import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { openFolder, run, type CliDependencies } from "./cli";
import { isMainEntry } from "./index";
import type { CommandSpec, GeneratedFile } from "./types";

const destination = "C:\\workspace\\my-app";

type TestDependencies = CliDependencies & { outputLog: string[] };

function dependencies(overrides: Partial<CliDependencies> = {}): TestDependencies {
  const output: string[] = [];
  return {
    cwd: "C:\\workspace",
    platform: "win32",
    packageMetadata: { doodleCoreVersion: "9.9.9", version: "0.1.0" },
    output: {
      log: (message) => output.push(message),
      error: (message) => output.push(`ERROR: ${message}`),
    },
    outputLog: output,
    intro: (message) => output.push(message),
    outro: (message) => output.push(message),
    validateProjectDirectory: async (input, cwd) => ({
      projectDirectory: input.includes(":\\") ? input : `${cwd}\\${input}`,
      projectName: input.split(/[\\/]/).pop() ?? input,
      existingEntries: [],
    }),
    getTemplateFiles: (projectName, coreVersion) => [
      { path: "package.json", contents: `${projectName}@${coreVersion}` },
    ],
    writeTemplate: async () => undefined,
    runCommand: async () => ({ exitCode: 0 }),
    prompts: {
      text: async () => "prompted-app",
      isCancel: () => false,
      cancel: () => undefined,
    },
    openFolder: async () => undefined,
    ...overrides,
  } as TestDependencies;
}

describe("run", () => {
  it("uses a sensible default and remains non-interactive with --yes", async () => {
    const installCommands: CommandSpec[] = [];
    const written: GeneratedFile[][] = [];
    const deps = dependencies({
      runCommand: async (command) => {
        installCommands.push(command);
        return { exitCode: 0 };
      },
      writeTemplate: async (files) => {
        written.push(files);
      },
    });

    await expect(run(["--yes"], deps)).resolves.toBe(0);

    expect(deps.outputLog).not.toContain(expect.stringMatching(/ERROR/));
    expect(written[0]?.[0]?.contents).toBe("my-doodle-app@9.9.9");
    expect(installCommands).toHaveLength(1);
    expect(installCommands[0]).toMatchObject({ command: "npm", args: ["install"] });
    expect(deps.outputLog.join("\n")).toContain("cd my-doodle-app");
    expect(deps.outputLog.join("\n")).toContain("npm run dev");
  });

  it("prints help without prompting or validating a destination", async () => {
    let validations = 0;
    const deps = dependencies({
      validateProjectDirectory: async () => {
        validations += 1;
        throw new Error("should not validate help");
      },
    });

    await expect(run(["--help"], deps)).resolves.toBe(0);
    expect(validations).toBe(0);
    expect(deps.outputLog.join("\n")).toContain("Usage: create-doodle-app");
  });

  it("prints the package version without generating an app", async () => {
    let writes = 0;
    const deps = dependencies({
      writeTemplate: async () => {
        writes += 1;
      },
    });

    await expect(run(["--version"], deps)).resolves.toBe(0);
    expect(writes).toBe(0);
    expect(deps.outputLog).toContain("0.1.0");
  });

  it("prompts for a missing project directory and exits cleanly when cancelled", async () => {
    let promptCalls = 0;
    let writes = 0;
    const deps = dependencies({
      prompts: {
        text: async () => {
          promptCalls += 1;
          return Symbol("cancel");
        },
        isCancel: (value) => typeof value === "symbol",
        cancel: (message) => {
          deps.outputLog.push(`CANCEL: ${message}`);
        },
      },
      writeTemplate: async () => {
        writes += 1;
      },
    });

    await expect(run([], deps)).resolves.toBe(0);
    expect(promptCalls).toBe(1);
    expect(writes).toBe(0);
    expect(deps.outputLog.join("\n")).toMatch(/cancel/i);
  });

  it("refuses unsafe destinations without writing files", async () => {
    let writes = 0;
    const deps = dependencies({
      validateProjectDirectory: async () => {
        throw new Error("The project directory is not empty; re-run with --force.");
      },
      writeTemplate: async () => {
        writes += 1;
      },
    });

    await expect(run(["existing-app"], deps)).resolves.toBe(1);
    expect(writes).toBe(0);
    expect(deps.outputLog.join("\n")).toMatch(/not empty|force/i);
  });

  it("passes --force through to safe validation", async () => {
    let force: boolean | undefined;
    const deps = dependencies({
      validateProjectDirectory: async (_input, _cwd, _fs, options) => {
        force = options?.force;
        return {
          projectDirectory: destination,
          projectName: "my-app",
          existingEntries: ["notes.txt"],
        };
      },
    });

    await expect(run(["my-app", "--force", "--skip-install"], deps)).resolves.toBe(0);
    expect(force).toBe(true);
  });

  it("installs dependencies and opens the generated folder after success", async () => {
    const commands: CommandSpec[] = [];
    const opened: string[] = [];
    const deps = dependencies({
      runCommand: async (command) => {
        commands.push(command);
        return { exitCode: 0, stdout: "installed" };
      },
      openFolder: async (path) => {
        opened.push(path);
      },
    });

    await expect(run(["my-app", "--open"], deps)).resolves.toBe(0);
    expect(commands).toEqual([{ command: "npm", args: ["install"], cwd: destination }]);
    expect(opened).toEqual([destination]);
    expect(deps.outputLog.join("\n")).toMatch(/created|ready/i);
  });

  it("warns but keeps a successful exit when opening the folder fails", async () => {
    const deps = dependencies({
      openFolder: async () => {
        throw new Error("Explorer is unavailable");
      },
    });

    await expect(run(["my-app", "--skip-install", "--open"], deps)).resolves.toBe(0);
    expect(deps.outputLog.join("\n")).toMatch(/could not open.*explorer is unavailable/i);
  });

  it("quotes nested paths with spaces in the exact next steps", async () => {
    const deps = dependencies({
      validateProjectDirectory: async () => ({
        projectDirectory: "C:\\workspace\\nested folder\\my-app",
        projectName: "my-app",
        existingEntries: [],
      }),
    });

    await expect(run(["nested folder\\my-app", "--skip-install"], deps)).resolves.toBe(0);
    expect(deps.outputLog.join("\n")).toContain('cd "nested folder\\my-app"');
  });

  it("keeps POSIX next steps copy-pastable", async () => {
    const deps = dependencies({
      cwd: "/workspace",
      platform: "linux",
      validateProjectDirectory: async () => ({
        projectDirectory: "/workspace/nested folder/my-app",
        projectName: "my-app",
        existingEntries: [],
      }),
    });

    await expect(run(["nested folder/my-app", "--skip-install"], deps)).resolves.toBe(0);
    expect(deps.outputLog.join("\n")).toContain("cd 'nested folder/my-app'");
  });

  it("never invokes npm when --skip-install is set", async () => {
    let commandCalls = 0;
    const deps = dependencies({
      runCommand: async () => {
        commandCalls += 1;
        return { exitCode: 0 };
      },
    });

    await expect(run(["my-app", "--skip-install"], deps)).resolves.toBe(0);
    expect(commandCalls).toBe(0);
    expect(deps.outputLog.join("\n")).toMatch(/skip|npm install/i);
  });

  it("keeps generated files and explains recovery when npm install fails", async () => {
    let writes = 0;
    let commandCalls = 0;
    const deps = dependencies({
      writeTemplate: async () => {
        writes += 1;
      },
      runCommand: async () => {
        commandCalls += 1;
        return { exitCode: 1, stderr: "network unavailable" };
      },
    });

    await expect(run(["my-app"], deps)).resolves.toBe(1);
    expect(writes).toBe(1);
    expect(commandCalls).toBe(1);
    expect(deps.outputLog.join("\n")).toMatch(/install.*failed|npm install/i);
    expect(deps.outputLog.join("\n")).toMatch(/run npm install|retry/i);
  });
});

describe("openFolder", () => {
  it("rejects asynchronous opener failures instead of leaking an unhandled error", async () => {
    const listeners: Record<string, (error?: Error) => void> = {};
    const child = {
      once(event: string, listener: (error?: Error) => void) {
        listeners[event] = listener;
        return child;
      },
      unref() {
        return child;
      },
    };
    const spawnProcess = (() => child) as unknown as typeof import("node:child_process").spawn;

    const pending = openFolder("C:\\workspace\\my-app", "win32", spawnProcess);
    listeners.error?.(new Error("Explorer is unavailable"));

    await expect(pending).rejects.toThrow("Explorer is unavailable");
  });
});

describe("CLI entrypoint", () => {
  it("handles a missing argv entry safely", () => {
    expect(isMainEntry(undefined)).toBe(false);
    expect(isMainEntry(resolve("packages/create-doodle-app/dist/does-not-exist.js"))).toBe(false);
  });

  it("recognizes a symlinked executable path as the main entry", async ({ skip }) => {
    const directory = await mkdtemp(join(tmpdir(), "create-doodle-app-entry-"));
    const target = resolve("packages/create-doodle-app/src/index.ts");
    const link = join(directory, "create-doodle-app");

    try {
      try {
        await symlink(target, link, "file");
      } catch {
        skip("symlink creation is unavailable on this platform");
        return;
      }

      expect(isMainEntry(link)).toBe(true);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
