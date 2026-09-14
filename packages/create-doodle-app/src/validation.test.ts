import { basename, join, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";
import {
  validateProjectDirectory,
  type DirectoryFsApi,
} from "./validation";

const fixtureCwd = resolve("validation-fixture");

function fakeFs(
  entries: Record<string, { kind: "directory"; entries: string[] } | { kind: "file" }> = {},
  realpaths: Record<string, string> = {},
  symlinks: string[] = [],
): DirectoryFsApi {
  return {
    async lstat(path) {
      if (symlinks.includes(path)) {
        return { isSymbolicLink: () => true };
      }
      if (entries[path]) {
        return { isSymbolicLink: () => false };
      }
      throw Object.assign(new Error(`ENOENT: ${path}`), { code: "ENOENT" });
    },
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
    async realpath(path) {
      if (realpaths[path]) {
        return realpaths[path];
      }
      if (path === fixtureCwd || entries[path]) {
        return path;
      }
      if (Object.keys(realpaths).some((link) => path.startsWith(`${link}${sep}`))) {
        throw Object.assign(new Error(`ENOENT: ${path}`), { code: "ENOENT" });
      }
      return path;
    },
  };
}

describe("validateProjectDirectory", () => {
  const cwd = fixtureCwd;

  it("permits a valid npm project name at a new destination", async () => {
    const destination = join(cwd, "my-doodle-app");

    await expect(validateProjectDirectory("my-doodle-app", cwd, fakeFs())).resolves.toEqual({
      projectDirectory: destination,
      projectName: "my-doodle-app",
      existingEntries: [],
    });
  });

  it.each(["My App", "UPPERCASE", ".hidden", "node_modules", "favicon.ico", "name%encoded"])(
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

  it("rejects an absolute destination outside the working directory", async () => {
    const outsideDestination = resolve(cwd, "..", "outside-app");

    await expect(validateProjectDirectory(outsideDestination, cwd, fakeFs())).rejects.toThrow(
      /inside the current working directory/i,
    );
  });

  it("rejects an existing symlink destination whose target escapes the working directory", async () => {
    const destination = join(cwd, "linked-app");
    const outsideDestination = resolve(cwd, "..", "outside-app");
    const fsApi = fakeFs(
      { [destination]: { kind: "directory", entries: [] } },
      { [destination]: outsideDestination },
    );

    await expect(validateProjectDirectory("linked-app", cwd, fsApi)).rejects.toThrow(
      /inside the current working directory/i,
    );
  });

  it("rejects a new destination beneath a symlinked parent whose target escapes the working directory", async () => {
    const parent = join(cwd, "linked-parent");
    const destination = join(parent, "my-app");
    const outsideParent = resolve(cwd, "..", "outside-parent");
    const fsApi = fakeFs(
      { [parent]: { kind: "directory", entries: [] } },
      { [parent]: outsideParent },
    );

    await expect(validateProjectDirectory(destination, cwd, fsApi)).rejects.toThrow(
      /inside the current working directory/i,
    );
  });

  it("rejects a dangling symlink destination before treating it as new", async () => {
    const destination = join(cwd, "dangling-app");
    const fsApi = fakeFs({}, {}, [destination]);

    await expect(validateProjectDirectory("dangling-app", cwd, fsApi)).rejects.toThrow(
      /symbolic link|junction|symlink/i,
    );
  });

  it("rejects a new destination beneath a dangling symlink parent", async () => {
    const parent = join(cwd, "dangling-parent");
    const destination = join(parent, "my-app");
    const fsApi = fakeFs({}, {}, [parent]);

    await expect(validateProjectDirectory(destination, cwd, fsApi)).rejects.toThrow(
      /symbolic link|junction|symlink/i,
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
