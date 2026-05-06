## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-22 - Table Actions Keyboard Accessibility
**Learning:** Actions in data tables that are revealed via hover (using `opacity-0 group-hover:opacity-100`) are completely hidden from keyboard users since keyboard focus does not trigger `hover`.
**Action:** Always include `group-focus-within:opacity-100` alongside hover states for table action containers to ensure they become visible when a user tabs into them, and ensure all icon-only buttons have descriptive `aria-label` attributes and focus-visible rings.
