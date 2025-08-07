from playwright.sync_api import Page, expect, sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Arrange: Go to the website
    page.goto("http://localhost:3000")

    # 2. Assert: Check the title
    expect(page).to_have_title("William White - Senior Software Engineer")

    # 3. Assert: Check the heading
    heading = page.get_by_role("heading", name="I’m William White, a Senior Software Engineer.")
    expect(heading).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
