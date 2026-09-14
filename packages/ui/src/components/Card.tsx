import { createContext, useContext, type ComponentProps } from "react";
import { cn } from "../lib/cn";

export interface CardProps extends ComponentProps<"div"> {
  /** decorative tape strips on the top corners */
  tape?: boolean;
  /** slight collage rotation, in degrees */
  tilt?: number;
  tone?: "surface" | "sun" | "sky" | "lavender" | "terra" | "mint";
}

const tones = {
  surface: "bg-surface",
  sun: "bg-accent",
  sky: "bg-accent-sky",
  lavender: "bg-accent-lavender",
  terra: "bg-accent-terra",
  mint: "bg-accent-mint",
} as const;

const tapeTones = [
  "bg-accent/70",
  "bg-accent-sky/70",
  "bg-accent-salmon/70",
] as const;

type CardForeground = "surface" | "accent";

const CardForegroundContext = createContext<CardForeground>("surface");

export function Card({
  tape = false,
  tilt = 0,
  tone = "surface",
  className,
  style,
  ...props
}: CardProps) {
  const foreground = tone === "surface" ? "surface" : "accent";

  return (
    <CardForegroundContext.Provider value={foreground}>
      <div
        style={{ rotate: tilt ? `${tilt}deg` : undefined, ...style }}
        className={cn(
          "relative rounded-cutout border-2 border-line shadow-pop",
          foreground === "accent" && "text-on-accent",
          tones[tone],
          className,
        )}
        {...props}
      >
        {tape && (
          <>
            <span
              aria-hidden
              className={cn(
                "absolute -top-3 -left-2 h-6 w-16 -rotate-12 border border-line/20",
                tapeTones[0],
              )}
            />
            <span
              aria-hidden
              className={cn(
                "absolute -top-3 -right-2 h-6 w-16 rotate-6 border border-line/20",
                tapeTones[1],
              )}
            />
          </>
        )}
        {props.children}
      </div>
    </CardForegroundContext.Provider>
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1 p-6 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  const foreground = useContext(CardForegroundContext);

  return (
    <h3
      className={cn(
        "font-display text-xl font-bold tracking-tight",
        foreground === "accent" && "text-on-accent",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  const foreground = useContext(CardForegroundContext);

  return (
    <p
      className={cn(
        "text-sm",
        foreground === "accent" ? "text-on-accent-soft" : "text-fg-mute",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-3 p-6 pt-0", className)}
      {...props}
    />
  );
}
