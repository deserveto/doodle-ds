import { useEffect, useState } from "react";
import { Badge, Button } from "@doodle-ds/ui";
import { MoonIcon, SunIcon } from "@doodle-ds/icons";
import { Components } from "./docs/sections/Components";
import { Foundations } from "./docs/sections/Foundations";
import {
  CrosshatchPatch,
  DoodleArrow,
  DoodleScribble,
  DoodleStar,
} from "./docs/decor";

const nav = [
  {
    group: "Foundations",
    links: [
      ["colors", "Colors"],
      ["type", "Typography"],
      ["shape", "Radii & Shadows"],
      ["texture", "Texture & Motion"],
    ] as const,
  },
  {
    group: "Components",
    links: [
      ["buttons", "Button"],
      ["badges", "Badge & Tag"],
      ["cards", "Card"],
      ["forms", "Forms"],
      ["feedback", "Alert & Progress"],
      ["nav", "Tabs & Tooltip"],
      ["overlay", "Modal"],
      ["icons", "Icons"],
    ] as const,
  },
];

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="bg-noise min-h-screen bg-bg text-fg">
      {/* header */}
      <header className="sticky top-0 z-40 border-b-2 border-line bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Doodle DS logo"
              className="h-9 w-9 -rotate-6"
            />
            <span className="font-display text-lg font-bold tracking-tight">
              Doodle DS
            </span>
            <Badge tone="sun" shape="tape" className="hidden sm:inline-flex">
              v0.1
            </Badge>
          </a>
          <div className="flex items-center gap-3">
            <span className="font-hand text-lg text-fg-mute max-sm:hidden">
              mixed-media neo-brutalism
            </span>
            <Button
              size="sm"
              variant={dark ? "sun" : "outline"}
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <>
                  <MoonIcon className="h-4 w-4" /> night
                </>
              ) : (
                <>
                  <SunIcon className="h-4 w-4" /> paper
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* hero */}
      <div id="top" className="relative overflow-hidden border-b-2 border-line bg-bg-deep">
        <div className="bg-stipple absolute inset-0" aria-hidden />
        <CrosshatchPatch
          className="absolute top-6 right-8 hidden h-24 w-24 text-fg opacity-20 lg:block"
          aria-hidden
        />
        <DoodleStar className="absolute bottom-10 left-8 hidden h-8 w-8 rotate-12 text-fg-mute sm:block" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-28">
          <div>
            <Badge tone="terra" shape="wobbly" className="rotate-sticker-l animate-wiggle">
              doodle modernism
            </Badge>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Design loud.
              <br />
              <span className="relative inline-block">
                Ship playful.
                <DoodleScribble className="absolute -bottom-3 left-0 h-4 w-full text-accent-terra" />
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-fg-soft">
              A zine-flavored design system: crisp paper, deep ink, hard
              shadows, sticker badges and just enough hand-drawn chaos.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={() => document.getElementById("buttons")?.scrollIntoView({ behavior: "smooth" })}>
                browse components
              </Button>
              <Button
                variant="sun"
                onClick={() => document.getElementById("colors")?.scrollIntoView({ behavior: "smooth" })}
              >
                see foundations
              </Button>
            </div>
          </div>
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="h-56 w-44 rotate-3 rounded-full border-2 border-line bg-accent-lavender shadow-pop-lg" />
            <div className="absolute h-40 w-40 -rotate-6 rounded-full border-2 border-line bg-accent-sky shadow-pop" />
            <div className="absolute flex h-24 w-24 items-center justify-center rounded-full border-2 border-line bg-accent font-display text-3xl font-bold shadow-pop-sm">
              ☺
            </div>
            <DoodleArrow className="absolute -bottom-2 left-6 h-24 w-32 -scale-x-100 text-fg" />
          </div>
        </div>
      </div>

      {/* body */}
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-6">
            {nav.map((g) => (
              <div key={g.group}>
                <p className="mb-2 font-hand text-xl text-fg-mute">
                  {g.group.toLowerCase()}
                </p>
                <ul className="space-y-1 border-l-2 border-line/20 pl-4">
                  {g.links.map(([id, label]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="text-sm text-fg-soft transition-colors hover:text-fg hover:squiggle"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-16 pb-24">
          <Foundations />
          <Components />
          <footer className="border-t-2 border-dashed border-line/30 pt-6 text-sm text-fg-mute">
            Doodle DS — paper #F9F9F9 · ink #111111 · sun #FFE600. Imperfect
            on purpose.
          </footer>
        </main>
      </div>
    </div>
  );
}
