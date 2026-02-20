## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-24 - Icon-only Button Accessibility
**Learning:** Icon-only buttons (like FABs) are invisible to screen readers without explicit labels, even if they have tooltips (unless `aria-describedby` is used).
**Action:** Always add `aria-label` to icon-only buttons, matching the visual tooltip text.
