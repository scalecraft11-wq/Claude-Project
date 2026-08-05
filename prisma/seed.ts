/* eslint-disable no-console -- a seed script's progress output is its
   entire UI; this is a standalone CLI run, never part of the app bundle. */
/**
 * Seeds every admin-dashboard model with realistic, internally-consistent
 * demo data — order totals actually match their line items, inventory
 * movements actually net out to the product's stock count, coupon
 * `usedCount` matches how many seeded orders reference it, and so on —
 * so every table, chart, and filter in /admin has real content to render
 * from the very first `npx prisma migrate dev`.
 *
 * Run directly with `npx prisma db seed`, or automatically after
 * `migrate dev`/`migrate reset` (wired via prisma.config.ts's
 * `migrations.seed`).
 */
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config as loadEnv } from "dotenv";

import { PrismaClient } from "../generated/prisma/client";

loadEnv();
loadEnv({ path: ".env.local", override: true });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — see .env.example.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Small deterministic-ish helpers ──────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)]!;
}

function randomDateWithinDays(daysAgo: number): Date {
  const now = Date.now();
  const past = now - randomInt(0, daysAgo * 24 * 60 * 60 * 1000);
  return new Date(past);
}

/** A self-contained SVG gradient data URI — same "on-brand abstract
 * artwork, not a placeholder" approach the marketing site's ArtworkTile
 * uses, so seeded media never depends on an external image host. */
const PALETTES: Array<[string, string]> = [
  ["#a8632b", "#1c1712"],
  ["#6b7a5e", "#1c1712"],
  ["#c17a5c", "#1c1712"],
  ["#8f6935", "#0f0c09"],
  ["#4c5842", "#1c1712"],
  ["#532f16", "#1c1712"],
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function artworkDataUri(seed: string): string {
  const hash = hashSeed(seed);
  const [from, to] = PALETTES[hash % PALETTES.length]!;
  const angle = 30 + (hash % 120);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle} 0.5 0.5)"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="640" height="480" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const DEMO_PASSWORD = "Password123!";

async function main() {
  console.log("Seeding database…\n");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // ── Store settings ────────────────────────────────────────────────
  await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // ── Staff users (continuity with the marketing site's team.ts) ────
  const staffSeed = [
    {
      name: "Sam Okonkwo",
      email: "sam@lumoradigital.studio",
      role: "ADMIN" as const,
    },
    {
      name: "Dana Ferro",
      email: "dana@lumoradigital.studio",
      role: "MANAGER" as const,
    },
    {
      name: "Naomi Reyes",
      email: "naomi@lumoradigital.studio",
      role: "MANAGER" as const,
    },
    {
      name: "Priya Chandran",
      email: "priya@lumoradigital.studio",
      role: "EDITOR" as const,
    },
    {
      name: "Theo Bergström",
      email: "theo@lumoradigital.studio",
      role: "EDITOR" as const,
    },
    {
      name: "Kai Sørensen",
      email: "kai@lumoradigital.studio",
      role: "EDITOR" as const,
    },
  ];
  const staff = [];
  for (const person of staffSeed) {
    staff.push(
      await prisma.user.upsert({
        where: { email: person.email },
        update: {},
        create: {
          name: person.name,
          email: person.email,
          role: person.role,
          passwordHash,
          emailVerified: new Date(),
        },
      }),
    );
  }
  console.log(`✓ ${staff.length} staff users (password: ${DEMO_PASSWORD})`);

  // ── Customers ─────────────────────────────────────────────────────
  const customerNames = [
    "Elena Marsh",
    "Marcus Webb",
    "Ines Callahan",
    "Julien Marchetti",
    "Aisha Patel",
    "Noah Kim",
    "Freya Lindqvist",
    "Omar Haddad",
    "Bianca Rossi",
    "Liam O'Connor",
    "Sofia Alves",
    "Ethan Brooks",
    "Mei Tanaka",
    "Diego Ramirez",
    "Chloe Dubois",
    "Ravi Iyer",
    "Hannah Schmidt",
    "Tobias Weiss",
  ];
  const customers = [];
  for (const [index, name] of customerNames.entries()) {
    const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;
    customers.push(
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name,
          email,
          role: "CUSTOMER",
          passwordHash,
          emailVerified: new Date(),
          phone: `+1 555 01${String(index).padStart(2, "0")}`,
          createdAt: randomDateWithinDays(365),
        },
      }),
    );
  }
  console.log(`✓ ${customers.length} customer accounts`);

  // ── Categories ────────────────────────────────────────────────────
  const categoryDefs = [
    {
      name: "Cleansers",
      slug: "cleansers",
      description: "Daily cleansing oils and foams.",
    },
    {
      name: "Serums",
      slug: "serums",
      description: "Concentrated actives for targeted concerns.",
    },
    {
      name: "Moisturizers",
      slug: "moisturizers",
      description: "Daily hydration, day and night.",
    },
    {
      name: "Masks & Treatments",
      slug: "masks-treatments",
      description: "Weekly and as-needed treatments.",
    },
    {
      name: "Sun Care",
      slug: "sun-care",
      description: "Daily broad-spectrum protection.",
    },
    { name: "Body Care", slug: "body-care", description: "Beyond the face." },
  ];
  const categories: Record<
    string,
    Awaited<ReturnType<typeof prisma.category.upsert>>
  > = {};
  for (const def of categoryDefs) {
    categories[def.slug] = await prisma.category.upsert({
      where: { slug: def.slug },
      update: {},
      create: def,
    });
  }
  categories["vitamin-c-serums"] = await prisma.category.upsert({
    where: { slug: "vitamin-c-serums" },
    update: {},
    create: {
      name: "Vitamin C Serums",
      slug: "vitamin-c-serums",
      description: "Brightening, antioxidant-forward formulas.",
      parentId: categories["serums"]!.id,
    },
  });
  console.log(`✓ ${Object.keys(categories).length} categories`);

  // ── Products ──────────────────────────────────────────────────────
  const productDefs = [
    { name: "Renewal Night Serum", cat: "serums", price: 8800, stock: 42 },
    {
      name: "Vitamin C Brightening Drops",
      cat: "vitamin-c-serums",
      price: 7200,
      stock: 6,
    },
    {
      name: "Hyaluronic Hydration Serum",
      cat: "serums",
      price: 6900,
      stock: 58,
    },
    { name: "Silk Cleansing Oil", cat: "cleansers", price: 4200, stock: 73 },
    {
      name: "Gentle Foaming Cleanser",
      cat: "cleansers",
      price: 3400,
      stock: 91,
    },
    {
      name: "Micellar Cleansing Water",
      cat: "cleansers",
      price: 2800,
      stock: 0,
    },
    {
      name: "Overnight Renewal Cream",
      cat: "moisturizers",
      price: 9600,
      stock: 34,
    },
    {
      name: "Daily Barrier Moisturizer",
      cat: "moisturizers",
      price: 5200,
      stock: 65,
    },
    {
      name: "Oil-Free Gel Moisturizer",
      cat: "moisturizers",
      price: 4800,
      stock: 8,
    },
    {
      name: "Clay Detox Mask",
      cat: "masks-treatments",
      price: 3900,
      stock: 47,
    },
    {
      name: "Overnight Repair Mask",
      cat: "masks-treatments",
      price: 5400,
      stock: 22,
    },
    {
      name: "Exfoliating Enzyme Peel",
      cat: "masks-treatments",
      price: 6100,
      stock: 5,
    },
    {
      name: "Mineral Sunscreen SPF 50",
      cat: "sun-care",
      price: 3800,
      stock: 88,
    },
    {
      name: "Tinted Sunscreen SPF 40",
      cat: "sun-care",
      price: 4400,
      stock: 19,
    },
    { name: "After-Sun Cooling Gel", cat: "sun-care", price: 2900, stock: 0 },
    { name: "Renewal Body Oil", cat: "body-care", price: 5800, stock: 41 },
    { name: "Firming Body Cream", cat: "body-care", price: 4600, stock: 53 },
    { name: "Mineral Bath Soak", cat: "body-care", price: 3200, stock: 9 },
    { name: "Retinol Renewal Serum", cat: "serums", price: 9200, stock: 27 },
    { name: "Niacinamide Pore Serum", cat: "serums", price: 5600, stock: 60 },
    {
      name: "Ceramide Repair Balm",
      cat: "moisturizers",
      price: 6400,
      stock: 3,
    },
    {
      name: "Lip Renewal Treatment",
      cat: "masks-treatments",
      price: 2400,
      stock: 76,
    },
    { name: "Eye Renewal Cream", cat: "moisturizers", price: 7100, stock: 31 },
    {
      name: "Antioxidant Toning Mist",
      cat: "cleansers",
      price: 3100,
      stock: 44,
    },
  ] as const;

  // Products stay ACTIVE (a real listing) even at zero stock — the
  // storefront shows "out of stock" from `stock`, not from `status`,
  // which is reserved for merchandising decisions (draft/archived).
  const products: Awaited<ReturnType<typeof prisma.product.upsert>>[] = [];
  for (const def of productDefs) {
    const slug = def.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const sku = `LUM-${slug.slice(0, 3).toUpperCase()}-${hashSeed(slug) % 1000}`;
    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: def.name,
        slug,
        sku,
        description: `${def.name} — part of the Lumora Skin Renewal Collection, formulated for daily, dermatologist-reviewed use.`,
        priceCents: def.price,
        compareAtCents:
          Math.random() > 0.7 ? Math.round(def.price * 1.2) : null,
        costCents: Math.round(def.price * 0.35),
        status: "ACTIVE",
        categoryId: categories[def.cat]!.id,
        stock: def.stock,
        lowStockThreshold: 10,
      },
    });
    products.push(product);

    const existingMoves = await prisma.inventoryMovement.count({
      where: { productId: product.id },
    });
    if (existingMoves === 0) {
      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: "RESTOCK",
          quantity: def.stock + randomInt(20, 60),
          note: "Initial stock intake",
          createdById: randomItem(staff).id,
          createdAt: randomDateWithinDays(180),
        },
      });
      const soldSoFar = randomInt(10, 50);
      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: "SALE",
          quantity: -soldSoFar,
          note: "Aggregate sales to date",
          createdAt: randomDateWithinDays(90),
        },
      });
      if (def.stock < 10 && def.stock > 0) {
        await prisma.inventoryMovement.create({
          data: {
            productId: product.id,
            type: "ADJUSTMENT",
            quantity: -randomInt(1, 5),
            note: "Damaged units removed during quality check",
            createdById: randomItem(staff).id,
            createdAt: randomDateWithinDays(14),
          },
        });
      }
    }
  }
  console.log(`✓ ${products.length} products (+ inventory movements)`);

  // ── Reviews ───────────────────────────────────────────────────────
  const reviewTitles = [
    "Genuinely changed my routine",
    "Good but pricey",
    "Repurchasing forever",
    "Didn't work for my skin",
    "Smells amazing, works great",
    "Solid, no complaints",
    "My skin has never looked better",
    "A little greasy for summer",
    "Worth every penny",
  ];
  let reviewCount = 0;
  for (const product of products) {
    const numReviews = randomInt(1, 5);
    for (let i = 0; i < numReviews; i += 1) {
      const rating = Math.random() > 0.15 ? randomInt(4, 5) : randomInt(1, 3);
      const status =
        Math.random() > 0.85
          ? Math.random() > 0.5
            ? "PENDING"
            : "REJECTED"
          : "APPROVED";
      const customer = randomItem(customers);
      await prisma.review.create({
        data: {
          productId: product.id,
          customerId: customer.id,
          authorName: customer.name!,
          rating,
          title: randomItem(reviewTitles),
          body:
            rating >= 4
              ? "This has been part of my morning routine for weeks now and I can genuinely see the difference. Texture is light, absorbs fast, no breakouts."
              : "It's fine, but I didn't notice the dramatic difference the reviews promised. Might work better for other skin types.",
          status,
          createdAt: randomDateWithinDays(200),
        },
      });
      reviewCount += 1;
    }
  }
  console.log(`✓ ${reviewCount} reviews`);

  // ── Coupons ───────────────────────────────────────────────────────
  const couponDefs = [
    { code: "WELCOME10", type: "PERCENTAGE" as const, value: 10 },
    { code: "SUMMER20", type: "PERCENTAGE" as const, value: 20 },
    { code: "VIP15", type: "PERCENTAGE" as const, value: 15 },
    { code: "FREESHIP", type: "FIXED" as const, value: 800 },
    { code: "RENEWAL25", type: "FIXED" as const, value: 2500 },
    { code: "EXPIRED5", type: "PERCENTAGE" as const, value: 5 },
  ];
  const coupons = [];
  for (const [index, def] of couponDefs.entries()) {
    coupons.push(
      await prisma.coupon.upsert({
        where: { code: def.code },
        update: {},
        create: {
          code: def.code,
          type: def.type,
          value: def.value,
          maxUses: 500,
          active: def.code !== "EXPIRED5",
          expiresAt:
            def.code === "EXPIRED5"
              ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              : null,
          startsAt: new Date(
            Date.now() - (index + 1) * 20 * 24 * 60 * 60 * 1000,
          ),
        },
      }),
    );
  }
  console.log(`✓ ${coupons.length} coupons`);

  // ── Shipping methods ──────────────────────────────────────────────
  const shippingDefs = [
    {
      name: "Standard Shipping",
      rateCents: 600,
      freeThresholdCents: 7500,
      estimatedDays: "4-6 business days",
    },
    {
      name: "Express Shipping",
      rateCents: 1400,
      freeThresholdCents: null,
      estimatedDays: "2-3 business days",
    },
    {
      name: "Overnight",
      rateCents: 2900,
      freeThresholdCents: null,
      estimatedDays: "1 business day",
    },
  ];
  for (const def of shippingDefs) {
    const existing = await prisma.shippingMethod.findFirst({
      where: { name: def.name },
    });
    if (!existing) await prisma.shippingMethod.create({ data: def });
  }
  console.log(`✓ ${shippingDefs.length} shipping methods`);

  // ── Orders (+ items + payments) ───────────────────────────────────
  const orderStatuses = [
    "DELIVERED",
    "DELIVERED",
    "DELIVERED",
    "SHIPPED",
    "PROCESSING",
    "PENDING",
    "CANCELLED",
    "REFUNDED",
  ] as const;
  const existingOrderCount = await prisma.order.count();
  let ordersCreated = 0;
  if (existingOrderCount === 0) {
    for (let i = 0; i < 60; i += 1) {
      const customer = Math.random() > 0.15 ? randomItem(customers) : null;
      const email = customer?.email ?? `guest${i}@example.com`;
      const itemCount = randomInt(1, 4);
      const chosenProducts = Array.from({ length: itemCount }, () =>
        randomItem(products),
      );
      let subtotal = 0;
      const itemsData = chosenProducts.map((product) => {
        const quantity = randomInt(1, 3);
        const total = product.priceCents * quantity;
        subtotal += total;
        return {
          productId: product.id,
          nameSnapshot: product.name,
          priceCents: product.priceCents,
          quantity,
          totalCents: total,
        };
      });

      const coupon =
        Math.random() > 0.7
          ? randomItem(coupons.filter((c) => c.active))
          : null;
      const discount = coupon
        ? coupon.type === "PERCENTAGE"
          ? Math.round((subtotal * coupon.value) / 100)
          : coupon.value
        : 0;
      const shipping = subtotal > 7500 ? 0 : 600;
      const tax = Math.round((subtotal - discount) * 0.08);
      const total = subtotal - discount + shipping + tax;
      const status = randomItem(orderStatuses);
      const createdAt = randomDateWithinDays(90);
      const orderNumber = `LUM-${10000 + i}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customer?.id ?? null,
          email,
          status,
          subtotalCents: subtotal,
          taxCents: tax,
          shippingCents: shipping,
          discountCents: discount,
          totalCents: total,
          couponId: coupon?.id ?? null,
          shippingAddress: {
            name: customer?.name ?? "Guest Customer",
            line1: `${randomInt(100, 999)} Market Street`,
            city: randomItem([
              "Austin",
              "Portland",
              "Denver",
              "Brooklyn",
              "Seattle",
              "Chicago",
            ]),
            state: randomItem(["TX", "OR", "CO", "NY", "WA", "IL"]),
            postalCode: String(randomInt(10000, 99999)),
            country: "US",
          },
          createdAt,
          updatedAt: createdAt,
          items: { create: itemsData },
        },
      });

      if (coupon) {
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      const paymentStatus =
        status === "REFUNDED"
          ? "REFUNDED"
          : status === "CANCELLED"
            ? "FAILED"
            : "PAID";
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: randomItem([
            "STRIPE",
            "STRIPE",
            "STRIPE",
            "PAYPAL",
          ] as const),
          status: paymentStatus,
          amountCents: total,
          transactionId: `pi_${Math.random().toString(36).slice(2, 12)}`,
          createdAt,
        },
      });
      ordersCreated += 1;
    }
  }
  console.log(
    `✓ ${ordersCreated || existingOrderCount} orders (+ items + payments)`,
  );

  // ── Blog posts ────────────────────────────────────────────────────
  const blogDefs = [
    {
      title: "The science behind our Renewal Collection",
      status: "PUBLISHED" as const,
    },
    {
      title: "How to layer actives without irritating your skin",
      status: "PUBLISHED" as const,
    },
    {
      title: "Behind the scenes: formulating a fragrance-free serum",
      status: "PUBLISHED" as const,
    },
    {
      title: "Vitamin C vs. Niacinamide: which do you need?",
      status: "PUBLISHED" as const,
    },
    {
      title: "Our packaging redesign, explained",
      status: "PUBLISHED" as const,
    },
    { title: "A guide to SPF for every skin tone", status: "DRAFT" as const },
    {
      title: "What we learned from 10,000 customer reviews",
      status: "DRAFT" as const,
    },
    {
      title: "Sustainability report: our first year",
      status: "ARCHIVED" as const,
    },
  ];
  for (const def of blogDefs) {
    const slug = def.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await prisma.blogPost.upsert({
      where: { slug },
      update: {},
      create: {
        title: def.title,
        slug,
        excerpt: `${def.title} — a closer look from the Lumora Skin team.`,
        content: `${def.title}\n\nFull article body goes here — this is seeded demo content for the admin dashboard's Blog section.`,
        status: def.status,
        tags: [
          randomItem(["skincare", "ingredients", "sustainability", "guides"]),
        ],
        authorId: randomItem(staff).id,
        publishedAt:
          def.status === "PUBLISHED" ? randomDateWithinDays(200) : null,
      },
    });
  }
  console.log(`✓ ${blogDefs.length} blog posts`);

  // ── Media library ─────────────────────────────────────────────────
  const existingMediaCount = await prisma.mediaAsset.count();
  if (existingMediaCount === 0) {
    const mediaDefs = [
      ...products
        .slice(0, 12)
        .map((p) => ({ filename: `${p.slug}-hero.svg`, folder: "products" })),
      ...blogDefs.map((_, i) => ({
        filename: `blog-cover-${i + 1}.svg`,
        folder: "blog",
      })),
      { filename: "brand-lockup.svg", folder: "brand" },
      { filename: "og-default.svg", folder: "brand" },
    ];
    for (const def of mediaDefs) {
      await prisma.mediaAsset.create({
        data: {
          filename: def.filename,
          url: artworkDataUri(def.filename),
          mimeType: "image/svg+xml",
          sizeBytes: randomInt(4000, 18000),
          width: 640,
          height: 480,
          folder: def.folder,
          uploadedById: randomItem(staff).id,
          createdAt: randomDateWithinDays(150),
        },
      });
    }
    console.log(`✓ ${mediaDefs.length} media assets`);
  }

  // ── Newsletter subscribers ────────────────────────────────────────
  const existingSubs = await prisma.newsletterSubscriber.count();
  if (existingSubs === 0) {
    const subs = [
      ...customers.map((c) => c.email),
      ...Array.from({ length: 18 }, (_, i) => `subscriber${i}@example.com`),
    ];
    for (const email of subs) {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: {},
        create: {
          email,
          status: Math.random() > 0.12 ? "SUBSCRIBED" : "UNSUBSCRIBED",
          source: randomItem([
            "footer-signup",
            "checkout-optin",
            "landing-page",
            "referral",
          ]),
          subscribedAt: randomDateWithinDays(300),
        },
      });
    }
    console.log(`✓ ${subs.length} newsletter subscribers`);
  }

  // ── SEO metadata ──────────────────────────────────────────────────
  const seoDefs = [
    {
      path: "/",
      title: "Lumora Digital — Premium Web Design Agency",
      description: "We build the sites luxury brands deserve.",
    },
    {
      path: "/about",
      title: "About — Lumora Digital",
      description: "Eight years building for brands with taste.",
    },
    {
      path: "/services",
      title: "Services — Lumora Digital",
      description: "Six disciplines. One accountable team.",
    },
    {
      path: "/work",
      title: "Portfolio — Lumora Digital",
      description: "Work that earns the case study.",
    },
    {
      path: "/pricing",
      title: "Pricing — Lumora Digital",
      description: "Straightforward pricing, fixed-price delivery.",
    },
    {
      path: "/blog",
      title: "Blog — Lumora Digital",
      description: "Notes from the studio floor.",
    },
    {
      path: "/contact",
      title: "Contact — Lumora Digital",
      description: "Let's build something worth the case study.",
    },
  ];
  for (const def of seoDefs) {
    await prisma.seoMeta.upsert({
      where: { path: def.path },
      update: {},
      create: def,
    });
  }
  console.log(`✓ ${seoDefs.length} SEO metadata entries`);

  // ── Support tickets ───────────────────────────────────────────────
  const existingTickets = await prisma.supportTicket.count();
  if (existingTickets === 0) {
    const subjects = [
      "Order hasn't arrived yet",
      "Wrong item received",
      "Question about ingredients",
      "Requesting a refund",
      "Can I change my shipping address?",
      "Product caused irritation",
      "Subscription cancellation",
      "Missing item from order",
      "Discount code not working",
      "Product recommendation request",
      "Damaged packaging on arrival",
      "Where's my invoice?",
    ];
    const ticketStatuses = [
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ] as const;
    const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
    for (const subject of subjects) {
      const customer = randomItem(customers);
      const status = randomItem(ticketStatuses);
      const createdAt = randomDateWithinDays(60);
      const ticket = await prisma.supportTicket.create({
        data: {
          subject,
          customerId: customer.id,
          email: customer.email,
          status,
          priority: randomItem(priorities),
          assignedToId: status === "OPEN" ? null : randomItem(staff).id,
          createdAt,
          updatedAt: createdAt,
        },
      });
      await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          authorId: customer.id,
          authorName: customer.name!,
          isStaff: false,
          body: `Hi, I'm writing about: ${subject.toLowerCase()}. Could someone help me out?`,
          createdAt,
        },
      });
      if (status !== "OPEN") {
        const agent = randomItem(staff);
        await prisma.ticketMessage.create({
          data: {
            ticketId: ticket.id,
            authorId: agent.id,
            authorName: agent.name!,
            isStaff: true,
            body: "Thanks for reaching out — I've looked into this and here's what I found. Let us know if you need anything else.",
            createdAt: new Date(
              createdAt.getTime() + 1000 * 60 * 60 * randomInt(1, 48),
            ),
          },
        });
      }
    }
    console.log(`✓ ${subjects.length} support tickets`);
  }

  // ── Permissions matrix ────────────────────────────────────────────
  const permissionDefs = [
    {
      key: "catalog.view",
      label: "View products & categories",
      category: "Catalog",
    },
    {
      key: "catalog.manage",
      label: "Create/edit products & categories",
      category: "Catalog",
    },
    {
      key: "inventory.manage",
      label: "Adjust stock & inventory",
      category: "Catalog",
    },
    { key: "orders.view", label: "View orders", category: "Orders" },
    {
      key: "orders.manage",
      label: "Update order status, issue refunds",
      category: "Orders",
    },
    {
      key: "customers.view",
      label: "View customer profiles",
      category: "Orders",
    },
    {
      key: "content.manage",
      label: "Create/edit/publish blog posts",
      category: "Content",
    },
    {
      key: "media.manage",
      label: "Upload & organize media library",
      category: "Content",
    },
    {
      key: "reviews.moderate",
      label: "Approve/reject reviews",
      category: "Content",
    },
    { key: "seo.manage", label: "Edit SEO metadata", category: "Content" },
    {
      key: "marketing.manage",
      label: "Manage coupons & newsletter",
      category: "Marketing",
    },
    {
      key: "support.manage",
      label: "Respond to support tickets",
      category: "Support",
    },
    { key: "users.manage", label: "Change user roles", category: "Users" },
    {
      key: "settings.manage",
      label: "Edit store settings",
      category: "Settings",
    },
    { key: "logs.view", label: "View activity logs", category: "Settings" },
  ];
  const grantedByRole: Record<string, string[]> = {
    ADMIN: permissionDefs.map((p) => p.key),
    MANAGER: permissionDefs
      .map((p) => p.key)
      .filter((k) => k !== "users.manage" && k !== "settings.manage"),
    EDITOR: [
      "catalog.view",
      "catalog.manage",
      "content.manage",
      "media.manage",
      "reviews.moderate",
      "seo.manage",
    ],
    CUSTOMER: [],
  };
  for (const def of permissionDefs) {
    const permission = await prisma.permission.upsert({
      where: { key: def.key },
      update: {},
      create: def,
    });
    for (const role of ["ADMIN", "MANAGER", "EDITOR", "CUSTOMER"] as const) {
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role, permissionId: permission.id } },
        update: { granted: grantedByRole[role]!.includes(def.key) },
        create: {
          role,
          permissionId: permission.id,
          granted: grantedByRole[role]!.includes(def.key),
        },
      });
    }
  }
  console.log(`✓ ${permissionDefs.length} permissions × 4 roles`);

  // ── Activity log (historical seed entries) ────────────────────────
  const existingLogs = await prisma.activityLog.count();
  if (existingLogs === 0) {
    const actions = [
      { action: "product.create", entityType: "Product" },
      { action: "product.update", entityType: "Product" },
      { action: "order.status_change", entityType: "Order" },
      { action: "review.approve", entityType: "Review" },
      { action: "coupon.create", entityType: "Coupon" },
      { action: "blog_post.publish", entityType: "BlogPost" },
      { action: "user.role_change", entityType: "User" },
      { action: "settings.update", entityType: "StoreSettings" },
    ];
    for (let i = 0; i < 30; i += 1) {
      const { action, entityType } = randomItem(actions);
      const actor = randomItem(staff);
      await prisma.activityLog.create({
        data: {
          actorId: actor.id,
          actorName: actor.name!,
          action,
          entityType,
          entityId: null,
          createdAt: randomDateWithinDays(60),
        },
      });
    }
    console.log("✓ 30 historical activity log entries");
  }

  console.log(
    "\nDone. Staff sign-in password for every seeded account:",
    DEMO_PASSWORD,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
