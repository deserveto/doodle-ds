import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { posix, resolve, win32 } from "node:path";
import {
  cancel as clackCancel,
  intro as clackIntro,
  isCancel as clackIsCancel,
  outro as clackOutro,
  spinner as clackSpinner,
  text as clackText,
} from "@clack/prompts";
import pc from "picocolors";
import { buildInstallCommand } from "./install";
import { getTemplateFiles } from "./template";
import { writeTemplate, type TemplateFsApi } from "./generate";
import type { CliOptions } from "./types";
import type { CommandResult, CommandSpec } from "./types";
import {
  validateProjectDirectory,
  type DirectoryDecision,
  type DirectoryFsApi,
  type DirectoryValidationOptions,
} from "./validation";

const supportedFlags = {
  "--yes": "yes",
  "--skip-install": "skipInstall",
  "--force": "force",
  "--open": "open",
  "--help": "help",
  "--version": "version",
} as const satisfies Record<string, keyof Omit<CliOptions, "projectDirectory">>;

export function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    projectDirectory: "",
    yes: false,
    skipInstall: false,
    force: false,
    open: false,
    help: false,
    version: false,
  };

  for (const argument of argv) {
    if (argument.startsWith("-")) {
      const option = supportedFlags[argument as keyof typeof supportedFlags];
      if (!option) {
        throw new Error(`Unknown option: ${argument}`);
      }

      options[option] = true;
      continue;
    }

    if (options.projectDirectory) {
      throw new Error(
        `Only one project directory may be provided (received "${options.projectDirectory}" and "${argument}").`,
      );
    }

    options.projectDirectory = argument;
  }

  return options;
}

export interface PromptApi {
  text(options: {
    message: string;
    placeholder?: string;
    initialValue?: string;
  }): Promise<unknown>;
  isCancel(value: unknown): boolean;
  cancel(message: string): void;
}

export interface SpinnerApi {
  start(message: string): void;
  stop(message: string): void;
}

export interface CliOutput {
  log(message: string): void;
  error(message: string): void;
}

export interface CliPackageMetadata {
  doodleCoreVersion: string;
  version?: string;
}

export interface CliDependencies {
  cwd?: string;
  platform?: NodeJS.Platform;
  packageMetadata?: CliPackageMetadata;
  readPackageMetadata?: () => Promise<CliPackageMetadata>;
  validateProjectDirectory?: (
    input: string,
    cwd: string,
    fsApi?: DirectoryFsApi,
    options?: DirectoryValidationOptions,
  ) => Promise<DirectoryDecision>;
  validationFs?: DirectoryFsApi;
  getTemplateFiles?: typeof getTemplateFiles;
  writeTemplate?: typeof writeTemplate;
  templateFs?: TemplateFsApi;
  runCommand?: (command: CommandSpec) => Promise<CommandResult>;
  prompts?: PromptApi;
  output?: CliOutput;
  intro?: (message: string) => void;
  outro?: (message: string) => void;
  spinner?: () => SpinnerApi;
  openFolder?: (projectDirectory: string) => Promise<void>;
}

const defaultPrompts: PromptApi = {
  text: clackText,
  isCancel: clackIsCancel,
  cancel: clackCancel,
};

const defaultOutput: CliOutput = {
  log: (message) => console.log(message),
  error: (message) => console.error(message),
};

const defaultRunCommand = (command: CommandSpec): Promise<CommandResult> =>
  new Promise((resolveResult, reject) => {
    const child = spawn(command.command, command.args, {
      cwd: command.cwd,
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.once("error", reject);
    child.once("close", (exitCode) => {
      resolveResult({ exitCode: exitCode ?? 1, stdout, stderr });
    });
  });

export const openFolder = (
  projectDirectory: string,
  platform: NodeJS.Platform = process.platform,
  spawnProcess: typeof spawn = spawn,
): Promise<void> =>
  new Promise((resolveOpen, rejectOpen) => {
    const command = platform === "win32" ? "explorer.exe" : platform === "darwin" ? "open" : "xdg-open";
    let child;
    try {
      child = spawnProcess(command, [projectDirectory], {
        detached: true,
        stdio: "ignore",
      });
    } catch (error) {
      rejectOpen(error);
      return;
    }
    child.once("error", rejectOpen);
    child.once("spawn", () => {
      child.unref();
      resolveOpen();
    });
  });

async function readDefaultPackageMetadata(): Promise<CliPackageMetadata> {
  const packagePath = resolve(import.meta.dirname, "../package.json");
  const contents = JSON.parse(await readFile(packagePath, "utf8")) as Partial<CliPackageMetadata>;
  if (!contents.doodleCoreVersion) {
    throw new Error("create-doodle-app package metadata is missing doodleCoreVersion.");
  }
  return contents as CliPackageMetadata;
}

function usage(): string {
  return [
    "Usage: create-doodle-app [project-directory] [options]",
    "",
    "Options:",
    "  --yes            Use my-doodle-app when no directory is provided",
    "  --skip-install   Generate files without running npm install",
    "  --force          Write declared files into a non-empty directory",
    "  --open           Open the generated folder after success",
    "  --help           Show this help",
    "  --version        Show the CLI version",
  ].join("\n");
}

function quotePath(path: string, platform: NodeJS.Platform): string {
  if (platform === "win32") {
    if (/^[A-Za-z0-9._~\\/-]+$/.test(path)) {
      return path;
    }
    return `"${path.replaceAll('"', '\\"')}"`;
  }

  if (/^[A-Za-z0-9._~/-]+$/.test(path)) {
    return path;
  }
  return `'${path.replaceAll("'", "'\\''")}'`;
}

function nextSteps(cwd: string, projectDirectory: string, platform: NodeJS.Platform): string {
  const destination = platform === "win32"
    ? win32.relative(win32.resolve(cwd), win32.resolve(projectDirectory)) || "."
    : posix.relative(posix.resolve(cwd), posix.resolve(projectDirectory)) || ".";
  return `Next steps:\n  cd ${quotePath(destination, platform)}\n  npm run dev`;
}

/** Run the create-doodle-app command and return a process-compatible exit code. */
export async function run(argv: string[], dependencies: CliDependencies = {}): Promise<number> {
  const output = dependencies.output ?? defaultOutput;
  const prompts = dependencies.prompts ?? defaultPrompts;
  let options: CliOptions;

  try {
    options = parseArgs(argv);
  } catch (error) {
    output.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  if (options.help) {
    output.log(usage());
    return 0;
  }

  let metadata: CliPackageMetadata;
  try {
    metadata = dependencies.packageMetadata ?? (dependencies.readPackageMetadata
      ? await dependencies.readPackageMetadata()
      : await readDefaultPackageMetadata());
  } catch (error) {
    output.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  if (options.version) {
    output.log(metadata.version ?? metadata.doodleCoreVersion);
    return 0;
  }

  const cwd = dependencies.cwd ?? process.cwd();
  const intro = dependencies.intro ?? clackIntro;
  const outro = dependencies.outro ?? clackOutro;
  intro(pc.bold("create-doodle-app"));

  let projectInput = options.projectDirectory;
  if (!projectInput) {
    if (options.yes) {
      projectInput = "my-doodle-app";
    } else {
      const answer = await prompts.text({
        message: "Where should we create your Doodle app?",
        placeholder: "my-doodle-app",
      });
      if (prompts.isCancel(answer)) {
        prompts.cancel("Operation cancelled.");
        return 0;
      }
      projectInput = typeof answer === "string" ? answer.trim() : "";
    }
  }

  const validate = dependencies.validateProjectDirectory ?? validateProjectDirectory;
  let decision: DirectoryDecision;
  try {
    decision = await validate(projectInput, cwd, dependencies.validationFs, {
      force: options.force,
    });
  } catch (error) {
    output.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  const getFiles = dependencies.getTemplateFiles ?? getTemplateFiles;
  const write = dependencies.writeTemplate ?? writeTemplate;
  let files: ReturnType<typeof getTemplateFiles>;
  try {
    files = getFiles(decision.projectName, metadata.doodleCoreVersion);
  } catch (error) {
    output.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
  const progress = dependencies.spinner?.() ?? clackSpinner();
  progress.start("Creating your Doodle app");
  try {
    await write(files, decision.projectDirectory, dependencies.templateFs);
    progress.stop("Files created");
  } catch (error) {
    progress.stop("Could not create files");
    output.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  if (!options.skipInstall) {
    const command = buildInstallCommand("npm", decision.projectDirectory);
    const execute = dependencies.runCommand ?? defaultRunCommand;
    progress.start("Installing dependencies with npm");
    try {
      const result = await execute(command);
      if (result.exitCode !== 0) {
        progress.stop("Dependency installation failed");
        output.error(`npm install failed${result.stderr ? `: ${result.stderr.trim()}` : "."}`);
        output.log(`Your generated files are still available. From the project directory, run npm install again to retry.`);
        return 1;
      }
      progress.stop("Dependencies installed");
    } catch (error) {
      progress.stop("Dependency installation failed");
      output.error(`npm install failed: ${error instanceof Error ? error.message : String(error)}`);
      output.log("Your generated files are still available. From the project directory, run npm install again to retry.");
      return 1;
    }
  } else {
    output.log("Skipped dependency installation (--skip-install).");
  }

  if (options.open) {
    try {
      await (dependencies.openFolder ?? openFolder)(decision.projectDirectory);
    } catch (error) {
      output.error(`Could not open the project folder automatically: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  outro(`Created ${decision.projectName} at ${decision.projectDirectory}.\n\n${nextSteps(cwd, decision.projectDirectory, dependencies.platform ?? process.platform)}`);
  return 0;
}
