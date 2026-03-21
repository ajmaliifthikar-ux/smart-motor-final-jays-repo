## 2024-05-18 - Avoid Rules of Hooks Violation in UI Events
**Learning:** Initializing state (`useState`) inside a callback or event handler (like `handleSend`) violates React’s Rules of Hooks. In `src/components/ui/ai-chat-panel.tsx`, `conversationId` was initialized inside the `handleSend` function.
**Action:** Always declare React Hooks like `useState` at the top level of a component. Use lazy initialization `useState(() => ...)` when the default value relies on volatile functions like `Date.now()` or `Math.random()` to prevent them from executing repeatedly on every re-render.
