# Task 3 Report — template files and safe generation

## Status

Complete. The scaffold package now renders a version-aligned Vite + React 19 + TypeScript + Tailwind v4 Doodle app template and writes only the files supplied to the safe writer.

## Files

Created:

- `packages/create-doodle-app/src/template.ts`
- `packages/create-doodle-app/src/generate.ts`
- `packages/create-doodle-app/src/generate.test.ts`
- `packages/create-doodle-app/src/templates/package.json`
- `packages/create-doodle-app/src/templates/vite.config.ts`
- `packages/create-doodle-app/src/templates/index.html`
- `packages/create-doodle-app/src/templates/src/main.tsx`
- `packages/create-doodle-app/src/templates/src/App.tsx`
- `packages/create-doodle-app/src/templates/src/index.css`
- `packages/create-doodle-app/src/templates/README.md`
- `packages/create-doodle-app/src/templates/DESIGN_SYSTEM.md`

No existing README or unrelated documentation file was changed by this task.

## Behavior delivered

- `getTemplateFiles(projectName, coreVersion)` emits the eight declared app files with the project name in `package.json` and one aligned `coreVersion` for tokens, icons, and UI.
- The starter uses `@tailwindcss/vite`, `@import "tailwindcss"`, token CSS, UI theme CSS, and an `@source` entry for `@sangisalarp/ui/dist`.
- The starter screen visibly uses `Button`, `Card`, `CardContent`, and `SearchIcon`.
- Global CSS is imported once from `src/main.tsx`; the generated design contract documents semantic classes, accessibility, dark mode, and no raw hex/inline SVG guidance.
- `writeTemplate` creates parent directories as needed, writes only declared relative paths, rejects paths that escape the project directory, and never removes unrelated files.
- The generated build command uses `vite build`, keeping the declared file set self-contained while Vite transpiles the TypeScript entrypoints.

## TDD commands and output

- `npx vitest run packages/create-doodle-app/src/generate.test.ts` (initial RED): failed during import resolution because `./template` and `./generate` did not exist.
- The same focused command after implementation (GREEN): 1 file passed, 2 tests passed.

## Verification commands and output

- `npx vitest run packages/create-doodle-app/src/cli.test.ts packages/create-doodle-app/src/validation.test.ts packages/create-doodle-app/src/install.test.ts packages/create-doodle-app/src/metadata-types.test.ts packages/create-doodle-app/src/generate.test.ts`: 5 files passed, 29 tests passed.
- `npx eslint packages/create-doodle-app/src/cli.ts packages/create-doodle-app/src/validation.ts packages/create-doodle-app/src/install.ts packages/create-doodle-app/src/template.ts packages/create-doodle-app/src/generate.ts packages/create-doodle-app/src/*.test.ts`: passed with no output.
- `npm run typecheck -w create-doodle-app`: passed.

## Concerns

- The source template fixtures are kept under the package `src/templates` path required by the task, while `template.ts` embeds the runtime-safe strings so the published `dist` package does not depend on source-relative file reads.
- The generated file list intentionally follows the task’s declared paths and does not add a `tsconfig.json`; therefore the generated `build` script is Vite-only. A future task can add a generated TypeScript project config if the scaffold contract expands.
