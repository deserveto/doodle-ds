import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getTemplateFiles } from "./template";
import { writeTemplate, type TemplateFsApi } from "./generate";

const projectDirectory = resolve("generation-fixture/my-doodle-app");

function fakeFs(writes: Record<string, string>, directories: Set<string>): TemplateFsApi {
  return {
    async lstat() {
      return { isSymbolicLink: () => false };
    },
    async mkdir(path) {
      directories.add(path);
    },
    async writeFile(path, contents) {
      writes[path] = contents;
    },
  };
}

describe("getTemplateFiles", () => {
  it("returns the complete Vite Doodle app template", () => {
    const files = getTemplateFiles("my-doodle-app", "0.1.0");
    const byPath = new Map(files.map((file) => [file.path, file.contents]));

    expect([...byPath.keys()]).toEqual([
      "package.json",
      "vite.config.ts",
      "index.html",
      "src/main.tsx",
      "src/App.tsx",
      "src/index.css",
      "README.md",
      "DESIGN_SYSTEM.md",
    ]);

    const packageJson = JSON.parse(byPath.get("package.json") ?? "{}") as {
      name: string;
      dependencies: Record<string, string>;
    };
    expect(packageJson.name).toBe("my-doodle-app");
    expect(packageJson.dependencies["@sangisalarp/tokens"]).toBe("0.1.0");
    expect(packageJson.dependencies["@sangisalarp/icons"]).toBe("0.1.0");
    expect(packageJson.dependencies["@sangisalarp/ui"]).toBe("0.1.0");

    const app = byPath.get("src/App.tsx") ?? "";
    expect(app).toContain('from "@sangisalarp/ui"');
    expect(app).toContain("Button");
    expect(app).toContain("Card");
    expect(app).toContain("CardContent");
    expect(app).toContain('from "@sangisalarp/icons"');
    expect(app).toContain("SearchIcon");

    const css = byPath.get("src/index.css") ?? "";
    expect(css).toContain('@import "tailwindcss";');
    expect(css).toContain('@import "@sangisalarp/tokens/css/tokens.css";');
    expect(css).toContain('@import "@sangisalarp/ui/theme.css";');
    expect(css).toMatch(/@source\s+[^;]*@sangisalarp\/ui\/dist/);

    const main = byPath.get("src/main.tsx") ?? "";
    expect(main.match(/import [^;]*index\.css/g)).toHaveLength(1);
    expect(app).not.toContain("index.css");
    expect(byPath.get("README.md")).not.toContain("type-check");
    expect(byPath.get("index.html")).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("writeTemplate", () => {
  it("creates nested declared files while preserving unrelated files", async () => {
    const files = getTemplateFiles("my-doodle-app", "0.1.0");
    const sentinelPath = join(projectDirectory, "keep-me.txt");
    const writes: Record<string, string> = { [sentinelPath]: "do not remove" };
    const directories = new Set<string>();

    await writeTemplate(files, projectDirectory, fakeFs(writes, directories));

    expect(writes[sentinelPath]).toBe("do not remove");
    expect(writes[join(projectDirectory, "src", "App.tsx")]).toContain("SearchIcon");
    expect(Object.keys(writes)).toHaveLength(files.length + 1);
    expect(directories).toContain(dirname(join(projectDirectory, "src", "App.tsx")));
  });

  it("refuses to write through a pre-existing linked source directory", async () => {
    const linkedSource = join(projectDirectory, "src");
    const writes: Record<string, string> = {};
    const directories = new Set<string>();
    const fsApi = {
      ...fakeFs(writes, directories),
      async lstat(path: string) {
        return { isSymbolicLink: () => path === linkedSource };
      },
    } as TemplateFsApi;

    await expect(
      writeTemplate(
        [{ path: "src/App.tsx", contents: "export default function App() {}\n" }],
        projectDirectory,
        fsApi,
      ),
    ).rejects.toThrow(/symbolic link|junction/i);
    expect(writes).toEqual({});
  });
});
