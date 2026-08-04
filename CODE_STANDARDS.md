# Code Standards

Engineering conventions for the Lumora Digital codebase. This document is
enforced by tooling (ESLint, Prettier, TypeScript, `lint-staged`) wherever a
rule can be automated; the rest is reviewer judgment at PR time.

## Language & types

- TypeScript `strict` mode is non-negotiable. `any` is an ESLint error
  (`@typescript-eslint/no-explicit-any`) — use `unknown` and narrow, or a
  proper generic.
- Prefer `type` for object shapes/unions, `interface` only when declaration
  merging is genuinely needed (rare — mostly third-party augmentation).
- Type-only imports use `import type { X } from "..."` (enforced by
  `@typescript-eslint/consistent-type-imports`) so the bundler can always
  elide them.
- No non-null assertions (`!`) as a substitute for a real null check outside
  of test files — if the type system doesn't know a value is defined, either
  narrow it or fix the type.

## Components

- One component per file; the file name matches the component name in
  `PascalCase.tsx` (e.g., `ProductCard.tsx` exports `ProductCard`).
- Server Components by default. A component only becomes a Client Component
  (`"use client"`) when it needs interactivity, browser APIs, a hook, or
  animation state — see ARCHITECTURE.md §12.
- Folder is the namespace, not the component name: `components/marketing/Hero.tsx`,
  `components/lumora/ProductCard.tsx`, `components/admin/DataTable.tsx`,
  `components/ui/Button.tsx` — see DESIGN_SYSTEM.md §31.
- Brand/theme variance is read from the nearest `data-brand`/`data-theme`
  ancestor via CSS tokens, never hard-coded per component and never passed
  as a manual `brand` prop in application code (Storybook isolation is the
  one exception).
- Component state exposed for styling goes through `data-*` attributes
  (`data-state`, `data-variant`), matching the Radix/Shadcn convention —
  not bespoke BEM modifier classes.

## Styling

- Tailwind utilities only, composed with `cn()` (`lib/utils.ts`) for
  conditional classes. No inline `style` props except for values that are
  computed at runtime and cannot be a class (e.g., a cursor-follow
  transform).
- Reach for semantic token utilities (`bg-canvas`, `text-primary`,
  `rounded-button`) before raw palette utilities — a raw `bg-[#...]` or
  `text-neutral-500` in application code is a sign a semantic token is
  missing, not a shortcut to take.
- Class order is auto-sorted by `prettier-plugin-tailwindcss` — don't
  hand-tune ordering.

## Imports & module boundaries

- Import order (enforced by editor + review, not yet a hard lint rule):
  external packages → `@/lib` / `@/hooks` / `@/contexts` → `@/components` →
  relative imports → styles.
- Respect the layering rule from ARCHITECTURE.md §12: `app/**` composes
  components and calls `server/services/**`; components never import
  Prisma or any server-only client directly.
- Path aliases (`@/*`, `@/components/*`, `@/lib/*`, …) are mandatory for
  anything outside the current directory — no `../../../` chains.

## Naming

- Variables/functions: `camelCase`. Components/types: `PascalCase`.
  Constants that are truly fixed (tokens, config maps): `SCREAMING_SNAKE_CASE`
  only for primitive literals; exported config objects stay `camelCase`.
- Hooks are prefixed `use` and live in `src/hooks/`, one hook per file,
  file name matches the hook (`use-media-query.ts` exports `useMediaQuery`).
- Boolean props/variables read as a question: `isLoading`, `hasError`,
  `shouldReduceMotion` — never `loading`/`error`/`flag` alone.

## Comments & documentation

- Default to no comments. A comment is only added when it explains a
  non-obvious *why* (a workaround, a constraint from the Design System or
  Animation Blueprint, a browser quirk) — never a restatement of *what* the
  code does.
- Public utilities in `lib/` get a one-line JSDoc summary if their purpose
  isn't obvious from the name + types alone; no multi-paragraph docstrings.

## Errors & edge cases

- Validate at system boundaries only (form input, API payloads, env vars) —
  internal function calls trust their callers' types.
- Every async boundary that can fail (data fetch, third-party SDK call) is
  wrapped by an Error Boundary or an explicit try/catch with a meaningful
  fallback — never a silent swallow.

## Accessibility (see DESIGN_SYSTEM.md §29)

- `eslint-plugin-jsx-a11y` runs as an error-level gate in CI, not a
  suggestion.
- Every interactive element ships a visible focus state and a keyboard path
  — this is checked in review for anything touching pointer/drag/hover
  interactions specifically (magnetic buttons, 3D viewer controls, custom
  cursor).

## Git

- Conventional, imperative commit subjects (`Add`, `Fix`, `Refactor`, not
  `Added`/`Fixes`). One logical change per commit.
- `main` is protected; all work lands via PR with CI green (lint, typecheck,
  build) before merge — see ARCHITECTURE.md §29 (CI/CD).
