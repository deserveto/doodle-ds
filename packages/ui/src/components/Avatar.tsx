import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type AvatarShape = "circle" | "pill";
type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends ComponentProps<"span"> {
  src?: string;
  alt?: string;
  /** two-letter initials fallback */
  fallback?: string;
  shape?: AvatarShape;
  size?: AvatarSize;
  tone?: "sun" | "sky" | "lavender" | "terra" | "mint" | "surface";
}

const sizes: Record<AvatarSize, string> = {
  sm: "h-8 w-14 text-xs",
  md: "h-10 w-18 text-sm",
  lg: "h-14 w-24 text-base",
  xl: "h-20 w-32 text-xl",
};

const circleSizes: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

const tones = {
  sun: "bg-accent",
  sky: "bg-accent-sky",
  lavender: "bg-accent-lavender",
  terra: "bg-accent-terra",
  mint: "bg-accent-mint",
  surface: "bg-bg-deep",
} as const;

export function Avatar({
  src,
  alt = "",
  fallback,
  shape = "circle",
  size = "md",
  tone = "surface",
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-line font-display font-bold text-ink shadow-pop-xs",
        shape === "pill" ? sizes[size] : circleSizes[size],
        src ? "bg-bg-deep" : tones[tone],
        className,
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        fallback ?? "☺"
      )}
    </span>
  );
}
