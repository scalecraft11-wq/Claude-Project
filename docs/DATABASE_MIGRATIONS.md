# Database Migration Guide

This project uses Prisma Migrate against PostgreSQL. `prisma/schema.prisma`
is the source of truth; `prisma/migrations/` is the ordered, committed
history of every schema change that produced it.

## The two commands, and when to use which

**`prisma migrate dev`** — local development only. Compares the schema to
the database, generates a new migration file for any difference, applies
it, and regenerates the Prisma Client. Will prompt to reset the database
if it detects drift (a migration history that doesn't match reality) —
never run this against a database with data you care about.

**`prisma migrate deploy`** — staging/production. Applies any migrations
in `prisma/migrations/` that haven't been applied yet, in order. Never
generates new migrations, never prompts, never resets anything. This is
the only migration command that should ever touch a production database.

```bash
# Local dev — after editing schema.prisma:
npx prisma migrate dev --name describe_the_change

# Production/staging:
npx prisma migrate deploy
```

## Writing a new migration

1. Edit `prisma/schema.prisma`.
2. `npx prisma migrate dev --name <short_description>` — creates
   `prisma/migrations/<timestamp>_<short_description>/migration.sql` and
   applies it locally.
3. **Read the generated SQL.** Prisma's diffing is usually right, but it
   can't know your intent — a renamed column looks identical to a
   dropped-column-plus-added-column unless you tell it otherwise (see
   below).
4. Commit the migration folder along with the schema change, in the same
   PR. They must never be separated — a schema change without its
   migration breaks every other developer's next `migrate dev`, and a
   migration without the matching schema update breaks the generated
   client's types.

### Renaming a column or table without data loss

Prisma can't distinguish "rename" from "drop + add" by inspecting the
schema diff alone. If you rename a field:

```bash
npx prisma migrate dev --name rename_x --create-only
```

Then hand-edit the generated `migration.sql` to use `ALTER TABLE ...
RENAME COLUMN` instead of the drop/create Prisma generated, before
running `npx prisma migrate dev` again (without `--create-only`) to
actually apply it.

## Applying migrations in each environment

| Environment | Command | Notes |
|---|---|---|
| Local dev | `npx prisma migrate dev` | Safe to reset; seed script assumes a fresh schema |
| Vercel | `npx prisma migrate deploy`, run manually before/after deploy | Vercel does not run this for you — see [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Docker | `docker compose exec app npx prisma migrate deploy` | Run once after `docker compose up`, and again after any deploy that adds migrations |

## Checking migration status

```bash
npx prisma migrate status
```

Reports which migrations are applied, and whether the schema has drifted
from what the migration history describes (drift is the thing to worry
about — it means someone changed the database directly, bypassing
migrations).

## Rolling back

Prisma Migrate has no built-in "down" migration / automatic rollback —
this is deliberate upstream (see Prisma's own docs); the supported
pattern is **forward-only**:

1. If the bad migration hasn't been deployed anywhere but your machine:
   delete its folder from `prisma/migrations/`, fix the schema, and
   `migrate dev` again for a clean replacement.
2. If it's already deployed (staging/production): write a **new**
   migration that reverses the change (e.g., re-add a dropped column,
   drop a newly-added `NOT NULL` constraint) and `migrate deploy` it.
   Never delete or edit a migration file that's already been applied
   anywhere — `migrate deploy` tracks applied migrations by name and
   checksum in the `_prisma_migrations` table, and editing history
   underneath it causes exactly the drift `migrate status` above is
   there to catch.

For a destructive migration that's already run in production and needs a
true data-level rollback (not just a schema reversal), restore from
backup instead — see [RECOVERY.md](./RECOVERY.md).

## Seeding

```bash
npx tsx prisma/seed.ts
```

`prisma.config.ts` wires this as the seed command Prisma CLI runs
automatically after `migrate dev` / `migrate reset` — you don't need to
run it separately in local dev unless you want to re-seed without
resetting.

**Never run the seed script against a production database.** It's
written to populate a schema with realistic, internally-consistent demo
data (`prisma/seed.ts`'s own docstring explains why: order totals that
match their line items, stock counts that match inventory movements,
etc.) — that's exactly the wrong shape of "safe" for a database that
already has real customer data.

## A note on `DATABASE_URL` and connection pooling

`prisma.config.ts` and `src/lib/prisma.ts` use a single `DATABASE_URL`
for everything (Prisma 7's driver-adapter model doesn't split "migration"
vs. "runtime" connection strings the way older Prisma versions' `directUrl`
did). In serverless environments (Vercel), point that URL at a pooled
connection (Neon/Supabase's built-in pooler, or PgBouncer in front of
RDS) — migrations and the query engine both go through it.
