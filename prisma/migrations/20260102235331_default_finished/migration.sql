/*
  Warnings:

  - You are about to drop the column `responsabilities` on the `Experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "responsabilities",
ADD COLUMN     "responsibilities" TEXT[];
