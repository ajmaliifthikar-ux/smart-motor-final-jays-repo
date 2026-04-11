## 2026-04-11 - Hoisting Intl instantiations

**Learning:** Repeatedly instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` within render loops or frequently called utility functions is a significant performance bottleneck in Next.js applications, adding measurable overhead to formatting. React also flags impure random values (`Math.random()` or `Date.now()`) used in initial state (`useState`) during linting due to unpredictability during renders.
**Action:** Always hoist `Intl` formatter instances to the module scope as constants. When generating random IDs for initial React state, initialize the state with an empty string or deterministic value, then perform the random assignment inside a `useEffect` on mount to ensure purity and hydration matching.
