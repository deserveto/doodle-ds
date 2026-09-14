# @doodle-ds/icons

Scribbles is the hand-drawn icon set for Doodle DS. Every icon uses a 24px viewBox, a 2px `currentColor` stroke, and round caps/joins.

## Install and use

```sh
npm install @doodle-ds/icons
```

```tsx
import { SearchIcon } from "@doodle-ds/icons";

export function SearchButton() {
  return (
    <button type="button" aria-label="Search">
      <SearchIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
```

Icons accept normal React SVG props. By default an icon is `aria-hidden`; pass a `title` when the icon itself is the accessible image:

```tsx
<SearchIcon title="Search" className="h-6 w-6" />
```

The package also exposes authored SVG files through the `@doodle-ds/icons/svg/*` export. React components and the barrel index are generated from [`assets/svg`](assets/svg) during every build; never edit generated files in `src/icons` by hand.

## Development

```sh
npm run build -w @doodle-ds/icons
```

Review new icons at 16px, 24px, and 32px and compare them with the checklist in [`ICONLIST.md`](ICONLIST.md). The [root README](../../README.md) explains how designers keep the icon set and Figma library aligned.
