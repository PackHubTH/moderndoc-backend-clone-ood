-- CreateEnum
CREATE TYPE "level" AS ENUM ('BACHELOR', 'MASTER', 'DOCTOR');

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "level" "level" NOT NULL DEFAULT 'BACHELOR';
