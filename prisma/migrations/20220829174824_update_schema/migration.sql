/*
  Warnings:

  - The `createdAt` column on the `FavoriteBooks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rentedAt` column on the `RentedBook` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `returnedAt` column on the `RentedBook` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdAt` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `publishedAt` on the `Book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `birthday` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Book` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    DROP COLUMN `publishedAt`,
    ADD COLUMN `publishedAt` DATETIME(3) NOT NULL,
    MODIFY `isbn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `FavoriteBooks` DROP COLUMN `createdAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `RentedBook` DROP COLUMN `rentedAt`,
    ADD COLUMN `rentedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    DROP COLUMN `returnedAt`,
    ADD COLUMN `returnedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Session` DROP COLUMN `createdAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `createdAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    DROP COLUMN `birthday`,
    ADD COLUMN `birthday` DATETIME(3) NOT NULL;
