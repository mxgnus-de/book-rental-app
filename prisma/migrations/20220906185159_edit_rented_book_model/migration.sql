/*
  Warnings:

  - A unique constraint covering the columns `[rentedBookId]` on the table `RentedBook` will be added. If there are existing duplicate values, this will fail.
  - The required column `rentedBookId` was added to the `RentedBook` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `RentedBook` ADD COLUMN `rentedBookId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`rentedBookId`);

-- CreateIndex
CREATE UNIQUE INDEX `RentedBook_rentedBookId_key` ON `RentedBook`(`rentedBookId`);
