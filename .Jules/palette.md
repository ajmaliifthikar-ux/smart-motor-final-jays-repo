## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-22 - Hover-Revealed Container Accessibility
**Learning:** Table action containers that are only revealed via CSS hover (e.g., `opacity-0 group-hover:opacity-100`) become invisible to keyboard users who are navigating via the `Tab` key.
**Action:** Always include `group-focus-within:opacity-100` alongside hover classes to ensure action containers are fully visible when any of their child elements receive focus during keyboard navigation.
