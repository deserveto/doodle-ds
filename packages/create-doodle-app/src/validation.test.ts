import { basename, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  validateProjectDirectory,
  type DirectoryFsApi,
} from "./validation";

function fakeFs(
  entries: Record<string, { kind: "directory"; entries: string[] } | { kind: "file" }> = {},
): DirectoryFsApi {
  return {
    async stat(path) {
      const entry = entries[path];
      if (!entry) {
        throw Object.assign(new Error(`ENOENT: ${path}`), { code: "ENOENT" });
      }

      return { isDirectory: () => entry.kind === "directory" };
    },
    async readdir(path) {
      const entry = entries[path];
      if (!entry || entry.kind !== "directory") {
        throw new Error(`Cannot read directory: ${path}`);
      }

      return [...entry.entries];
    },
  };
}

describe("validateProjectDirectory", () => {
  const cwd = resolve("validation-fixture");

  it("permits a valid npm project name at a new destination", async () => {
    const destination = join(cwd, "my-doodle-app");

    await expect(validateProjectDirectory("my-doodle-app", cwd, fakeFs())).resolves.toEqual({
      projectDirectory: destination,
      projectName: "my-doodle-app",
      existingEntries: [],
    });
  });

  it.each(["My App", "UPPERCASE", ".hidden", "node_modules", "name%encoded"])(
    "rejects the invalid npm project name %s",
    async (name) => {
      await expect(validateProjectDirectory(name, cwd, fakeFs())).rejects.toThrow(
        /valid npm package name/i,
      );
    },
  );

  it("rejects an empty input before inspecting the filesystem", async () => {
    await expect(validateProjectDirectory("", cwd, fakeFs())).rejects.toThrow(
      /project directory is required/i,
    );
  });

  it("rejects a destination that escapes the working directory", async () => {
    await expect(validateProjectDirectory(join("..", "escape"), cwd, fakeFs())).rejects.toThrow(
      /inside the current working directory/i,
    );
  });

  it("rejects an existing file even when force is enabled", async () => {
    const destination = join(cwd, "my-app");
    const fsApi = fakeFs({ [destination]: { kind: "file" } });

    await expect(
      validateProjectDirectory("my-app", cwd, fsApi, { force: true }),
    ).rejects.toThrow(/is a file/i);
  });

  it("permits an existing empty directory", async () => {
    const destination = join(cwd, "my-app");
    const fsApi = fakeFs({ [destination]: { kind: "directory", entries: [] } });

    await expect(validateProjectDirectory("my-app", cwd, fsApi)).resolves.toEqual({
      projectDirectory: destination,
      projectName: "my-app",
      existingEntries: [],
    });
  });

  it("refuses a non-empty directory without force", async () => {
    const destination = join(cwd, "my-app");
    const fsApi = fakeFs({
      [destination]: { kind: "directory", entries: ["notes.txt", "src"] },
    });

    await expect(validateProjectDirectory("my-app", cwd, fsApi)).rejects.toThrow(
      /not empty.*--force/i,
    );
  });

  it("permits a forced write and reports unrelated entries without removing them", async () => {
    const destination = join(cwd, "my-app");
    const preservedEntries = ["notes.txt", "src"];
    const fsApi = fakeFs({
      [destination]: { kind: "directory", entries: preservedEntries },
    });

    await expect(
      validateProjectDirectory("my-app", cwd, fsApi, { force: true }),
    ).resolves.toEqual({
      projectDirectory: destination,
      projectName: basename(destination),
      existingEntries: ["notes.txt", "src"],
    });
    expect(preservedEntries).toEqual(["notes.txt", "src"]);
  });
});
