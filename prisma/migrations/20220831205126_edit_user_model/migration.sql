-- AlterTable
ALTER TABLE `User` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `permissions` VARCHAR(191) NOT NULL DEFAULT 'USER';
