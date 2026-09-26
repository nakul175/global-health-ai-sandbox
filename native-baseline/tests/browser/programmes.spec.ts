import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import AxeBuilder from "@axe-core/playwright";
const config = JSON.parse(
  fs.readFileSync(process.env.SANDBOX_CONFIG ?? ".local/config.json", "utf8"),
);
async function login(page: Page, profile = "A_PM") {
  await page.goto("/");
  await page.getByLabel("Institution and role").selectOption(profile);
  await page.getByLabel("Local access code").fill(config.dev_access_code);
  await page.getByRole("button", { name: "Enter workspace" }).click();
  await expect(
    page.getByRole("heading", { name: "Programmes", exact: true }),
  ).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await expect(page.getByText("Loading your programmes…")).not.toBeVisible();
}
async function fill(page: Page, name: string, code: string) {
  await page.getByLabel("Programme name", { exact: true }).fill(name);
  await page.getByLabel("Programme code", { exact: true }).fill(code);
  await page
    .getByLabel("Purpose and description")
    .fill("Synthetic browser acceptance programme with governed access.");
  await page.getByLabel("Start date", { exact: true }).fill("2026-10-01");
  await page.getByLabel("End date", { exact: true }).fill("2027-10-01");
}
test("desktop directory, filtering and keyboard access", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await login(page);
  await expect(
    page.getByRole("button", {
      name: "Respiratory AI evaluation",
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({
    path: "verification/programmes-desktop.png",
    fullPage: true,
  });
  await page.getByLabel("Filter loaded programmes").fill("Maternal");
  await expect(
    page.getByRole("button", { name: "Maternal health research", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Respiratory AI evaluation",
      exact: true,
    }),
  ).toHaveCount(0);
  const button = page.getByRole("button", {
    name: "Maternal health research",
    exact: true,
  });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Programme overview", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Maternal health research",
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({
    path: "verification/programme-details.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("create, validate, persist and edit a programme through the interface", async ({
  page,
}) => {
  await login(page);
  await page
    .getByRole("button", { name: "New programme", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Create programme", exact: true })
    .click();
  await expect(page.getByText("Check the following fields")).toBeVisible();
  await fill(
    page,
    "Browser acceptance programme",
    "BROWSER_" + Date.now().toString().slice(-8),
  );
  await page
    .getByRole("button", { name: "Create programme", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Browser acceptance programme",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit programme", exact: true })
    .click();
  await page
    .getByLabel("Programme name", { exact: true })
    .fill("Browser programme updated");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Browser programme updated",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText("Version 2", { exact: true })).toBeVisible();
  await page.reload();
  await login(page);
  await expect(
    page.getByRole("button", {
      name: "Browser programme updated",
      exact: true,
    }),
  ).toBeVisible();
});
test("conflicting edit preserves the draft and requires explicit review", async ({
  page,
  request,
}) => {
  await login(page);
  await page
    .getByRole("button", { name: "Diagnostic equity study", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Edit programme", exact: true })
    .click();
  await page
    .getByLabel("Programme name", { exact: true })
    .fill("My preserved draft");
  const session = await (
    await request.post("/dev/session", {
      data: { profile: "A_PM" },
      headers: { "X-Dev-Access-Code": config.dev_access_code },
    })
  ).json();
  const headers = {
    Authorization: "Bearer " + session.access_token,
    "X-Context-Id": session.context_id,
  };
  const list = await (
    await request.get("/v1/resources/ORG", { headers })
  ).json();
  const resource = list.items.find(
    (p: { title: string }) => p.title === "Diagnostic equity study",
  );
  expect(
    (
      await request.patch("/v1/resources/ORG/" + resource.id, {
        headers: {
          ...headers,
          "Idempotency-Key": crypto.randomUUID(),
          "If-Match": `"v${resource.version}"`,
        },
        data: { title: "Another editor saved this" },
      })
    ).status(),
  ).toBe(200);
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A newer version is available" }),
  ).toBeVisible();
  await expect(page.getByLabel("Programme name", { exact: true })).toHaveValue(
    "My preserved draft",
  );
  await expect(
    page.getByText("Another editor saved this", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep my reviewed draft" }).click();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "My preserved draft", exact: true }),
  ).toBeVisible();
});
test("reader has no create or edit action", async ({ page }) => {
  await login(page, "A_EV");
  await expect(
    page.getByRole("button", { name: "New programme", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Respiratory AI evaluation", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Edit programme", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText("This programme is read-only in your current context."),
  ).toBeVisible();
});
test("switching identity clears the previous institution and tokens are not persisted", async ({
  page,
}) => {
  await login(page);
  await page
    .getByRole("button", { name: "Switch institution or role" })
    .click();
  await page.getByLabel("Institution and role").selectOption("B_PM");
  await page.getByLabel("Local access code").fill(config.dev_access_code);
  await page.getByRole("button", { name: "Enter workspace" }).click();
  await expect(
    page.getByRole("button", {
      name: "Community health evaluation",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Respiratory AI evaluation",
      exact: true,
    }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
});
test("safety intake succeeds without a selected programme", async ({
  page,
}) => {
  await login(page);
  await page
    .getByRole("button", { name: "Report a concern", exact: true })
    .click();
  await page
    .getByLabel("What happened?")
    .fill("Synthetic browser safety concern, no patient information.");
  await page
    .getByRole("button", { name: "Submit concern", exact: true })
    .click();
  await expect(
    page.getByText("Safety concern recorded. It is awaiting review."),
  ).toBeVisible();
});
test("mobile reflow, modal focus and offline feedback", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "verification/programmes-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "New programme", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New programme", exact: true }),
  ).toBeFocused();
  await context.setOffline(true);
  await expect(
    page.getByText("You’re offline.", { exact: false }),
  ).toBeVisible();
  await context.setOffline(false);
});
