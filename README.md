# Doodle DS

Playful neo-brutalist React design system. Tokens, Scribbles icons, UI components, and a live docs showcase share one build pipeline.

## Packages

- `@doodle-ds/tokens`: DTCG tokens compiled to CSS variables.
- `@doodle-ds/icons`: hand-drawn React icons.
- `@doodle-ds/ui`: React components and compiled Tailwind theme.
- `@doodle-ds/docs`: local showcase application.

## Development

```sh
npm ci
npm run dev
```

Run the complete local gate:

```sh
npm run verify
```

Individual checks:

```sh
npm run lint
npm run typecheck
npm test
npm run audit:production
npm run build
npm run test:e2e
```

`npm run test:e2e` expects a completed build and a locally installed Playwright Chromium browser. CI installs the browser automatically.

## Usage

Import tokens before the component stylesheet:

```tsx
import "@doodle-ds/tokens/css/tokens.css";
import "@doodle-ds/ui/styles.css";
import { Button } from "@doodle-ds/ui";

export function Example() {
  return <Button>use doodles</Button>;
}
```

## Release

Packages use Changesets. Create a changeset, review the generated version updates, then publish from the release workflow or a trusted release environment.

## License

MIT
