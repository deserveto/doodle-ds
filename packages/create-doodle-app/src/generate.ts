import { lstat, mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import type { GeneratedFile } from "./types";

export interface TemplateFsApi {
  lstat(path: string): Promise<{ isSymbolicLink(): boolean }>;
  mkdir(path: string, options?: { recursive: true }): Promise<unknown>;
  writeFile(path: string, contents: string, encoding?: "utf8"): Promise<unknown>;
}

const defaultFsApi: TemplateFsApi = {
  lstat,
  mkdir,
  writeFile,
};

function isMissingPath(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

function resolveTemplatePath(projectDirectory: string, filePath: string): string {
  if (isAbsolute(filePath)) {
    throw new Error(`Template file path must be relative: ${filePath}`);
  }

  const projectRoot = resolve(projectDirectory);
  const target = resolve(projectRoot, filePath);
  const targetRelative = relative(projectRoot, target);
  if (
    targetRelative === ".." ||
    targetRelative.startsWith(`..${sep}`) ||
    isAbsolute(targetRelative)
  ) {
    throw new Error(`Template file path escapes the project directory: ${filePath}`);
  }

  return target;
}

async function rejectLinkedComponents(
  projectRoot: string,
  target: string,
  fsApi: TemplateFsApi,
): Promise<void> {
  const targetRelative = relative(projectRoot, target);
  let current = projectRoot;
  const components = targetRelative ? targetRelative.split(sep) : [];

  for (const component of ["", ...components]) {
    if (component) {
      current = join(current, component);
    }

    try {
      if ((await fsApi.lstat(current)).isSymbolicLink()) {
        throw new Error(
          `Refusing to write through a symbolic link or junction: ${current}`,
        );
      }
    } catch (error) {
      if (!isMissingPath(error)) {
        throw error;
      }
      // Missing parents are safe: mkdir({ recursive: true }) creates them.
      return;
    }
  }
}

/** Write only the supplied template files; existing unrelated files are untouched. */
export async function writeTemplate(
  files: GeneratedFile[],
  projectDirectory: string,
  fsApi: TemplateFsApi = defaultFsApi,
): Promise<void> {
  for (const file of files) {
    const target = resolveTemplatePath(projectDirectory, file.path);
    await rejectLinkedComponents(resolve(projectDirectory), target, fsApi);
    await fsApi.mkdir(dirname(target), { recursive: true });
    await fsApi.writeFile(target, file.contents, "utf8");
  }
}
