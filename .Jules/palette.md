## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2026-05-01 - Dynamic Chat Accessibility Pattern
**Learning:** Many interactive chat components in this app dynamically stream content and use icon-only buttons without proper screen reader support. Without ARIA roles on the container and labels on the controls, users with visual impairments are unable to perceive new messages or interact with the inputs efficiently.
**Action:** Consistently enforce adding `role="log"` and `aria-live="polite"` to chat message containers. Ensure all interactive chat controls (inputs, toggle buttons, send buttons) include descriptive `aria-label`s.