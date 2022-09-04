-- CreateTable
CREATE TABLE `UserVerification` (
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verificationCode` VARCHAR(191) NOT NULL,
    `userUserId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserVerification_userId_key`(`userId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserVerification` ADD CONSTRAINT `UserVerification_userUserId_fkey` FOREIGN KEY (`userUserId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
