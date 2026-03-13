## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-10-27 - Toggle State Screen Reader Context
**Learning:** Mobile menus and sidebars with toggle states without contextual labels cause confusion for screen reader users as they cannot identify what the button does or its current state.
**Action:** Interactive elements that toggle state must use dynamic `aria-label` (e.g., "Open menu" vs "Close menu") and `aria-expanded` or `aria-pressed` attributes to accurately reflect the current state to screen readers.
