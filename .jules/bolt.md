## 2025-02-27 - Hoisting Intl Formatter Instances
**Learning:** Repeatedly instantiating Intl objects within functions or render loops introduces a performance bottleneck. Additionally, toLocaleDateString() natively defaults to the local timezone, so passing Intl.DateTimeFormat().resolvedOptions().timeZone is redundant and expensive.
**Action:** Always hoist Intl formatter instances to the module scope as constants to reuse them, and rely on native defaults for local timezone formatting.
