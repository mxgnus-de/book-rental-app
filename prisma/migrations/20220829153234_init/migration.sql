-- CreateTable
CREATE TABLE `User` (
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` INTEGER NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `birthday` INTEGER NOT NULL,

    UNIQUE INDEX `User_userId_key`(`userId`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_userId_email_idx`(`userId`, `email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `sessionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` INTEGER NOT NULL,
    `ip` VARCHAR(191) NULL,

    UNIQUE INDEX `Session_sessionId_key`(`sessionId`),
    INDEX `Session_sessionId_userId_idx`(`sessionId`, `userId`),
    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `bookId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `publisherNumber` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `genre` ENUM('comic', 'crime', 'nonfiction', 'fantasy', 'romance', 'horror', 'adventure', 'action') NOT NULL,

    UNIQUE INDEX `Book_bookId_key`(`bookId`),
    UNIQUE INDEX `Book_name_key`(`name`),
    INDEX `Book_name_bookId_idx`(`name`, `bookId`),
    PRIMARY KEY (`bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentedBook` (
    `userId` VARCHAR(191) NOT NULL,
    `bookId` VARCHAR(191) NOT NULL,
    `rentedAt` INTEGER NOT NULL,
    `returnedAt` INTEGER NOT NULL,
    `isRented` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `RentedBook_bookId_key`(`bookId`),
    INDEX `RentedBook_userId_bookId_idx`(`userId`, `bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteBooks` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bookId` VARCHAR(191) NOT NULL,
    `createdAt` INTEGER NOT NULL,

    UNIQUE INDEX `FavoriteBooks_id_key`(`id`),
    INDEX `FavoriteBooks_userId_bookId_idx`(`userId`, `bookId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentedBook` ADD CONSTRAINT `RentedBook_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentedBook` ADD CONSTRAINT `RentedBook_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`bookId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteBooks` ADD CONSTRAINT `FavoriteBooks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteBooks` ADD CONSTRAINT `FavoriteBooks_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`bookId`) ON DELETE RESTRICT ON UPDATE CASCADE;
