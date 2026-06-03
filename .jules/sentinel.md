## 2025-02-27 - XSS Vulnerability in CMS Title Rendering via dangerouslySetInnerHTML
**Vulnerability:** CMS-driven title fields in `why-smart-motor.tsx` and `about-snippet.tsx` were rendered directly using React's `dangerouslySetInnerHTML`, creating an XSS vulnerability if CMS data is compromised.
**Learning:** Using `dangerouslySetInnerHTML` for CMS content is extremely risky. It should be avoided in favor of safe parsing utilities, even when rich text formatting (like spans and breaks) is expected.
**Prevention:** Implement and use a safe parsing utility (`safeTitle`) that strictly whitelists explicit HTML tags instead of blindly rendering inner HTML.
