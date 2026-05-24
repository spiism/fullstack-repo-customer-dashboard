import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type CustomerCsvRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
  company: string;
  city: string;
  title: string;
  website: string;
};

type ImportedCustomer = {
  sourceId: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null;
  ipAddress: string | null;
  company: string | null;
  city: string | null;
  title: string | null;
  website: string | null;
};

const prisma = new PrismaClient();
const csvPath = process.env.CUSTOMERS_CSV_PATH ?? 'data/customers.csv';

function nullable(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function required(value: string, field: string, rowNumber: number) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`Row ${rowNumber}: ${field} is required.`);
  }

  return trimmed;
}

function toCustomer(row: CustomerCsvRow, index: number): ImportedCustomer {
  const rowNumber = index + 2;
  const sourceId = Number(required(row.id, 'id', rowNumber));
  const email = required(row.email, 'email', rowNumber);

  if (!Number.isInteger(sourceId) || sourceId < 1) {
    throw new Error(`Row ${rowNumber}: id must be a positive integer.`);
  }

  if (!email.includes('@')) {
    throw new Error(`Row ${rowNumber}: email is invalid.`);
  }

  return {
    sourceId,
    firstName: required(row.first_name, 'first_name', rowNumber),
    lastName: required(row.last_name, 'last_name', rowNumber),
    email,
    gender: nullable(row.gender),
    ipAddress: nullable(row.ip_address),
    company: nullable(row.company),
    city: nullable(row.city),
    title: nullable(row.title),
    website: nullable(row.website),
  };
}

async function importCustomers() {
  const contents = await readFile(resolve(process.cwd(), csvPath), 'utf8');
  const rows = parse<CustomerCsvRow>(contents, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const customers = rows.map(toCustomer);

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: {
        sourceId: customer.sourceId,
      },
      update: customer,
      create: customer,
    });
  }

  console.log(`Imported ${customers.length} customers.`);
}

void importCustomers()
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Unknown import failure.';
    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
