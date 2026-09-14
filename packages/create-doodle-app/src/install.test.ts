import { describe, expect, it } from "vitest";
import { buildInstallCommand } from "./install";

describe("buildInstallCommand", () => {
  it("constructs an exact npm install command in the project directory", () => {
    expect(buildInstallCommand("npm", "C:\\work\\my-app")).toEqual({
      command: "npm",
      args: ["install"],
      cwd: "C:\\work\\my-app",
    });
  });

  it("rejects unsupported package managers", () => {
    expect(() => buildInstallCommand("pnpm" as "npm", "C:\\work\\my-app")).toThrow(
      /unsupported package manager.*pnpm/i,
    );
  });
});
