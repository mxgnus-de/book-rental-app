-- DropIndex
DROP INDEX `Book_name_bookId_idx` ON `Book`;

-- CreateIndex
CREATE INDEX `Book_name_bookId_author_genre_isbn_idx` ON `Book`(`name`, `bookId`, `author`, `genre`, `isbn`);

-- CreateIndex
CREATE FULLTEXT INDEX `Book_name_author_description_isbn_bookId_idx` ON `Book`(`name`, `author`, `description`, `isbn`, `bookId`);
