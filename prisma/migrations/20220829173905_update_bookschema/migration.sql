/*
  Warnings:

  - You are about to alter the column `isbn` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `publishedAt` BIGINT NOT NULL,
    MODIFY `isbn` INTEGER NOT NULL;
