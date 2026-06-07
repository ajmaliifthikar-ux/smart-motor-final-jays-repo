## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-22 - Mobile Menu Accessibility
**Learning:** Hamburger menus often lack ARIA attributes and focus states, making them difficult to use with screen readers and keyboard navigation.
**Action:** Always add `aria-expanded`, `aria-label`, `aria-controls`, and `focus-visible` ring styles to mobile menu toggle buttons, and link them to the menu container via `id`.
