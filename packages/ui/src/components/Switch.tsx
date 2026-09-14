import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export interface SwitchProps
  extends Omit<ComponentProps<"input">, "type" | "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({ onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <label className={cn("group inline-flex cursor-pointer items-center", className)}>
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <span
        aria-hidden
        className="relative h-7 w-13 rounded-full border-2 border-line bg-surface shadow-pop-xs transition-colors duration-150 peer-checked:bg-accent-mint peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-dashed peer-focus-visible:outline-sky-deep"
      >
        <span className="absolute top-1/2 left-0.5 h-4.5 w-4.5 -translate-y-1/2 rounded-full border-2 border-line bg-ink transition-transform duration-150 group-has-[:checked]:translate-x-[24px]" />
      </span>
    </label>
  );
}
