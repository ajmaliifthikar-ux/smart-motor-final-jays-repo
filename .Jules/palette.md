## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-23 - FAB Accessibility
**Learning:** Floating Action Buttons (FABs) are primary interaction points but often lack accessible names when they rely on icons, making them invisible to screen readers. Tooltips alone are insufficient for accessibility.
**Action:** Always include `aria-label` on icon-only FABs, especially when they toggle states (e.g., "Open Chat" vs "Close Chat").
