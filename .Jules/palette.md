## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-23 - FAB Accessibility
**Learning:** Stacked Floating Action Buttons often rely on tooltips which are inaccessible to screen readers. Toggle states (like chat open/close) are often purely visual.
**Action:** Ensure all icon-only buttons have `aria-label` and toggle buttons use `aria-expanded` to communicate state changes.
