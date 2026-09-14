import type { ComponentProps, ReactNode } from "react";
import { CheckIcon } from "@doodle-ds/icons";
import { cn } from "../lib/cn";

export interface CheckboxProps extends ComponentProps<"input"> {
  children?: ReactNode;
}

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <label className={cn("group inline-flex cursor-pointer items-center gap-2.5", className)}>
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className="flex h-6 w-6 items-center justify-center rounded-wobbly-sm border-2 border-line bg-surface text-ink shadow-pop-xs transition-shadow duration-100 peer-checked:bg-accent peer-checked:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px] peer-focus-visible:outline-2 peer-focus-visible:outline-dashed peer-focus-visible:outline-sky-deep"
      >
        <CheckIcon className="h-4 w-4 scale-0 transition-transform duration-150 group-has-[:checked]:scale-100" />
      </span>
      {children && <span className="text-fg">{children}</span>}
    </label>
  );
}
