/*
  Warnings:

  - You are about to drop the column `first_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `user` table. All the data in the column will be lost.
  - Added the required column `nameEN` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameTH` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "first_name";
ALTER TABLE "user" DROP COLUMN "last_name";
ALTER TABLE "user" ADD COLUMN     "nameEN" STRING NOT NULL;
ALTER TABLE "user" ADD COLUMN     "nameTH" STRING NOT NULL;
