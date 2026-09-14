# Task 2 Report — CLI parsing, directory validation, and install planning

## Status

Complete. The scaffold package now has a pure argument parser, injectable and Windows-compatible destination validation, and exact npm install command planning.

## Files

Created:

- `packages/create-doodle-app/src/cli.ts`
- `packages/create-doodle-app/src/cli.test.ts`
- `packages/create-doodle-app/src/validation.ts`
- `packages/create-doodle-app/src/validation.test.ts`
- `packages/create-doodle-app/src/install.ts`
- `packages/create-doodle-app/src/install.test.ts`
- `.superpowers/sdd/2026-09-15-create-doodle-app/task-2-report.md`

No existing README or unrelated documentation file was changed by this task.

## Behavior delivered

- Parses one optional positional project directory plus `--yes`, `--skip-install`, `--force`, `--open`, `--help`, and `--version` in any order.
- Rejects unknown flags and extra positional arguments with actionable errors.
- Resolves destinations relative to the supplied working directory and rejects traversal outside it.
- Allows missing directories, while rejecting invalid npm project names, existing files, and non-empty directories unless `force` is explicitly set.
- Allows new and empty destinations; forced validation reports existing entries without deleting or changing them.
- Builds the exact `{ command: "npm", args: ["install"], cwd: projectDirectory }` command and rejects unsupported package managers.
- Represents `--skip-install` in `CliOptions`; Task 4 orchestration can omit the install command when this flag is true.

## TDD commands and output

- `npx vitest run packages/create-doodle-app/src/cli.test.ts packages/create-doodle-app/src/validation.test.ts packages/create-doodle-app/src/install.test.ts` (initial RED): 3 suites failed because the production modules did not exist.
- The same focused command after compile-only throwing stubs (behavioral RED): 3 files failed, 19 tests failed with `Not implemented` or the expected message mismatch.
- The same focused command after implementation (GREEN): 3 files passed, 19 tests passed.

## Verification commands and output

- `npm run typecheck -w create-doodle-app`: passed.
- `npx eslint packages/create-doodle-app/src/cli.ts packages/create-doodle-app/src/cli.test.ts packages/create-doodle-app/src/validation.ts packages/create-doodle-app/src/validation.test.ts packages/create-doodle-app/src/install.ts packages/create-doodle-app/src/install.test.ts`: passed with no output.
- `npm test`: 6 files passed, 24 tests passed.
- `npm run typecheck`: all workspace typechecks passed (`create-doodle-app`, icons, UI, and docs).

## Concerns

- The Task 2 brief names a three-argument `validateProjectDirectory(input, cwd, fsApi)` API while requiring forced validation. The implementation preserves those arguments and adds an optional fourth `{ force?: boolean }` object; default behavior remains safe and refuses non-empty directories.
- This task only plans the npm install command. The Task 4 coordinator remains responsible for not building or running it when `skipInstall` is true.
- Validation deliberately performs no writes or deletion. Safe file creation/overwrite behavior is the responsibility of the template writer in the later task, using the approved resolved destination.

## Follow-up fix — canonical symlink containment

Task 2 review identified that lexical containment alone could accept a destination or parent symlink/junction resolving outside the working directory. The validator now canonicalizes the working directory and destination with the injected `realpath` API (walking up to the nearest existing parent for new destinations) before applying the containment check. The npm package-manager input is a string so unsupported-manager validation remains reachable, and the invalid-name guidance now includes tildes.

Added regression coverage for absolute outside paths, reserved `favicon.ico`, existing symlink destinations, and new destinations under symlinked parents. The test filesystem now models canonical paths while remaining Windows-compatible.

Verification after the fix:

- Focused validation/install tests (RED before implementation: 2 symlink-escape failures; GREEN after implementation): 2 files passed, 18 tests passed.
- `npx eslint packages/create-doodle-app/src/validation.ts packages/create-doodle-app/src/validation.test.ts packages/create-doodle-app/src/install.ts packages/create-doodle-app/src/install.test.ts`: passed.
- `npm run typecheck -w create-doodle-app`: passed.

## Follow-up fix — dangling link rejection

Review found that dangling destination or parent links could still be mistaken for missing paths because `realpath` returns `ENOENT`. The validator now walks every destination path component with injected `lstat` and rejects symbolic links or Windows junctions before canonicalization, including dangling links.

Added regression coverage for dangling destination and dangling parent links. Verification for this round:

- RED before implementation: 2 dangling-link tests failed because validation resolved successfully.
- GREEN after implementation: `npx vitest run packages/create-doodle-app/src/validation.test.ts` — 1 file passed, 18 tests passed.
