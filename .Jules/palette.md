## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-27 - Keyboard Navigation for Hover Containers
**Learning:** Actions revealed only on hover (`opacity-0 group-hover:opacity-100`) become invisible and inaccessible to keyboard users navigating via Tab.
**Action:** Always add `group-focus-within:opacity-100` alongside hover classes for action containers to ensure they are revealed during keyboard navigation.
