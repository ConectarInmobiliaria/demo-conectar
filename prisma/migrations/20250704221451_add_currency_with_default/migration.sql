/*
  Warnings:

  - The primary key for the `properties` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('ARS', 'USD');

-- DropForeignKey
ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_propertyId_fkey";

-- AlterTable
ALTER TABLE "inquiries" ALTER COLUMN "propertyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "properties" DROP CONSTRAINT "properties_pkey",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'ARS',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "properties_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "properties_id_seq";

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
