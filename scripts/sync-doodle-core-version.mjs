import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const rootDirectory = resolve(import.meta.dirname, "..");
const corePackages = ["tokens", "icons", "ui"];

const packagePath = (name) => resolve(rootDirectory, "packages", name, "package.json");

const readPackage = async (name) =>
  JSON.parse(await readFile(packagePath(name), "utf8"));

const coreMetadata = await Promise.all(corePackages.map(readPackage));
const coreVersions = new Set(coreMetadata.map(({ version }) => version));

if (coreVersions.size !== 1) {
  throw new Error(
    `Doodle core packages must share one version before release: ${[
      ...coreVersions,
    ].join(", ")}`,
  );
}

const [coreVersion] = coreVersions;
const cliPath = packagePath("create-doodle-app");
const cliMetadata = JSON.parse(await readFile(cliPath, "utf8"));

if (cliMetadata.doodleCoreVersion === coreVersion) {
  console.log(`create-doodle-app already targets Doodle core ${coreVersion}.`);
} else {
  cliMetadata.doodleCoreVersion = coreVersion;
  await writeFile(cliPath, `${JSON.stringify(cliMetadata, null, 2)}\n`, "utf8");
  console.log(`Updated create-doodle-app to Doodle core ${coreVersion}.`);
}
