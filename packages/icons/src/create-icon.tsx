import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { title?: string };

/**
 * Shared doodle icon chrome: 24 grid, 2px currentColor stroke,
 * round caps/joins, no fill. Icons inherit `1em` sizing from font.
 */
export function IconBase({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
