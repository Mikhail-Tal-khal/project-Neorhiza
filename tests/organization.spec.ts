import { expect, test } from "@playwright/test";
import { PAGES } from "./support/site";

/**
 * Corporate identity, governance and honesty rules (corporate identity
 * brief, 2026-11-17).
 */

const OPERATOR = "Project Neorhiza is an initiative operated by Lyshub Limited, a company registered in Kenya.";
const PHONE = "+254 768 871 004";

test("every page footer names the operator and the official business contact", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const footer = page.getByRole("contentinfo");
    await expect(footer, path).toContainText(OPERATOR);
    const tel = footer.getByRole("link", { name: PHONE });
    await expect(tel, path).toHaveAttribute("href", "tel:+254768871004");
  }
});

test("no unapproved names, appointments, credentials or partnerships appear anywhere", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    // A proposed contact who has not consented to publication.
    expect(text, path).not.toMatch(/Paul\s+Noel|Athens State|Calhoun Community|Alabama in Huntsville/i);
    // The founder is never presented as a scientist or clinician.
    expect(text, path).not.toMatch(/Dr\.?\s+Rereu|Rereu Lemein,?\s+(PhD|MD)|scientific director/i);
    // No invented corporate particulars or charitable status.
    // Denials ("nothing claims that … is a registered charity") are allowed; affirmative claims are not.
    expect(text, path).not.toMatch(/(Lyshub Limited|Neorhiza) is an? (registered )?(charity|PBO|public benefit organi[sz]ation|tax-exempt)/i);
  }
});

test("governance page explains structure, oversight, reporting and status", async ({ page }) => {
  await page.goto("/governance");
  await expect(page.locator("h1")).toHaveText("How Neorhiza Is Governed and Held to Account");
  const main = page.getByRole("main");
  await expect(main).toContainText("LYSHUB LIMITED");
  await expect(main).toContainText("The Founder currently provides overall project oversight.");
  await expect(main).toContainText("Research activities will require qualified scientific supervision.");
  await expect(main).toContainText("appropriate institutional, ethics and biosafety approvals");
  for (const item of [
    "Funds received",
    "Payment processing fees",
    "Actual expenditures",
    "Research-development milestones",
    "Recruitment progress",
    "Institutional partnerships",
    "Remaining funds",
    "Changes in the research roadmap",
  ]) {
    await expect(page.locator("section[aria-labelledby='reporting-heading']").getByText(item, { exact: true }), item).toBeVisible();
  }
  await expect(main).toContainText("planned expenditure clearly separate from money actually spent");
  // Unconfirmed particulars are placeholders, never invented values.
  await expect(main.getByText("Pending publication", { exact: true })).toHaveCount(2);
  // Independent oversight is not claimed.
  await expect(main).toContainText("Independent financial audit or external financial oversight");
  await expect(main).toContainText("independent financial review has not yet been arranged");
});

test("public transparency status is shown as present facts", async ({ page }) => {
  for (const path of ["/governance", "/funding"]) {
    await page.goto(path);
    const status = page.locator("dl").filter({ hasText: "Organizational status" });
    for (const [label, value] of [
      ["Organizational status", "Operating under Lyshub Limited"],
      ["Project status", "Foundation Phase"],
      ["Laboratory research", "Not yet commenced"],
      ["Scientific recruitment", "Under development"],
      ["Institutional partnerships", "Being pursued"],
      ["First proposed research programme", "Liver-tissue feasibility"],
      ["Clinical services", "Not offered"],
      ["Medical treatments", "Not offered"],
    ]) {
      await expect(status.locator("div").filter({ hasText: label }).locator("dd"), `${path} ${label}`).toHaveText(value);
    }
  }
});

test("scientific network separates appointed, confirmed, prospective and open roles", async ({ page }) => {
  await page.goto("/scientific-network");
  const main = page.getByRole("main");
  await expect(main).toContainText("advisory network is under development");
  for (const [title, status] of [
    ["Formally appointed advisers", "None at present"],
    ["Confirmed institutional partners", "None at present"],
    ["Prospective advisers", "Being identified"],
    ["Recruitment opportunities", "Open"],
  ]) {
    const card = main.getByRole("listitem").filter({ has: page.getByRole("heading", { name: title }) });
    await expect(card, title).toContainText(status);
  }
  await expect(main.getByText("Regulatory professionals")).toBeVisible();
  await expect(main.getByRole("link", { name: "Apply or Express Interest" })).toHaveAttribute(
    "href",
    "/contact?interest=researcher#inquiry-form"
  );
});

test("leadership page shows the founder-led model without overstating credentials", async ({ page }) => {
  await page.goto("/leadership");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 3, name: "Rereu Lemein" })).toBeVisible();
  await expect(main.getByAltText("Rereu Lemein, Founder of Project Neorhiza.")).toBeVisible();
  await expect(main).toContainText("Founder, Project Neorhiza");
  await expect(main).toContainText("founder-led");
  await expect(main).toContainText("Fundraising strategy and accountability");
  await expect(main).toContainText("not clinical medicine or laboratory science");
});

test("liver programme status is explicit and no laboratory work is claimed", async ({ page }) => {
  for (const path of ["/", "/roadmap"]) {
    await page.goto(path);
    const main = page.getByRole("main");
    await expect(main, path).toContainText(
      "Proposed research programme — institutional collaboration and qualified scientific supervision required."
    );
    await expect(main, path).toContainText("No laboratory research has yet begun.");
  }
});

test("contact page offers partnership routes and the official business contact", async ({ page }) => {
  await page.goto("/contact");
  const routes = page.getByRole("navigation", { name: "Choose your inquiry route" });
  for (const [label, interest] of [
    ["Researcher applications", "Researcher application"],
    ["University collaboration", "University collaboration"],
    ["Research sponsorship", "Research sponsorship"],
    ["General enquiries", "General inquiry"],
  ]) {
    await page.goto("/contact");
    await routes.getByRole("link", { name: new RegExp(label) }).click();
    await expect(page.getByLabel("Area of interest"), label).toHaveValue(interest);
  }
  await expect(page.getByRole("main").getByRole("link", { name: PHONE })).toHaveAttribute("href", "tel:+254768871004");
});
