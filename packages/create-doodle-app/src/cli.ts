import type { CliOptions } from "./types";

const supportedFlags = {
  "--yes": "yes",
  "--skip-install": "skipInstall",
  "--force": "force",
  "--open": "open",
  "--help": "help",
  "--version": "version",
} as const satisfies Record<string, keyof Omit<CliOptions, "projectDirectory">>;

export function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    projectDirectory: "",
    yes: false,
    skipInstall: false,
    force: false,
    open: false,
    help: false,
    version: false,
  };

  for (const argument of argv) {
    if (argument.startsWith("-")) {
      const option = supportedFlags[argument as keyof typeof supportedFlags];
      if (!option) {
        throw new Error(`Unknown option: ${argument}`);
      }

      options[option] = true;
      continue;
    }

    if (options.projectDirectory) {
      throw new Error(
        `Only one project directory may be provided (received "${options.projectDirectory}" and "${argument}").`,
      );
    }

    options.projectDirectory = argument;
  }

  return options;
}
