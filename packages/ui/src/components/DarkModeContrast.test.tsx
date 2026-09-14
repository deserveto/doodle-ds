import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardDescription, CardTitle } from "./Card";
import { Avatar } from "./Avatar";
import { Tag } from "./Tag";

describe("dark mode contrast roles", () => {
  it("uses a dark foreground for bright button variants", () => {
    render(<Button variant="sun">make it readable</Button>);

    expect(screen.getByRole("button")).toHaveClass("text-on-accent");
  });

  it("uses a dark foreground for bright badges", () => {
    render(<Badge tone="sky">read this</Badge>);

    expect(screen.getByText("read this")).toHaveClass("text-on-accent");
  });

  it("gives tinted cards readable title and supporting copy", () => {
    render(
      <Card tone="sky">
        <CardTitle>Colorway card</CardTitle>
        <CardDescription>Tinted surfaces stay legible.</CardDescription>
      </Card>,
    );

    expect(screen.getByText("Colorway card")).toHaveClass("text-on-accent");
    expect(screen.getByText("Tinted surfaces stay legible.")).toHaveClass(
      "text-on-accent-soft",
    );
  });

  it("gives alerts readable title and supporting copy", () => {
    render(
      <Alert tone="warning" title="Heads up">
        Keep the message clear.
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveClass("text-on-accent");
    expect(screen.getByText("Keep the message clear.")).toHaveClass(
      "text-on-accent-soft",
    );
  });

  it("keeps surface avatar fallbacks readable in dark mode", () => {
    render(<Avatar fallback="AB" />);

    expect(screen.getByText("AB")).toHaveClass("text-fg");
  });

  it("keeps removable ink tags aligned with their foreground", () => {
    render(<Tag tone="ink" onRemove={() => undefined}>status</Tag>);

    expect(screen.getByRole("button", { name: "Remove" })).toHaveClass(
      "text-bg",
    );
  });
});
