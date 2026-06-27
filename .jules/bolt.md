
## 2025-02-12 - Frontend Verification Artifacts
**Learning:** Running `pnpm dev` or UI testing tools (like Playwright test pages) can sometimes execute package managers implicitly or fail to clean up `.pnpm` artifacts or `.next` cache correctly, resulting in unintentional lockfile changes (`pnpm-lock.yaml`) being generated and staged alongside the source code.
**Action:** Always strictly monitor `git status` after frontend verifications and `pnpm dev` tests. Unstage and remove any newly generated `pnpm-lock.yaml` file (e.g. `git restore --staged pnpm-lock.yaml && rm pnpm-lock.yaml`) before committing to maintain the strict boundary against modifying package definitions.
