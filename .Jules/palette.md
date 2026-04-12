## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-23 - Focus States for Hover-Revealed Elements
**Learning:** Interactable elements that are visually hidden until hover (e.g., using `opacity-0 group-hover:opacity-100`) become invisible traps for keyboard navigators, as they receive focus but cannot be seen.
**Action:** Always include explicit focus states (like `focus:opacity-100 focus:outline-none focus:ring-2`) for elements that rely on hover for visibility.
