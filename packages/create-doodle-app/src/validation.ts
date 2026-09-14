import { lstat, readdir, realpath, stat } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

export interface DirectoryFsApi {
  lstat(path: string): Promise<{ isSymbolicLink(): boolean }>;
  stat(path: string): Promise<{ isDirectory(): boolean }>;
  readdir(path: string): Promise<string[]>;
  realpath(path: string): Promise<string>;
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
  async lstat(path) {
    return lstat(path);
  },
  async stat(path) {
    return stat(path);
  },
  async readdir(path) {
    return readdir(path);
  },
  async realpath(path) {
    return realpath(path);
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

async function canonicalizePath(path: string, fsApi: DirectoryFsApi): Promise<string> {
  let unresolvedPath = resolve(path);
  const missingSegments: string[] = [];

  while (true) {
    try {
      let canonicalPath = resolve(await fsApi.realpath(unresolvedPath));
      for (let index = missingSegments.length - 1; index >= 0; index -= 1) {
        canonicalPath = join(canonicalPath, missingSegments[index]);
      }
      return canonicalPath;
    } catch (error) {
      if (!isMissingPath(error)) {
        throw error;
      }

      const parentPath = dirname(unresolvedPath);
      if (parentPath === unresolvedPath) {
        throw error;
      }

      missingSegments.push(basename(unresolvedPath));
      unresolvedPath = parentPath;
    }
  }
}

function isWithinDirectory(directory: string, candidate: string): boolean {
  const relativeCandidate = relative(directory, candidate);
  return (
    relativeCandidate !== ".." &&
    !relativeCandidate.startsWith(`..${sep}`) &&
    !isAbsolute(relativeCandidate)
  );
}

async function rejectSymlinkComponents(
  path: string,
  fsApi: DirectoryFsApi,
): Promise<void> {
  let currentPath = resolve(path);

  while (true) {
    let isSymbolicLink = false;
    try {
      isSymbolicLink = (await fsApi.lstat(currentPath)).isSymbolicLink();
    } catch (error) {
      if (!isMissingPath(error)) {
        throw error;
      }
    }

    if (isSymbolicLink) {
      throw new Error(
        `The project directory cannot contain symbolic links or junctions (found "${currentPath}").`,
      );
    }

    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) {
      return;
    }
    currentPath = parentPath;
  }
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

  await rejectSymlinkComponents(projectDirectory, fsApi);
  const canonicalWorkingDirectory = await canonicalizePath(workingDirectory, fsApi);
  const canonicalProjectDirectory = await canonicalizePath(projectDirectory, fsApi);
  if (!isWithinDirectory(canonicalWorkingDirectory, canonicalProjectDirectory)) {
    throw new Error("The project directory must be inside the current working directory.");
  }

  const projectName = basename(projectDirectory);
  if (!isValidProjectName(projectName)) {
    throw new Error(
      `"${projectName}" is not a valid npm package name. Use lowercase letters, numbers, dots, hyphens, underscores, or tildes.`,
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
