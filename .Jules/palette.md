## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2025-06-05 - Tooltip Component Accessibility
**Learning:** The custom `Tooltip` component does not automatically provide `aria-label` or `aria-describedby` attributes to its child elements, leaving icon-only buttons inaccessible to screen readers.
**Action:** Always explicitly add `aria-label` attributes to icon-only buttons, even when they are wrapped in a `Tooltip` component.
