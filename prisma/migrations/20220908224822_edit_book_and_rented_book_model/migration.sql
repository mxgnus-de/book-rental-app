/*
  Warnings:

  - The primary key for the `RentedBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rentedBookId` on the `RentedBook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `RentedBook` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `RentedBook` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `RentedBook_rentedBookId_key` ON `RentedBook`;

-- AlterTable
ALTER TABLE `RentedBook` DROP PRIMARY KEY,
    DROP COLUMN `rentedBookId`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `RentedBook_id_key` ON `RentedBook`(`id`);
