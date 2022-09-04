/*
  Warnings:

  - The values [nonfiction] on the enum `Book_genre` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `genre` ENUM('comic', 'crime', 'fantasy', 'romance', 'horror', 'adventure', 'action') NOT NULL;
