import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export interface ProgressProps extends ComponentProps<"div"> {
  value: number;
  max?: number;
  tone?: "sun" | "sky" | "terra" | "lavender" | "mint";
  label?: string;
}

const tones = {
  sun: "bg-accent",
  sky: "bg-accent-sky",
  terra: "bg-accent-terra",
  lavender: "bg-accent-lavender",
  mint: "bg-accent-mint",
} as const;

export function Progress({
  value,
  max = 100,
  tone = "sun",
  label,
  className,
  ...props
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn(
        "h-5 w-full overflow-hidden rounded-full border-2 border-line bg-surface shadow-pop-xs",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative h-full rounded-full transition-[width] duration-300",
          tones[tone],
        )}
        style={{
          width: `${pct}%`,
          backgroundImage:
            "repeating-linear-gradient(-45deg, rgba(17,17,17,0.18) 0 6px, transparent 6px 12px)",
        }}
      />
    </div>
  );
}
