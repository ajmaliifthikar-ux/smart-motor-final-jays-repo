## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2025-05-23 - Dynamic ARIA States on Toggle Buttons
**Learning:** Interactive elements that toggle state (e.g., mobile hamburger menus, mode switches) need more than just an `aria-label`. They require dynamic attributes like `aria-expanded` or `aria-pressed` to accurately reflect the current state to screen readers, preventing confusion about whether an action was successful.
**Action:** Always include `aria-expanded={isOpen}` for menus/accordions and `aria-pressed={isActive}` for toggle buttons alongside descriptive `aria-label`s.
