## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-23 - Interactive Elements Toggle States
**Learning:** Interactive elements that toggle states (like opening/closing chat or toggling voice mode) need dynamic aria-labels that reflect the action that will happen when clicked, not just what it is.
**Action:** Always use dynamic `aria-label` attributes (e.g., `aria-label={isActive ? "Stop" : "Start"}`) for toggle buttons to ensure screen readers accurately convey the current state and action.
