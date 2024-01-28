/*
  Warnings:

  - The values [USER] on the enum `role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "role" ADD VALUE 'STUDENT';
ALTER TYPE "role" ADD VALUE 'STAFF';
ALTER TYPE "role"DROP VALUE 'USER';
