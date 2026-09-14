import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { TabPanel, Tabs } from "./Tabs";

function TabExample() {
  const [value, setValue] = useState("doodles");

  return (
    <Tabs
      items={[
        { id: "doodles", label: "doodles" },
        { id: "collage", label: "collage" },
      ]}
      value={value}
      onValueChange={setValue}
    >
      <TabPanel value="doodles">doodle panel</TabPanel>
      <TabPanel value="collage">collage panel</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("moves the active panel when a trigger is selected", async () => {
    const user = userEvent.setup();

    render(<TabExample />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("doodle panel");

    await user.click(screen.getByRole("tab", { name: "collage" }));

    expect(screen.getByRole("tabpanel")).toHaveTextContent("collage panel");
    expect(screen.getByRole("tab", { name: "collage" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
