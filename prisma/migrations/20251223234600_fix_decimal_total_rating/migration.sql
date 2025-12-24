/*
  Warnings:

  - You are about to alter the column `total` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE INTEGER;
