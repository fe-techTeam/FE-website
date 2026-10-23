# First Economy website

Next.js 16 (App Router, Turbopack) marketing site plus an admin panel at `/admin`.

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in the secrets, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Public pages live in `src/app/(site)`; the admin panel lives in `src/app/admin`.
They are separate route groups so the admin does not inherit the site's header,
footer or page-reveal animations.

## Admin panel

The admin panel is backed by Postgres via Prisma. First-time setup:

```bash
docker-compose up -d      # start Postgres on localhost:5433
npm run db:migrate        # create the schema
npm run admin:seed        # create the first Super Admin from .env.local
```

Then sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

With an empty database, go to **System → Import content** and run the importer.
It reads the TypeScript content in `src/content/**` and writes it into the
database — 185 entries across 22 modules. It is safe to re-run: existing entries
are skipped unless you explicitly choose to overwrite them, and the source files
are never modified.

### Required environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection. Also copy this into `.env` — the Prisma CLI reads that file. |
| `ADMIN_SESSION_SECRET` | Encrypts the session cookie. Minimum 32 chars: `openssl rand -base64 48` |
| `ADMIN_CRON_SECRET` | Bearer token for the scheduled-publish endpoint |
| `ADMIN_SEED_*` | Credentials for the first Super Admin |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run db:up` / `db:down` | Start / stop the local Postgres container |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:studio` | Browse the database in Prisma Studio |
| `npm run admin:seed` | Create the first Super Admin (`--reset-password` to change it) |

### Scheduled publishing

Entries can be queued to publish later. A cron job drives it:

```bash
curl -H "Authorization: Bearer $ADMIN_CRON_SECRET" https://<host>/api/admin/cron/publish
```

### Roles

| Role | Access |
| --- | --- |
| Super Admin | Everything, including users, permissions and system tools |
| Editor | Create, edit and publish content across all modules |
| Author | Create and edit drafts, then submit them for review |
| Viewer | Read-only |

Per-module overrides are set on each user's page under **Users**.

## Notes

This project runs Next.js 16, where Middleware is called **Proxy** (`src/proxy.ts`)
and request APIs (`cookies`, `headers`, `draftMode`, `params`) are async. See
`AGENTS.md` — read the bundled docs in `node_modules/next/dist/docs/` before
assuming an API works the way older versions did.
