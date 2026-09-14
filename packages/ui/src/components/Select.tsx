import type { ComponentProps } from "react";
import { ChevronDownIcon } from "@sangisalarp/icons";
import { cn } from "../lib/cn";

export type SelectProps = ComponentProps<"select">;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative inline-flex w-full">
      <select
        className={cn(
          "h-10 w-full cursor-pointer appearance-none rounded-xl border-2 border-line bg-surface pr-10 pl-4 font-body text-fg shadow-pop-sm transition-[translate,box-shadow] duration-100 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
      />
    </div>
  );
}
