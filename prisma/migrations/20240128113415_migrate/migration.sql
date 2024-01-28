/*
  Warnings:

  - You are about to drop the column `is_approved` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `is_approved` on the `teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "staff" DROP COLUMN "is_approved";

-- AlterTable
ALTER TABLE "staff_department" ADD COLUMN     "is_approved" BOOL NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "teacher" DROP COLUMN "is_approved";

-- AlterTable
ALTER TABLE "teacher_department" ADD COLUMN     "is_approved" BOOL NOT NULL DEFAULT false;
