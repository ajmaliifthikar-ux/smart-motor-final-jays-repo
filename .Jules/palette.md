## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.

## 2025-05-22 - Semantic ARIA Implementation
**Learning:** Using `aria-selected` on buttons without explicit `role="tab"` and `role="tablist"` wrappers is technically an invalid ARIA state and gets flagged by screen readers. Furthermore, using `role="radiogroup"` implies mutually exclusive single-choice, so using `aria-checked={true}` on multiple items (like star ratings) violates the intended pattern.
**Action:** Use `aria-current="true"` or `aria-current="step"` for pagination dots instead of `aria-selected`. Ensure `aria-checked` accurately reflects true single-item selection logic when using `role="radio"`.
