## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2025-05-22 - Tooltip Component Accessibility
**Learning:** The internal `Tooltip` component often relies only on mouse/touch events, leaving out keyboard focus events which makes it inaccessible to screen readers that use keyboard navigation.
**Action:** In addition to adding `aria-label` to buttons, verify that tooltip components handle `onFocus` and `onBlur` for full accessibility.
