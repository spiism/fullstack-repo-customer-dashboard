# Fullstack Repo Customer Dashboard

This repository contains a small full-stack customer dashboard workspace:

- A Next.js GitHub repository browser.
- A NestJS customer API backed by PostgreSQL.
- A static customer web client that consumes the customer API.

Each app keeps its own dependencies and README under `apps/`.

## Applications

| Path | Purpose | Main Stack |
| --- | --- | --- |
| `apps/github-repo-browser` | Fetches and displays GitHub repositories with pagination. | Next.js, React, Vitest |
| `apps/customer-api` | Imports customer CSV data into PostgreSQL and serves a paginated JSON API. | NestJS, Prisma, PostgreSQL, Jest |
| `apps/customer-web` | Static customer directory client for the Customer API. | HTML, CSS, JavaScript |

## What Is Included

### GitHub Repository Browser

- Fetches public repositories from the GitHub organization API.
- Uses server-side fetching with URL-based pagination.
- Parses GitHub `Link` headers to determine available pages.
- Handles loading, empty, retry, and rate-limit error states.
- Includes responsive GitHub-like repository list styling.
- Includes focused tests for API parsing and rendered pagination/error UI.

See `apps/github-repo-browser/README.md`.

### Customer API

- Imports `apps/customer-api/data/customers.csv` into PostgreSQL.
- Uses Prisma migrations and a typed Prisma client.
- Provides `GET /api/v1/customers?page=1&limit=10&search=...`.
- Validates pagination and search input.
- Returns pagination metadata for web/mobile clients.
- Includes request IDs, CORS, throttling, environment validation, and API versioning.
- Includes unit and e2e tests.
- Can be deployed to AWS Lambda/API Gateway through SST.

See `apps/customer-api/README.md`.

### Customer Web Client

- Static HTML/CSS/JS client for the Customer API.
- Fetches customer JSON asynchronously.
- Supports search, row count selection, direct page selection, and First/Previous/Next/Last navigation.
- Designed to work locally or from a static host such as Vercel.

See `apps/customer-web/README.md`.

## Quick Start

### Frontend

```bash
cd apps/github-repo-browser
npm install
npm run dev
```

Open `http://localhost:3000`.

### Backend

```bash
cd apps/customer-api
npm install
cp .env.example .env
createdb customer_dashboard
npm run db:generate
npm run db:migrate
npm run import:customers
npm run start:dev
```

The API runs on `http://localhost:3001/api/v1`.

### Static Customer Web

Start the backend first, then open:

```text
apps/customer-web/index.html
```

## Validation

Frontend:

```bash
cd apps/github-repo-browser
npm run lint
npm test
npm run build
```

Backend:

```bash
cd apps/customer-api
npm run lint
npm test
npm run test:e2e
npm run build
```

Static web client:

```bash
node --check apps/customer-web/app.js
node --check apps/customer-web/config.js
```

## Deployment

The backend can be deployed from the repo root with SST:

```bash
set -a
source apps/customer-api/.env
set +a
SST_TELEMETRY_DISABLED=1 npx sst@4.14.3 deploy --stage dev
```

The deploy command prints the API Gateway URL as `apiUrl`. Keep that value out of committed files unless you intentionally want the endpoint public.

The static customer web client reads its API base from `apps/customer-web/config.js`, or from the `apiBase` query parameter for temporary local testing.

## Notes

- Real `.env` files are ignored. Use `.env.example` as the template.
- Generated files such as `.sst/`, `sst-env.d.ts`, build output, and dependency directories are ignored.
