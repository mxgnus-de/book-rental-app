-- DropIndex
DROP INDEX `Book_name_author_description_idx` ON `Book`;

-- CreateIndex
CREATE FULLTEXT INDEX `Book_name_author_description_isbn_idx` ON `Book`(`name`, `author`, `description`, `isbn`);
