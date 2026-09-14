import { describe, expect, it } from "vitest";
import { run, type CliDependencies } from "./cli";
import type { CommandSpec, GeneratedFile } from "./types";

const destination = "C:\\workspace\\my-app";

type TestDependencies = CliDependencies & { outputLog: string[] };

function dependencies(overrides: Partial<CliDependencies> = {}): TestDependencies {
  const output: string[] = [];
  return {
    cwd: "C:\\workspace",
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
