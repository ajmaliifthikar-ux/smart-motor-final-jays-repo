## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2026-02-21 - Floating Action Button Accessibility
**Learning:** Animated Floating Action Buttons (FABs) using libraries like `framer-motion` often duplicate DOM elements during transitions or initial renders, complicating accessibility testing with strict `getByRole` queries.
**Action:** Use `getAllByRole` for verifying looped or animated components and ensure unique, descriptive `aria-label` attributes are applied dynamically based on state (e.g., "Close AI Assistant" vs "AI Assistant").
