## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2026-05-29 - Keyboard Accessibility of Hover Actions
**Learning:** Actions revealed by `group-hover:opacity-100` are invisible to keyboard users navigating via Tab unless they also receive focus styles.
**Action:** Always pair `group-hover:opacity-100` with `group-focus-within:opacity-100` on containers of interactive elements, and ensure all icon-only buttons have proper `aria-label` attributes.
