CREATE TABLE "customers" (
  "id" SERIAL NOT NULL,
  "source_id" INTEGER NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "gender" TEXT,
  "ip_address" TEXT,
  "company" TEXT,
  "city" TEXT,
  "title" TEXT,
  "website" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customers_source_id_key" ON "customers"("source_id");
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");
CREATE INDEX "customers_source_id_idx" ON "customers"("source_id");
