import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-full border-2 font-display font-bold tracking-tight whitespace-nowrap transition-[translate,box-shadow] duration-100 select-none disabled:pointer-events-none disabled:opacity-50 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  {
    variants: {
      variant: {
        solid:
          "bg-fg text-bg border-line shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-pop-sm",
        sun: "bg-accent text-on-accent border-line shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-pop-sm",
        terra:
          "bg-accent-terra text-on-accent border-line shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-pop-sm",
        sky: "bg-accent-sky text-on-accent border-line shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-pop-sm",
        outline:
          "bg-surface text-fg border-line shadow-pop-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-pop-xs",
        ghost:
          "bg-transparent text-fg border-transparent shadow-none hover:bg-bg-deep",
      },
      size: {
        sm: "h-8 px-4 text-sm gap-1.5",
        md: "h-10 px-5 text-base gap-2",
        lg: "h-12 px-7 text-lg gap-2.5",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
