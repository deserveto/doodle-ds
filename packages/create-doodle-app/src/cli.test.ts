import { describe, expect, it } from "vitest";
import { parseArgs } from "./cli";

describe("parseArgs", () => {
  it("returns an empty project directory when the positional argument is missing", () => {
    expect(parseArgs([])).toEqual({
      projectDirectory: "",
      yes: false,
      skipInstall: false,
      force: false,
      open: false,
      help: false,
      version: false,
    });
  });

  it("parses one project directory and every supported boolean flag", () => {
    expect(
      parseArgs([
        "my-app",
        "--yes",
        "--skip-install",
        "--force",
        "--open",
        "--help",
        "--version",
      ]),
    ).toEqual({
      projectDirectory: "my-app",
      yes: true,
      skipInstall: true,
      force: true,
      open: true,
      help: true,
      version: true,
    });
  });

  it("accepts supported flags before the project directory", () => {
    expect(parseArgs(["--yes", "nested/my-app", "--skip-install"])).toMatchObject({
      projectDirectory: "nested/my-app",
      yes: true,
      skipInstall: true,
    });
  });

  it("rejects an unknown flag with a user-facing error", () => {
    expect(() => parseArgs(["my-app", "--template"])).toThrow(/unknown option.*--template/i);
  });

  it("rejects extra positional arguments with a user-facing error", () => {
    expect(() => parseArgs(["my-app", "another-app"])).toThrow(/only one project directory/i);
  });
});
