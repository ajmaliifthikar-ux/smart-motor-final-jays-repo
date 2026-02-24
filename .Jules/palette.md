## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2026-03-02 - Dynamic FAB Labels
**Learning:** FABs that toggle states (e.g., open/close chat) often rely on icon changes which are invisible to screen readers if the label remains static.
**Action:** Use conditional logic to update `aria-label` (e.g., "Open Chat" vs "Close Chat") matching the visual icon change.
