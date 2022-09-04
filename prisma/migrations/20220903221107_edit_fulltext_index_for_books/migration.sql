-- DropIndex
DROP INDEX `Book_name_author_description_isbn_idx` ON `Book`;

-- CreateIndex
CREATE FULLTEXT INDEX `Book_description_idx` ON `Book`(`description`);
