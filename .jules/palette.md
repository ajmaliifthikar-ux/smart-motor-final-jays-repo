## 2024-12-07 - Accessible Password Toggle Buttons
**Learning:** Icon-only buttons used for toggling password visibility often lack semantic meaning for screen readers. While they are a standard UI pattern, they are inaccessible without proper ARIA labels and focus indicators.
**Action:** Always add dynamic `aria-label`s (e.g., "Show password" / "Hide password") and explicit `focus-visible` ring styles to icon-only buttons to ensure they are accessible via keyboard navigation and screen readers.
