# Task 5 report: root documentation, workspace integration, and end-to-end verification

## Delivered

- Updated the root README so `npm create doodle-app@latest my-app` is the recommended fresh-folder path.
- Kept the manual Vite/package installation path and its starter CSS/React examples, and retained the existing React 19, Tailwind, theme, accessibility, and release guidance.
- Updated `packages/ui/README.md` to link directly to the `create-doodle-app` quick start and explicitly state that installing `@sangisalarp/ui` never scaffolds files or a visible app.
- Added `.changeset/doodle-app-cli.md` to version the public `create-doodle-app` package with a minor release. The CLI's `doodleCoreVersion` remains aligned with the current `@sangisalarp/tokens`, `@sangisalarp/icons`, and `@sangisalarp/ui` release line.
- Added `tests/create-doodle-app.integration.test.ts`. The test is skipped during normal unit runs unless `DOODLE_DS_RUN_INTEGRATION=1` is set. The opted-in test builds the CLI when its dist entry is absent, invokes the built executable in a fresh temporary directory, verifies all generated files and aligned dependencies, installs published dependencies, runs the generated app's production build, and removes only its own temporary directory in `finally`.

No `postinstall` behavior was added.

## Verification

- `npm test -- tests/create-doodle-app.integration.test.ts` — passed with the integration test explicitly skipped (offline-safe default).
- `$env:DOODLE_DS_RUN_INTEGRATION='1'; npm test -- tests/create-doodle-app.integration.test.ts` — passed on Windows, including registry install and generated `npm run build`.
- `npm run lint -- --no-warn-ignored` — passed.
- `npm run check` — passed: lint, 47 unit tests plus one skipped integration test, production audit (0 vulnerabilities), full build, and workspace typecheck.

The first opt-in run exposed the default Vitest 5-second timeout for a real npm install/build; the integration test now uses an explicit 180-second timeout appropriate for this opt-in path. The Windows npm invocation uses Node's npm CLI entrypoint rather than shell-spawning `npm.cmd`, keeping paths with spaces safe and avoiding shell argument warnings.

## Files in this task

- `README.md`
- `packages/ui/README.md`
- `tests/create-doodle-app.integration.test.ts`
- `.changeset/doodle-app-cli.md`
- `.superpowers/sdd/2026-09-15-create-doodle-app/task-5-report.md`

## Packaging follow-up

The release review identified that the root build did not build `create-doodle-app`, while the package publishes only `dist`. The follow-up now includes `npm run build -w create-doodle-app` in the root build chain and adds a `prepack` script that rebuilds `dist` for direct `npm pack` or publish workflows. The metadata test asserts both lifecycle/build wiring and the published `dist` directory.

- `npm run build -w create-doodle-app` — passed.
- `npm pack --dry-run --workspace create-doodle-app` — passed; tarball contents included `dist/index.js`, `README.md`, and `package.json`.
- `npm run build` — passed, with the CLI build occurring before docs.
- `npm run check` — passed: 48 tests plus one skipped integration test, audit clean, full build, and typecheck.
