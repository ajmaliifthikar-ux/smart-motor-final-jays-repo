## $(date +%Y-%m-%d) - ARIA labels for Chat & FAB UI
**Learning:** Found multiple icon-only interactive buttons in components like `ai-chat-panel.tsx` and `emergency-fab.tsx` that lacked screen-reader descriptions, making the chat/support interface hard to navigate for visually impaired users.
**Action:** Always verify that every `<button>` and interactive `<svg>` wrapped in a generic container possesses an explicit `aria-label` attribute describing its function (e.g., 'Close chat', 'Start voice mode').
