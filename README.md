# Doodle DS

Playful neo-brutalist React design system. Tokens, Scribbles icons, UI components, and a live docs showcase share one build pipeline.

[GitHub repository](https://github.com/deserveto/doodle-ds) · [MIT license](LICENSE)

## Packages

| Package | Use it for |
| --- | --- |
| `@sangisalarp/tokens` | DTCG design tokens compiled to CSS custom properties |
| `@sangisalarp/icons` | Hand-drawn React icons with a consistent 24px grid |
| `@sangisalarp/ui` | React 19 components and the Tailwind CSS v4 theme |
| `@sangisalarp/docs` | The local showcase app (private; not published) |

## Install

In a React 19 application:

```sh
npm install @sangisalarp/tokens @sangisalarp/icons @sangisalarp/ui
```

`@sangisalarp/ui` has peer dependencies on `react`, `react-dom`, and Tailwind CSS 4. Install the peers when they are not already in your app.

### Fastest CSS setup

Use the precompiled stylesheet when the application does not need to generate Doodle DS utility classes itself:

```css
/* src/index.css, imported once by the app entrypoint */
@import "@sangisalarp/tokens/css/tokens.css";
@import "@sangisalarp/ui/styles.css";
```

`styles.css` includes Tailwind preflight, the Doodle theme, component styles, and the custom utilities used by the package. Do not import `theme.css` as well in this mode.

### Tailwind CSS v4 integration

If the application owns the Tailwind build, import the theme and explicitly scan the published package. Tailwind ignores `node_modules` by default:

```css
/* app.css — adjust the @source path to your CSS file location */
@import "tailwindcss";
@import "@sangisalarp/tokens/css/tokens.css";
@import "@sangisalarp/ui/theme.css";
@source "../node_modules/@sangisalarp/ui/dist";
```

Use this integration instead of `styles.css`; importing both duplicates the Tailwind layers.

## Use components and icons

```tsx
import { SearchIcon } from "@sangisalarp/icons";
import { Button, Card, CardContent } from "@sangisalarp/ui";

export function WelcomeCard() {
  return (
    <Card tone="sun">
      <CardContent className="flex items-center gap-3">
        <SearchIcon className="h-5 w-5" aria-hidden="true" />
        <Button variant="solid" type="button">
          browse doodles
        </Button>
      </CardContent>
    </Card>
  );
}
```

The UI entrypoint exports `Button`, `Badge`, `Tag`, `Card` parts, `Avatar`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Alert`, `Progress`, `Tabs`, `TabPanel`, `Tooltip`, and `Modal`. Components forward native HTML props unless their API is called out in the package README. Scribbles icons accept normal SVG props; pass `title` when an icon needs an accessible name, otherwise they are hidden from assistive technology by default.

## Theme and brand overrides

Add `dark` to the document root (or another ancestor) to switch semantic values:

```html
<html class="dark">
  <!-- app -->
</html>
```

Brand a section by overriding semantic variables on a wrapper. Keep the ink, line, and focus colors contrast-safe:

```css
.brand-ocean {
  --ds-bg: #eef8ff;
  --ds-bg-deep: #d8efff;
  --ds-surface: #ffffff;
  --ds-ink: #102a43;
  --ds-ink-soft: #29465f;
  --ds-ink-mute: #5b7185;
  --ds-line: #102a43;
  --ds-sun: #ffd166;
  --ds-focus: #2f80ed;
}
```

Raw palette variables (`--ds-color-*`) are available for foundations. Components use semantic variables (`--ds-bg`, `--ds-ink`, `--ds-line`, and the accent variables) so dark mode and brand themes remain predictable.

## Accessibility expectations

- Keep labels, descriptions, and error text in the application markup; pass `id`, `name`, `aria-*`, and other native props through the controls.
- Give every `Input`, `Textarea`, and `Select` an associated label. `Checkbox` and `Radio` render their children as the visible label; `Switch` still needs a nearby accessible label in the consuming form.
- Set `type="submit"` explicitly when a `Button` submits a form (the default is `button`).
- Give `Progress` a `label` so it exposes an accessible name. Keep values between `0` and `max`.
- Keep `Tabs` item IDs aligned with their `TabPanel value` props. Use a focusable button or link as the child of `Tooltip` and treat the tooltip as supplemental information.
- `Modal` is built on Radix Dialog. Provide a useful `title`, keep the body description meaningful, and make footer actions explicit; Escape and overlay clicks close it.
- The theme supplies visible dashed focus rings and honors `prefers-reduced-motion`.

## For designers: Figma + DTCG

Doodle DS has two companion artifacts: a Figma component library for composing screens and this repository for tokens and implementation. Keep the names and states aligned across both (for example, the Figma Button variants should map to the `Button` `variant` prop).

The token source of truth is the DTCG JSON in [`packages/tokens/tokens`](packages/tokens/tokens). A practical sync loop is:

1. Maintain matching color, type, spacing, radius, and state variables in Figma. Export or import DTCG JSON with the team’s chosen token tool (for example, Tokens Studio), preserving the `semantic` and `dark` groups.
2. Review the JSON change in Git, then run `npm run build` to regenerate `@sangisalarp/tokens` CSS and the docs preview.
3. Designers validate the Figma library against the docs showcase; developers consume the generated CSS and semantic variables instead of copying hex values.

The repository currently ships the DTCG source and React packages; the Figma library is a separate shared library that should be published and versioned alongside releases. If a token cannot be represented in both places, resolve the naming/value mismatch before shipping the component.

## Develop and verify

```sh
npm ci
npm run dev       # docs showcase at the Vite dev URL
npm run verify    # lint, unit tests, audit, build, typecheck, and e2e checks
```

Build order matters: tokens → icons → ui → docs. Use the root `npm run build` so workspace artifacts are available to downstream packages.

## Upgrade and release

Keep the three public packages on the same release line:

```sh
npm install @sangisalarp/tokens@latest @sangisalarp/icons@latest @sangisalarp/ui@latest
```

Before `1.0.0`, treat minor releases as potentially breaking and read the generated Changeset notes. For a code change, create a changeset with `npx changeset`, run `npm run verify`, and commit the changeset with the change.

The release workflow at [`.github/workflows/release.yml`](.github/workflows/release.yml) creates or updates a version pull request and publishes after that pull request is merged. It is inert until the repository variable `DOODLE_DS_RELEASE_ENABLED` is set to `true`. Once enabled, it requires the repository setting that allows GitHub Actions to create and approve pull requests and a least-privilege npm publish token stored as the `NPM_TOKEN` repository secret. Keep the variable and secret unset until the scope, package visibility, and release owner are confirmed. If the team later adopts npm trusted publishing (OIDC), migrate to the Changesets v2 sub-actions and remove the long-lived token.

For the first public release, confirm the npm scope, package visibility, and release owner first. Then build and inspect each tarball, publishing in dependency order:

```sh
npm run verify
npm pack --dry-run --workspace @sangisalarp/tokens
npm pack --dry-run --workspace @sangisalarp/icons
npm pack --dry-run --workspace @sangisalarp/ui

npm publish --workspace @sangisalarp/tokens --access public
npm publish --workspace @sangisalarp/icons --access public
npm publish --workspace @sangisalarp/ui --access public
```

Subsequent releases should use Changesets (`npm run version-packages`, then `npm run release`) so internal dependency ranges and changelogs stay synchronized.

## License

MIT
