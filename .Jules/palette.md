## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-22 - Keyboard Navigation for Hover States
**Learning:** Table action containers that are revealed via CSS hover (e.g., `opacity-0 group-hover:opacity-100`) are invisible and inaccessible to users navigating via keyboard.
**Action:** Always include `group-focus-within:opacity-100` alongside hover states to ensure visibility during keyboard navigation.
