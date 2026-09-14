import type { ComponentProps, ReactNode } from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export interface TooltipProps
  extends Omit<ComponentProps<"span">, "content" | "title"> {
  content: ReactNode;
  side?: "top" | "bottom";
}

export function Tooltip({
  content,
  side = "top",
  className,
  children,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <span
            className={cn("inline-flex", className)}
            {...props}
          >
            {children}
          </span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={10}
            className={cn(
              "relative z-50 w-max max-w-56 rounded-wobbly-sm border-2 border-line bg-surface px-3 py-1.5 text-sm font-medium text-fg shadow-pop-sm animate-pop-in",
            )}
          >
            {content}
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-line bg-surface",
                side === "top"
                  ? "-bottom-[7.5px] border-r-2 border-b-2"
                  : "-top-[7.5px] border-l-2 border-t-2",
              )}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
