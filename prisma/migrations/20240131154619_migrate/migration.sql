-- CreateEnum
CREATE TYPE "department_type" AS ENUM ('DOG', 'CAT');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'STUDENT', 'STAFF');

-- CreateEnum
CREATE TYPE "staff_type" AS ENUM ('STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "document_status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "faculty" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "type" "department_type" NOT NULL,
    "faculty_id" STRING,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "department_id" STRING NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" STRING NOT NULL,
    "role" "role" NOT NULL,
    "email" STRING[],
    "default_email_index" INT4 NOT NULL DEFAULT 0,
    "phone" STRING[],
    "default_phone_index" INT4 NOT NULL DEFAULT 0,
    "profile_img" STRING,
    "signature" STRING[],
    "notification_config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nameEN" STRING NOT NULL,
    "nameTH" STRING NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "course_id" STRING NOT NULL,
    "advisor_id" STRING,
    "student_number" STRING NOT NULL,
    "is_approved" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "staff_number" STRING NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_department" (
    "id" STRING NOT NULL,
    "teacher_id" STRING NOT NULL,
    "department_id" STRING NOT NULL,
    "is_approved" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "teacher_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "staff_number" STRING NOT NULL,
    "type" "staff_type" NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_department" (
    "id" STRING NOT NULL,
    "staff_id" STRING NOT NULL,
    "department_id" STRING NOT NULL,
    "is_approved" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "staff_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" STRING NOT NULL,
    "template_id" STRING,
    "title" STRING NOT NULL,
    "document_code" STRING NOT NULL,
    "description" STRING NOT NULL,
    "guideline" STRING NOT NULL,
    "extra_contact" STRING NOT NULL,
    "file" STRING,
    "is_internal" BOOL NOT NULL,
    "created_by" STRING NOT NULL,
    "updated_by" STRING NOT NULL,
    "last_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_faq" (
    "id" STRING NOT NULL,
    "faq_id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "is_internal" BOOL NOT NULL,
    "created_by" STRING NOT NULL,
    "updated_by" STRING NOT NULL,
    "last_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template" (
    "id" STRING NOT NULL,
    "department_id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "template_file" STRING NOT NULL,
    "example_file" STRING NOT NULL,
    "description" STRING NOT NULL,
    "created_by" STRING NOT NULL,
    "updated_by" STRING NOT NULL,
    "last_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "is_internal" BOOL NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_group" (
    "user_id" STRING NOT NULL,
    "group_id" STRING NOT NULL,

    CONSTRAINT "user_group_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "template_group" (
    "template_id" STRING NOT NULL,
    "group_id" STRING NOT NULL,

    CONSTRAINT "template_group_pkey" PRIMARY KEY ("template_id","group_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_tag" (
    "faq_id" STRING NOT NULL,
    "tag_id" STRING NOT NULL,

    CONSTRAINT "faq_tag_pkey" PRIMARY KEY ("faq_id","tag_id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "template_file" STRING NOT NULL,
    "example_file" STRING NOT NULL,
    "element" JSONB NOT NULL,
    "status" "document_status" NOT NULL,
    "created_by" STRING NOT NULL,
    "updated_by" STRING NOT NULL,
    "last_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_timeline" (
    "document_id" STRING NOT NULL,
    "message" STRING NOT NULL,
    "updated_by" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_timeline_pkey" PRIMARY KEY ("document_id","updated_by")
);

-- CreateTable
CREATE TABLE "document_sent" (
    "document_id" STRING NOT NULL,
    "receiver_id" STRING NOT NULL,
    "message" STRING NOT NULL,
    "is_editable" BOOL NOT NULL,
    "status" "document_status" NOT NULL,
    "send_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_sent_pkey" PRIMARY KEY ("document_id","receiver_id","send_at")
);

-- CreateIndex
CREATE UNIQUE INDEX "faculty_name_key" ON "faculty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "course_name_key" ON "course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_student_number_key" ON "student"("student_number");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_staff_number_key" ON "teacher"("staff_number");

-- CreateIndex
CREATE UNIQUE INDEX "staff_staff_number_key" ON "staff"("staff_number");

-- CreateIndex
CREATE UNIQUE INDEX "group_name_key" ON "group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_department" ADD CONSTRAINT "teacher_department_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_department" ADD CONSTRAINT "teacher_department_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_department" ADD CONSTRAINT "staff_department_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_department" ADD CONSTRAINT "staff_department_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq" ADD CONSTRAINT "faq_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq" ADD CONSTRAINT "faq_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq" ADD CONSTRAINT "faq_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_faq" ADD CONSTRAINT "sub_faq_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_faq" ADD CONSTRAINT "sub_faq_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "faq"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_faq" ADD CONSTRAINT "sub_faq_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template" ADD CONSTRAINT "template_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template" ADD CONSTRAINT "template_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template" ADD CONSTRAINT "template_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group" ADD CONSTRAINT "user_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group" ADD CONSTRAINT "user_group_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_group" ADD CONSTRAINT "template_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_group" ADD CONSTRAINT "template_group_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_tag" ADD CONSTRAINT "faq_tag_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "faq"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_tag" ADD CONSTRAINT "faq_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_timeline" ADD CONSTRAINT "document_timeline_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_timeline" ADD CONSTRAINT "document_timeline_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_sent" ADD CONSTRAINT "document_sent_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_sent" ADD CONSTRAINT "document_sent_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
