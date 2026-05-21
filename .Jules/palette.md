## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2025-05-22 - Chat Component Accessibility
**Learning:** React chat panels typically update messages asynchronously, leaving screen readers unaware of new content unless the message container is configured as a live region.
**Action:** When working with dynamic chat or messaging components, ensure the messages container element includes `role="log"`, `aria-live="polite"`, and `aria-atomic="false"`, and all interactive input fields and icon-only buttons have descriptive `aria-label` attributes.
