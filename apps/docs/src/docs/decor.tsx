import type { ReactNode } from "react";

export function DoodleArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 90"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      className={className}
    >
      <path d="M8 12 C 40 4, 88 18, 96 52 C 98 62, 92 72, 82 74" />
      <path d="M74 62 L 82 75 L 94 68" />
    </svg>
  );
}

export function DoodleStar({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className={className}
    >
      <path d="M20 4 L23 16 L35 17 L25 24 L29 36 L20 28 L11 36 L15 24 L5 17 L17 16 Z" />
    </svg>
  );
}

export function DoodleScribble({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      className={className}
    >
      <path d="M4 14 Q 14 4 24 14 T 44 14 T 64 14 T 84 14 T 104 14 T 116 12" />
    </svg>
  );
}

export function CrosshatchPatch({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 80"
      stroke="currentColor"
      strokeWidth={1}
      className={className}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={-20 + i * 8} y1={90} x2={30 + i * 8} y2={-10} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`c${i}`} x1={-20 + i * 8} y1={-10} x2={60 + i * 8} y2={90} />
      ))}
    </svg>
  );
}

export function Section({
  id,
  title,
  kicker,
  children,
}: {
  id: string;
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-6 flex items-baseline gap-4">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          {title}
        </h2>
        {kicker && (
          <span className="font-hand text-xl text-fg-mute">{kicker}</span>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function Demo({
  title,
  children,
  tint,
}: {
  title: string;
  children: ReactNode;
  tint?: boolean;
}) {
  return (
    <div className="rounded-cutout border-2 border-line bg-surface shadow-pop">
      <div
        className={`flex flex-wrap items-center gap-4 rounded-t-[calc(1.25rem-2px)] border-b-2 border-line p-6 ${
          tint ? "bg-bg-deep bg-stipple" : "bg-bg-deep"
        } [&>*]:flex-wrap`}
      >
        {children}
      </div>
      <p className="px-6 py-3 font-hand text-lg text-fg-mute">{title}</p>
    </div>
  );
}
