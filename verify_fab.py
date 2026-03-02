import time
from playwright.sync_api import sync_playwright

def verify_fab(page):
    print("Navigating to homepage...")
    try:
        page.goto("http://localhost:3000", timeout=30000)
    except Exception as e:
        print(f"Navigation failed: {e}")
        return

    print("Waiting for FABs...")

    # Check for WhatsApp button
    try:
        whatsapp_btn = page.locator("button[aria-label='WhatsApp']")
        whatsapp_btn.wait_for(state="attached", timeout=10000)
        print("✅ Found 'WhatsApp' button")
    except Exception as e:
        print(f"❌ 'WhatsApp' button not found: {e}")

    # Check for Phone button
    try:
        phone_btn = page.locator("button[aria-label='Call Us']")
        phone_btn.wait_for(state="attached", timeout=5000)
        print("✅ Found 'Call Us' button")
    except Exception as e:
        print(f"❌ 'Call Us' button not found: {e}")

    # Check for AI Assistant button
    try:
        ai_btn = page.locator("button[aria-label='AI Assistant']")
        ai_btn.wait_for(state="attached", timeout=5000)
        print("✅ Found 'AI Assistant' button")

        # Click to toggle
        print("Clicking AI Assistant button...")
        ai_btn.click()

        # Check for Close button state
        close_btn = page.locator("button[aria-label='Close AI Assistant']")
        close_btn.wait_for(state="attached", timeout=5000)
        print("✅ Found 'Close AI Assistant' button after toggle")

    except Exception as e:
        print(f"❌ AI Assistant button check failed: {e}")

    # Screenshot
    page.screenshot(path="verification_fab.png")
    print("Screenshot saved to verification_fab.png")

with sync_playwright() as p:
    print("Launching browser...")
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        verify_fab(page)
    except Exception as e:
        print(f"Script error: {e}")
    finally:
        browser.close()
