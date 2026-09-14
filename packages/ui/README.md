# @doodle-ds/ui

Playful neo-brutalist React 19 components with a Tailwind CSS v4 theme.

## Install and import

```sh
npm install @doodle-ds/tokens @doodle-ds/icons @doodle-ds/ui
```

Import tokens before the precompiled component stylesheet:

```tsx
import "@doodle-ds/tokens/css/tokens.css";
import "@doodle-ds/ui/styles.css";
import { Button } from "@doodle-ds/ui";

export function Example() {
  return <Button variant="sun">use doodles</Button>;
}
```

`styles.css` is the zero-configuration path: it bundles Tailwind preflight, the Doodle theme, and the utilities used by the published components. If your app owns Tailwind, import `@doodle-ds/ui/theme.css` instead and add an `@source` entry for `node_modules/@doodle-ds/ui/dist`; do not import both stylesheets. The full setup and a copy-paste example are in the [root README](../../README.md).

## Exports

The package exports `Button`, `Badge`, `Tag`, `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`, `Avatar`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Alert`, `Progress`, `Tabs`, `TabPanel`, `Tooltip`, and `Modal`.

Most components extend their native HTML props and accept `className` for local composition. Notable APIs are:

- `Button`: `variant` (`solid`, `sun`, `terra`, `sky`, `outline`, `ghost`) and `size` (`sm`, `md`, `lg`). Its default `type` is `button`.
- `Card`: optional `tone`, `tape`, and numeric `tilt` props.
- `Avatar`: `src`/`alt` or a `fallback`, plus `shape`, `size`, and `tone`.
- `Input`/`Textarea`: `invalid` sets `aria-invalid` and the error border; provide the associated label and message in your form.
- `Tabs`: pass `items`, then render matching `TabPanel value` children inside it.
- `Modal`: controlled `open` and `onClose`, with optional `title` and `footer`; it uses Radix Dialog for focus management and Escape/overlay dismissal.

Native controls remain keyboard and screen-reader friendly when consumers provide labels, names, descriptions, and error text. The theme adds visible focus rings and reduces motion when `prefers-reduced-motion` is enabled.

## Development

```sh
npm run build -w @doodle-ds/ui
npm run typecheck -w @doodle-ds/ui
```

The package depends on `@doodle-ds/icons` at the same release line. Keep tokens, icons, and UI versions aligned when upgrading; the [root upgrade guide](../../README.md) covers the Changesets workflow.
