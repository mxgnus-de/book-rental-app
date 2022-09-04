-- DropIndex
DROP INDEX `Book_name_author_isbn_bookId_idx` ON `Book`;

-- CreateIndex
CREATE FULLTEXT INDEX `Book_name_isbn_bookId_idx` ON `Book`(`name`, `isbn`, `bookId`);
