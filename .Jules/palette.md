## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2025-03-15 - Missing ARIA attributes on dynamic mobile menus
**Learning:** Found a recurring pattern in both V1 and V2 `navbar.tsx` components where dynamically toggled mobile menus lacked standard `aria-label` and `aria-expanded` attributes. This hides critical state information from screen readers.
**Action:** When adding or reviewing custom interactive elements that toggle visibility (like hamburger menus or mode switches), always ensure dynamic `aria-label` updates alongside accurate `aria-expanded` attributes are implemented.
