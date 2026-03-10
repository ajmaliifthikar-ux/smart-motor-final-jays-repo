## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-23 - Mobile Menu Accessibility
**Learning:** Interactive elements that toggle state (e.g., mobile hamburger menus) often lack dynamic `aria-label` and `aria-expanded` attributes, making their current state opaque to screen readers.
**Action:** Always include dynamic `aria-label` along with `aria-expanded` or `aria-pressed` attributes on elements that toggle state to accurately reflect the current state to screen readers.