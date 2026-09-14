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

## Concerns

- The generated app still uses the template’s package metadata/version contract from Task 3; this CLI does not query package registries or perform independent “latest” lookups.
- The working tree contained pre-existing changes in root `README.md`, `packages/ui/README.md`, and `docs/`; they were preserved and are not part of this task’s commit.
