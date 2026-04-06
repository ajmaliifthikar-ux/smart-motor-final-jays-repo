## 2025-02-21 - Hoist Intl objects outside formatting functions

**Learning:** Re-instantiating `Intl.NumberFormat` or `Intl.DateTimeFormat` inside utility functions (like `formatPrice` or `formatDate`) is a performance anti-pattern. Since these functions are often called repeatedly in rendering loops (e.g., formatting lists of prices or dates), recreating the `Intl` object on every call wastes significant CPU cycles and memory.

**Action:** Always hoist `Intl` object initializations to the module scope as constants, allowing the application to reuse a single instance for all formatting calls.