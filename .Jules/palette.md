## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2026-04-07 - [ARIA State Attributes for Interactive Elements]
**Learning:** Interactive elements that toggle state or indicate position (e.g., mode switches, pagination dots) must use `aria-pressed` or `aria-current` attributes alongside `aria-label` to accurately reflect the current state to screen readers.
**Action:** Always add `aria-pressed={isActive}` to toggle buttons and `aria-current={isCurrent}` to pagination/navigation elements when implementing custom UI controls.
