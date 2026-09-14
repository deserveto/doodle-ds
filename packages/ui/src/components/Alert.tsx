import type { ComponentProps, ReactNode } from "react";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
} from "@sangui/icons";
import { cn } from "../lib/cn";

type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<ComponentProps<"div">, "title"> {
  tone?: AlertTone;
  icon?: ReactNode;
  title: ReactNode;
}

const tones: Record<
  AlertTone,
  { wrap: string; tape: string; Icon: typeof InfoIcon }
> = {
  info: { wrap: "bg-accent-sky", tape: "bg-accent-lavender/80", Icon: InfoIcon },
  success: {
    wrap: "bg-accent-mint",
    tape: "bg-accent-sky/80",
    Icon: CheckCircleIcon,
  },
  warning: {
    wrap: "bg-accent",
    tape: "bg-accent-terra/80",
    Icon: AlertTriangleIcon,
  },
  danger: {
    wrap: "bg-accent-salmon",
    tape: "bg-accent/80",
    Icon: XCircleIcon,
  },
};

export function Alert({
  tone = "info",
  icon,
  title,
  className,
  children,
  ...props
}: AlertProps) {
  const t = tones[tone];
  const resolvedIcon =
    icon === undefined ? <t.Icon className="h-5 w-5" /> : icon;
  return (
    <div
      role="alert"
      className={cn(
        "relative rounded-cutout border-2 border-line p-5 pt-6 shadow-pop",
        t.wrap,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "absolute -top-3.5 left-6 -rotate-3 rounded-sm border border-line/20 px-4 py-0.5 font-hand text-sm font-bold",
          t.tape,
        )}
      >
        {tone}
      </span>
      <div className="flex items-start gap-3">
        {resolvedIcon && (
          <span className="mt-0.5 text-xl leading-none">{resolvedIcon}</span>
        )}
        <div className="min-w-0">
          <p className="font-display text-lg leading-snug font-bold tracking-tight">
            {title}
          </p>
          {children && (
            <div className="mt-1 text-sm text-ink-soft">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
