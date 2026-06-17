## 2026-06-17 - Debouncing Resize Event Listeners
**Learning:** Adding a debounce to frequent events like window resize ensures rapid triggering doesn't cause UI freeze or excessive re-renders, especially on components with layout recalculations (e.g., logo sliders/carousels).
**Action:** Implement debouncing using `setTimeout` within a `useEffect` hook and ensure timeout cleanup on component unmount to prevent layout thrashing and memory leaks.
