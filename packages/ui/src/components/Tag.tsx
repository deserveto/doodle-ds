import type { ComponentProps, ReactNode } from "react";
import { CloseIcon } from "@sangisalarp/icons";
import { cn } from "../lib/cn";

type TagTone = "ink" | "sun" | "terra" | "sky" | "lavender" | "mint";

export interface TagProps extends ComponentProps<"span"> {
  tone?: TagTone;
  dot?: boolean;
  onRemove?: () => void;
  removeLabel?: ReactNode;
}

const tones: Record<TagTone, string> = {
  ink: "bg-fg text-bg",
  sun: "bg-accent text-on-accent",
  terra: "bg-accent-terra text-on-accent",
  sky: "bg-accent-sky text-on-accent",
  lavender: "bg-accent-lavender text-on-accent",
  mint: "bg-accent-mint text-on-accent",
};

export function Tag({
  tone = "sky",
  dot = false,
  onRemove,
  removeLabel,
  className,
  children,
  ...props
}: TagProps) {
  const removeForeground = tone === "ink" ? "text-bg" : "text-on-accent";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-line px-3 py-0.5 font-display text-xs font-bold tracking-tight shadow-pop-xs",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className="h-2 w-2 rounded-full border border-line bg-bg"
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className={cn(
            "-mr-1 ml-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-transform duration-100 hover:rotate-90",
            removeForeground,
          )}
        >
          {removeLabel ?? <CloseIcon className="h-3 w-3" />}
        </button>
      )}
    </span>
  );
}
