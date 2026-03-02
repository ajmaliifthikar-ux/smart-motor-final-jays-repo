## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-24 - FAB Accessibility
**Learning:** Floating Action Buttons (FABs) often rely on tooltips which are not always accessible. Icon-only buttons are invisible to screen readers without labels.
**Action:** Always add explicit `aria-label` to icon-only buttons, even if a tooltip is present.
