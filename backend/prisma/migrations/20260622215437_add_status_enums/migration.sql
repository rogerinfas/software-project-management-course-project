/*
  Warnings:

  - The `status` column on the `Charge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Enrollment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Section` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'WITHDRAWN', 'GRADUATED');

-- CreateEnum
CREATE TYPE "SectionStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID');

-- AlterTable
ALTER TABLE "Charge" DROP COLUMN "status",
ADD COLUMN     "status" "ChargeStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "status",
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "status",
ADD COLUMN     "status" "SectionStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
