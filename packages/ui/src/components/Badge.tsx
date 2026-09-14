import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border-2 border-line px-3 py-0.5 font-display text-sm font-bold tracking-tight",
  {
    variants: {
      tone: {
        ink: "bg-fg text-bg",
        sun: "bg-accent text-on-accent",
        terra: "bg-accent-terra text-on-accent",
        sky: "bg-accent-sky text-on-accent",
        lavender: "bg-accent-lavender text-on-accent",
        mint: "bg-accent-mint text-on-accent",
      },
      shape: {
        pill: "rounded-full shadow-pop-xs",
        wobbly: "rounded-wobbly-sm shadow-pop-xs",
        tape: "rounded-sm rotate-sticker-l opacity-90 shadow-none border-dashed",
      },
    },
    defaultVariants: {
      tone: "sun",
      shape: "pill",
    },
  },
);

export interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
}

export function Badge({
  tone,
  shape,
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, shape }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}
