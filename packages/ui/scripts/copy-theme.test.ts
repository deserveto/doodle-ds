import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { copyTheme } from "./copy-theme.mjs";

describe("copyTheme", () => {
  it("is the package build step for the consumer-owned theme entrypoint", async () => {
    const packageJson = JSON.parse(
      await readFile(resolve(import.meta.dirname, "../package.json"), "utf8"),
    ) as { scripts?: { build?: string } };
    const build = packageJson.scripts?.build ?? "";

    expect(build).toContain("node scripts/copy-theme.mjs");
    expect(build).not.toContain("tailwindcss -i src/styles/theme.css");
  });

  it("publishes the source theme directives unchanged", async () => {
    const directory = await mkdtemp(join(tmpdir(), "doodle-theme-"));
    const source = join(directory, "theme.css");
    const destination = join(directory, "dist", "theme.css");
    const contents = "@theme { --color-bg: var(--ds-bg); }\n@utility bg-noise {}\n";

    try {
      await mkdir(join(directory, "dist"));
      await writeFile(source, contents, "utf8");
      await copyTheme(source, destination);

      await expect(readFile(destination, "utf8")).resolves.toBe(contents);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
