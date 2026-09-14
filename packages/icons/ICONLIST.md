# Doodle DS icon checklist — "Scribbles"

Single source of truth: `assets/svg/*.svg` (hand-authored, wobbly).
React components in `src/icons/` are **generated** (`npm run build` regenerates).
Never edit `src/icons/*.tsx` or `src/index.ts` by hand.

## Style rules (frozen after Tier 0 review)

- 24×24 viewBox, content within 3–21 (2px optical margin)
- stroke `2`, `currentColor`, round caps + joins, `fill: none`
- Wobble = slight bezier jitter on every line; if it looks straight, it's wrong
- Review every icon at 16px before marking DONE — wobble must read as intentional, not broken
- One metaphor per icon (no `x`/`cross`/`close` duplicates)

## Definition of done

- [ ] SVG authored in `assets/svg/`, checked at 16 / 24 / 32px
- [ ] Compared next to the Lucide equivalent in the docs icon gallery
- [ ] Generated component builds + appears in docs
- [ ] Checkbox below flipped

## Tier 0 — Pilot (style referendum) · 5

- [x] close
- [x] check
- [x] chevron-down
- [x] search
- [x] star

## Tier 1 — System-critical (replace inline SVGs/emoji in components) · 12

- [x] chevron-up
- [x] chevron-left
- [x] chevron-right
- [x] arrow-right
- [x] plus
- [x] minus
- [x] info
- [x] alert-triangle
- [x] check-circle
- [x] x-circle
- [x] sun
- [x] moon

## Tier 2 — Consumer essentials · 14

- [x] menu
- [x] dots-horizontal
- [x] external-link
- [x] copy
- [x] trash
- [x] edit
- [x] eye
- [x] eye-off
- [x] download
- [x] upload
- [x] calendar
- [x] clock
- [x] user
- [x] settings

## Tier 3 — Sticker garnish (fill + hard shadow, NOT for inputs/nav) · 6

- [x] star-sticker
- [x] heart-sticker
- [x] bell-sticker
- [x] smile-sticker
- [x] lightbulb-sticker
- [x] thumbs-up-sticker

## Tier 4 — Stretch (add only with a real use case; alarm if > 20)

- [x] mail
- [x] lock
- [x] image
- [x] folder
- [x] refresh
- [x] home
