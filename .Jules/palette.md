## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2024-05-19 - ARIA States in Floating UI and Chat Components
**Learning:** This application extensively utilizes custom floating action buttons (FABs) and interactive chat panels (like `SmartAssistantFloating`) containing animated toggles, dynamically updated content lists, and stateful icon-buttons. Standard static ARIA labels are insufficient. Screen readers require dynamic state attributes (`aria-expanded`, `aria-pressed`) on toggles to communicate status, and `role="log"` with `aria-live="polite"` on chat message containers to announce incoming messages asynchronously.
**Action:** When implementing or modifying custom chat interfaces or floating widgets in this design system, always verify that interactive mode toggles track state with `aria-pressed`, expansion toggles track `aria-expanded`, and live content areas utilize `role="log"` to ensure full screen reader compatibility without relying solely on visual cues or basic aria-labels.
