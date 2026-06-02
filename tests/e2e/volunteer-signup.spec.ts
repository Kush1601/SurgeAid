import { test, expect } from "@playwright/test";

test("volunteer signup form submits and shows success message", async ({ page }) => {
  await page.goto("/volunteer");

  await expect(page.getByRole("heading", { name: /join as volunteer/i })).toBeVisible();

  const uniquePhone = `555${Date.now().toString().slice(-7)}`;
  await page.getByPlaceholder("Full name").fill("Test Volunteer");
  await page.getByPlaceholder("Phone number").fill(uniquePhone);
  await page.getByPlaceholder(/skills/i).fill("First Aid, Search & Rescue");

  await page.getByRole("button", { name: /join as volunteer/i }).click();

  // Success banner: "You're registered!"
  await expect(page.getByText(/you.re registered/i)).toBeVisible({ timeout: 10_000 });
});
