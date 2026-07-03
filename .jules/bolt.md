## 2024-05-28 - Debounce resize events for performance
**Learning:** Attaching un-debounced window resize event listeners directly triggers excessive re-renders and layout thrashing, which can severely degrade frontend performance during window resizing.
**Action:** Always wrap resize event handlers in a debounce mechanism (e.g., `setTimeout` for 150ms) and clear the timeout on component unmount to prevent memory leaks.
