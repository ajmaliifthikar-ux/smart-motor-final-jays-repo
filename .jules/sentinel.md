## 2024-05-18 - XSS Vulnerability in Contact Form
**Vulnerability:** Contact form submissions were rendering raw HTML via `dangerouslySetInnerHTML` in the admin dashboard.
**Learning:** React's built-in protections are bypassed when explicitly using `dangerouslySetInnerHTML`. The previous dev assumed internal CMS data was safe, but user-submitted forms flow into the same dashboard.
**Prevention:** Never use `dangerouslySetInnerHTML` for user-generated content. Use DOMPurify or our custom SafeHtml component for rendering.

## 2024-05-18 - Insecure Random Number Generation for Cryptographic Values
**Vulnerability:** Weak random number generation using `Math.random()` was used throughout the application to generate security-sensitive values, including passwords (`src/lib/password.ts`), backup codes, short codes, and device IDs (`src/lib/totp.ts`, `src/lib/tokens.ts`). Additionally, `Math.random() - 0.5` was used to shuffle password characters, which introduces severe bias.
**Learning:** `Math.random()` is predictable and not cryptographically secure, leaving the generated passwords, backup codes, and tokens vulnerable to prediction attacks. This was an architectural gap where standard non-secure JS functionality was mistakenly relied upon for cryptographic contexts.
**Prevention:** Always use `globalThis.crypto.getRandomValues()` for security-sensitive token/password generation. For shuffling, implement a proper Fisher-Yates shuffle algorithm rather than relying on array sorting with random biases. For array/buffer-based random values in loops, allocating a pre-sized `Uint32Array` reduces overhead compared to multiple allocations.
