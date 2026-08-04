import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Mirrors Next.js's own env-file cascade (.env, then .env.local overriding
// it) so `DATABASE_URL` only ever has to be defined once, in the same
// `.env.local` every other part of the app already reads from — the
// Prisma CLI runs outside Next.js's build pipeline, so it needs this
// loaded explicitly rather than relying on Next's automatic env loading.
loadEnv();
loadEnv({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
