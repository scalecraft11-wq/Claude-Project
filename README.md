# Velocity Shoes

Premium ecommerce storefront for **Velocity Shoes** — a luxury sneaker
and streetwear brand. Built as a progressive, phased build; this is
**Phase 1**: a fully designed, animated, portfolio-ready storefront UI.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for animation and page/scroll interactions
- **React Three Fiber** + **Drei** for the 3D rotating hero sneaker
- **Lucide** icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` — Home: hero with 3D sneaker, categories, featured products,
  testimonials, FAQ
- `/shop` — Full catalog with search, filters (category, price, size),
  and sorting
- `/product/[slug]` — Product detail with gallery, color/size
  selection, and related products
- `/about` — Brand story, values, process
- `/contact` — Contact form and studio info

## Architecture

- `app/` — routes (App Router)
- `components/` — UI organized by domain (`layout`, `home`, `shop`,
  `product`, `three`, `ui`)
- `context/` — Cart and Wishlist state (persisted to `localStorage`
  via a small `useSyncExternalStore`-based store in `lib/createLocalStore.ts`)
- `lib/data/` — sample product, testimonial, and FAQ data

## Roadmap

Later phases (per the project plan) layer in a database (Prisma +
PostgreSQL), authentication, an admin dashboard, and Stripe checkout —
without changing the UI built in this phase.
