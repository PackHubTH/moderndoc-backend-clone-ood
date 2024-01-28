/*
  Warnings:

  - You are about to drop the column `course_id` on the `teacher` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "teacher" DROP CONSTRAINT "teacher_course_id_fkey";

-- AlterTable
ALTER TABLE "teacher" DROP COLUMN "course_id";
