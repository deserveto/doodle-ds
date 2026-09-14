/**
 * Options after command-line arguments and prompts have been resolved.
 */
export interface CliOptions {
  projectDirectory: string;
  yes: boolean;
  skipInstall: boolean;
  force: boolean;
  open: boolean;
  help?: boolean;
  version?: boolean;
}

/**
 * A single file emitted by the app template.
 */
export interface GeneratedFile {
  path: string;
  contents: string;
}

/**
 * An executable command and the directory in which it should run.
 */
export interface CommandSpec {
  command: string;
  args: string[];
  cwd: string;
}

/**
 * Result returned by an injected command runner.
 */
export interface CommandResult {
  exitCode: number;
  stdout?: string;
  stderr?: string;
}
