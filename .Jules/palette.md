## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2026-02-20 - Tooltip vs. ARIA Label
**Learning:** The custom `Tooltip` component displays text on hover but does not associate it with the trigger element via `aria-labelledby` or `aria-describedby`. Screen readers miss the context for icon-only buttons.
**Action:** Always add explicit `aria-label` to buttons wrapped in `Tooltip`, even if the content seems redundant.
