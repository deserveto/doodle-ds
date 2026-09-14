import type { GeneratedFile } from "./types";

const packageTemplate = (projectName: string, coreVersion: string) =>
  JSON.stringify(
    {
      name: projectName,
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        "@sangisalarp/icons": coreVersion,
        "@sangisalarp/tokens": coreVersion,
        "@sangisalarp/ui": coreVersion,
        react: "^19.1.1",
        "react-dom": "^19.1.1",
      },
      devDependencies: {
        "@tailwindcss/vite": "^4.1.13",
        "@types/react": "^19.1.14",
        "@types/react-dom": "^19.1.9",
        "@vitejs/plugin-react": "^5.0.3",
        tailwindcss: "^4.1.13",
        typescript: "~5.8.3",
        vite: "^7.1.6",
      },
    },
    null,
    2,
  ) + "\n";

const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Doodle app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const mainTsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

const appTsx = `import { SearchIcon } from "@sangisalarp/icons";
import { Button, Card, CardContent } from "@sangisalarp/ui";

export default function App() {
  return (
    <main className="min-h-screen bg-bg bg-noise px-6 py-12 text-fg sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-hand text-2xl text-fg-mute">hello, maker!</p>
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
              Your Doodle app
            </h1>
          </div>
          <Button variant="sun" size="lg">Start doodling</Button>
        </header>

        <Card tape tone="sun" className="max-w-2xl" tilt={-1}>
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 font-display text-2xl font-bold">A tiny canvas awaits.</p>
              <p className="max-w-md text-fg-mute">
                Edit <code className="font-mono">src/App.tsx</code> and make this
                starter screen yours.
              </p>
            </div>
            <Button variant="outline" className="shrink-0">
              <SearchIcon aria-hidden width={18} height={18} />
              Explore
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
`;

const indexCss = `@import "tailwindcss";
@import "@sangisalarp/tokens/css/tokens.css";
@import "@sangisalarp/ui/theme.css";

@source "../node_modules/@sangisalarp/ui/dist";

body {
  margin: 0;
}
`;

const readme = (coreVersion: string) => `# Doodle app

This project was created with [Doodle DS](https://github.com/deserveto/doodle-ds), a playful neo-brutalist React design system.

## Next steps

1. Start the dev server: \`npm run dev\`
2. Open the local URL printed by Vite.
3. Edit \`src/App.tsx\` and begin making it yours.

## Commands

- \`npm run dev\` — start the Vite development server.
- \`npm run build\` — build the production bundle with Vite.
- \`npm run preview\` — preview the production build locally.

## Existing app

To add Doodle DS to an existing Vite React app, install the packages manually:

\`\`\`sh
npm install @sangisalarp/tokens@${coreVersion} @sangisalarp/icons@${coreVersion} @sangisalarp/ui@${coreVersion}
npm install -D tailwindcss@^4.1.13 @tailwindcss/vite@^4.1.13
\`\`\`

Then copy the Tailwind plugin setup from \`vite.config.ts\`, the CSS imports from \`src/index.css\`, and the starter component patterns from \`src/App.tsx\`.

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the visual contract and component guidance.
`;

const designSystem = `# Doodle DS design contract

Use this guide when extending the generated app or asking an AI coding assistant to make UI changes.

## Visual language

- Keep the playful neo-brutalist look: expressive type, friendly color blocks, and hand-drawn details.
- Use 2px ink borders and hard offset shadows such as \`shadow-pop\`; never use blurred shadows.
- Prefer \`rounded-wobbly\`, \`rounded-cutout\`, or pill shapes over generic smooth corners.
- Use semantic theme classes (\`bg-bg\`, \`bg-surface\`, \`text-fg\`, \`border-line\`, and \`bg-accent-*\`) rather than raw colors.
- Never put raw hex values in components.
- Do not add smooth color gradients. Pattern-only texture utilities such as \`bg-noise\` are encouraged.

## Components

Use \`@sangisalarp/ui\` before creating custom controls, and use \`@sangisalarp/icons\` instead of inline SVG or emoji icons. Use the existing \`Button\` and \`Card\` components before creating one-off equivalents. Follow their documented variants and APIs. Preserve labels, aria attributes, button types, focus behavior, and keyboard accessibility.

## Theme and CSS

The single global stylesheet is \`src/index.css\`, imported once from \`src/main.tsx\`. Keep these imports in that file:

\`\`\`css
@import "tailwindcss";
@import "@sangisalarp/tokens/css/tokens.css";
@import "@sangisalarp/ui/theme.css";
@source "../node_modules/@sangisalarp/ui/dist";
\`\`\`

Dark mode uses the \`.dark\` class on \`<html>\`; brand themes can override the \`--ds-*\` variables. Keep component styles semantic so both modes continue to work.
`;

/** Return every file in the generated app, with project metadata substituted. */
export function getTemplateFiles(projectName: string, coreVersion: string): GeneratedFile[] {
  return [
    { path: "package.json", contents: packageTemplate(projectName, coreVersion) },
    { path: "vite.config.ts", contents: viteConfig },
    { path: "index.html", contents: indexHtml },
    { path: "src/main.tsx", contents: mainTsx },
    { path: "src/App.tsx", contents: appTsx },
    { path: "src/index.css", contents: indexCss },
    { path: "README.md", contents: readme(coreVersion) },
    { path: "DESIGN_SYSTEM.md", contents: designSystem },
  ];
}
