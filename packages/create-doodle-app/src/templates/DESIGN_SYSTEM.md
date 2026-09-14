# Doodle DS design contract

- Keep the playful neo-brutalist look with expressive type, friendly color blocks, and hand-drawn details.
- Use 2px ink borders and hard offset shadows such as `shadow-pop`; never blurred shadows or smooth gradients.
- Prefer semantic classes such as `bg-bg`, `bg-surface`, `text-fg`, `border-line`, and `bg-accent-*` over raw colors.
- Never put raw hex values in components. Use `@sangisalarp/ui` before creating custom controls, and use `@sangisalarp/icons` instead of inline SVG or emoji icons.
- Reuse `Button` and `Card` before creating one-off equivalents, and preserve labels, aria attributes, button types, focus behavior, and keyboard accessibility.
- Keep the single global stylesheet in `src/index.css`, imported once from `src/main.tsx`. Dark mode uses `.dark` on `<html>`.
