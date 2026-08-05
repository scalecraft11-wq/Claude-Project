# Lumora Design System (v1.0)
## The Complete Design Language

**Role:** Award-winning creative direction and design token specification for the agency portfolio and its flagship case study, Lumora Skin.
**Status:** Design language sign-off. No pages, templates, or components are built against this document yet — it is the law they will be built from.

---

## 0. How to Read This Document

This is **one design system with two brand expressions**, sitting on a **shared foundation**:

- **Foundation layer** — primitive tokens: spacing, grid, breakpoints, elevation math, motion timing, accessibility rules. Identical across the whole product.
- **Agency expression** (`data-brand="agency"`) — the studio's own voice: monochrome, architectural, editorial, confident restraint. Channels Apple's material honesty, Cuberto/Active Theory's interactive bravado, and Locomotive's scroll craft.
- **Lumora Skin expression** (`data-brand="lumora"`) — the flagship client brand: warm, tactile, quietly opulent. Channels Aesop's material honesty, Dior/Chanel's typographic authority, and Rhode's soft-focus modern minimalism.

Every token below is named so a component never hard-codes a value — it consumes a **semantic token**, which resolves to a **brand primitive**, which is swapped by a single `data-brand` attribute. This is what lets one codebase hold two premium brands without either feeling like a "theme" of the other.

---

## 1. Design Philosophy

**Six words govern every decision:** Minimal. Luxury. Modern. Editorial. Premium. Sophisticated.

Translated into rules a designer or engineer can actually apply:

1. **Whitespace is the primary design material.** If a layout feels tight, the fix is almost never a smaller component — it's more air. Luxury reads as *unhurried*.
2. **One accent color, used like a signature, not a paint bucket.** Color communicates hierarchy and interactivity, never decoration. Most of any screen is neutral.
3. **Typography carries the brand.** Not icons, not illustration, not gradients. A page with its imagery removed should still look premium from type alone.
4. **Motion is earned, not decorative.** Every animation either clarifies a relationship (this caused that), guides attention, or adds tactility to a direct manipulation (drag, hover, scroll). No animation exists "because it looks cool."
5. **Restraint is the tell of craft.** Anyone can add an effect. The agency's craft is knowing which nine effects to cut so the tenth one lands. Glassmorphism, blur, gradients, and 3D each have exactly one job in this system — not a general-purpose decoration toolkit.
6. **Editorial before app-like.** Layouts borrow from print/editorial design (asymmetric grids, pull quotes, generous margins, deliberate cropping) more than from generic SaaS-dashboard conventions — except inside the admin console, which is honestly utilitarian by design (see §Admin exceptions throughout).

**Reference triangulation** (what we take from whom, precisely — not vibes):

| Reference | What we take |
|---|---|
| **Apple** | Material honesty, generous negative space, restrained motion that clarifies state, product photography as hero, zero visual noise in UI chrome. |
| **Aesop** | Apothecary-editorial tone, muted natural palette, typographic confidence at small sizes, ingredient-as-story content pattern. |
| **Dior Beauty / Chanel Beauty** | High-contrast serif display type, full-bleed cinematic imagery, dark-luxe color moments, slow reveal pacing. |
| **Rhode Skin** | Soft-focus modern minimalism, pastel-adjacent warm neutrals, approachable (not cold) luxury, product-forward PDP layout. |
| **Cuberto / Active Theory** | Interactive bravado — magnetic cursors, scroll-scrubbed 3D, bold hover states, technical craft as the actual message. |
| **Locomotive** | Buttery smooth-scroll physics as a brand signature, scroll-synced parallax and reveal choreography. |

---

## 2. Brand Identity

### 2.1 Agency — "Lumora Digital"

- **Positioning statement:** *"We build the sites luxury brands deserve."* Confident, quiet, technically fluent.
- **Voice:** Declarative, short sentences, no marketing fluff, no exclamation points. Speaks like a design critic, not a salesperson.
- **Visual signature:** Monochrome canvas (paper/ink), one accent (Signal Copper) reserved for interactive elements and the studio's wordmark mark. Sharp geometry, architectural grid lines occasionally visible as a design motif (thin hairline rules), generous full-bleed imagery of client work in realistic frames.
- **Logo concept:** Wordmark-only, custom-tracked all-caps set in the UI sans (see §3), no symbol/icon mark — the confidence move of a studio that doesn't need a logo gimmick. A single geometric mark (a minimal, single-stroke "L" monogram built from the grid unit) exists as a favicon/social-avatar reduction only.
- **Default theme:** Dark (editorial, moody, portfolio-gallery feel) with a first-class light mode — see §27–28.

### 2.2 Lumora Skin — the flagship client brand

- **Positioning statement:** *"Skincare, formulated like an argument — every ingredient earns its place."*
- **Voice:** Warm but precise. Ingredient-literate, never hype-driven. Short declarative copy blocks, generous line spacing, no urgency language ("Shop now! Limited time!" is banned).
- **Visual signature:** Warm porcelain/clay neutrals, a soft botanical-gold accent, high-contrast serif display type over quiet product photography, rounded/organic geometry echoing bottle silhouettes.
- **Logo concept:** A refined serif wordmark, small caps, wide tracking, no icon — with an optional reduction mark: a single dot-and-crescent glyph evoking a drop of serum, used only as a favicon/social avatar and as a loading-state motif.
- **Default theme:** Light (porcelain, daylight, apothecary-shelf feel), with an evening/dark "boutique-at-night" mode — see §27–28.

---

## 3. Typography System

**Pairing logic:** each brand pairs one **editorial serif** (display, emotional, slow) with one **geometric/humanist sans** (UI, functional, fast). The serif never appears below 20px; the sans never carries a hero headline.

| Role | Agency | Lumora Skin |
|---|---|---|
| Display serif | **Fraunces** (variable, optical size axis engaged, weight 400–500 only — never bold) | **Cormorant Garamond** (high-contrast, romantic, italic used for emotional pull-quotes) |
| UI / body sans | **Inter** (variable) | **Manrope** (variable, slightly softer geometry than Inter — warmer for a beauty brand) |
| Monospace (admin/code contexts only) | **JetBrains Mono** | *(shared — admin console uses Agency type regardless of public brand)* |

All fonts are variable, self-hosted via `next/font/google`, subset to Latin, with `font-display: swap` and no external font requests at runtime (performance + no third-party network waterfall).

### 3.1 Type scale (fluid, `clamp()`-based — same token names, brand-specific font-family only)

| Token | Size (`clamp`) | Line-height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `display-01` | `clamp(2.75rem, 2rem + 3.5vw, 6rem)` | 1.02 | -0.02em | 400/500 | Hero headline, one per page max |
| `display-02` | `clamp(2.25rem, 1.75rem + 2.5vw, 4.5rem)` | 1.04 | -0.02em | 400/500 | Section headline |
| `display-03` | `clamp(1.75rem, 1.4rem + 1.6vw, 3rem)` | 1.08 | -0.01em | 400/500 | Sub-section headline |
| `heading-01` | `clamp(1.5rem, 1.3rem + 0.8vw, 2.25rem)` | 1.15 | -0.01em | 500/600 | In-content H1/H2 |
| `heading-02` | `clamp(1.25rem, 1.15rem + 0.5vw, 1.75rem)` | 1.2 | -0.005em | 500/600 | H3, card titles |
| `heading-03` | `1.25rem` (fixed) | 1.3 | 0 | 500/600 | H4, list titles |
| `body-lg` | `1.125rem` | 1.6 | 0 | 400 | Lead paragraphs |
| `body-md` | `1rem` (base) | 1.6 | 0 | 400 | Default body copy |
| `body-sm` | `0.875rem` | 1.55 | 0 | 400 | Secondary copy, form helper text |
| `caption` | `0.75rem` | 1.4 | 0.01em | 500 | Metadata, timestamps |
| `overline` | `0.6875rem` | 1.2 | 0.12em, uppercase | 600 | Eyebrow labels ("CASE STUDY", "COLLECTION") |
| `button` | `0.9375rem` | 1 | 0.01em | 500 | Button/interactive label |

**Rules:**
- Display tokens (`display-*`) always use the brand serif; everything `heading-03` and below always uses the brand sans. `heading-01`/`heading-02` may use serif *or* sans depending on editorial context (a case study title = serif; an admin page title = sans, always — the admin console never uses the display serif, to keep it fast-reading and utilitarian).
- Max body-copy measure: **68–75 characters per line** (`max-width: 38rem`–`45rem`), enforced on every long-form text block — the single highest-leverage rule for "editorial" feel.
- Never justify text. Never letter-space body copy above `0`. Negative tracking only on display sizes ≥ `1.5rem`.
- Bold weight (`700`) is banned in the serif family site-wide — luxury display type stays light/medium. Bold is reserved for the sans, used sparingly (badges, table headers).

---

## 4. Color Palette

### 4.1 Foundation — warm neutral primitive scale (shared skeleton, brand-tinted)

A single warm (brown-undertone, never blue-grey) neutral ramp anchors both brands so photography and product imagery never fight a cold UI chrome.

```
neutral-0    #FFFFFF
neutral-25   #FCFBF9
neutral-50   #F7F5F2
neutral-100  #EFEBE5
neutral-150  #E4DED5
neutral-200  #D6CEC1
neutral-300  #BBAF9D
neutral-400  #998C78
neutral-500  #7A6E5C
neutral-600  #5E5445
neutral-700  #453D32
neutral-800  #2E2822
neutral-900  #1C1712
neutral-950  #0F0C09
neutral-1000 #000000
```

### 4.2 Agency accent — "Signal Copper" (interactive color only)

```
copper-50  #FAF1E9   copper-300 #D49C63   copper-600 #8B4F22
copper-100 #F1DDC7   copper-400 #C17F42   copper-700 #6E3E1C
copper-200 #E4BE93   copper-500 #A8632B ← base   copper-800 #532F16
                                                   copper-900 #3A2110
```

### 4.3 Lumora Skin accents — ingredient-story palette

```
Biolumina Gold (primary)      Serum Sage (secondary)        Clay Terracotta (tertiary, sparing use)
gold-100 #F6EAD3               sage-100 #E4E9DD               clay-100 #F3E1D8
gold-300 #E3C68F               sage-300 #A9B79A               clay-300 #DDA98D
gold-500 #C9A15C ← base         sage-500 #6B7A5E ← base         clay-500 #C17A5C ← base
gold-600 #AD8547               sage-700 #4C5842               clay-700 #8F5540
```

### 4.4 Semantic status colors (shared across both brands — used mainly in admin + form/system feedback)

```
success  #4B7A5E   (muted sage-green, not neon green)
warning  #C68A3D   (muted amber)
danger   #B3462F   (muted brick red, never pure #FF0000 — stays luxury-muted even in error states)
info     #4A6B8A   (muted slate blue)
```

### 4.5 Semantic token layer (what components actually consume)

| Semantic token | Agency · Light | Agency · Dark | Lumora · Light | Lumora · Dark |
|---|---|---|---|---|
| `bg-canvas` | neutral-25 | neutral-950 | neutral-25 (porcelain-shifted, see §28) | sage-based near-black `#171B15` |
| `bg-surface` | neutral-0 | neutral-900 | neutral-0 | `#1F241D` |
| `bg-surface-raised` | neutral-50 | neutral-800 | neutral-50 | `#262C22` |
| `border-subtle` | neutral-150 | neutral-800 | neutral-150 | rgba(255,255,255,0.08) |
| `border-strong` | neutral-400 | neutral-600 | neutral-400 | rgba(255,255,255,0.16) |
| `text-primary` | neutral-900 | neutral-25 | neutral-900 | neutral-25 |
| `text-secondary` | neutral-600 | neutral-300 | neutral-600 | neutral-300 |
| `text-muted` | neutral-400 | neutral-500 | neutral-500 | neutral-400 |
| `accent` | copper-500 | copper-400 | gold-500 | gold-300 |
| `accent-hover` | copper-600 | copper-300 | gold-600 | gold-400 |
| `accent-subtle-bg` | copper-50 | copper-900 (12% mix) | gold-100 | gold-600 (14% mix) |

**Rule of one:** any single screen may show **at most one** accent color at full saturation. Sage/clay in the Lumora palette are content/ingredient colors (e.g., a "hydration" tag, a rating star), never competing CTA colors — the CTA is always Biolumina Gold.

---

## 5. Spacing Scale

Base unit: **4px**. All spacing — margin, padding, gap — is drawn from this scale; arbitrary values are a lint error.

```
space-0   0px      space-6   24px     space-16  64px
space-1   4px      space-8   32px     space-20  80px
space-2   8px      space-10  40px     space-24  96px
space-3   12px     space-12  48px     space-32  128px
space-4   16px                        space-40  160px
space-5   20px                        space-48  192px
                                       space-64  256px
```

**Macro/section rhythm** (fluid, for page-level vertical rhythm — the "generous whitespace" rule made concrete):

```
space-section-sm  clamp(3rem, 2rem + 4vw, 5rem)     (between related blocks)
space-section-md  clamp(5rem, 3rem + 8vw, 9rem)      (between distinct page sections)
space-section-lg  clamp(7rem, 4rem + 12vw, 14rem)    (before/after hero moments)
```

**Baseline grid:** an 8px vertical rhythm underlies all type-scale line-heights — every `heading-*`/`body-*` token's computed line-height snaps to a multiple of 8px at the base viewport, so stacked text blocks stay optically aligned without manual nudging.

---

## 6. Grid System

- **Base:** 12-column fluid grid, gutter **24px** (mobile) / **32px** (desktop, ≥1024px).
- **Margins:** 20px (mobile) → 32px (tablet) → clamp to a max content margin so text never runs to true edge on ultra-wide screens.
- **Container max-widths:**

```
container-sm   100%  (padding 20px)         — mobile
container-md   100%  (padding 32px)         — tablet
container-lg   1120px                       — standard content
container-xl   1280px                       — wide sections, product grids
container-2xl  1440px                       — full-bleed editorial sections
container-3xl  1600px                       — hard cap; nothing (text or UI) exceeds this width even on a 32" display
```

- **Editorial asymmetric variant:** long-form content (case studies, journal) uses a **5/7 split** (5 columns image, 7 columns text, or reversed) rather than a symmetric 6/6 — the deliberate imbalance is what reads as "edited," not "templated." Alternates side per section for rhythm.
- **Admin exception:** the admin console uses a conventional symmetric 12-col grid with a fixed 240px sidebar — utilitarian, not editorial, by design (see §0).

---

## 7. Breakpoints

```
xs   0px      (default / mobile-first base)
sm   480px    (large phone)
md   768px    (tablet)
lg   1024px   (small laptop — primary "desktop" breakpoint for nav/layout switches)
xl   1280px   (desktop)
2xl  1536px   (large desktop)
3xl  1920px   (ultra-wide — caps container growth, does not introduce new layouts)
```

Design and build **mobile-first**; every component's default state is its smallest-viewport state. `lg` (1024px) is the single most important breakpoint — it's where navigation, grid column counts, and 3D scene complexity all step up simultaneously.

---

## 8. Border Radius

```
radius-none  0px
radius-xs    2px
radius-sm    4px
radius-md    8px
radius-lg    12px
radius-xl    20px
radius-2xl   32px
radius-full  9999px
```

**Brand rule (a primary differentiator between the two expressions):**
- **Agency** defaults to `radius-xs`/`radius-sm` — architectural, precise, confident edges (buttons, cards, inputs). Only the cursor-follow dot and modal scrims use `radius-full`.
- **Lumora Skin** defaults to `radius-lg`/`radius-xl`, with `radius-full` on primary buttons and badges — soft, bottle-cap, organic geometry that echoes the product itself.

---

## 9. Shadow System

Elevation is **diffused and warm-tinted** — shadows are tinted with `neutral-900`, never pure black, and always low-opacity/large-blur (the "soft product photography" look, not "material design card lift").

```
elevation-0  none
elevation-1  0 1px 2px rgba(28,23,18,0.04), 0 1px 1px rgba(28,23,18,0.03)
elevation-2  0 2px 8px rgba(28,23,18,0.06), 0 1px 2px rgba(28,23,18,0.04)
elevation-3  0 8px 24px rgba(28,23,18,0.08), 0 2px 6px rgba(28,23,18,0.05)
elevation-4  0 16px 48px rgba(28,23,18,0.10), 0 4px 12px rgba(28,23,18,0.06)
elevation-5  0 32px 80px rgba(28,23,18,0.14), 0 8px 24px rgba(28,23,18,0.08)
```

**Mapping:** `elevation-1` = resting cards; `elevation-2` = hovered cards/dropdown triggers; `elevation-3` = open dropdowns/popovers; `elevation-4` = drawers (cart, mobile nav); `elevation-5` = modals and the hero product's floating state.

**Dark mode:** same structure, `rgba(0,0,0, opacity × 1.6)` for depth (dark surfaces need darker shadows to read at all) — plus, **Lumora dark mode only**, an optional `elevation-glow` variant that adds a soft `gold-500` glow (`0 0 40px rgba(201,161,92,0.15)`) beneath hero product imagery — the one place a colored shadow is permitted, because it reads as "boutique lighting," not "UI effect."

---

## 10. Glassmorphism Rules

Glassmorphism is a **functional-overlay tool, not a decorative style** — it exists exactly where content needs to float over other content while staying legible. It is never applied to static content cards, buttons, or body-text containers.

**Approved surfaces only:**
1. Sticky navigation bar, once the user scrolls past the hero (transitions from transparent → glass).
2. Modal/drawer scrims (the dimming layer behind a modal, not the modal panel itself).
3. The 3D product-viewer control overlay (zoom/rotate hints floating over the canvas).
4. The admin command palette (⌘K).

**Recipe:**
```
background:        rgba(surface-color, 0.62)      /* 0.72 in dark mode — needs more opacity to stay legible */
backdrop-filter:    blur(20px) saturate(140%)
border:             1px solid rgba(255,255,255,0.12)   /* rgba(255,255,255,0.08) in dark mode */
```
Never stack more than one glass layer. Never place body-copy-length text directly on a glass surface without a scrim beneath it first (contrast risk).

---

## 11. Button Styles

| Variant | Purpose | Agency treatment | Lumora treatment |
|---|---|---|---|
| **Primary** | Single most important action per view | Sharp rectangle, `radius-xs`, ink-fill/paper-text (light) or paper-fill/ink-text (dark), copper underline animates in on hover | Pill (`radius-full`), gold-fill, ink-text, soft lift + gold glow on hover |
| **Secondary** | Supporting action | Outline, 1px `border-strong`, transparent fill, fills with `bg-surface-raised` on hover | Outline pill, fills with `gold-100` on hover |
| **Ghost/Text** | Tertiary, inline actions | No border/fill; underline draws left-to-right on hover (signature Agency interaction) | No border/fill; label shifts 2px right + arrow icon slides in on hover |
| **Icon button** | Toolbar/utility actions | Square, `radius-xs`, 40×40px hit area | Circular, `radius-full`, 44×44px hit area |

**Sizing scale (shared):** `sm` 32px height / `md` 44px height (default, meets touch-target minimum) / `lg` 56px height (hero CTAs only).

**States (all variants):** `default → hover (150ms ease-out, see §25) → active (scale 0.98, 80ms) → focus-visible (2px accent ring, 2px offset) → disabled (40% opacity, no pointer events, no hover transform) → loading (label replaced by a brand-consistent spinner/progress dot, button width locked to prevent layout shift)`.

**Rule:** never more than one Primary button visible in the same viewport at once (enforces the "single most important action" principle).

---

## 12. Card Styles

| Card type | Structure | Agency | Lumora |
|---|---|---|---|
| **Case study card** | Full-bleed image, overline (client/industry), title, one-line summary | `radius-sm`, `elevation-0` at rest, image scales `1.0 → 1.04` on hover (600ms), no border | — |
| **Product card (PLP)** | Square product image (studio-lit, consistent crop), name, price, quick-add icon-button on hover | — | `radius-lg`, `elevation-1`, image gets a subtle `elevation-glow`-style backdrop on hover, price in `body-sm` medium weight |
| **Testimonial card** | Quote (serif, `heading-03`), attribution row (avatar, name, role) | `radius-xs`, `bg-surface-raised`, no shadow — flat, editorial | `radius-xl`, `elevation-2`, soft `gold-100` background tint |
| **Admin data card (KPI)** | Label (`overline`), value (`display-03` in sans, not serif), delta indicator | Shared, brand-neutral — admin never wears brand skin | Shared |

**Universal card rule:** a card is either **fully clickable** (whole surface is the hit target, cursor communicates it) or **has explicit internal actions** — never both ambiguously. Hover states use `transform`/`opacity`/`box-shadow` only (GPU-cheap, see §24).

---

## 13. Input Fields

- **Structure:** static label above field (never a placeholder-as-label pattern — placeholders are reserved for format hints, e.g. "you@brand.com").
- **Default:** 44px height, `radius-sm` (Agency) / `radius-md` (Lumora), 1px `border-subtle`, `bg-surface`.
- **Focus:** border transitions to `accent`, plus a 2px offset outer ring in `accent-subtle-bg` at 40% opacity — focus must be visible without relying on color alone (accessibility, see §29).
- **Error:** border → `danger`, helper text switches to `danger` with a leading inline icon; error message replaces helper text (never both shown stacked to avoid layout jump — reserve the space for helper text at all times so an error doesn't shift the layout).
- **Disabled:** `bg-surface-raised`, `text-muted`, no border color change on hover.
- **Textarea:** same rules, min-height 3 lines, resize vertical-only.
- **Select/Combobox:** shares the Dropdown panel spec (§16); trigger looks identical to a text input.
- **Checkbox/Radio:** custom-styled (never bare browser default), `radius-xs` for checkbox / `radius-full` for radio, checked state fills with `accent`, 200ms check-mark draw-in animation.
- **Switch:** pill track, thumb slides with a slight overshoot easing (`ease-luxury-out`, §25) — the one place a "bouncy" feeling is allowed, because it's a direct-manipulation toggle, not passive content motion.

---

## 14. Forms

- **Layout:** single-column by default (higher completion rates); two-column only for logically-paired short fields (First/Last name, City/Postal code) at `md`+ breakpoints, collapsing to one column below.
- **Multi-step pattern** (used by the lead-intake form): a slim progress indicator (segmented hairline bar, not a numbered stepper — quieter), one question-group per step, back/continue at the bottom, no step-skipping.
- **Validation timing:** validate on blur, not on every keystroke (keystroke-level validation feels punitive); re-validate on submit attempt.
- **Error summary:** on submit failure, focus moves to the first invalid field automatically; no top-of-form red banner listing every error (isolates one problem at a time, feels less punitive — consistent with the calm brand voice).
- **Submit button:** always full-width on mobile, auto-width on desktop; shows the `loading` button state (§11) during submission, never disables-then-hides (avoids the "did my click register?" moment).
- **Success state:** replaces the form with a confirmation message + illustration/motif (§21), not a toast alone — for a high-intent form like lead-intake, the confirmation deserves a real moment.

---

## 15. Navigation

**Agency site header:**
- Transparent over the hero; crossfades to a glass surface (§10) once scrolled past ~80% of the viewport height.
- Behavior: hides on scroll-down, reveals on scroll-up (content-first, doesn't fight reading) — except within the first 100px of a page, where it always stays visible.
- Desktop: horizontal wordmark-left, links-right, single Primary button ("Start a Project") always visible even when the rest of the bar hides (persists as a small floating pill).
- Mobile: hamburger opens a **full-screen overlay menu**, links reveal with a staggered upward fade (60ms stagger per item, §25) — a deliberate "Cuberto-style" moment of craft on an otherwise restrained site.

**Lumora Skin header:**
- Persistent (does not hide on scroll — commerce nav must stay reachable for cart access), solid porcelain background from the start, thin hairline bottom border.
- Includes a mega-menu on "Collections" (desktop): a glass-free flat panel, product-category imagery + text links, opens on hover with a 100ms intent-delay (prevents accidental triggers).
- Persistent cart icon shows a live count badge (§20 Badges); adding an item triggers a brief drawer slide-in (elevation-4).

**Shared conventions:** active nav-item state uses an underline (draws in, doesn't just appear), never a filled pill/background — keeps navigation typographically quiet.

---

## 16. Dropdowns

- **Trigger → panel:** panel anchors to the trigger, opens with a **fade + scale-from-98%** (120ms, `ease-editorial`), transform-origin set toward the trigger for a natural "grows from here" feel.
- **Panel style:** `bg-surface`, `elevation-3`, `radius-sm`(Agency)/`radius-md`(Lumora), 1px `border-subtle`, 8px internal padding, items at 40px height with 8px horizontal padding.
- **Item states:** hover/focus → `bg-surface-raised`; selected → leading checkmark, `accent` text.
- **Keyboard:** full arrow-key navigation, `Enter`/`Space` to select, `Esc` to close and return focus to the trigger — non-negotiable (§29).

---

## 17. Accordions

- Used for FAQ, ingredient breakdowns (Lumora PDP), and admin help panels.
- **Trigger row:** label + trailing icon (chevron for Agency, a plus/minus glyph for Lumora — softer, less technical), full row is the hit target.
- **Icon animation:** rotates 180°/cross-fades to minus over 200ms, synced with the panel expand.
- **Panel expand:** height animates via measured-content auto-height (not `max-height` magic numbers), 250ms `ease-editorial`, content fades in over the second half of the duration so text doesn't visibly "unfold."
- **Behavior:** independent by default (multiple open at once); single-open ("only one at a time") mode available per-instance for FAQ-style lists where that reads cleaner.

---

## 18. Modals

- **Scrim:** glass treatment (§10), `elevation` beneath handled by the scrim itself darkening the backdrop, not the modal panel needing extra shadow.
- **Panel entrance:** fade + scale-from-96% + 8px upward translate, 250ms `ease-luxury-out`; exit is the reverse at 180ms (exits are always faster than entrances — a system-wide motion rule, §25).
- **Sizing:** `sm` (confirmations, 400px), `md` (forms, 560px), `lg` (content-rich, e.g., a case-study lightbox gallery, 880px), `fullscreen` (mobile default for any modal ≥ `md`).
- **Focus trap:** mandatory — focus moves to the modal on open, cycles within it, returns to the trigger element on close. `Esc` closes unless the modal represents a destructive confirmation awaiting explicit choice (no accidental-Esc data loss).
- **Nesting:** modals never stack more than one deep; a second required interaction replaces the first modal's content in place rather than opening on top of it.

---

## 19. Tables

(Primarily an **admin console** concern — the public sites rarely show tabular data.)

- **Style:** hairline row dividers (`border-subtle`), no zebra striping (zebra reads as "generic admin template"; hairlines read as edited/precise, consistent with brand voice), sticky header on scroll.
- **Density:** default row height 48px; a "comfortable/compact" density toggle (40px/56px) available on data-heavy views (orders, leads).
- **Row hover:** `bg-surface-raised`, entire row clickable where a detail view exists; explicit row actions (menu, quick-status buttons) right-aligned and only rendered on hover/focus (keeps the resting table visually calm) — but always reachable via keyboard focus regardless of hover state (accessibility exception to the hover-only rule).
- **Sort:** column header click toggles asc/desc, small arrow indicator, one sort column at a time.
- **Empty/loading state:** skeleton rows (not a spinner) while loading; an on-brand empty-state illustration/message when a filter yields zero rows.

---

## 20. Badges

- **Shape:** `radius-full` pill, `caption`-scale text, 4px vertical / 10px horizontal padding.
- **Status badges** (leads, orders — semantic colors from §4.4, background = 12%-opacity tint of the status color, text = the full-strength status color — never a solid-fill loud badge):

```
New         → info tint       Paid        → success tint
Contacted   → neutral tint    Fulfilled   → success tint
Qualified   → accent tint     Refunded    → warning tint
Won         → success tint    Canceled    → neutral tint (strikethrough label)
Lost        → danger tint (muted, never alarming red)
```

- **Count badge** (cart icon, notifications): small solid-fill circle, `accent` background, sits top-right of its parent icon, animates in with a scale-pop (§25) on value change rather than snapping.

---

## 21. Icons

- **Library:** **Lucide** (matches the Shadcn UI primitive layer already chosen at the framework level) — consistent 24×24 grid, 1.5px stroke weight, rounded line caps.
- **Sizing scale:** `16px` (inline with `body-sm`/`caption` text), `20px` (default UI icon, inline with `body-md`), `24px` (standalone/toolbar icons), `32px`+ (feature/empty-state icons).
- **Color:** icons inherit `currentColor` — never hard-coded, so they always match the text they're paired with unless deliberately using `text-muted` for a secondary/utility icon.
- **Lumora-specific accent set:** a small custom set of **botanical line icons** (leaf, droplet, dawn/dusk sun, water-ripple) at the same 1.5px stroke weight as Lucide, used only for ingredient/benefit call-outs on the PDP — never mixed into the Agency site.
- **Rule:** icons never appear without an accessible label (visible text or `aria-label`) except in universally-understood, redundant-with-visible-context cases (a lone chevron next to a clearly-labeled accordion row).

---

## 22. Illustration Style

- **Agency site:** illustration is almost entirely absent by design — the brand is carried by type and real project photography. Where an abstract graphic is unavoidable (e.g., a 404 page, an empty-state), use **fine hairline geometric line-art** (single 1px stroke, no fill, monochrome) echoing the grid motif — never a colorful/cute illustration style.
- **Lumora Skin:** **minimal botanical line illustrations** (single-weight ink line, no shading) for ingredient diagrams and journal-content spot art — think apothecary field-guide sketches, not cartoon icons. Always monochrome (`neutral-700`/`neutral-900`), never full-color illustration, so illustration never competes with product photography for attention.
- **Universal rule:** illustration is diagrammatic/explanatory (this is how the ingredient works) or wayfinding (empty states, errors) — never purely decorative filler.

---

## 23. Photography Style

**Agency (case studies, team, process):**
- High-contrast, mostly **black-and-white or heavily desaturated** process/behind-the-scenes photography, color reserved for actual client-work screenshots.
- Client work is shown in **realistic context frames** (browser chrome, device mockups with true shadows/reflections, not flat cropped screenshots) to communicate real, shipped craftsmanship.
- Team/about photography: natural light, candid-over-posed, consistent single-color-cast grade across all team photos for cohesion.

**Lumora Skin (product, editorial, model):**
- **Studio-lit product photography**, soft single-key light with a gentle fill, consistent seamless backdrop color-matched per collection (not always white — a warm porcelain or clay backdrop per product line).
- **Macro texture shots** of product/skin/serum droplet as recurring content motif (used in journal content, ingredient sections) — tactile, sensory, never sterile.
- **Model photography direction:** diverse skin tones, natural skin texture visible (pores, fine lines) — deliberately *not* airbrushed to plastic, consistent with Rhode/Aesop-style authentic-luxury positioning. Minimal/no visible makeup in skincare-context shots.
- **Color grade:** warm, slightly desaturated highlights, lifted (not crushed) blacks — one consistent LUT-equivalent applied across all photography so the brand feels shot by one photographer even when assets come from multiple shoots.

---

## 24. 3D Style

(Applies to the Lumora Skin hero and product-viewer scenes — the agency's core visual proof-point, built in React Three Fiber + Drei.)

- **Rendering approach:** physically-based materials only (`MeshPhysicalMaterial`) — matte ceramic caps, brushed-metal accents, and tinted glass with real fresnel/transmission, never flat-shaded/toon materials.
- **Lighting:** soft three-point studio lighting rig (key + fill + rim), an HDRI environment map (via Drei `<Environment>`) for realistic reflections, matching the warm color grade of the photography (§23) so 3D and photographed product never feel like two different products.
- **Camera behavior:** slow, deliberate moves only — a gentle orbit/drift at rest, scroll-scrubbed rotation tied 1:1 to scroll position on entry (via GSAP ScrollTrigger, see §25) so the object feels *controlled by the user's scroll*, not auto-playing at them. No spinning, no camera shake, no chaotic particle bursts.
- **Materials palette:** matches the brand's physical product design — matte "biolumina gold" cap, frosted/tinted glass body in tones drawn directly from the Lumora palette (§4.3), soft contact shadow beneath (Drei `<ContactShadows>`), never a hard-edged drop shadow.
- **Performance discipline:** capped device-pixel-ratio (max 2), draco-compressed models, automatic quality step-down (shadow resolution, environment map fidelity) on detected low-end GPUs, and a static high-quality poster-image fallback for `prefers-reduced-motion` or WebGL-unavailable contexts — the 3D scene must never be a hard requirement for experiencing the product.
- **Agency site 3D (used sparingly, if at all):** if a 3D element appears on the agency's own site, it is **abstract, not literal** — a slow-moving monochrome metaball/fluid field or grain-textured gradient mesh behind the hero headline, never a literal 3D object, to keep the agency site's restraint intact (the literal, materially-rich 3D is Lumora Skin's signature, not the agency's).

---

## 25. Animation Principles

**Timing tokens** (shared vocabulary across Framer Motion, GSAP, and CSS transitions — the single most important consistency mechanism in this system):

```
duration-instant   100ms   micro state changes (checkbox check, icon toggle)
duration-fast      150ms   hover states, button feedback
duration-base      250ms   default UI transition (dropdown, accordion, modal panel)
duration-slow      400ms   larger surface changes (drawer, page-section reveal)
duration-cinematic 600–900ms   hero reveals, image scale-ins
duration-narrative 1200–2000ms scroll-scrubbed sequences (duration is scroll-distance-driven, this is a reference range, not literal ms)
```

**Easing tokens:**

```
ease-standard    cubic-bezier(0.4, 0, 0.2, 1)     general-purpose UI (Material-equivalent, used for simple fades)
ease-editorial   cubic-bezier(0.65, 0, 0.35, 1)     symmetric ease-in-out, used for accordions/panel-size changes
ease-luxury-out  cubic-bezier(0.16, 1, 0.3, 1)      expo-out — the signature "settles in with confidence" curve for entrances, modals, hero reveals
ease-luxury-in   cubic-bezier(0.7, 0, 0.84, 0)      expo-in — used for exits (always paired with a shorter duration than the matching entrance)
```

**Core principles:**
1. **Exits are faster than entrances.** An element should arrive with presence and leave without ceremony (roughly 60–70% of the entrance duration).
2. **Only animate `transform` and `opacity`** for anything running during scroll or on lower-end devices — never animate `width`/`height`/`top`/`left`/box-shadow-spread directly in a scroll-driven or high-frequency context (GPU compositing only, 60fps non-negotiable).
3. **Stagger reveals in groups of related content** (nav items, grid cards entering viewport) at **60–80ms** per item, capped at 6–8 items staggered before switching to a single group fade (avoids a 2-second cascading wait on long lists).
4. **One motion idea per element.** An element that fades in doesn't also scale, rotate, *and* blur on entrance — pick one or two complementary properties (fade+translateY is the default combination system-wide).
5. **Scroll-driven motion is choreographed at the macro level only** (hero narrative sequences, pinned sections) — it is never used for routine content reveal (a blog paragraph fading in on scroll is a cliché this system explicitly avoids; simple content uses a single subtle fade-up on viewport entry, once, not a scrubbed effect).
6. **`prefers-reduced-motion` is a hard requirement, not an enhancement.** Every scroll-scrubbed, autoplaying, or parallax effect has a defined static/reduced equivalent (see §29) — this is checked in code review, not left to chance.

---

## 26. Micro-interaction Guidelines

- **Custom cursor (Agency site, desktop only):** a small dot follows the pointer with a slight lag (spring physics, not 1:1), enlarges and inverts color over interactive elements ("magnetic" targets — buttons/links pull the cursor a few px toward their center on proximity). Disabled entirely on touch devices and under `prefers-reduced-motion`; always paired with a normal visible focus state for keyboard users, since the cursor effect is a bonus, not the only affordance.
- **Link underline draw:** text links draw an underline left-to-right on hover (`transform: scaleX` from a `0` origin, 200ms `ease-standard`) rather than a color change alone — reinforces the typographic-first brand voice.
- **Image reveal on scroll:** first appearance of a large image uses a single clip-path wipe (not a fade+scale combo) — a deliberate, one-time "reveal" moment per image, never repeated on re-scroll.
- **Add-to-bag (Lumora):** product thumbnail animates along a curved path into the cart icon (250ms `ease-luxury-out`), cart badge count-pops on arrival — the single most "delightful" sanctioned micro-interaction in the system, used exactly once per add-action (no confetti, no additional toast on top of it).
- **Form field focus:** label (if using a floating-label variant in a dense admin form) lifts and shrinks in 150ms; border/ring transitions match §13.
- **Page transitions:** cross-fade + 12px vertical settle between routes (View Transitions API where supported, graceful fallback to a plain fast cross-fade elsewhere) — deliberately subtle; this system does not do full Locomotive/Barba-style curtain-wipe page transitions site-wide, reserving that level of choreography for the Lumora hero entrance specifically, so it stays special rather than becoming wallpaper.
- **Toasts/notifications:** slide up from bottom-right (or bottom-center on mobile), `elevation-4`, auto-dismiss 4s unless it demands action, max one visible at a time (queue, don't stack).

---

## 27. Dark Theme

| Token | Agency (default theme) | Lumora Skin (secondary "boutique-at-night" mode) |
|---|---|---|
| `bg-canvas` | `neutral-950` #0F0C09 | `#171B15` (near-black, sage-shifted, not warm-brown — reads as "evening," distinct from Agency's dark) |
| `bg-surface` | `neutral-900` #1C1712 | `#1F241D` |
| `text-primary` | `neutral-25` #FCFBF9 | `neutral-25` #FCFBF9 |
| `accent` | `copper-400` #C17F42 (lightened for dark contrast) | `gold-300` #E3C68F |
| Imagery treatment | Photography unchanged; UI chrome recedes around it | Product photography gets a subtle dark vignette in surrounding UI so shots lit for daylight porcelain backdrops don't look washed out against near-black |
| Shadow | Standard elevation scale ×1.6 opacity (§9) | Same, plus optional `elevation-glow` (gold) under hero product only |

Dark mode is a **first-class, fully designed state for both brands** — never an auto-inverted afterthought. Every semantic token in §4.5 has an explicit dark value; nothing is computed via CSS `filter: invert()` or naive opacity tricks.

---

## 28. Light Theme

| Token | Agency (secondary theme) | Lumora Skin (default theme) |
|---|---|---|
| `bg-canvas` | `neutral-25` #FCFBF9 | Porcelain-shifted `#FBF7F1` (warmer than the shared neutral-25, mixed 4% with `gold-100`) |
| `bg-surface` | `neutral-0` #FFFFFF | `neutral-0` #FFFFFF |
| `text-primary` | `neutral-900` #1C1712 | `neutral-900` |
| `accent` | `copper-500` #A8632B | `gold-500` #C9A15C |
| Imagery treatment | Full-bleed, high contrast against pure white/near-white | Soft, sits naturally against the warm porcelain canvas — no harsh white product cutouts |

**Theme switching mechanics:** a single `data-theme="light"|"dark"` attribute (persisted via `prefers-color-scheme` on first visit, user-overridable, stored in `localStorage`) drives all CSS-variable resolution; `data-brand="agency"|"lumora"` is independent and orthogonal, so all four combinations (Agency-Light, Agency-Dark, Lumora-Light, Lumora-Dark) are valid, tested states — not just the two "default" pairings.

---

## 29. Accessibility Guidelines

Non-negotiable, checked in code review and CI (automated axe-core scan + manual pass), not a post-launch retrofit:

- **Contrast:** minimum **4.5:1** for body text, **3:1** for large text (≥24px or 19px bold) and meaningful UI icons/borders, against every background token in every theme combination in §27–28 — including text set over photography, which must sit on a scrim if the underlying image contrast is unpredictable.
- **Focus visibility:** every interactive element has a visible `focus-visible` state (2px `accent` ring, 2px offset) — never `outline: none` without a replacement. The custom cursor (§26) is decorative and never the sole focus indicator.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables all scroll-scrubbed/parallax/autoplaying motion and the magnetic cursor; content still reveals (instantly or via a single simple fade), nothing is ever permanently hidden by a motion trigger that never fires.
- **Touch targets:** minimum **44×44px** hit area on every interactive element, even where the visual element (an icon) is smaller — achieved via padding, not by inflating the visual.
- **Color independence:** status/semantic meaning is never conveyed by color alone — badges carry text labels, error states carry icon + text, chart/data-viz (admin) uses pattern or direct labeling alongside color.
- **Keyboard completeness:** every interaction reachable by mouse/touch (dropdowns, accordions, modals, the 3D product viewer's rotate/zoom controls, drag-to-reorder in the admin content editor) has a keyboard equivalent — the 3D viewer specifically ships arrow-key rotate and +/- zoom as a mandatory alternative to drag/scroll gestures.
- **Semantic structure:** one `<h1>` per page, heading levels never skipped for visual-size reasons (use a type-scale token + a lower heading level instead), landmark regions (`nav`, `main`, `footer`) present on every template, a "skip to content" link precedes the nav on every page.
- **Forms:** every input has a programmatically associated `<label>` (never placeholder-only), errors are announced via `aria-live`, required fields are marked both visually and via `aria-required`.
- **Alt text:** decorative images (`alt=""`) vs. meaningful images (descriptive `alt`) are explicitly distinguished at the CMS content-block level (§18 of the architecture doc's `ContentBlock` schema) — never left to a content editor's memory.

---

## 30. Responsive Rules

- **Mobile-first authoring** — every component's base CSS is its mobile state; breakpoints only add, never override-and-undo.
- **Fluid type/spacing over breakpoint-jumping** where possible (`clamp()`-based tokens per §3/§5) — most text and macro spacing scales continuously; only structural properties (column count, nav pattern, sidebar presence) snap at hard breakpoints.
- **No hover-only affordances.** Any interaction revealed on `:hover` on desktop (row actions in a table, a card's quick-add button) must have a tap-visible or always-visible equivalent on touch — detected via a `(hover: hover) and (pointer: fine)` media query, not user-agent sniffing.
- **Container queries** (not just viewport breakpoints) drive internal card/component layout where a component appears in variable-width contexts (e.g., a product card in a 3-col grid vs. a 1-col mobile list) — the card decides its own internal layout based on its own available width.
- **Safe-area insets** (`env(safe-area-inset-*)`) respected on all fixed/sticky elements (bottom cart bar, mobile nav) for notched/gesture-bar devices.
- **Orientation:** the Lumora 3D hero canvas re-frames (not just re-scales) on orientation change so the product remains centered and fully visible rather than cropped.
- **Testing matrix:** every template is checked at 375px, 768px, 1024px, 1440px, and 1920px minimum before sign-off.

---

## 31. Component Naming

**File/React component naming** (aligns with the folder structure defined in the architecture document, §11):

- **PascalCase** component names, domain-prefixed by folder rather than by name string — i.e., `components/marketing/Hero.tsx`, `components/lumora/ProductCard.tsx`, `components/admin/DataTable.tsx`, `components/ui/Button.tsx` — folder is the namespace, so component names themselves stay clean (`Hero`, not `MktHero`).
- **Shared primitives** (`components/ui`) are named after the Shadcn/Radix convention they extend (`Button`, `Dialog`, `Select`, `Accordion`) so they're instantly recognizable to any engineer familiar with that ecosystem.
- **Brand-specific variants of a shared primitive** compose rather than fork: `<Button variant="primary" brand="lumora" />` reads brand context from the nearest `data-brand` ancestor automatically in practice — the `brand` prop is only ever needed for Storybook isolation, never passed manually in application code.

**CSS/token naming:**
- Design tokens as CSS custom properties use **kebab-case, category-first** naming: `--color-bg-surface`, `--space-6`, `--radius-lg`, `--shadow-elevation-3`, `--ease-luxury-out`, `--duration-base`, `--font-display`, `--font-ui` (see full token architecture in §32).
- Component-level state is expressed via **`data-*` attributes**, not modifier classes — `data-state="open|closed"`, `data-variant="primary|secondary|ghost"`, `data-brand="agency|lumora"`, `data-theme="light|dark"` — this is the Radix/Shadcn-native convention and keeps Tailwind class lists free of bespoke BEM modifiers.
- Tailwind utility application follows a fixed class-order convention (layout → box model → typography → color → effects → state-variants) enforced by `prettier-plugin-tailwindcss` — not a naming rule per se, but a consistency rule that keeps every component's `className` readable.

---

## 32. Token System

**Three-tier architecture** (industry-standard primitive → semantic → component, made concrete for this stack):

```
Tier 1 — Primitive tokens        raw values, brand-agnostic where possible
  --neutral-500: #7A6E5C;
  --copper-500: #A8632B;
  --gold-500: #C9A15C;
  --space-6: 24px;
  --radius-lg: 12px;
  --duration-base: 250ms;
  --ease-luxury-out: cubic-bezier(0.16, 1, 0.3, 1);

Tier 2 — Semantic tokens         meaning-based, resolve differently per data-brand/data-theme
  --color-bg-canvas: var(--neutral-25);          /* Agency Light */
  --color-bg-canvas: var(--neutral-950);         /* Agency Dark */
  --color-accent: var(--copper-500);             /* Agency */
  --color-accent: var(--gold-500);               /* Lumora */
  --radius-button: var(--radius-xs);             /* Agency */
  --radius-button: var(--radius-full);           /* Lumora */

Tier 3 — Component tokens        component-scoped, resolve from semantic tier only
  --button-bg: var(--color-accent);
  --button-radius: var(--radius-button);
  --card-shadow: var(--shadow-elevation-1);
  --input-focus-ring: var(--color-accent-subtle-bg);
```

**Mechanics:**
- Tier 1 lives in a single generated token file (source of truth authored in a design-tokens format — e.g., Style Dictionary/Tokens Studio JSON — exported to both CSS custom properties *and* the Tailwind theme config, so Figma and code never drift).
- Tier 2 resolution happens via CSS attribute selectors: `[data-brand="lumora"][data-theme="light"] { --color-accent: var(--gold-500); ... }` — a finite, fully-enumerated matrix of the four brand×theme combinations, each a short, reviewable block.
- Tier 3 (component tokens) is what components actually reference in their styles — **a component never reads a Tier 1 primitive directly.** This is the rule that makes re-theming (or adding a third brand expression later, e.g., for a second flagship case study) an additive change, not a find-and-replace across the codebase.
- Tailwind's theme is extended (not overridden) to expose every Tier 1/2 token as a utility (`bg-canvas`, `text-primary`, `rounded-button`, `shadow-elevation-2`, `duration-base`, `ease-luxury-out`) so utility classes and design tokens are the same vocabulary, never two parallel systems.

---

## 33. Motion Design Guidelines

**Division of responsibility across the three motion libraries** (from the architecture doc's stack) — this is the rule that keeps GSAP, Framer Motion, and R3F from fighting over the same elements:

| Tool | Owns | Never used for |
|---|---|---|
| **Framer Motion** | Component-state-driven motion: hover/press/focus feedback, enter/exit of components that mount/unmount (modals, dropdowns, toasts), layout animations (`layout` prop) for reflowing lists | Long scroll-scrubbed timelines, pinned sections |
| **GSAP + ScrollTrigger** | Scroll-position-driven choreography: pinned/cinematic hero sequences, scrubbed reveals tied to scroll distance, cross-component timeline sequencing (e.g., text and 3D camera moving in lockstep) | Simple component enter/exit that has no relationship to scroll position |
| **Lenis** | Global smooth-scroll physics substrate underneath everything — normalizes wheel/touch scroll so GSAP ScrollTrigger's scroll-position math and R3F's per-frame scroll-driven updates stay perfectly synced across browsers/devices | Any discrete/triggered animation — it only ever smooths continuous scroll, never animates a component itself |
| **React Three Fiber / Drei** | Ambient/idle 3D motion (slow orbit, breathing scale) and scroll-driven 3D transforms (camera/object position mapped from Lenis-normalized scroll progress passed in as a prop) | UI chrome motion — 3D never animates buttons/text; those stay in the DOM/Framer Motion layer |

**Shared vocabulary rule:** all four tools consume the **same duration/easing tokens** from §25/§32 (GSAP timelines reference the same `cubic-bezier` values as Framer Motion's `transition.ease`, R3F lerp factors are tuned to feel consistent with the same curves) — so a user can't perceive a "seam" between a GSAP-driven hero and a Framer-Motion-driven button even though two different engines are running them.

**Performance budget:** 60fps is the pass/fail bar for every animated sequence, verified via Chrome DevTools Performance trace on a mid-tier device profile before any motion-heavy feature ships — a beautiful animation that drops frames is, by this system's standard, a bug, not a trade-off.

**Choreography hierarchy (macro → micro):**
1. **Page-level narrative** (GSAP): the story a hero section tells as you scroll through it once.
2. **Section-level reveal** (Framer Motion, triggered once on viewport entry): individual content blocks arriving.
3. **Component-level feedback** (Framer Motion + CSS transitions): the thousand small hover/focus/press responses that make the UI feel alive under direct manipulation.
4. **Ambient/idle** (R3F): motion that exists even when the user does nothing — kept extremely subtle (a multi-second slow drift) so it reads as "alive," not "distracting."

Every animation in the product should be traceable to exactly one of these four tiers — an animation that doesn't fit any tier is the signal to cut it, per the restraint principle in §1.
