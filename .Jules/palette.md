## 2025-05-22 - Chat Accessibility
**Learning:** Chat interfaces often lack screen reader support for incoming messages which makes them unusable for blind users.
**Action:** Always add `role="log"` and `aria-live="polite"` to message containers and `aria-label` to input fields in chat components.
## 2024-05-24 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Found a systemic pattern across modals (`callback-modal`, `setup-2fa-modal`, `backup-codes-modal`) and sections (`testimonials`) where icon-only action buttons (e.g., Close, Copy, Next/Prev) lack `aria-label` attributes, rendering them invisible or confusing to screen reader users.
**Action:** When auditing or building new components with icon-only buttons, always ensure an explicit, descriptive `aria-label` is provided to maintain screen reader accessibility.
