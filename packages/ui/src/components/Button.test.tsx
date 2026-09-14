import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the selected visual variant", () => {
    render(<Button variant="sun">make it loud</Button>);

    const button = screen.getByRole("button", { name: "make it loud" });
    expect(button).toHaveClass("bg-accent");
    expect(button).toHaveClass("shadow-pop");
  });

  it("exposes disabled state", () => {
    render(<Button disabled>not available</Button>);

    expect(screen.getByRole("button", { name: "not available" })).toBeDisabled();
  });
});
