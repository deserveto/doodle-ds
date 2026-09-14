import { readdir, stat } from "node:fs/promises";
import { basename, isAbsolute, relative, resolve, sep } from "node:path";

export interface DirectoryFsApi {
  stat(path: string): Promise<{ isDirectory(): boolean }>;
  readdir(path: string): Promise<string[]>;
}

export interface DirectoryDecision {
  projectDirectory: string;
  projectName: string;
  existingEntries: string[];
}

export interface DirectoryValidationOptions {
  force?: boolean;
}

const defaultFsApi: DirectoryFsApi = {
  async stat(path) {
    return stat(path);
  },
  async readdir(path) {
    return readdir(path);
  },
};

const invalidPackageNames = new Set(["node_modules", "favicon.ico"]);

function isValidProjectName(name: string): boolean {
  return (
    name.length > 0 &&
    name.length <= 214 &&
    !invalidPackageNames.has(name) &&
    /^[a-z0-9][a-z0-9._~-]*$/.test(name)
  );
}

function isMissingPath(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

export async function validateProjectDirectory(
  input: string,
  cwd: string,
  fsApi: DirectoryFsApi = defaultFsApi,
  options: DirectoryValidationOptions = {},
): Promise<DirectoryDecision> {
  if (!input.trim()) {
    throw new Error("A project directory is required.");
  }

  const workingDirectory = resolve(cwd);
  const projectDirectory = resolve(workingDirectory, input);
  const relativeDestination = relative(workingDirectory, projectDirectory);

  if (
    relativeDestination === ".." ||
    relativeDestination.startsWith(`..${sep}`) ||
    isAbsolute(relativeDestination)
  ) {
    throw new Error("The project directory must be inside the current working directory.");
  }

  const projectName = basename(projectDirectory);
  if (!isValidProjectName(projectName)) {
    throw new Error(
      `"${projectName}" is not a valid npm package name. Use lowercase letters, numbers, dots, hyphens, or underscores.`,
    );
  }

  let existingEntries: string[] = [];

  try {
    const destinationStat = await fsApi.stat(projectDirectory);
    if (!destinationStat.isDirectory()) {
      throw new Error(`The project destination "${projectDirectory}" is a file.`);
    }

    existingEntries = await fsApi.readdir(projectDirectory);
  } catch (error) {
    if (!isMissingPath(error)) {
      throw error;
    }
  }

  if (existingEntries.length > 0 && !options.force) {
    throw new Error(
      `The project directory "${projectDirectory}" is not empty. Re-run with --force to write without deleting existing files.`,
    );
  }

  return {
    projectDirectory,
    projectName,
    existingEntries,
  };
}
