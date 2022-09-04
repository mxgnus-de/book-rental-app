/*
  Warnings:

  - You are about to drop the `UserVerificationReset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserVerificationReset` DROP FOREIGN KEY `UserVerificationReset_userId_fkey`;

-- DropTable
DROP TABLE `UserVerificationReset`;

-- CreateTable
CREATE TABLE `UserVerificationResend` (
    `userId` VARCHAR(191) NOT NULL,
    `resendCode` VARCHAR(256) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserVerificationResend_userId_key`(`userId`),
    UNIQUE INDEX `UserVerificationResend_resendCode_key`(`resendCode`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserVerificationResend` ADD CONSTRAINT `UserVerificationResend_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
