import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import type { GeneratedFile } from "./types";

export interface TemplateFsApi {
  mkdir(path: string, options?: { recursive: true }): Promise<unknown>;
  writeFile(path: string, contents: string, encoding?: "utf8"): Promise<unknown>;
}

const defaultFsApi: TemplateFsApi = {
  mkdir,
  writeFile,
};

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

/** Write only the supplied template files; existing unrelated files are untouched. */
export async function writeTemplate(
  files: GeneratedFile[],
  projectDirectory: string,
  fsApi: TemplateFsApi = defaultFsApi,
): Promise<void> {
  for (const file of files) {
    const target = resolveTemplatePath(projectDirectory, file.path);
    await fsApi.mkdir(dirname(target), { recursive: true });
    await fsApi.writeFile(target, file.contents, "utf8");
  }
}
