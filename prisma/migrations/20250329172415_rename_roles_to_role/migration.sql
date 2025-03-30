/*
  Warnings:

  - You are about to drop the column `roles` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `role` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "roles",
ADD COLUMN     "role" TEXT NOT NULL;
