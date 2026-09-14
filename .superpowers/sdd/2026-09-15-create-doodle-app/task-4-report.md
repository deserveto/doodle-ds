# Task 4 Report — executable CLI UX and optional folder opening

## Status

Complete. The scaffold package now exposes an injectable `run(argv, dependencies?)` coordinator, a compiled ESM bin entrypoint, polished Clack CLI feedback, recoverable install failures, and optional safe folder opening.

## Files

Created:

- `packages/create-doodle-app/src/index.ts`
- `packages/create-doodle-app/src/run.test.ts`
- `packages/create-doodle-app/README.md`
- `.superpowers/sdd/2026-09-15-create-doodle-app/task-4-report.md`

Updated:

- `packages/create-doodle-app/src/cli.ts`
- `packages/create-doodle-app/package.json` (build script now explicitly bundles `src/index.ts` to `dist/index.js`)

## Behavior delivered

- `run` parses help/version and all supported flags, prompting only when the project directory is omitted.
- `--yes` uses the safe default `my-doodle-app` without prompts; `--skip-install` never calls the command runner; and `--force` is passed to the existing symlink-aware directory validator.
- The Doodle core version is read once from package metadata and supplied to all generated package dependencies through `getTemplateFiles`.
- Generation uses the existing safe writer and preserves generated files if `npm install` exits nonzero or cannot start. Recovery output tells the user to retry `npm install` from the generated directory.
- Successful runs show exact `cd <directory>` and `npm run dev` next steps.
- `--open` uses `explorer.exe` with an argument array on Windows (and `open`/`xdg-open` on other platforms); opening errors are warnings and do not discard a successful scaffold.
- Prompt, spinner, output, command execution, metadata, filesystem, template, and folder-opening dependencies are injectable for deterministic tests.

## TDD and verification

- `npx vitest run packages/create-doodle-app/src/run.test.ts` (RED): 7 tests failed with `run is not a function` before implementation.
- `npx vitest run packages/create-doodle-app/src/run.test.ts` (GREEN): 7 tests passed.
- `npx vitest run packages/create-doodle-app/src`: 6 files passed, 37 tests passed.
- `npm run typecheck -w create-doodle-app`: passed.
- `npx eslint packages/create-doodle-app/src/cli.ts packages/create-doodle-app/src/index.ts packages/create-doodle-app/src/run.test.ts`: passed.
- `npm run build -w create-doodle-app`: passed; tsup emitted `dist/index.js`.
- `node dist/index.js --help` and `node dist/index.js --version`: passed (`0.1.0`).

## Review fixes

- Hardened the detached folder opener with `spawn`/`error` handling. It now resolves only after the child successfully spawns and rejects startup failures so `run` can emit a recoverable warning without an unhandled process error.
- Made generated `cd` instructions shell-safe: Windows paths with special characters use escaped double quotes, while POSIX paths use escaped single quotes; simple paths retain the concise unquoted form.
- Updated manual-install guidance to use the three unversioned Doodle packages and documented pinning all three to one recorded `doodleCoreVersion` for reproducible installs.
- Added focused coverage for `--help`, `--version`, opener failure, nested paths containing spaces, and asynchronous default-opener rejection.

Review-fix verification:

- `npx vitest run packages/create-doodle-app/src/run.test.ts`: 12 tests passed.
- `npm test`: 8 files passed, 45 tests passed.
- `npm run typecheck -w create-doodle-app`: passed.
- `npx eslint packages/create-doodle-app/src/cli.ts packages/create-doodle-app/src/index.ts packages/create-doodle-app/src/run.test.ts`: passed.
- `npm run build -w create-doodle-app`: passed; tsup emitted `dist/index.js`.
- `node dist/index.js --help` and `node dist/index.js --version` from the package directory: passed.

## Entrypoint symlink fix

- Replaced the lexical `argv[1]` comparison with a safe `realpathSync.native` comparison, including a lexical fallback for missing paths and case-insensitive matching on Windows.
- Exported the guard as `isMainEntry` for focused regression coverage. A symlinked executable path is now recognized as the main entry, while missing/undefined paths safely return false.

Entrypoint-fix verification:

- `npx vitest run packages/create-doodle-app/src/run.test.ts`: 14 tests passed (including symlink and missing-path checks).
- `npm test`: 8 files passed, 47 tests passed.
- `npm run typecheck -w create-doodle-app`: passed.
- `npx eslint packages/create-doodle-app/src/cli.ts packages/create-doodle-app/src/index.ts packages/create-doodle-app/src/run.test.ts`: passed.
- `npm run build -w create-doodle-app`: passed; tsup emitted `dist/index.js`.
- `node dist/index.js --help` and `node dist/index.js --version` from the package directory: passed.

## Cross-platform next-step fix

- Reproduced the Ubuntu failure where Windows-style fixture paths were resolved with host POSIX path semantics, producing `../C:\\workspace\\...` output.
- `nextSteps` now selects `path.win32` for Windows output and `path.posix` for POSIX output; test dependencies explicitly declare `platform: "win32"` for Windows fixtures.
- Added a POSIX nested-path regression to ensure paths with spaces use shell-safe single quotes while Windows paths use escaped double quotes.

Cross-platform fix verification:

- `npx vitest run packages/create-doodle-app/src/run.test.ts`: 15 tests passed.
- `npm run check`: passed (lint, 49 tests passed/1 skipped, production audit with 0 vulnerabilities, all workspace builds, and all workspace typechecks).
- `npm run build -w create-doodle-app`: passed; tsup emitted `dist/index.js`.

## Concerns

- The generated app still uses the template’s package metadata/version contract from Task 3; this CLI does not query package registries or perform independent “latest” lookups.
- The working tree contained pre-existing changes in root `README.md`, `packages/ui/README.md`, and `docs/`; they were preserved and are not part of this task’s commit.
