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
PORT=3001
```

Create the database before running the migration if it does not already exist:

```bash
createdb customer_dashboard
```

## API

```http
GET /customers?page=1&limit=10
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
- Results are ordered by the CSV source id for stable pagination.

## CSV Import

The CSV file lives at `data/customers.csv`.

```bash
npm run import:customers
```

The importer is idempotent. It validates required fields, normalizes empty optional fields to `null`, and upserts rows by the CSV `id` column mapped to `sourceId`.

To import a different file:

```bash
CUSTOMERS_CSV_PATH=/absolute/path/to/customers.csv npm run import:customers
```

## Validation

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```
