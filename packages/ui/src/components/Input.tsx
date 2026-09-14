import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export interface InputProps extends ComponentProps<"input"> {
  invalid?: boolean;
}

const fieldBase =
  "w-full rounded-xl border-2 bg-surface px-4 font-body text-fg placeholder:text-fg-mute/70 transition-[translate,box-shadow] duration-100 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 shadow-pop-sm",
        invalid ? "border-accent-salmon" : "border-line",
        fieldBase,
        className,
      )}
      {...props}
    />
  );
}

export interface TextareaProps extends ComponentProps<"textarea"> {
  invalid?: boolean;
}

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-24 py-2.5 shadow-pop-sm",
        invalid ? "border-accent-salmon" : "border-line",
        fieldBase,
        className,
      )}
      {...props}
    />
  );
}
