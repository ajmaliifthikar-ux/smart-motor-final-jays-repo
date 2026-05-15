## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-22 - Tooltip Keyboard Accessibility
**Learning:** Tooltip components relying on `onMouseEnter` and `onMouseLeave` are completely inaccessible to keyboard-only users navigating via the Tab key.
**Action:** Always bind `onFocus` (to show) and `onBlur` (to hide) handlers alongside mouse events on Tooltip wrappers to ensure keyboard accessibility.
