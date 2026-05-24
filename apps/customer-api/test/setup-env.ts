process.env.DATABASE_URL ??=
  'postgresql://postgres:postgres@localhost:5432/customer_dashboard?schema=public';
process.env.DIRECT_URL ??=
  'postgresql://postgres:postgres@localhost:5432/customer_dashboard?schema=public';
process.env.WEB_ORIGIN ??= '*';
process.env.THROTTLE_LIMIT ??= '1000';
