## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## $(date +%Y-%m-%d) - Adding ARIA attributes to Navigation Icons
**Learning:** Found multiple icon-only buttons in navigation components (`navbar.tsx` and `admin-toolbar.tsx`) missing `aria-label`s. Also, interactive toggles like the mobile menu hamburger were missing `aria-expanded` attributes to convey their state.
**Action:** Always verify that every interactive element relying solely on visual icons has an appropriate `aria-label`, and interactive toggles also reflect their current state with `aria-expanded` or `aria-pressed`.
