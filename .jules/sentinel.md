## 2024-05-18 - Missing Authentication on API Key Endpoint
**Vulnerability:** The `/api/ai/get-key` endpoint, designed to securely provide the `GEMINI_API_KEY` to the frontend, was completely publicly accessible. Any user could retrieve the API key by making a GET request to the endpoint.
**Learning:** Even endpoints designed to keep secrets out of client-side bundles (e.g. `process.env`) can still leak those secrets if the endpoint itself lacks proper authentication and authorization checks.
**Prevention:** All API routes returning sensitive information or secrets must explicitly verify the user's session (e.g., using `adminAuth.verifyIdToken(token)` with the `user-token` cookie) before returning any data.
