import { copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const packageRoot = new globalThis.URL("..", import.meta.url);
const defaultSource = new globalThis.URL("src/styles/theme.css", packageRoot);
const defaultDestination = new globalThis.URL("dist/theme.css", packageRoot);

export async function copyTheme(
  source = defaultSource,
  destination = defaultDestination,
) {
  await copyFile(source, destination);
}

if (
  globalThis.process.argv[1] &&
  resolve(globalThis.process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await copyTheme();
}
