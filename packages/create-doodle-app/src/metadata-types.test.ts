import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CliOptions, CommandSpec, GeneratedFile } from "./types";

const packagePath = resolve(import.meta.dirname, "../package.json");

describe("create-doodle-app package metadata", () => {
  it("declares the public ESM CLI and aligned Doodle core version", async () => {
    const metadata = JSON.parse(await readFile(packagePath, "utf8")) as {
      name: string;
      version: string;
      type: string;
      bin: string | Record<string, string>;
      doodleCoreVersion: string;
    };
    const publicPackages = await Promise.all(
      ["tokens", "icons", "ui"].map(async (name) => {
        const publicPackage = JSON.parse(
          await readFile(resolve(import.meta.dirname, "../../" + name + "/package.json"), "utf8"),
        ) as { version: string };
        return publicPackage.version;
      }),
    );

    expect(metadata.name).toBe("create-doodle-app");
    expect(metadata.version).toMatch(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
    expect(metadata.type).toBe("module");
    expect(metadata.bin).toEqual({ "create-doodle-app": "./dist/index.js" });
    expect(metadata.doodleCoreVersion).toMatch(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
    expect(publicPackages).toEqual([
      metadata.doodleCoreVersion,
      metadata.doodleCoreVersion,
      metadata.doodleCoreVersion,
    ]);
  });

  it("builds from the root and before direct packaging", async () => {
    const metadata = JSON.parse(await readFile(packagePath, "utf8")) as {
      files?: string[];
      scripts?: Record<string, string>;
    };
    const rootPackage = JSON.parse(
      await readFile(resolve(import.meta.dirname, "../../../package.json"), "utf8"),
    ) as { scripts?: Record<string, string> };

    expect(rootPackage.scripts?.build).toContain("npm run build -w create-doodle-app");
    expect(rootPackage.scripts?.["version-packages"]).toContain(
      "sync-doodle-core-version.mjs",
    );
    expect(metadata.scripts?.prepack).toBe("npm run build");
    expect(metadata.files).toContain("dist");
  });
});

describe("CLI shared types", () => {
  it("accepts parsed options, generated files, and executable commands", () => {
    const options: CliOptions = {
      projectDirectory: "my-app",
      yes: true,
      skipInstall: false,
      force: false,
      open: false,
    };
    const file: GeneratedFile = {
      path: "src/main.tsx",
      contents: "export {};\n",
    };
    const command: CommandSpec = {
      command: "npm",
      args: ["install"],
      cwd: "C:/work/my-app",
    };

    expect(options.projectDirectory).toBe("my-app");
    expect(file.path).toContain("src/");
    expect(command.args).toEqual(["install"]);
  });
});
