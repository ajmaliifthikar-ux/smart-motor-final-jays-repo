# GEMINI.md — Smart Motor Gold Standard Rules

## 1. Naming Conventions
- **Files & Directories:**
  - **Components:** `kebab-case` (e.g., `button.tsx`, `user-card.tsx`).
  - **Utilities:** `kebab-case` (e.g., `utils.ts`, `format-date.ts`).
  - **Pages:** Next.js standard (`page.tsx`, `layout.tsx`).
- **Code Entities:**
  - **Components:** PascalCase (e.g., `Button`, `UserCard`).
  - **Interfaces:** PascalCase, no "I" prefix (e.g., `ButtonProps`).
  - **Variables/Functions:** camelCase (e.g., `isLoading`, `formatPrice`).
  - **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`).

## 2. Structure & Imports
- **Component File Structure:**
  1. `'use client'` (if interactive).
  2. Imports (React -> Libs -> Components -> Assets).
  3. Interface Definition (`export interface NameProps`).
  4. Component Definition (`const Name = forwardRef...` or normal function).
  5. `displayName` assignment.
  6. Named Export (`export { Name }`).
- **Strict Imports:**
  - Always use `@/` alias for internal imports.
  - Usage of `cn()` from `@/lib/utils` is **mandatory** for class merging.

## 3. Styling Rules (The "Gold Standard")
**Source of Truth:** Tailwind CSS + `globals.css` Variables.

### Color Palette (Smart Motor Identity)
- **Primary Black:** `#121212` (Use `bg-[#121212]` or `text-[#121212]`).
- **Smart Red:** `#E62329` (Use `bg-[#E62329]` or `text-[#E62329]`).
- **Backgrounds:**
  - Primary: `#FAFAF9` (`bg-primary`).
  - Secondary: `#F4F3F1`.
  - Glass: `rgba(255, 255, 255, 0.72)` with blur.

### UI Patterns & Shapes
- **Buttons:** `rounded-full`, `font-black`, `uppercase`, `tracking-widest`.
- **Inputs/Cards:** `rounded-2xl`, `bg-gray-50` (inputs), `backdrop-blur` (cards).
- **Glassmorphism:**
  - Utility: `.glass` (if available) or manual:
  - `backdrop-blur-md bg-white/10 border border-white/20`.

### Typography
- **Headings:** `tracking-tight`, `font-sans`.
- **Labels/UI Text:** `text-[10px]` or `text-xs`, `uppercase`, `tracking-widest`, `font-black`.

## 4. Coding Logic & Best Practices
- **Strict Types:** No `any`. Explicitly define prop types extending HTMLAttributes where applicable.
- **Responsiveness:** Mobile-first. Use `md:`, `lg:` modifiers.
- **State:** Prefer URL state (`nuqs`) or React Context. Avoid complex `useEffect` chains.
- **Micro-interactions:**
  - Hover: `hover:bg-opacity-80` or `hover:shadow-lg`.
  - Active: `active:scale-[0.96]` for clickable elements.
  - Transitions: `transition-all duration-300`.

## 5. Example "Gold Standard" Component
```tsx
'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-7 py-4',
          'text-xs font-black uppercase tracking-widest transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-[#121212] active:scale-[0.96]',
          variant === 'primary' 
            ? 'bg-[#121212] text-white hover:bg-[#E62329] shadow-md' 
            : 'border border-[#ECECEA] bg-transparent text-[#121212] hover:border-[#121212]',
          className
        )}
        {...props}
      />
    )
  }
)
ActionButton.displayName = 'ActionButton'

export { ActionButton }
## 6. Documentation & Organization
- **Centralized Hub:** All new documentation must be created and organized exclusively within the `project-docs/` folder.
- **Categorization:** Documentation must be placed in appropriate subfolders:
  - `general/`: High-level project standards and rules (like `GEMINI.md`).
  - `guides/`: Setup, deployment, and usage instructions.
  - `management/`: Project tracking, PRDs, and strategy plans.
  - `reports/`: Audit results, strategy reports, and visual benchmarks.
  - `technical/`: Deep dives into specific modules, skills, or components.
- **Maintenance:** The master `project-docs/README.md` must be updated with a link and description whenever a new documentation file is added.
- **No Fragmentation:** Do not create markdown documentation files in root or specific module directories unless strictly required by standard conventions (e.g., `package.json` sidecar READMEs in strictly isolated packages).
