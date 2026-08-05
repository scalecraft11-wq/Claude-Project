# Lumora Digital — Agency Portfolio Platform
## Enterprise Architecture Document (v1.0)

**Prepared as:** Principal Architecture Review
**Scope:** Agency portfolio website + "Lumora Skin" flagship interactive case study
**Status:** Pre-development — architecture sign-off document. No code has been written against this spec yet.

---

## 0. Document Purpose

This document is the single source of truth for how the platform is designed, before a line of application code is written. It defines *what* we are building, *why*, *for whom*, and the concrete technical decisions required to build it correctly the first time, at a quality bar consistent with luxury/premium brand work, and in a way that scales operationally (traffic, content, team size) without a rewrite.

Everything downstream — sprint planning, ticket breakdown, component libraries — should trace back to a section in this document.

---

## 1. Project Goals

1. **Prove the agency's capability, not just describe it.** The site itself must be the best example of the agency's work. Visitors judge the agency by the site's motion, performance, and polish before reading a single word of copy.
2. **Convert visits into qualified leads.** The site exists to generate discovery calls and signed proposals from luxury/premium brands (skincare, beauty, cosmetics, fashion, healthcare, wellness).
3. **Showcase a flagship, fully-functional case study — "Lumora Skin."** Not static mockups. A real, interactive, purchasable-flow demo of a luxury skincare e-commerce experience, built on the same production-grade stack the agency sells to clients (3D product visualization, cinematic scroll, real checkout flow).
4. **Operate as a real product, not a brochure.** Content (case studies, blog, testimonials) is managed through an admin CMS, leads flow into a real pipeline, and the whole system is instrumented, secured, and deployable like any SaaS product — because prospective clients will judge the agency's engineering rigor by how the agency runs its own house.
5. **Be rebuildable and reusable.** The component system, 3D pipeline, and design tokens built for Lumora Skin become the agency's reusable "premium site" starter kit for future client work.

---

## 2. Business Objectives

| Objective | Metric | Target (Year 1) |
|---|---|---|
| Generate qualified inbound leads | Discovery-call bookings/month | 15+ |
| Demonstrate technical credibility | Avg. session on Lumora Skin case study | > 3 min |
| Improve conversion of case-study viewers to leads | Case study → Contact form conversion | > 4% |
| Rank for high-intent search terms | "luxury skincare web design agency" top-10 ranking | Within 6 months |
| Reduce sales-cycle friction | % of leads pre-qualified via intake form (budget/timeline) | > 60% |
| Operational credibility | Core Web Vitals "Good" rating | 100% of key pages |
| Content velocity | Time for non-technical staff to publish a new case study | < 15 minutes, no dev involved |

**Non-goals (explicitly out of scope for v1):** Lumora Skin is a demo storefront, not a real merchant. It will use Stripe in **test mode** with a small curated product catalog whose purpose is to demonstrate UX, checkout, and admin flows — not to run a real skincare business. This shapes several decisions below (no real fulfillment/shipping integration, no tax engine, no real inventory supplier feed).

---

## 3. User Personas

### 3.1 Primary — "Elena," Brand/Marketing Director at a luxury skincare brand (Buyer persona)
- Mandate to relaunch or elevate the brand's DTC site.
- Non-technical, highly visual, brand-guideline-driven, risk-averse about vendor choice.
- Evaluates agencies by portfolio quality and case-study depth, not by feature checklists.
- Needs: proof of luxury-tier craft, proof of e-commerce competence, easy way to start a conversation.

### 3.2 Secondary — "Marcus," Founder/CEO of an early-growth D2C wellness brand (Buyer persona)
- Budget-conscious but ambitious; wants "the site that makes us look bigger than we are."
- Cares about performance, SEO, and time-to-launch as much as visuals.
- Needs: transparent process/pricing signals, fast-loading proof, direct contact path.

### 3.3 Tertiary — "Priya," Creative Director at another agency (Referral/partnership persona)
- Benchmarking competitor craft; potential subcontracting/partnership lead.
- Needs: technical depth (how was that 3D scene built?), credit/attribution, contact for partnerships.

### 3.4 Internal — "Sam," Agency Content/Ops Manager (Admin user persona)
- Publishes new case studies, updates testimonials, manages the blog, triages contact-form leads.
- Not a developer. Needs a clean, fast, mistake-proof CMS with drafts/preview.

### 3.5 Internal — "Dana," Agency Principal/Owner (Admin/Owner persona)
- Needs the lead pipeline, analytics, and full admin control including user/role management and Stripe test-mode order visibility for the Lumora Skin demo.

### 3.6 Demo end-user — "Casey," a visitor experiencing the Lumora Skin storefront as a shopper (Persona-within-a-persona)
- Not a real customer — a stand-in the agency designs for. Needs the demo to *feel* like a real premium skincare checkout: product story, ingredients, 3D bottle exploration, cart, guest checkout via Stripe test mode, order confirmation email.

---

## 4. Customer Journey

### 4.1 Agency site journey (Elena/Marcus)
```
Discover (Google / referral / social)
   → Land on Home (hero motion, credibility signals)
   → Explore Work (grid of case studies)
   → Open "Lumora Skin" flagship case study
   → Read narrative (problem → process → outcome) + play with live embedded demo
   → View Services / Process page (build confidence in methodology)
   → View About (team, philosophy) — trust
   → Contact / Start a Project (qualification form: brand, budget band, timeline, goals)
   → Receive instant confirmation email (Resend) + calendar link
   → [Admin] Lead appears in Admin Dashboard → Sam/Dana triage → discovery call booked
```

### 4.2 Lumora Skin demo journey (Casey, nested inside the case study)
```
Enter Lumora Skin experience (own subdomain-feel route, distinct branding)
   → Cinematic hero (R3F 3D serum bottle, scroll-scrubbed via GSAP + Lenis)
   → Browse collection (PLP: filters, sort)
   → Product detail (PDP: 3D product viewer via Drei, ingredients, reviews)
   → Add to bag → Mini-cart
   → Checkout (Stripe Checkout / Elements, test mode, guest or account)
   → Order confirmation page + transactional email (Resend)
   → Optional: create account (NextAuth) → Order history
```

### 4.3 Admin journey (Sam/Dana)
```
Login (NextAuth, credentials + optional OAuth) → role-checked redirect
   → Dashboard (leads KPI, recent orders on Lumora demo, content status)
   → Content: create/edit Case Study (rich content blocks, Cloudinary media, SEO fields, draft/preview/publish)
   → Leads: view/filter/export/assign/mark-status
   → Lumora Demo Admin: products, inventory (demo), orders (test mode), discount codes
   → Settings: users & roles, site settings, redirects
```

---

## 5. Information Architecture

**Top-level domains of the system (logical, not necessarily subdomains):**

1. **Marketing site** — public, SEO-critical, mostly static/ISR.
2. **Lumora Skin experience** — public, interactive, e-commerce demo, its own visual system nested under the agency's domain (`/work/lumora-skin` marketing entry point, full experience at `/lumora`).
3. **Admin console** — private, authenticated, role-gated (`/admin`).
4. **Auth** — shared across the above where needed (`/login`, demo account flows under `/lumora/account`).
5. **API layer** — Next.js Route Handlers backing all of the above, plus webhooks (Stripe, Resend).

**Content model separation:** Agency content (case studies, blog, testimonials, team) is modeled distinctly from Lumora Skin commerce content (products, collections, orders) — different Prisma models, different admin sections — even though both live in one database, because they have fundamentally different lifecycles and access patterns.

---

## 6. Sitemap

```
/                                  Home
/work                              Case study index (portfolio grid)
/work/lumora-skin                  Flagship case study (narrative + embedded live demo + results)
/work/[slug]                       Other case studies
/services                          Services offered
/services/[slug]                   Service detail (e.g., /services/ecommerce-development)
/process                           Agency methodology
/about                             Team, philosophy, values
/blog                              Insights/blog index
/blog/[slug]                       Blog post
/contact                           Start a project (lead intake form)
/legal/privacy                     Privacy policy
/legal/terms                       Terms of service

/lumora                            Lumora Skin experience home (immersive hero)
/lumora/collections                All products
/lumora/collections/[collection]   Collection (e.g., renewal-serum, night-recovery)
/lumora/products/[slug]            Product detail page
/lumora/bag                        Cart
/lumora/checkout                   Checkout
/lumora/checkout/success           Order confirmation
/lumora/account                    Demo account (order history) — optional auth
/lumora/account/orders/[id]        Order detail
/lumora/journal                    Brand editorial/journal (skincare content, showcases CMS reuse)
/lumora/journal/[slug]

/login                             Admin/account login
/admin                             Admin dashboard (role-gated)
/admin/leads                       Lead inbox
/admin/leads/[id]
/admin/content/case-studies
/admin/content/case-studies/[id]
/admin/content/blog
/admin/content/blog/[id]
/admin/content/testimonials
/admin/lumora/products
/admin/lumora/products/[id]
/admin/lumora/orders
/admin/lumora/orders/[id]
/admin/lumora/discounts
/admin/users
/admin/settings

/api/*                             Route Handlers (see §16)
```

---

## 7. Feature List

**Marketing site**
- Cinematic, scroll-driven home page (GSAP + Lenis + Framer Motion micro-interactions).
- Case study system with rich content blocks (image, video, before/after, embedded 3D demo, metrics/results block).
- Blog/insights with categories and tags.
- Lead-qualification contact form (multi-step: project type, budget band, timeline, brand links).
- Testimonials, team bios, service pages.
- Global command-palette style search (⌘K) across case studies + blog.
- Full SEO layer (see §23), sitemap.xml/robots.txt generation, OG image generation.
- Newsletter signup (Resend Audiences/Broadcasts).

**Lumora Skin flagship demo**
- Immersive 3D hero (React Three Fiber + Drei: rotating serum bottle/droplet scene, scroll-scrubbed).
- Product listing with filters (skin concern, collection, price) and sort.
- Product detail with 3D/interactive product viewer, ingredient breakdown, reviews (seeded/demo data).
- Cart (persisted, guest-friendly) and real Stripe Checkout (test mode) with promo codes.
- Order confirmation + transactional email receipt.
- Optional lightweight account system (order history) via NextAuth.
- Editorial "Journal" content reusing the same CMS content-block engine as the agency blog.

**Admin console**
- Role-gated dashboard: KPIs (leads this month, conversion rate, demo GMV, top content).
- CMS for case studies/blog/testimonials with draft → preview → publish workflow, rich block editor, Cloudinary asset picker/uploader.
- Lead inbox: filter, search, status pipeline (New → Contacted → Qualified → Won/Lost), notes, CSV export.
- Lumora Skin commerce admin: products/variants/inventory (demo-scale), orders, refunds (test mode), discount codes.
- User & role management (Owner, Admin, Editor, Viewer).
- Audit log of admin actions.
- Site settings (contact routing email, feature flags, redirect manager).

**Platform-wide**
- Global search (Postgres full-text initially; see §22).
- Dark-mode-aware theming for the agency site (Lumora Skin keeps its own fixed premium palette, deliberately not user-themeable, since brand consistency matters more than user preference for a luxury commerce demo).
- Accessibility (WCAG 2.1 AA) despite heavy motion — respects `prefers-reduced-motion`.
- Analytics + funnel tracking; consent-aware (cookie banner, GDPR/CCPA-ready).

---

## 8. Functional Requirements

**FR-1** Users can browse all public marketing and Lumora Skin routes without authentication.
**FR-2** Users can submit the contact/lead form; submission is validated server-side, persisted, and triggers a confirmation email and (async) a lead-created notification to the agency team.
**FR-3** Users can browse Lumora Skin products, add to cart, and complete a Stripe test-mode checkout without creating an account.
**FR-4** Users may optionally create a Lumora Skin demo account to view past demo orders.
**FR-5** Admin users can authenticate and, based on role, access CMS/leads/commerce/user-management sections.
**FR-6** Editors can create/edit/preview/publish/unpublish/archive content (case studies, blog posts, testimonials) without developer involvement.
**FR-7** Admins can manage Lumora Skin products, variants, prices, images, and inventory counts, and view/refund (test-mode) orders.
**FR-8** The system sends transactional emails (lead confirmation, order confirmation, password reset, admin invite) via Resend, and supports a newsletter signup.
**FR-9** All uploaded media (case study images/video, product images) is processed and served through Cloudinary with responsive, optimized variants.
**FR-10** Site content is searchable (case studies + blog) via a unified search UI.
**FR-11** All admin mutations are attributable to a user and recorded in an audit log.
**FR-12** Stripe webhooks reliably update order status even if the client never returns to the success page.

---

## 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | LCP < 2.0s, INP < 200ms, CLS < 0.1 on 4G/mid-tier mobile, for all marketing + Lumora Skin pages (Core Web Vitals "Good"). |
| Availability | 99.9% uptime target for public site (Vercel edge + managed Postgres with failover). |
| Scalability | Must handle traffic spikes (press coverage, launch day) — target 10k concurrent sessions without degradation, via ISR/edge caching, not brute compute. |
| Accessibility | WCAG 2.1 AA; full keyboard navigation; motion respects `prefers-reduced-motion`. |
| Security | OWASP ASVS L2 baseline; no plaintext secrets; signed webhooks only; RBAC enforced server-side, never client-only. |
| SEO | 100% of public pages server-rendered/pre-rendered with full metadata; Core Web Vitals as a ranking input treated as a hard requirement, not an afterthought. |
| Maintainability | Strict TypeScript, no `any` in application code, enforced via CI; component library documented via Storybook (roadmap Phase 3). |
| Internationalization | English-only for v1; architecture must not preclude i18n later (no hard-coded copy in components beyond acceptable MVP scope; content model supports locale field for future use). |
| Data privacy | GDPR/CCPA-aware consent for analytics/marketing cookies; lead data deletable on request. |
| Auditability | Every admin write operation logged with actor, timestamp, before/after diff where feasible. |

---

## 10. Tech Stack Justification

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Unifies marketing (SSG/ISR), commerce (dynamic/SSR), and admin (fully dynamic) rendering modes in one app; React Server Components cut client JS for content-heavy marketing pages while still allowing rich client interactivity where it matters (3D, cart, checkout). Native Route Handlers remove the need for a separate API service at this scale. |
| UI runtime | **React 19** | Server Components + Actions reduce client-side data-fetching boilerplate for forms (lead intake, admin CRUD) and pair natively with Next.js 15's data model. |
| Language | **TypeScript (strict)** | Non-negotiable for a system with a real schema, payments, and an admin console — correctness at the boundaries (Prisma types end-to-end) prevents an entire class of production bugs. |
| Styling | **Tailwind CSS** | Utility-first velocity without fighting a global CSS architecture across three visually distinct sub-systems (agency brand, Lumora brand, admin UI). |
| Component primitives | **Shadcn UI** | Unstyled, accessible Radix-based primitives that are copied into the repo (not an opaque dependency) — critical because the agency needs to heavily re-skin components per brand (agency vs. Lumora) without fighting a component library's own theme system. Used primarily for admin UI + form primitives; marketing/Lumora surfaces are custom-styled on top of the same primitives for accessibility (focus traps, dialogs, popovers) without reinventing them. |
| 2D motion | **Framer Motion** | Declarative, React-native animation for UI-level micro-interactions (page transitions, hover states, staggered reveals, cart drawer) where React state should drive the animation. |
| Timeline/scroll choreography | **GSAP (+ ScrollTrigger)** | Best-in-class for complex, scrubbed, timeline-based sequences (hero scroll narrative, pinned sections) that are awkward to express in Framer Motion's declarative model. Framer Motion handles component-state-driven motion; GSAP handles cinematic, scroll-position-driven sequences. Clear division of responsibility avoids two animation engines fighting over the same elements. |
| 3D | **Three.js + React Three Fiber + Drei** | R3F lets the 3D scene (Lumora Skin hero bottle, product viewer) be authored as React components, sharing state with the rest of the app (cart, theme, scroll progress) instead of a walled-off imperative Three.js scene. Drei supplies production-ready helpers (`<Environment>`, `<ContactShadows>`, `<Float>`, loaders) so the team isn't rebuilding primitives. This is the single most important visual differentiator the agency is selling — it deserves first-class, dedicated tooling rather than a CSS/SVG approximation. |
| Smooth scroll | **Lenis** | Normalizes scroll physics across browsers/devices so GSAP ScrollTrigger and R3F scroll-driven scenes stay perfectly in sync — without Lenis, scrubbed animations feel janky on the very pages meant to prove the agency's craft. |
| ORM | **Prisma** | Type-safe schema-to-TypeScript pipeline across three data domains (agency CMS, leads, Lumora commerce); migrations are reviewable, versioned, and safe for a solo/small team to run confidently. |
| Database | **PostgreSQL** | Relational integrity matters here (orders ↔ line items ↔ products, leads ↔ status history, content ↔ authors ↔ revisions). JSONB support covers flexible content-block bodies without a separate document store. |
| Cache/session/queue | **Redis** | Backs rate limiting (contact form, login), session/cart hydration for guest checkout, cache of expensive queries (search index, homepage aggregates), and a lightweight job queue (email sending, webhook processing retries). |
| Auth | **NextAuth (Auth.js)** | Handles credentials + OAuth providers for admin and optional Lumora demo accounts, with a Prisma adapter that keeps sessions in Postgres — avoids hand-rolling session/JWT security logic. |
| Payments | **Stripe** (test mode for Lumora Skin) | Industry-standard, PCI burden offloaded via Stripe Checkout/Elements; webhooks give a reliable source of truth for order state independent of client redirects. |
| Media | **Cloudinary** | On-the-fly responsive image/video transforms, automatic format negotiation (AVIF/WebP), and a DAM-like asset library the non-technical CMS user can search — essential for a visually-driven, media-heavy site. |
| Transactional email | **Resend** | Modern deliverability-focused email API with React Email templates, so transactional emails (lead confirmation, order receipt, admin invite) are built and tested like components, not raw HTML strings. |
| Containerization | **Docker** | Reproducible local dev (Postgres, Redis) and a portable build artifact for any environment that isn't Vercel (e.g., a client's own infra later, or CI test runners). |
| Hosting | **Vercel** | Native fit for Next.js (ISR, edge middleware, image optimization, preview deployments per PR) — minimizes ops overhead for a small team while still scaling automatically under traffic spikes. |

---

## 11. Folder Structure

```
lumora-digital/
├─ .github/workflows/            CI pipelines
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/            Agency public site — layout w/ marketing nav/footer
│  │  │  ├─ page.tsx                     /
│  │  │  ├─ work/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  │  ├─ services/
│  │  │  ├─ process/
│  │  │  ├─ about/
│  │  │  ├─ blog/
│  │  │  └─ contact/
│  │  ├─ (lumora)/               Lumora Skin experience — own layout/branding
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx                     /lumora
│  │  │  ├─ collections/
│  │  │  ├─ products/[slug]/
│  │  │  ├─ bag/
│  │  │  ├─ checkout/
│  │  │  │  └─ success/
│  │  │  ├─ account/
│  │  │  └─ journal/
│  │  ├─ (auth)/
│  │  │  └─ login/
│  │  ├─ admin/                  Admin console — role-gated layout
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ leads/
│  │  │  ├─ content/
│  │  │  │  ├─ case-studies/
│  │  │  │  ├─ blog/
│  │  │  │  └─ testimonials/
│  │  │  ├─ lumora/
│  │  │  │  ├─ products/
│  │  │  │  ├─ orders/
│  │  │  │  └─ discounts/
│  │  │  ├─ users/
│  │  │  └─ settings/
│  │  ├─ api/
│  │  │  ├─ leads/route.ts
│  │  │  ├─ checkout/route.ts
│  │  │  ├─ webhooks/
│  │  │  │  ├─ stripe/route.ts
│  │  │  │  └─ resend/route.ts
│  │  │  ├─ search/route.ts
│  │  │  ├─ auth/[...nextauth]/route.ts
│  │  │  ├─ upload/route.ts
│  │  │  └─ admin/**/route.ts
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  └─ opengraph-image.tsx
│  ├─ components/
│  │  ├─ ui/                     Shadcn primitives (button, dialog, input, ...)
│  │  ├─ marketing/               Agency-brand components (Hero, CaseStudyCard, ...)
│  │  ├─ lumora/                  Lumora-brand components (ProductCard, BagDrawer, Scene3D, ...)
│  │  ├─ admin/                   Admin-only components (DataTable, ContentEditor, ...)
│  │  └─ shared/                  Cross-cutting (SEO head, forms, motion primitives)
│  ├─ three/                     R3F scenes, materials, loaders, shared canvas wrapper
│  ├─ lib/
│  │  ├─ prisma.ts
│  │  ├─ redis.ts
│  │  ├─ auth.ts                  NextAuth config
│  │  ├─ stripe.ts
│  │  ├─ cloudinary.ts
│  │  ├─ resend.ts
│  │  ├─ rate-limit.ts
│  │  ├─ logger.ts
│  │  └─ validation/              Zod schemas shared client/server
│  ├─ server/
│  │  ├─ services/                Business logic (leadService, orderService, contentService)
│  │  ├─ repositories/            Prisma query modules per domain
│  │  └─ actions/                 Server Actions (form submissions, admin mutations)
│  ├─ hooks/                      Client hooks (useCart, useLenis, useScrollProgress)
│  ├─ stores/                     Zustand stores (cart, ui)
│  ├─ styles/                     Tailwind config, design tokens, globals.css
│  ├─ config/                     Site config, nav config, feature flags
│  └─ types/                      Shared TS types not derived from Prisma
├─ emails/                       React Email templates (rendered by Resend)
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/                       Playwright
├─ docker-compose.yml            Local Postgres + Redis
├─ Dockerfile
├─ .env.example
└─ ARCHITECTURE.md
```

**Route group rationale:** `(marketing)`, `(lumora)`, `(auth)` are Next.js route groups giving each surface its own root `layout.tsx` (fonts, nav, footer, theming) without affecting the URL path — critical because the agency site and Lumora Skin must feel like *two distinct premium brands* sharing one codebase.

---

## 12. Component Architecture

**Layering (strict, one-directional dependency):**
```
app/**            → composes components + calls server/services (never Prisma directly)
components/**     → presentational + light client state (props/hooks in)
three/**          → R3F scene graph, isolated from business logic (receives data via props)
server/services/** → business rules, orchestrates repositories, cache, third-party clients
server/repositories/** → Prisma queries only, no business logic
lib/**             → thin, stateless clients/config for infra (db, redis, stripe, etc.)
```

**Conventions:**
- **Server Components by default.** A component becomes a Client Component only when it needs interactivity, browser APIs, animation state, or a hook (`useCart`, `useLenis`, R3F canvases). This keeps marketing pages' JS payload minimal.
- **Co-located "brand" component sets.** `components/marketing/*` and `components/lumora/*` never import from each other. Shared truly-generic primitives live in `components/ui` (Shadcn) and `components/shared`.
- **Composition over configuration.** E.g., `<CaseStudyLayout>` composes `<Hero>`, `<ContentBlocks blocks={...}>`, `<ResultsMetrics>` rather than one mega-component with 30 props.
- **Content-block renderer:** case studies, blog posts, and the Lumora journal all render from the same `ContentBlock[]` JSON shape (see §14 schema) through a single `<BlockRenderer blocks={blocks} />` switch component — one rendering engine, reused three times, styled per-brand via a `brand` prop/context.
- **3D isolation boundary:** All R3F/Three code sits behind a single `<Scene3D>` wrapper component per use case (`<HeroScene>`, `<ProductViewerScene>`) that is dynamically imported with `ssr: false` and a lightweight CSS/image fallback — so a WebGL failure or slow device never breaks page layout or blocks Core Web Vitals.
- **Storybook** (Phase 3 roadmap) documents `components/ui` and `components/lumora` in isolation for design QA.

---

## 13. State Management Architecture

Deliberately minimal — most "state" here is server state, not client state.

| State type | Tool | Rationale |
|---|---|---|
| Server/remote data (content, orders, leads) | **React Server Components + Server Actions**, no client fetching library needed for most reads | Data is fetched where it's rendered; avoids duplicating a cache client-side for content that's already cached at the edge (ISR). |
| Client-side data needing revalidation/mutation from client components (e.g., admin tables with optimistic updates) | **TanStack Query** | Used narrowly in `admin/**` and cart/checkout flows where optimistic UI and background refetch genuinely add value. |
| Cart (Lumora Skin) | **Zustand** store, persisted to `localStorage` + mirrored server-side in Redis keyed by a signed guest-cart cookie | Needs to survive reloads/tabs client-side instantly (no network round-trip to add-to-cart) while remaining recoverable/valid server-side at checkout time (price/stock re-validated server-side, never trusted from client state). |
| Ephemeral UI state (drawers, modals, active filters, scroll progress) | **Local `useState`/`useReducer`** or small Zustand slices where shared across distant components (e.g., `useScrollProgress` feeding both a GSAP timeline and an R3F scene) | Avoid a global store for things that are naturally local. |
| Auth/session | **NextAuth session (JWT/DB session) via `useSession`/server `auth()` helper** | Single source of truth for identity; never duplicated into another store. |
| Form state | **React Hook Form + Zod** resolvers, shared Zod schemas with the server validation | One schema, two runtimes (client UX validation + server authoritative validation) — no drift. |

**Rule:** No global "app state" store. State lives as close as possible to where it's needed; anything crossing the network is server state, not client state pretending to be a cache.

---

## 14. Database Schema

PostgreSQL via Prisma. Three logical domains in one database/schema: **CMS**, **Leads**, **Lumora Commerce**, plus shared **Identity/Audit**.

```prisma
// ── Identity ─────────────────────────────────────────────
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String?              // null if OAuth-only
  name          String?
  image         String?
  role          Role     @default(VIEWER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  accounts      Account[]            // NextAuth
  sessions      Session[]            // NextAuth
  auditLogs     AuditLog[]
  authoredPosts BlogPost[]
  authoredCase  CaseStudy[]
  demoOrders    Order[]              // Lumora demo customer accounts
}

enum Role {
  OWNER
  ADMIN
  EDITOR
  VIEWER
}

model Account { // NextAuth adapter model
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model AuditLog {
  id         String   @id @default(cuid())
  actorId    String
  actor      User     @relation(fields: [actorId], references: [id])
  action     String              // "case_study.publish", "product.update", ...
  entityType String
  entityId   String
  before     Json?
  after      Json?
  createdAt  DateTime @default(now())
  @@index([entityType, entityId])
}

// ── CMS (agency content, reused by Lumora Journal) ──────
model CaseStudy {
  id           String    @id @default(cuid())
  slug         String    @unique
  title        String
  summary      String
  clientName   String
  industry     String
  status       ContentStatus @default(DRAFT)
  heroImageUrl String?
  blocks       Json                // ContentBlock[]
  metrics      Json?               // [{ label, value }]
  seoTitle     String?
  seoDescription String?
  ogImageUrl   String?
  publishedAt  DateTime?
  authorId     String
  author       User      @relation(fields: [authorId], references: [id])
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model BlogPost {
  id           String    @id @default(cuid())
  slug         String    @unique
  title        String
  excerpt      String
  status       ContentStatus @default(DRAFT)
  coverImageUrl String?
  blocks       Json
  tags         String[]
  seoTitle     String?
  seoDescription String?
  publishedAt  DateTime?
  authorId     String
  author       User      @relation(fields: [authorId], references: [id])
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Testimonial {
  id        String   @id @default(cuid())
  quote     String
  authorName String
  authorRole String
  companyName String
  avatarUrl String?
  featured  Boolean  @default(false)
  createdAt DateTime @default(now())
}

enum ContentStatus {
  DRAFT
  IN_REVIEW
  PUBLISHED
  ARCHIVED
}

// ── Leads ────────────────────────────────────────────────
model Lead {
  id          String     @id @default(cuid())
  name        String
  email       String
  company     String?
  projectType String                 // "e-commerce", "brand site", ...
  budgetBand  String                 // "10-25k", "25-50k", "50k+"
  timeline    String
  message     String
  status      LeadStatus @default(NEW)
  source      String?               // utm/referrer
  assignedToId String?
  notes       LeadNote[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  @@index([status])
}

model LeadNote {
  id        String   @id @default(cuid())
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
  authorId  String
  body      String
  createdAt DateTime @default(now())
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  WON
  LOST
}

// ── Lumora Skin Commerce (demo) ─────────────────────────
model Product {
  id           String   @id @default(cuid())
  slug         String   @unique
  name         String
  description  String
  ingredients  String[]
  collection   String
  status       ContentStatus @default(DRAFT)
  images       ProductImage[]
  variants     Variant[]
  model3dUrl   String?           // Cloudinary/CDN URL for 3D asset, if per-product
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  altText   String
  position  Int     @default(0)
}

model Variant {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku         String   @unique
  size        String              // "30ml", "50ml"
  priceCents  Int
  stripePriceId String?
  inventory   Int      @default(0)
  orderItems  OrderItem[]
}

model Discount {
  id          String   @id @default(cuid())
  code        String   @unique
  percentOff  Int?
  amountOffCents Int?
  active      Boolean  @default(true)
  expiresAt   DateTime?
}

model Order {
  id              String      @id @default(cuid())
  stripeSessionId String      @unique
  stripePaymentIntentId String?
  userId          String?               // null = guest
  user            User?       @relation(fields: [userId], references: [id])
  email           String
  status          OrderStatus @default(PENDING)
  subtotalCents   Int
  discountCents   Int         @default(0)
  totalCents      Int
  shippingAddress Json
  items           OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id         String  @id @default(cuid())
  orderId    String
  order      Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variantId  String
  variant    Variant @relation(fields: [variantId], references: [id])
  quantity   Int
  priceCents Int             // price at time of purchase (snapshot)
}

enum OrderStatus {
  PENDING
  PAID
  FULFILLED   // demo-simulated
  REFUNDED
  CANCELED
}
```

**Design notes:**
- `blocks: Json` (`ContentBlock[]`) gives editors flexible page-builder-style content (image, video, quote, metric-grid, embedded-3D-demo blocks) without a schema migration per new layout — validated against a Zod discriminated union at write time so the JSON is never truly "untyped."
- Money stored as integer cents — never floats.
- `Order` snapshots price at purchase time (`OrderItem.priceCents`) so later price changes never rewrite history.
- Guest checkout is first-class (`Order.userId` nullable); account linking is a bonus flow, not a requirement.

---

## 15. API Architecture

**Pattern:** Next.js **Route Handlers** (`app/api/**/route.ts`) for anything needing a stable HTTP contract (webhooks, third-party callbacks, the public search endpoint), and **Server Actions** for same-origin form submissions/mutations (lead form, admin CRUD, cart operations) to avoid hand-rolled fetch/JSON boilerplate for what is otherwise a same-app call.

**Conventions:**
- All handlers validate input with **Zod** before touching the database; invalid input returns `400` with a structured error shape `{ error: { code, message, fieldErrors? } }`.
- All handlers call into `server/services/*` — never touch Prisma directly — so business rules (e.g., "reject leads without a valid budget band," "recompute order totals server-side") live in one testable place regardless of whether they're invoked from a Route Handler or a Server Action.
- Public write endpoints (`/api/leads`, checkout) are rate-limited via Redis (see §21).
- Admin endpoints are wrapped in a single `withAdminAuth(handler, { minRole })` higher-order function that verifies session + role before the handler body runs — authorization is enforced at the edge of every handler, never inferred from UI state.
- Webhook endpoints (`/api/webhooks/stripe`) verify signatures before parsing payloads and are idempotent (checked against `Order.stripeSessionId`/a processed-events table) so retried webhook deliveries never double-process an order.

**Representative endpoints:**

| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | `/api/leads` | Submit contact/lead form | Public, rate-limited |
| POST | `/api/checkout` | Create Stripe Checkout Session for current cart | Public, rate-limited |
| POST | `/api/webhooks/stripe` | Handle `checkout.session.completed`, `payment_intent.*`, refunds | Stripe signature |
| GET | `/api/search` | Unified search across case studies/blog | Public |
| POST/GET | `/api/auth/[...nextauth]` | NextAuth handlers | — |
| POST | `/api/upload` | Signed Cloudinary upload for admin media picker | Admin session |
| GET/PATCH | `/api/admin/leads/[id]` | Read/update a lead | Admin (EDITOR+) |
| POST | `/api/admin/content/case-studies` | Create case study | Admin (EDITOR+) |
| POST | `/api/admin/lumora/products` | Create/update product | Admin (EDITOR+) |
| GET | `/api/admin/lumora/orders` | List demo orders | Admin (EDITOR+) |
| POST | `/api/admin/users` | Invite/manage users | Admin (OWNER/ADMIN only) |

**Versioning:** Not exposed as a public API product in v1, so no `/v1/` prefix is adopted yet — but all Zod schemas and response shapes are written as if they will be, so a future partner-facing API layer is additive, not a rewrite.

---

## 16. Authentication Architecture

- **Provider:** NextAuth (Auth.js) with the **Prisma Adapter**, database-backed sessions (not stateless JWT) for admin — allows instant session revocation (critical for an admin console: disable a compromised account and it's dead immediately, not "dead once the JWT expires").
- **Admin login:** Credentials provider (email + password, Argon2id-hashed) as the baseline, with optional Google OAuth for the agency's own team (fewer passwords to manage internally).
- **Lumora Skin demo accounts:** Same NextAuth instance, scoped by `Role` (a demo customer has no admin role) — magic-link (email, via Resend) or credentials, kept deliberately lightweight since these are demo accounts, not real customer PII of consequence.
- **Password policy:** Argon2id hashing, minimum 12 characters enforced client+server, breached-password check against a k-anonymity HaveIBeenPwned-style API call at signup for admin accounts.
- **Session:** Secure, `HttpOnly`, `SameSite=Lax` cookies; session lifetime 30 days for demo accounts, 12 hours idle-timeout for admin sessions given the sensitivity of the console.
- **MFA (Phase 2 roadmap):** TOTP-based MFA required for `OWNER`/`ADMIN` roles before production launch of any real client data — flagged as a pre-launch hardening task, not deferred indefinitely.
- **Rate limiting:** Login attempts rate-limited per IP+email via Redis (5 attempts / 15 min, exponential backoff), with generic error messages (no user-enumeration).

---

## 17. Authorization Architecture

**Model:** Coarse-grained **Role-Based Access Control (RBAC)**, enforced server-side only.

| Role | Capabilities |
|---|---|
| **OWNER** | Everything, including user management, role changes, destructive actions (delete published content, issue refunds). |
| **ADMIN** | Everything except managing other admins' roles/removal of OWNER. |
| **EDITOR** | Full CMS (create/edit/publish/unpublish content), manage Lumora products/orders, manage leads. Cannot manage users or site settings. |
| **VIEWER** | Read-only admin dashboard access (for stakeholders who want visibility, e.g., a client-facing viewer role in future). |

**Enforcement points (defense in depth, all three required — never rely on just one):**
1. **Middleware** (`middleware.ts`): redirects unauthenticated requests to `/login` for any `/admin/**` path before the route even renders.
2. **Server-side guard per handler/action:** `withAdminAuth`/`requireRole(minRole)` helper re-checks session + role inside every Server Action and Route Handler — because middleware alone can be misconfigured or bypassed by directly invoking a Server Action.
3. **Row/query-level scoping where relevant:** e.g., a future "client viewer" role would only ever query leads/content scoped to their own account — not applicable broadly in v1 (single-tenant agency admin) but the repository layer is structured to make this addable without a rewrite.

**Principle:** The UI hides controls a role can't use (good UX), but every mutation is re-validated server-side regardless of what the UI shows — client-side role checks are a UX nicety, never a security boundary.

---

## 18. Admin Dashboard Architecture

- **Shell:** `/admin` layout with persistent sidebar nav (role-aware — items the current role can't use are hidden), top bar with the acting user + quick search.
- **Dashboard home:** KPI cards (new leads this week, lead→won conversion, Lumora demo GMV, top-performing case study by traffic) pulled from cached aggregate queries (Redis-cached, 5-minute TTL, since these are dashboards, not real-time trading screens).
- **DataTable pattern:** every list view (leads, orders, products, users) uses one shared `<AdminDataTable>` (Shadcn Table + TanStack Table under the hood) with consistent search/filter/sort/pagination/CSV-export, so new admin sections are cheap to add.
- **Content editor:** a block-based editor (drag-to-reorder block list: Rich Text, Image, Gallery, Quote, Metric Grid, Embedded Demo) backed by the same `ContentBlock[]` Zod schema used for rendering — what an editor builds is exactly what `<BlockRenderer>` renders, with a live **Preview** pane (renders the real public component tree in an iframe/route with `?preview=token`) before publish.
- **Media picker:** opens a Cloudinary Upload Widget/Media Library picker; selected asset URLs are stored on the content record, never re-hosted.
- **Draft/Publish workflow:** `ContentStatus` state machine (`DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED`), with `publishedAt` set only on the `PUBLISHED` transition, and public queries always filtering `status = PUBLISHED AND publishedAt <= now()` — enabling scheduled publishing for free.
- **Audit trail:** every create/update/delete/publish/refund action writes an `AuditLog` row (actor, before/after JSON diff) surfaced in an `/admin/settings/audit-log` view for the OWNER.
- **Access:** entire `/admin/**` tree behind NextAuth session + role middleware; additionally not indexed (`robots: noindex`, excluded from sitemap).

---

## 19. Payment Architecture

Scope: **Lumora Skin demo storefront only**, Stripe in **test mode** throughout (no live-mode keys ever configured for this project, by design).

- **Checkout method:** Stripe **Checkout Sessions** (hosted) for v1 — fastest to ship correctly, PCI scope fully offloaded, and it visually matches "premium but real" without the team owning card-field security. (Embedded Stripe Elements is a documented Phase 2 upgrade if the agency wants to demo a fully custom on-site checkout UI as an additional capability showcase.)
- **Flow:**
  1. Client-side cart (Zustand) → user clicks "Checkout."
  2. Server Action/`/api/checkout` re-validates cart against current `Variant` price/inventory in Postgres (never trusts client-submitted prices), creates a Stripe Checkout Session with line items + metadata (`cartId`, discount code), and creates a local `Order` row in `PENDING` status keyed by the Stripe session id.
  3. User completes payment on Stripe-hosted page.
  4. Stripe fires `checkout.session.completed` webhook → `/api/webhooks/stripe` verifies signature, marks the matching `Order` as `PAID`, decrements `Variant.inventory`, triggers order-confirmation email via Resend.
  5. User is redirected to `/lumora/checkout/success?session_id=...`, which reads order state **from our own database** (already updated by the webhook, or polled briefly if the webhook hasn't landed yet) — never trusts the redirect alone as proof of payment.
- **Discounts:** `Discount` codes applied via Stripe Checkout's native promotion code support, mirrored in our `Discount` table for display/validation before redirect.
- **Refunds:** issued from `/admin/lumora/orders/[id]` via Stripe Refunds API (`OWNER`/`ADMIN` only), which itself triggers a `charge.refunded` webhook updating `Order.status → REFUNDED`.
- **Idempotency:** all webhook handlers are idempotent against `stripeSessionId`/`stripePaymentIntentId`; Stripe webhook retries never double-fulfill or double-email.
- **Secrets:** Stripe secret key and webhook signing secret are server-only env vars, never exposed to the client; only the publishable key ships client-side.

---

## 20. File Upload Architecture

- **Provider:** Cloudinary, used for **all** user-facing media (case study images/video, blog cover images, product images) — no raw file storage on the app server or in Postgres.
- **Upload path (admin):** Next.js Route Handler (`/api/upload`) generates a **signed upload signature** server-side (using the Cloudinary API secret, never exposed client-side); the admin browser uploads directly to Cloudinary using that signature (direct-to-cloud upload, so large video files never transit the Next.js server).
- **Constraints enforced server-side at signature-generation time:** allowed folder (`lumora-digital/case-studies`, `lumora-digital/products`, etc.), max file size, allowed formats (`jpg`, `png`, `webp`, `mp4`), tagging by content type for later asset-library filtering.
- **Delivery:** all rendered images go through Next.js `<Image>` pointed at Cloudinary's dynamic transformation URLs (`f_auto,q_auto`, responsive `w_` breakpoints) — automatic AVIF/WebP negotiation and responsive sizing without the app building its own image pipeline.
- **3D assets** (if any product uses a real `.glb` model instead of a procedurally-styled R3F scene): stored in Cloudinary's raw file support or a Vercel Blob/static bucket, loaded via `@react-three/drei`'s `useGLTF` with Suspense + draco compression.
- **Validation:** MIME-type and magic-byte validation server-side before generating an upload signature (never trust the client-declared content type); Cloudinary's own moderation add-on can be enabled later if third-party asset submission is ever allowed (not in v1 — only admins upload).

---

## 21. Search Architecture

- **v1 (launch):** PostgreSQL **full-text search** (`tsvector` generated columns + GIN indexes) across `CaseStudy`, `BlogPost`, and Lumora `Product`/journal content — zero extra infrastructure, more than sufficient at this content volume (dozens to low hundreds of records, not millions).
- **Query path:** `/api/search?q=` → single service function fans out ranked queries across the three content types, merges/ranks by `ts_rank`, returns a unified result list grouped by type for the ⌘K command palette (built on Shadcn's `Command` component).
- **Caching:** popular/empty-state queries (e.g., trending case studies shown before typing) cached in Redis with a short TTL.
- **Phase 3 upgrade path (documented, not built now):** if content volume or fuzzy/typo-tolerant search needs grow, swap the query layer for a hosted engine (Algolia or Meilisearch) behind the same `/api/search` contract — the service-layer abstraction (`searchService.query()`) is written so this is a swap-the-implementation change, not a rewrite of every call site.
- **Lumora PLP filtering** (collection/price/concern) is a separate, simpler Prisma `where` query path — not routed through the full-text search service, since it's structured filtering, not free-text search.

---

## 22. SEO Architecture

- **Rendering:** every public marketing/Lumora page is Server-Rendered or Statically Generated (ISR) — no client-only-rendered content that matters for SEO.
- **Metadata:** Next.js 15 native Metadata API (`generateMetadata`) per route, pulling `seoTitle`/`seoDescription` overrides from the CMS record when present, falling back to sensible generated defaults.
- **Structured data:** JSON-LD injected per page type — `Organization`/`ProfessionalService` on marketing pages, `Article` on blog posts, `Product`/`Offer` on Lumora PDPs, `BreadcrumbList` site-wide.
- **OG images:** dynamically generated per case study/blog post via `next/og` (`opengraph-image.tsx`), pulling title + hero image — no manually-designed social cards required per post.
- **Sitemap/robots:** generated via `app/sitemap.ts`/`app/robots.ts`, auto-including only `PUBLISHED` content; `/admin/**` and `/lumora/account/**` explicitly disallowed/noindexed.
- **Canonical URLs** set on every page; collection/filter query params on Lumora PLP use `rel=canonical` back to the unfiltered collection URL to avoid duplicate-content indexation.
- **Performance as SEO:** Core Web Vitals treated as an SEO requirement (see §23/§9), not just a UX nicety, given Google's ranking use of these signals.
- **Redirect manager:** admin-configurable 301 redirect table (for future slug changes) checked in middleware, so content restructuring never produces dead links.

---

## 23. Performance Architecture

- **Rendering strategy per route type:**
  - Marketing pages (home, about, services, published case studies/blog): **Static Generation + ISR** (revalidate on publish via on-demand revalidation from the admin publish action, not time-based polling).
  - Lumora PLP/PDP: ISR with on-demand revalidation on product/inventory updates.
  - Cart/checkout/account/admin: fully dynamic (SSR/Server Actions), correctly excluded from static caching.
- **JS budget discipline:** heavy libraries (Three.js/R3F, GSAP) are **dynamically imported** (`next/dynamic`, `ssr:false`) only on the routes that use them — the agency's blog post about typography never pays for a WebGL bundle.
- **3D performance guardrails:** capped device-pixel-ratio, frustum culling, lazy-loaded/draco-compressed models, automatic quality step-down on low-end/mobile GPUs (detected via a lightweight heuristic), and a static-image/poster fallback for reduced-motion or WebGL-unavailable contexts — a 3D hero must never be the reason a phone visitor bounces.
- **Images/fonts:** all images through `next/image` + Cloudinary transforms; fonts self-hosted via `next/font` (zero layout shift, no third-party font request waterfall).
- **Streaming/Suspense:** slow/optional page sections (e.g., testimonials pulled live, related case studies) wrapped in `<Suspense>` boundaries so they stream in after the primary content paints.
- **Bundle monitoring:** CI step (`@next/bundle-analyzer` or `size-limit`) fails the build if the shared client bundle regresses past a defined budget.
- **Lighthouse CI** runs on every PR preview deployment against key templates (home, case study, Lumora PDP, checkout) with hard thresholds for LCP/CLS/TBT.

---

## 24. Caching Strategy

| Layer | Mechanism | What's cached |
|---|---|---|
| CDN/Edge (Vercel) | Full-page cache via ISR + `Cache-Control` | Static/ISR marketing + Lumora content pages |
| Data cache (Next.js `fetch`/`unstable_cache`) | Tag-based cache (`revalidateTag`) | Content queries (case studies list, product catalog), invalidated precisely on admin publish/update actions |
| Redis | Explicit app-level cache | Search "trending" results, homepage aggregate stats, admin dashboard KPIs (short TTL), rate-limit counters, guest cart mirror, session lookups |
| Client | React Query cache | Admin table data (short staleTime, background refetch), cart hydration |
| Browser | HTTP cache headers on static assets | Images (via Cloudinary/Next Image, long max-age + hashed URLs), JS/CSS chunks (immutable, hashed) |

**Invalidation discipline:** every admin publish/update action calls `revalidateTag`/`revalidatePath` for exactly the affected content — no blanket "clear everything" cache-busting, so unrelated pages stay warm.

---

## 25. CDN Strategy

- **Application delivery:** Vercel's global edge network serves all rendered HTML/JS/CSS and handles ISR page caching at edge locations close to visitors.
- **Media delivery:** Cloudinary's own CDN (Akamai/Fastly-backed) serves all images/video with automatic format negotiation and edge caching — deliberately *not* proxied through the Vercel app, so media scales independently of app compute.
- **Cache headers:** long-lived, immutable caching for hashed static assets (`_next/static/*`); short/no-cache for HTML of dynamic routes (cart, checkout, admin); tag-purge on publish for ISR content.
- **Geographic considerations:** since the agency's client base and Lumora demo audience are presumed primarily US/EU, no dedicated multi-region database is needed at this stage — edge caching of rendered pages covers the latency-sensitive read path globally regardless of single-region DB placement.

---

## 26. Security Architecture

- **Transport:** HTTPS-only (enforced by Vercel), HSTS enabled.
- **Headers:** strict `Content-Security-Policy` (explicit allowlist for Stripe, Cloudinary, Resend-linked assets), `X-Frame-Options: DENY` (except the deliberate admin preview iframe, scoped via CSP `frame-ancestors 'self'`), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`.
- **Input validation:** Zod at every server boundary (Route Handlers, Server Actions) — reject-by-default, not sanitize-and-hope.
- **Injection safety:** Prisma parameterizes all queries (no raw SQL string concatenation); any future raw query gated through `Prisma.sql` tagged templates only.
- **XSS:** React's default escaping everywhere; the block-based content editor never allows raw HTML injection by editors (rich text block uses a constrained, sanitized editor schema, not a raw HTML textarea).
- **CSRF:** Server Actions get Next.js's built-in origin-checking; any custom form POST endpoints double-submit-cookie protected.
- **Secrets management:** all third-party keys (Stripe, Cloudinary, Resend, NextAuth secret, DB URL) stored in Vercel Environment Variables (encrypted at rest), never committed; `.env.example` documents required keys with placeholder values only.
- **Webhook security:** Stripe webhook signature verification mandatory before any processing; unsigned/invalid-signature requests rejected with `400` and logged as a security event.
- **Rate limiting:** Redis-backed sliding-window limits on login, contact form, checkout creation, and search endpoints to blunt abuse/enumeration/spam.
- **Dependency hygiene:** automated dependency vulnerability scanning in CI (`npm audit`/Dependabot/GitHub code scanning) blocking merge on high/critical findings.
- **Least privilege:** database roles scoped (app connection role has no `DROP`/`ALTER` in production); admin RBAC as described in §17.
- **PII minimization:** Lumora demo orders store only what's needed to demonstrate a real order flow (name, email, shipping address) with a documented data-retention/deletion policy; leads data deletable on request (GDPR/CCPA "right to erasure" honored via an admin "delete lead" hard-delete action, not just a status flag).
- **Regular review:** a lightweight annual (or pre-major-launch) security review pass, and this document's Security section is the checklist starting point for that review.

---

## 27. Logging

- **Structured logging** everywhere (`lib/logger.ts`, a thin wrapper — Pino under the hood) emitting JSON with consistent fields: `timestamp, level, requestId, route, userId?, message, context`.
- **Levels:** `debug` (local only), `info` (business events: lead created, order paid, content published), `warn` (recoverable failures, rate-limit hits), `error` (unhandled exceptions, webhook signature failures, payment errors).
- **Request correlation:** a `requestId` generated per incoming request (middleware) and threaded through any downstream service/log line, so a single user action's full log trail is traceable.
- **Sensitive data redaction:** logger explicitly strips/redacts fields like `passwordHash`, full card data (never touched, Stripe-hosted), and full shipping addresses beyond city/region in non-debug logs.
- **Sink:** logs shipped to Vercel's log drains → an aggregator (see Monitoring below) rather than relying on ephemeral function logs alone.

---

## 28. Monitoring

- **Error tracking:** **Sentry** (Next.js SDK) across client + server + edge runtimes — captures unhandled exceptions, failed Server Actions, and React error boundaries, with source maps for real stack traces and release tracking tied to each deploy.
- **Uptime/synthetic checks:** external uptime monitor (e.g., Better Uptime/Checkly) pinging key public routes (`/`, `/lumora`, `/api/health`) and critical flows (a synthetic "add to cart → checkout page loads" check) every few minutes, alerting via email/Slack on failure.
- **Performance monitoring:** Vercel Analytics + Speed Insights for real-user Core Web Vitals in production, supplementing the synthetic Lighthouse CI gate in §23.
- **Business metrics:** the admin dashboard's KPI cards (§18) double as the "business monitoring" layer — leads/day, demo order volume, content publish cadence — cheap to build since it's just cached aggregate queries, and it's the metric set that actually matters to the agency's owner.
- **Alerting:** Sentry alert rules (error-rate spike, new error type in production) and Stripe's own dashboard alerts (failed payments, webhook delivery failures) routed to a shared team Slack/email channel.
- **Health endpoint:** `/api/health` checks DB and Redis connectivity, used by both the uptime monitor and deployment smoke tests.

---

## 29. CI/CD

**Pipeline (GitHub Actions):**

```
On PR:
  1. Install (cached) → Lint (ESLint) → Typecheck (tsc --noEmit)
  2. Unit + integration tests (Vitest) against a Dockerized Postgres/Redis service container
  3. Prisma migration dry-run/validate (`prisma migrate diff` against main)
  4. Build (`next build`) — fails the PR on build errors or bundle-size budget regression
  5. Vercel automatically creates a Preview Deployment for the PR
  6. Lighthouse CI + Playwright E2E smoke suite run against the Preview URL
  7. Required status checks must pass before merge (branch protection on `main`)

On merge to main:
  1. Same pipeline re-runs against main
  2. Vercel Production Deployment triggered
  3. `prisma migrate deploy` run against production DB as a release step (gated, not automatic-on-every-push without review of the migration in the PR)
  4. Post-deploy smoke test hits `/api/health` and a couple of key pages
  5. Sentry release created and associated with the deployment for error/release correlation
```

- **Environments:** `local` (Docker Compose Postgres/Redis) → `preview` (per-PR Vercel deployment + a shared staging Postgres branch, e.g., via Neon/Postgres branching) → `production`.
- **Secrets per environment:** managed in Vercel's environment-scoped env vars (Preview vs Production vs Development), never shared test/live Stripe keys across environments.
- **Database branching:** if using Neon (recommended Postgres provider for exactly this reason), each PR preview can get an ephemeral branched database seeded from a sanitized snapshot — safe to test destructive migrations without touching production data.

---

## 30. Deployment

- **Host:** Vercel (Production + automatic Preview deployments per PR, per §29).
- **Runtime split:** most routes on the standard Node.js serverless runtime (needed for Prisma/Stripe SDK); latency-sensitive, logic-light routes (e.g., simple redirects, A/B flag checks) may use the Edge runtime where compatible.
- **Database hosting:** managed Postgres (Neon or equivalent) with automated backups and branching support, in the same region as the primary Vercel deployment region to minimize function-to-DB latency.
- **Redis hosting:** managed Redis (Upstash) — serverless-friendly (HTTP-based client), no persistent connection pool problem in a serverless function environment.
- **Docker's role:** not used to host production (Vercel is the host) — Docker Compose provides a faithful local dev environment (Postgres + Redis matching production versions) and a portable image for any CI job or future non-Vercel environment (e.g., a client wants the codebase self-hosted later).
- **Rollback:** Vercel's instant rollback to any previous deployment (atomic, no rebuild needed) is the first line of defense for a bad deploy; database migrations are written to be backward-compatible for at least one release (expand/contract pattern) so a code rollback never strands the schema.
- **Domain/DNS:** primary domain on Vercel's DNS/CDN; `lumora` experience served at a path (`/lumora`) in v1 for SEO/authority consolidation under the agency domain, with a documented option to move it to a subdomain (`lumora.agencyname.com`) later if it should stand alone.

---

## 31. Backup Strategy

- **Database:** automated daily full backups + continuous WAL archiving (point-in-time recovery) via the managed Postgres provider, retained 30 days minimum; weekly backup restore drills (Phase 2 roadmap item) to verify backups are actually restorable, not just taken.
- **Media:** Cloudinary is itself the durable store of record for all uploaded media (redundant, versioned) — no separate backup process needed for assets, since nothing is stored only locally/in the app.
- **Configuration/secrets:** environment variable values documented (names + purpose, not values) in `.env.example` and mirrored in a secure team password manager entry — recoverable even if Vercel project settings were somehow lost.
- **Code:** GitHub is the backup for all source (protected `main` branch, required reviews).

---

## 32. Disaster Recovery

| Scenario | Recovery approach | Target |
|---|---|---|
| Bad deploy (broken build/runtime error) | Vercel instant rollback to last-good deployment | < 5 minutes |
| Database corruption/bad migration | Point-in-time restore from managed Postgres backup to just before the incident; app rollback to matching code version | RPO < 24h (approaching near-zero with WAL/PITR), RTO < 1 hour |
| Full Vercel region outage | Vercel's multi-region edge serves cached/static content regardless; dynamic routes degrade until region recovers (accepted risk at this scale — documented, not engineered around with active-active multi-cloud, which is disproportionate for an agency portfolio site) | Best-effort, monitored via uptime checks |
| Stripe outage | Checkout temporarily unavailable; cart state preserved (Redis/localStorage) so no data loss, user can retry once Stripe recovers | No data loss; degraded availability only |
| Accidental data deletion (admin error) | `AuditLog` before/after JSON allows manual reconstruction of the last known-good state for CMS content; database point-in-time restore for anything beyond CMS content | RTO < 1 hour for CMS content via audit log; < 1 hour via PITR otherwise |
| Compromised admin credential | Immediate session revocation (DB-backed sessions, §16) by deleting the user's `Session` rows + forced password reset; audit log review to assess blast radius | < 15 minutes to revoke |

**DR ownership:** the agency Owner is the designated incident owner; this document's §31/§32 is the runbook starting point until a dedicated incident-response doc is written (Phase 3 roadmap).

---

## 33. Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=
NODE_ENV=

# Database
DATABASE_URL=
DIRECT_URL=                     # Prisma direct connection for migrations (bypassing pooler)

# Redis
REDIS_URL=

# Auth (NextAuth)
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe (TEST MODE keys only for this project)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_AUDIENCE_ID=              # newsletter

# Observability
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=                # for release/source-map upload in CI

# Misc
RATE_LIMIT_ENABLED=true
```

- `.env.example` in the repo documents every key with a one-line comment (no real values).
- Client-exposed variables are explicitly prefixed `NEXT_PUBLIC_`; everything else is server-only by convention and enforced by not referencing non-prefixed vars from Client Components.
- Per-environment values (Development/Preview/Production) managed in Vercel's project settings, never in a committed file.

---

## 34. Third-Party Services

| Service | Role | Notes |
|---|---|---|
| **Vercel** | Hosting, CI preview deploys, edge network, image optimization, analytics | Primary platform |
| **Neon (or equivalent managed Postgres)** | Primary database | Chosen for branching (per-PR ephemeral DBs) + PITR backups |
| **Upstash (or equivalent managed Redis)** | Cache, rate limiting, cart mirror, job queue | Serverless/HTTP client fits Vercel functions |
| **Stripe** | Payments (test mode) for Lumora Skin demo | No live-mode keys configured for this project |
| **Cloudinary** | Media storage, transformation, delivery | DAM-style asset library for non-technical editors |
| **Resend** | Transactional email + newsletter | React Email templates |
| **Sentry** | Error tracking + release monitoring | Client/server/edge |
| **Better Uptime / Checkly (or equivalent)** | Synthetic uptime + flow monitoring | External to Vercel, catches platform-wide incidents too |
| **GitHub** | Source control, CI (Actions), code review | Branch protection on `main` |
| **Google OAuth** | Internal team admin login option | Reduces password sprawl for the agency's own staff |

---

## 35. Development Roadmap

### Phase 0 — Foundation (Weeks 1–2)
- Repo scaffold, Next.js 15/TS/Tailwind/Shadcn setup, Docker Compose local Postgres/Redis, Prisma schema v1 + migrations, CI skeleton, design tokens/brand system for both the agency and Lumora Skin.

### Phase 1 — Agency Marketing Site (Weeks 3–6)
- Home, Work index, Services, Process, About, Blog, Contact.
- Admin: auth, RBAC, CaseStudy/BlogPost/Testimonial CRUD with block editor + Cloudinary media picker, Lead inbox.
- SEO layer (metadata, sitemap, JSON-LD, OG images), Resend transactional emails for leads.
- CI/CD fully wired, Sentry + uptime monitoring live.

### Phase 2 — Lumora Skin Flagship Case Study (Weeks 7–12)
- 3D hero (R3F/Drei) + GSAP/Lenis scroll choreography.
- PLP/PDP, cart (Zustand + Redis mirror), Stripe Checkout (test mode) + webhooks, order confirmation email.
- Optional demo account (NextAuth) + order history.
- Admin: product/variant/inventory/discount/order management.
- Full Lighthouse/Core Web Vitals pass on the 3D-heavy routes specifically (this is the highest-risk-for-regression area).

### Phase 3 — Polish, Hardening, Scale-Readiness (Weeks 13–16)
- MFA for admin OWNER/ADMIN roles.
- Storybook for `components/ui`/`components/lumora`.
- Backup-restore drill, incident-response runbook.
- Search upgrade evaluation (stay on Postgres FTS vs. move to Meilisearch/Algolia) based on real usage.
- Additional case studies (second/third portfolio pieces) using the now-proven block-content + component system.
- Accessibility audit (WCAG 2.1 AA) pass across all motion-heavy surfaces.

### Phase 4 — Post-Launch Iteration (Ongoing)
- A/B test contact-form conversion variants.
- Newsletter/journal content cadence via Resend Broadcasts.
- Reusable "premium site starter kit" extraction from Lumora Skin's component/3D/animation system for future client engagements — the intended long-term payoff of building this flagship project properly.

---

## Appendix A — Design Principle Summary

1. **Two brands, one codebase.** The agency's own brand and Lumora Skin's luxury brand are visually independent systems sharing infrastructure, never sharing component styling.
2. **Server-first, client-interactive-where-it-earns-its-keep.** Default to Server Components; pay the client-JS cost only for cart, checkout, admin interactivity, and the 3D/motion surfaces that are the actual product being sold.
3. **One content engine, three surfaces.** Case studies, blog, and the Lumora journal all render from the same block schema — built once, reused three times.
4. **Authorization is a server concern.** Every role check is re-verified server-side at every mutation boundary, never trusted from client state or hidden UI alone.
5. **Payments are demo-scoped, deliberately.** Stripe test-mode only, clearly documented, so the system's real purpose — proving the agency's e-commerce competence — is never confused with operating an actual skincare business.
