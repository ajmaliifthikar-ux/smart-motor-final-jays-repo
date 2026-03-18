## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2026-03-18 - Missing ARIA Labels in Chat Interfaces
**Learning:** Chat interfaces and AI floating widgets frequently contain icon-only buttons (like send, close, and mode toggles) that lack `aria-label` attributes, creating a consistent accessibility gap across multiple components.
**Action:** Ensure that all newly created chat interfaces or floating widgets include explicit `aria-label` attributes on icon-only interactive elements to maintain accessibility standards.
