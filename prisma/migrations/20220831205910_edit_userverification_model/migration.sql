/*
  Warnings:

  - You are about to drop the column `userUserId` on the `UserVerification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserVerification` DROP FOREIGN KEY `UserVerification_userUserId_fkey`;

-- AlterTable
ALTER TABLE `UserVerification` DROP COLUMN `userUserId`;

-- AddForeignKey
ALTER TABLE `UserVerification` ADD CONSTRAINT `UserVerification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
