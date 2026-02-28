## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-23 - Interactive State Accessibility
**Learning:** Custom components like `Tooltip` do not automatically apply `aria-label` or `title` attributes to their trigger elements, leaving screen readers without context for icon-only buttons. Furthermore, interactive buttons that toggle UI states (like opening/closing an AI chat) must dynamically update their `aria-label` to reflect the current action, not just the component's name.
**Action:** Always verify that elements wrapped in a `Tooltip` have explicit `aria-label` attributes for screen reader support, especially when they only contain icons. Update `aria-label`s dynamically based on component state to provide accurate context (e.g., "Close AI Assistant" vs "Open AI Assistant").
