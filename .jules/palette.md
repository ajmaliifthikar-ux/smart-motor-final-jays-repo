
## 2024-05-19 - Missing aria-labels on Custom Overlay Close Buttons
**Learning:** Found multiple instances of icon-only close buttons (`<X />`) missing `aria-label` attributes across different custom overlay and floating chat components (`review-modal.tsx`, `ai-chat-panel.tsx`, `smart-assistant-floating.tsx`, `emergency-fab.tsx`). Relying on visual icons without screen reader text creates accessibility barriers for interactive dismissal elements.
**Action:** Always verify that every custom icon-only button inside floating or modal components has an explicit `aria-label` describing its action (e.g., "Close [context]").
