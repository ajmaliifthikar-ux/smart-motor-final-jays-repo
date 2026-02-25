## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2026-02-25 - Floating Action Buttons (FABs)
**Learning:** Stacked FABs often rely solely on icons and animation, leaving screen reader users unaware of their purpose or state (expanded/collapsed).
**Action:** Always add `aria-label` to icon-only buttons and `aria-expanded`/`aria-haspopup` to buttons that toggle overlays like chat panels.
