## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2026-03-28 - Dynamic ARIA Labels for Toggle Buttons\n**Learning:** When adding ARIA labels to buttons that toggle modes (like voice vs. standard chat mode), the `aria-label` must be dynamic (e.g., `isVoiceMode ? "Stop voice mode" : "Start voice mode"`) to accurately communicate the *next action* to screen readers, rather than just the current state.\n**Action:** Always use ternary operators or state-derived strings for `aria-label` attributes on toggleable icon buttons.
