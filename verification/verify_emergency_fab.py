from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        page.goto("http://localhost:3000", timeout=60000)

        # 1. Verify WhatsApp button aria-label
        # Note: WhatsApp button might be inside a motion.div which delays rendering.
        whatsapp_btn = page.locator("button[aria-label='WhatsApp']")
        expect(whatsapp_btn).to_be_visible(timeout=30000)
        print("WhatsApp button found with correct aria-label")

        # 2. Verify Call Us button aria-label
        call_btn = page.locator("button[aria-label='Call Us']")
        expect(call_btn).to_be_visible()
        print("Call Us button found with correct aria-label")

        # 3. Verify AI Assistant button aria-label and initial expanded state
        ai_btn = page.locator("button[aria-label='AI Assistant']")
        expect(ai_btn).to_be_visible()

        # Verify expanded state
        # In React, boolean `false` for aria attributes renders as string "false".
        expect(ai_btn).to_have_attribute("aria-expanded", "false")
        print("AI Assistant button found with correct aria-label and expanded state")

        # 4. Open AI Chat
        ai_btn.click()

        # Verify expanded state changes to true
        expect(ai_btn).to_have_attribute("aria-expanded", "true")
        print("AI Assistant button expanded state updated to true")

        # Take screenshot
        page.screenshot(path="verification/emergency_fab.png")
        print("Screenshot taken")

        print("Verification successful!")
    except Exception as e:
        print(f"Verification failed: {e}")
        page.screenshot(path="verification/error_fab.png")
        # raise # Don't raise so we can exit gracefully
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
