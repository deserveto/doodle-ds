/**
 * Codegen: assets/svg/*.svg → src/icons/*.tsx + src/index.ts, and copies
 * raw SVGs to dist/svg/. Run via `npm run generate` (part of build).
 *
 * The SVG files are the single source of truth. Generated files carry a
 * do-not-edit header. No dependencies on purpose.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const svgDir = join(root, "assets", "svg");
const iconsDir = join(root, "src", "icons");
const distSvg = join(root, "dist", "svg");

const pascal = (name) =>
  name
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("") + "Icon";

rmSync(iconsDir, { recursive: true, force: true });
mkdirSync(iconsDir, { recursive: true });
mkdirSync(distSvg, { recursive: true });

const files = readdirSync(svgDir).filter((f) => f.endsWith(".svg")).sort();
const names = [];

for (const file of files) {
  const name = file.replace(/\.svg$/, "");
  const comp = pascal(name);
  names.push([name, comp]);

  const source = readFileSync(join(svgDir, file), "utf8");
  const inner = source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1]?.trim();
  if (!inner) throw new Error(`${file}: no inner content`);

  const tsx = `// Generated from assets/svg/${file} — do not edit by hand.
import { IconBase, type IconProps } from "../create-icon";

export function ${comp}(props: IconProps) {
  return (
    <IconBase {...props}>
      ${inner}
    </IconBase>
  );
}
`;
  writeFileSync(join(iconsDir, `${name}.tsx`), tsx);
  cpSync(join(svgDir, file), join(distSvg, file));
}

const index = `// Generated — do not edit by hand.
export { IconBase, type IconProps } from "./create-icon";

${names.map(([n]) => `export { ${pascal(n)} } from "./icons/${n}";`).join("\n")}
`;
writeFileSync(join(iconsDir, "../index.ts"), index);

console.log(`generated ${names.length} icons:`, names.map(([n]) => n).join(", "));
