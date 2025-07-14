/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `properties` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" 
  ADD COLUMN "address" TEXT,
  ADD COLUMN "bathrooms" INTEGER,
  ADD COLUMN "bedrooms" INTEGER,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "code" TEXT,
  ADD COLUMN "expenses" DOUBLE PRECISION,
  ADD COLUMN "garage" BOOLEAN,
  ADD COLUMN "videoUrl" TEXT;

-- Create unique index for "code"
CREATE UNIQUE INDEX IF NOT EXISTS "properties_code_key" ON "properties"("code");
