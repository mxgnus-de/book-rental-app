/*
  Warnings:

  - You are about to drop the `FavoriteBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `FavoriteBooks` DROP FOREIGN KEY `FavoriteBooks_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `FavoriteBooks` DROP FOREIGN KEY `FavoriteBooks_userId_fkey`;

-- DropTable
DROP TABLE `FavoriteBooks`;

-- CreateTable
CREATE TABLE `FavoriteBook` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bookId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FavoriteBook_id_key`(`id`),
    INDEX `FavoriteBook_userId_bookId_idx`(`userId`, `bookId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FavoriteBook` ADD CONSTRAINT `FavoriteBook_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteBook` ADD CONSTRAINT `FavoriteBook_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`bookId`) ON DELETE RESTRICT ON UPDATE CASCADE;
