// @ts-nocheck
import { SearchIcon } from "@sangisalarp/icons";
import { Button, Card, CardContent } from "@sangisalarp/ui";

export default function App() {
  return (
    <main className="min-h-screen bg-bg bg-noise px-6 py-12 text-fg">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex items-end justify-between gap-5">
          <div>
            <p className="font-hand text-2xl text-fg-mute">hello, maker!</p>
            <h1 className="font-display text-5xl font-bold tracking-tight">Your Doodle app</h1>
          </div>
          <Button variant="sun" size="lg">Start doodling</Button>
        </header>
        <Card tape tone="sun" className="max-w-2xl" tilt={-1}>
          <CardContent className="flex items-center justify-between gap-5">
            <div>
              <p className="mb-2 font-display text-2xl font-bold">A tiny canvas awaits.</p>
              <p className="text-fg-mute">Edit <code className="font-mono">src/App.tsx</code> and make it yours.</p>
            </div>
            <Button variant="outline" className="shrink-0"><SearchIcon aria-hidden width={18} height={18} />Explore</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
