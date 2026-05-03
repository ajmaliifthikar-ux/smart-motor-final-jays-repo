## 2024-05-14 - Prevent repeated Intl instantiation
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) inside formatting functions or loops can cause significant garbage collection overhead and slow down rendering.
**Action:** Cache these objects globally or at the module level when they are used repeatedly, such as in utility files or loops that render formatted values.
