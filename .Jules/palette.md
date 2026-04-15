## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2024-05-18 - Invisible Keyboard Trap on Delete Button
**Learning:** Icon-only buttons hidden with `opacity-0 group-hover:opacity-100` create invisible keyboard traps because they are in the tab order but remain visually hidden unless hovered over. They also lacked an `aria-label`.
**Action:** Always add `focus:opacity-100 focus:outline-none focus:ring-2` to visually hidden interactive elements so they become visible when accessed via keyboard navigation. Ensure ARIA labels are present for all icon-only buttons.
