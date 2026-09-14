import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface RadioProps
  extends Omit<ComponentProps<"input">, "type"> {
  children?: ReactNode;
}

export function Radio({ className, children, ...props }: RadioProps) {
  return (
    <label className={cn("group inline-flex cursor-pointer items-center gap-2.5", className)}>
      <input type="radio" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-line bg-surface shadow-pop-xs transition-shadow duration-100 peer-checked:bg-accent-sky peer-checked:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px] peer-focus-visible:outline-2 peer-focus-visible:outline-dashed peer-focus-visible:outline-sky-deep"
      >
        <span className="h-2.5 w-2.5 scale-0 rounded-full bg-ink transition-transform duration-150 group-has-[:checked]:scale-100" />
      </span>
      {children && <span className="text-fg">{children}</span>}
    </label>
  );
}
