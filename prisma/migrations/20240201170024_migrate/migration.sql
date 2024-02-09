-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_course_id_fkey";

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "course_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
