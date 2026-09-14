import { expect, test } from "@playwright/test";

test("showcase loads and core interactions work", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Doodle DS — Playful Neo-Brutalist Design System");
  await expect(
    page.getByRole("heading", { name: "Design loud. Ship playful." }),
  ).toBeVisible();

  const themeToggle = page.getByRole("button", { name: "Toggle dark mode" });
  await themeToggle.click();
  await expect(themeToggle).toContainText("night");
  await expect(page.locator("html")).toHaveClass(/dark/);

  const collageTab = page.getByRole("tab", { name: "collage" });
  await collageTab.click();
  await expect(collageTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText(
    "Overlapping shapes anchor visual weight",
  );

  await page.getByRole("button", { name: "hover me" }).hover();
  await expect(page.getByRole("tooltip")).toHaveText("hand-drawn, no blur");

  await page.getByRole("button", { name: "open the thing" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("showcase has no horizontal overflow on a narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Design loud. Ship playful." }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    )
    .toBe(true);
});
