# create-doodle-app

Scaffold a Vite + React + TypeScript app using the Doodle DS packages.

## Usage

```sh
npx create-doodle-app my-doodle-app
cd my-doodle-app
npm run dev
```

When the directory is omitted, the CLI asks where to create the app. Use `--yes` for a non-interactive run; it uses `my-doodle-app` as the default directory.

## Options

- `--yes` — accept non-interactive defaults.
- `--skip-install` — generate files without running `npm install`.
- `--force` — write the declared template files into a non-empty directory. Existing unrelated files are preserved.
- `--open` — open the generated folder after a successful run (Explorer on Windows, Finder on macOS, or the desktop opener on Linux).
- `--help` — print command help.
- `--version` — print the CLI version.

The CLI validates that the destination is a safe directory inside the current working directory. It rejects files, invalid npm package names, symlinks/junctions, and non-empty directories unless `--force` is supplied.

## Generated template

The starter contains:

- `package.json` with aligned `@sangisalarp/tokens`, `@sangisalarp/icons`, and `@sangisalarp/ui` versions.
- `vite.config.ts` configured for React and Tailwind v4.
- `src/main.tsx`, `src/App.tsx`, and `src/index.css` with a working Doodle starter screen.
- `README.md` with development commands.
- `DESIGN_SYSTEM.md` with Doodle’s visual and accessibility contract.

## Troubleshooting

If dependency installation fails, the generated files are kept. Change into the project and retry:

```sh
cd my-doodle-app
npm install
```

For a network-restricted environment, use `--skip-install`, then run `npm install` when registry access is available. If the destination is intentionally non-empty, use `--force`; the generator never deletes unrelated files.

## Existing Vite React apps

Install the packages manually. The three Doodle packages are released together; omitting explicit versions lets npm resolve the current published set:

```sh
npm install @sangisalarp/tokens @sangisalarp/icons @sangisalarp/ui
npm install -D tailwindcss@^4.1.13 @tailwindcss/vite@^4.1.13
```

For a reproducible install, pin all three Doodle packages to the same `doodleCoreVersion` recorded in the installed `create-doodle-app` package metadata.

Add the React and Tailwind plugins to `vite.config.ts`, import Tailwind, Doodle token CSS, and `@sangisalarp/ui/theme.css` from your global stylesheet, and follow the component examples in the generated `src/App.tsx` and `DESIGN_SYSTEM.md`.
