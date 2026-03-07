## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-02-28 - ARIA Labels for Floating Action Buttons and AI Chat UI
**Learning:** Floating, highly-interactive widgets (like the Emergency FAB and the AI Chat Panel) often use icon-only buttons with visual Tooltips for context. While a custom `<Tooltip>` provides visual context, it does not inherently satisfy accessibility requirements for screen readers if the underlying `<button>` lacks an `aria-label`. Conditionally rendered floating panels and widgets easily obscure their primary controls if these are not explicitly labelled.
**Action:** When auditing or building floating action buttons or interactive chat panels, always explicitly declare `aria-label` attributes on `<button>` elements that only contain an `<Icon />`, even if a wrapper component (like `<Tooltip>`) is used to provide a visual label.
