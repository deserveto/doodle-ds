# @sangisalarp/tokens

Doodle DS design tokens in [DTCG](https://tr.designtokens.org/format/) JSON format, compiled to CSS custom properties with Style Dictionary.

## Install and import

```sh
npm install @sangisalarp/tokens
```

```css
@import "@sangisalarp/tokens/css/tokens.css";
```

The package exports `@sangisalarp/tokens/css/tokens.css` and the other files under `dist/css`. The generated file contains:

- raw palette variables such as `--ds-color-paper` and `--ds-color-ink`;
- semantic light-mode variables such as `--ds-bg`, `--ds-ink`, and `--ds-line`;
- `--ds-on-accent` and `--ds-on-accent-soft` foregrounds for readable text on bright surfaces;
- `.dark` semantic overrides for night mode.

Toggle dark mode by placing `dark` on an ancestor:

```html
<html class="dark">
  <!-- app -->
</html>
```

Override semantic variables for brand themes rather than coupling components to raw hex values:

```css
.brand-ocean {
  --ds-bg: #eef8ff;
  --ds-ink: #102a43;
  --ds-line: #102a43;
  --ds-sun: #ffd166;
}
```

## Source and development

Edit the DTCG files in [`tokens/`](tokens), then regenerate CSS with:

```sh
npm run build -w @sangisalarp/tokens
```

Consumers should import the generated CSS; they should not import the source JSON at runtime. See the [root adoption guide](../../README.md) for the UI and Figma/DTCG workflow.
