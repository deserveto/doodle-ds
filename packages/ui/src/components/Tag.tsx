import type { ComponentProps, ReactNode } from "react";
import { CloseIcon } from "@doodle-ds/icons";
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
  sun: "bg-accent text-ink",
  terra: "bg-accent-terra text-ink",
  sky: "bg-accent-sky text-ink",
  lavender: "bg-accent-lavender text-ink",
  mint: "bg-accent-mint text-ink",
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
          className="-mr-1 ml-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-ink transition-transform duration-100 hover:rotate-90"
        >
          {removeLabel ?? <CloseIcon className="h-3 w-3" />}
        </button>
      )}
    </span>
  );
}
