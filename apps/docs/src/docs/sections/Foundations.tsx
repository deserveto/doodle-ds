import { Demo, CrosshatchPatch, DoodleScribble, Section } from "../decor";

const palette = [
  { name: "paper", cls: "bg-paper", hex: "#F9F9F9" },
  { name: "ink", cls: "bg-ink", hex: "#111111" },
  { name: "sun", cls: "bg-sun", hex: "#FFE600" },
  { name: "terra", cls: "bg-terra", hex: "#FF8A5C" },
  { name: "salmon", cls: "bg-salmon", hex: "#FF9AA8" },
  { name: "sky", cls: "bg-sky", hex: "#8ECBFF" },
  { name: "lavender", cls: "bg-lavender", hex: "#C9B8FF" },
  { name: "mint", cls: "bg-mint", hex: "#9BE8C8" },
  { name: "night", cls: "bg-night", hex: "#17161A" },
  { name: "cream", cls: "bg-cream", hex: "#F3EFE6" },
];

const semantic = [
  { token: "bg / surface / fg / line", note: "swaps under .dark" },
  { token: "accent (sun)", note: "primary highlight" },
  { token: "accent-terra / salmon", note: "warm energy" },
  { token: "accent-sky / lavender / mint", note: "cool anchors" },
];

export function Foundations() {
  return (
    <>
      <Section id="colors" title="Colors" kicker="loud paper, deep ink">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map((c) => (
            <div
              key={c.name}
              className="rounded-wobbly-sm border-2 border-line bg-surface p-2 shadow-pop-sm"
            >
              <div
                className={`h-16 rounded-lg border-2 border-line ${c.cls}`}
              />
              <p className="mt-2 font-display text-sm font-bold">{c.name}</p>
              <p className="text-xs text-fg-mute">{c.hex}</p>
            </div>
          ))}
        </div>
        <Demo title="semantic tokens — they flip in dark mode">
          {semantic.map((s) => (
            <span
              key={s.token}
              className="rounded-full border-2 border-line bg-bg-deep px-3 py-1 font-mono text-xs"
            >
              {s.token} <span className="text-fg-mute">— {s.note}</span>
            </span>
          ))}
        </Demo>
      </Section>

      <Section id="type" title="Typography" kicker="loud headers, quiet body">
        <Demo title="Space Grotesk — display, tracking-tight, 700">
          <span className="font-display text-5xl font-bold tracking-tight">
            Make it weird.
          </span>
        </Demo>
        <Demo title="DM Sans — body, charcoal on paper">
          <p className="max-w-xl text-fg-soft">
            Body copy stays grounded: neutral, legible, a little warm. Set in
            DM Sans at 16px with comfortable leading so functional details
            never shout over the headlines.
          </p>
        </Demo>
        <Demo title="Caveat — hand notes, tape labels, margin scribbles">
          <span className="font-hand text-3xl">hey, look here →</span>
        </Demo>
      </Section>

      <Section id="shape" title="Radii & shadows" kicker="no blur, ever">
        <Demo title="pills + cutout rounds + wobbly sketch borders">
          <div className="flex h-16 w-40 items-center justify-center rounded-full border-2 border-line bg-accent shadow-pop font-display font-bold">
            rounded-full
          </div>
          <div className="flex h-16 w-40 items-center justify-center rounded-cutout border-2 border-line bg-accent-sky shadow-pop font-display font-bold">
            cutout
          </div>
          <div className="flex h-16 w-40 items-center justify-center rounded-wobbly border-2 border-line bg-accent-salmon shadow-pop font-display font-bold">
            wobbly
          </div>
        </Demo>
        <Demo title="hard offset shadows — pop-xs to pop-xl">
          {(
          [
            ["pop-xs", "shadow-pop-xs"],
            ["pop-sm", "shadow-pop-sm"],
            ["pop", "shadow-pop"],
            ["pop-lg", "shadow-pop-lg"],
            ["pop-xl", "shadow-pop-xl"],
          ] as const
        ).map(([label, cls]) => (
          <div
            key={label}
            className={`flex h-14 w-24 items-center justify-center rounded-xl border-2 border-line bg-surface ${cls} font-mono text-xs`}
          >
            {label}
          </div>
        ))}
        </Demo>
      </Section>

      <Section id="texture" title="Texture & motion" kicker="notebook dust">
        <Demo title="noise, stipple, crosshatch — scatter in negative space">
          <div className="bg-noise h-20 w-40 rounded-xl border-2 border-line bg-surface" />
          <div className="relative h-20 w-40 overflow-hidden rounded-xl border-2 border-line bg-surface">
            <div className="bg-stipple absolute inset-0" />
          </div>
          <div className="relative h-20 w-40 overflow-hidden rounded-xl border-2 border-line bg-surface text-ink">
            <CrosshatchPatch className="absolute inset-0 h-full w-full opacity-15" />
          </div>
        </Demo>
        <Demo title="motion — pop-in, wiggle, squiggle underline">
          <span className="animate-pop-in rounded-wobbly-sm border-2 border-line bg-accent px-4 py-2 font-display font-bold shadow-pop-sm">
            animate-pop-in
          </span>
          <span className="animate-wiggle inline-block rounded-wobbly-sm border-2 border-line bg-accent-mint px-4 py-2 font-display font-bold shadow-pop-sm">
            animate-wiggle
          </span>
          <span className="squiggle font-display font-bold">
            squiggle underline
          </span>
          <DoodleScribble className="h-6 w-28 text-fg" />
        </Demo>
      </Section>
    </>
  );
}
