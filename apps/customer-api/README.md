# Customer API

NestJS API for importing the provided customer CSV into PostgreSQL and serving a paginated JSON endpoint.

## Requirements

- Node.js 22+
- PostgreSQL
- npm

## Setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run import:customers
npm run start:dev
```

The default `.env.example` points at:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/customer_dashboard?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/customer_dashboard?schema=public"
PORT=3001
WEB_ORIGIN="*"
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

For Supabase deployments:

- `DATABASE_URL` should use the Transaction pooler URI for Lambda/runtime connections. The SST config adds `pgbouncer=true` and `connection_limit=1` for Supabase pooler URLs so Prisma does not reuse prepared statements through the pooler.
- `DIRECT_URL` should use the Direct connection URI for Prisma migrations and imports. It is optional for API runtime. If direct connection fails on your network, use the Session pooler URI instead.

Create the database before running the migration if it does not already exist:

```bash
createdb customer_dashboard
```

## API

```http
GET /api/v1/customers?page=1&limit=10
```

Response shape:

```json
{
  "data": [
    {
      "id": 1,
      "sourceId": 1,
      "firstName": "Laura",
      "lastName": "Richards",
      "email": "lrichards0@reverbnation.com",
      "gender": "Female",
      "ipAddress": "81.192.7.99",
      "company": "Meezzy",
      "city": "Kallithea",
      "title": "Biostatistician III",
      "website": "https://example.com"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1000,
    "totalPages": 100
  }
}
```

Pagination input is validated with Nest validation pipes:

- `page` must be an integer greater than or equal to 1.
- `limit` must be an integer from 1 to 100.
- `search` is optional and matches name, email, company, city, or title.
- Results are ordered by the CSV source id for stable pagination.

The API also enables CORS through `WEB_ORIGIN`, returns an `x-request-id` response header, and applies a default request throttle.

## CSV Import

The CSV file lives at `data/customers.csv`.

```bash
npm run import:customers
```

The importer is idempotent. It validates required identifiers, normalizes empty CSV fields to `null`, and upserts rows by the CSV `id` column mapped to `sourceId`.
Upserts are grouped into small transactions so the importer avoids one transaction per row while still supporting repeatable imports.
When `DIRECT_URL` is set, the importer uses it instead of the runtime pooler URL so local imports do not run through the transaction pooler.

To import a different file:

```bash
CUSTOMERS_CSV_PATH=/absolute/path/to/customers.csv npm run import:customers
```

## Web Client

A small static web client is included at `../customer-web/index.html`.
Start the API, then open that file in a browser. It asynchronously fetches customer JSON from `http://localhost:3001/api/v1/customers`, renders a responsive list, and supports pagination and search.

## SST Deployment

The repo root includes `sst.config.ts` for deploying the Nest API as a single Lambda behind API Gateway HTTP API.
The function package copies the generated Prisma client into Lambda, so run `npm run db:generate` after schema changes and before deploy.
API Gateway owns browser CORS for the deployed endpoint and allows `GET` and `OPTIONS` from any origin for the demo web client.

From the repo root:

```bash
set -a
source apps/customer-api/.env
set +a
SST_TELEMETRY_DISABLED=1 npx sst@4.14.3 deploy --stage dev
```

The deploy outputs `apiUrl`. Use that value plus `/api/v1` in `apps/customer-web/config.js` before deploying the static web client.

## Validation

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```
