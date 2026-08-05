# syntax=docker/dockerfile:1

# Three stages: install deps once, build once, then copy only the traced
# standalone output into a lean runtime image — the final image never
# contains devDependencies, source maps' inputs, or the full node_modules
# tree, just what `next.config.ts`'s `output: "standalone"` decided the
# server actually needs to boot.

ARG NODE_VERSION=22-alpine

# ---- deps -------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# libc6-compat: Prisma's query engine binary needs it on Alpine.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---- builder ------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# No real secrets needed at build time — every var in src/lib/env.ts's
# schema is optional except NODE_ENV/NEXT_PUBLIC_APP_URL (which default),
# so the build succeeds with none set. Real values are supplied at
# container run time via `docker run -e` / compose `env_file` instead —
# NEXT_PUBLIC_* vars baked in at *this* build step would freeze whatever
# was present here into the client bundle, which is why none are passed.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

# ---- runner ---------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output's server.js + minimal node_modules + traced deps.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets aren't traced into `standalone` automatically — copied in
# alongside it (Next.js's own documented Docker pattern).
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Prisma's generated client + engine binaries, and the schema/migrations
# needed to run `prisma migrate deploy` from this same image (see
# docs/DATABASE_MIGRATIONS.md).
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
