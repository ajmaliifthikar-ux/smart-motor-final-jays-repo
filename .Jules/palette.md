## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2026-04-13 - Accessible Chat Interfaces
**Learning:** Chat components (like `ai-chat-panel` and `live-chat-panel`) without `role="log"` and `aria-live="polite"` on the message container are completely opaque to screen readers when new messages arrive. Furthermore, icon-only inputs and buttons often lack necessary `aria-label` attributes.
**Action:** Always add `role="log"` and `aria-live="polite"` to the container holding dynamic chat messages so screen readers announce new incoming messages automatically. Ensure all input fields and icon-only buttons include descriptive `aria-label`s.
